using System;
using CellReport;
using CellReport.exporter;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO.Compression;
using System.IO;
using Microsoft.IO;
using CSRedis;

using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Diagnostics;

namespace CellReport
{
    public abstract class BaseCache
    {
        public Func<String> getFreshFlag;
        public abstract String cacheKey(string key);
        public abstract Task OutputOrCalcAndCache(String key, HttpResponse response, Func<MyTextWrite, Task> calcReportAndExportHtml, String needType = "json");
        public DateTime global_time { get; protected set; }
        public DateTime fresh_time { get; protected set; }
        public string fresh_flag { get; protected set; } = "0";
    }
    public class Redis_Cache : BaseCache
    {
        public static readonly RecyclableMemoryStreamManager manager;
        private static int bytesBufSize = 1024 * 32;//10000
        static Redis_Cache()
        {
            int blockSize = 1024*32;
            int largeBufferMultiple = 1024 * 1024; //85,000
            int maxBufferSize = 128 * largeBufferMultiple;

            manager = new RecyclableMemoryStreamManager();

            //manager.GenerateCallStacks = true;
            //manager.AggressiveBufferReturn = true;
            manager.MaximumFreeLargePoolBytes = maxBufferSize * 4;
            manager.MaximumFreeSmallPoolBytes = 100 * blockSize;
        }
        public static string redis_str;// = System.Configuration.ConfigurationManager.AppSettings["redis_str"] ?? "127.0.0.1:6379,password=";
        /**
        timeOut 缓存多久然后刷新，如果这个值不少default，那么就由getFreshFlag来作为总控制
        */
        public Redis_Cache(string cacheId, CellReport.running.Logger logger)
        {
            if (String.IsNullOrEmpty(Redis_Cache.redis_str))
            {
                throw new Exception("没有提供redis连接串，请修改appsetting.json中的redis_str,格式：127.0.0.1:6379,password=");
            }
            this.cacheId = cacheId;
            this.logger = logger;
        }
        private CellReport.running.Logger logger;
        public int databaseId = 4;
        private String cacheId;
        public override String cacheKey(string key)
        {
            return $"{cacheId}:report:{key}";
        }
        public String CalcLockString(string key)
        {
            return $"{cacheId}:calc_lock:{key}";
        }
        private String FreshTimeString { get { return $"{cacheId}:fresh_time"; } }
        protected int CalcLockTTLSeconds=60*5;//计算锁定缺省为5 分钟
        protected int ResultTTLMinutes = 2*60;//结果缺省缓存时间长度为2 小时
        private static int now_calc_num = 0;
        //fresh_flag 对应的是客户端发送过来的刷新标记，fresh_time 对应的是发送过来新的刷新标记时本地的时间ticks
        private static string script_sha=null;
        protected static String exec_script = @"

if ARGV[1]~=redis.call('hget',ARGV[2+2],'fresh_flag') then --如果标记不一样，就更新全局缓存标记和时间
    redis.call('HMSET',ARGV[2+2],'fresh_flag',ARGV[1],'fresh_time',ARGV[3]) 
end
if 1==redis.call('exists',KEYS[1]) then    --如果存在缓存
    local reading_num=tonumber(redis.call('hget',KEYS[1],'reading'))
    local fresh_time= redis.call('hget',KEYS[1],'fresh_time') --当前报表的缓存时间
    local global_time= redis.call('hget',ARGV[2+2],'fresh_time') --全局的刷新时间
    --已经有线程在读，或，存在正确的缓存，设置reading+1,返回有几个数据块，然后再读，读完后要将reading-1
    if global_time<=fresh_time then 
        redis.call('hincrby',KEYS[1],'reading',1)
        return {redis.call('hget',KEYS[1],ARGV[2+4]..'_size'),global_time,fresh_time}
    end
    if reading_num>0 then --如果有线程在读，就返回等待0.5秒后再试
        return {'有线程正在读，不能清空',global_time,fresh_time}
    end
    redis.call('del',KEYS[1])--缓存过期，删除
end
if 0==redis.call('exists',ARGV[2+3]) then
    redis.call('set',ARGV[2+3],1,'EX',ARGV[2]) --设置计算锁，及设置多少秒后过期，自动删除
    return {'可以开始计算',ARGV[3],0} --返回0 ，就要计算
else
    return {'已经在计算了',ARGV[3],0} --已经在计算了
end  ";
        public override async Task OutputOrCalcAndCache(String key, HttpResponse response, 
            Func<MyTextWrite,Task> calcReportAndExportHtml, String needType="json")
        {
            string cache_key = cacheKey(key);
            
            if (getFreshFlag != null)
                fresh_flag = getFreshFlag();
            //redisDatabase.StringSet(FreshTimeString, TotalSeconds);
            string wait_result = "有线程正在读，不能清空";
            do
            {
                if(script_sha==null)
                    script_sha = RedisHelper.ScriptLoad(exec_script);
                var script_exists=await RedisHelper.ScriptExistsAsync(script_sha);
                if (!script_exists[0])
                    script_sha = RedisHelper.ScriptLoad(exec_script);
                //返回 0 ，需要计算，返回 1 ，已经在计算了，其他就是缓存的结果
                var result=(Object[])(await RedisHelper.EvalSHAAsync(script_sha, cache_key,
                    fresh_flag, CalcLockTTLSeconds, DateTime.Now.Ticks,
                    FreshTimeString, CalcLockString(key), needType
                    ));
                wait_result = result[0] as String;
                global_time = DateTime.FromBinary(long.Parse(result[1].ToString()));
                fresh_time = DateTime.FromBinary(long.Parse(result[2].ToString()));
                if("可以开始计算"!= wait_result)
                    logger.Info(wait_result+":"+key);
                if (wait_result == "有线程正在读，不能清空")
                    await Task.Delay(500);
            } while (wait_result == "有线程正在读，不能清空");
            //redisDatabase.HashScan
            if (wait_result== "已经在计算了")//数字一的 ascii 码是49 相当于 (int)result == 1
            {
                await response.WriteAsync("{\"errcode\":1,\"message\":\"已经在计算，正在刷新缓存，请稍后再试！\"");
                return ;
            }
            
            if (int.TryParse(wait_result, out int cnt))
            {
                try
                {
                    for (int i = 0; i < cnt; i++)
                    {
                        Stopwatch sw = new Stopwatch();
                        //sw.Start();
                        //var aaa =await RedisHelper.HScanAsync<byte[]>(cache_key, 0, $"{needType}*",cnt);
                        //sw.Stop();
                        //logger.Info("HScanAsync: " + sw.ElapsedMilliseconds + "ms");
                        sw.Restart();
                        var one = await RedisHelper.HGetAsync<byte[]>(cache_key, $"{needType}:{i.ToString("00000000")}");
                        sw.Stop();
                        logger.Debug("HGetAsync: " + sw.ElapsedMilliseconds + "ms");
                        sw.Restart();
                        await response.Body.WriteAsync(one);
                        sw.Stop();
                        logger.Debug("WriteAsync: " + sw.ElapsedMilliseconds + "ms");
                    }
                    await response.Body.FlushAsync();
                    logger.Info("缓存取出成功:" + key);
                    return ;
                }
                finally
                {
                    await RedisHelper.HIncrByAsync(cache_key, "reading",-1);
                }
            }            
            try
            {
                Interlocked.Increment(ref Redis_Cache.now_calc_num);
                logger.Info("开始计算:" + key + "\n正在计算数：" + Redis_Cache.now_calc_num);
                this.fresh_time = DateTime.Now;
                using (var jsonStream = manager.GetStream() as RecyclableMemoryStream) //
                {
                    
                    using (MyTextWrite jsonWriter = new MyTextWrite(jsonStream))
                    {

                        await calcReportAndExportHtml?.Invoke( jsonWriter);
                        await jsonWriter.FlushAsync();                        
                    }

                    await jsonStream.FlushAsync();
                    var pipe=RedisHelper.StartPipe();
                    StreamToBytesArray(jsonStream, cache_key, pipe, "json");
                    
                    pipe.HSet(cache_key, "fresh_time", this.fresh_time.Ticks);
                    pipe.HSet(cache_key, "reading", 0);
                    //缺省2小时后过期，自动删除
                    pipe.Expire(cache_key, ResultTTLMinutes*60);
                    pipe.EndPipe();
                    jsonStream.Position = 0;
                    await jsonStream.CopyToAsync(response.Body);  
                }
                logger.Info("完成计算:" + key);
                return ;
            }
            finally
            {
                Interlocked.Decrement(ref Redis_Cache.now_calc_num);
                await RedisHelper.DelAsync(CalcLockString(key));
            }
        }
        
        private void StreamToBytesArray(RecyclableMemoryStream stream,String cache_key,CSRedisClientPipe<string> pipe,string type)
        {
            stream.Position = 0; 
            long size = stream.Length / bytesBufSize;
            if (bytesBufSize * size < stream.Length)
                size++;
            var bytes = new Byte[size][];
            for (int i = 0; i < size; i++)
            {
                long cnt = bytesBufSize;
                if (bytesBufSize * (i + 1) > stream.Length)
                    cnt = stream.Length - bytesBufSize * i;
                bytes[i] = new byte[cnt];
                stream.Read(bytes[i], 0, (int)cnt);
                pipe.HSet(cache_key, $"{type}:{i.ToString("00000000")}", bytes[i]);
            }
            pipe.HSet(cache_key, $"{type}_size", size);
        }
    }
}