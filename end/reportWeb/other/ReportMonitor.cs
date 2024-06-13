using CellReport.running;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System;
using Microsoft.Extensions.Caching.Memory;
using System.Timers;
using System.Linq;
using System.Threading;

namespace reportWeb.other
{
    public class ReportMonitor
    {
        private static System.Timers.Timer timer = new();
        public Queue<Object[]> rpt_static { get; private set; } = new();
        public static ReportMonitor Instance { get; private set; } = new();

        private ReportMonitor()
        {
            Env.report_start_action = start_report;
            Env.report_end_action = end_report;
            // 设置定时器的间隔（以毫秒为单位）
            timer.Interval = 2 * 1000; // 每2秒执行一次
            // 设置定时器的重复行为
            timer.AutoReset = true; // 设置为 true，表示重复执行；设置为 false，表示只执行一次
            // 添加定时器的事件处理程序
            timer.Elapsed += (sender, e) =>
            {
                var cur_time = DateTime.Now;
                while (Instance.rpt_static.Count > 0 && cur_time - TimeSpan.FromMinutes(60) > (DateTime)(Instance.rpt_static.Peek()[0]))
                {
                    Instance.rpt_static.Dequeue();
                }
                lock (Instance)
                {
                    int runnig_cnt = Instance.running.Values.Sum(x => x.DataSourceInfoBag.Count(y => y.datasource_stat != null && y.datasource_stat.Contains("打开")));
                    Instance.rpt_static.Enqueue(new Object[] { cur_time
                        ,rpt_cnt
                        ,runnig_cnt , Instance.running.Count
                    });
                    rpt_cnt = runnig_cnt;
                }

            };
            timer.Start();
        }
        private int rpt_cnt=0;

        public ConcurrentDictionary<string, RunReportInfo> running { get; private set; } = new();

        public static ReportMonitor start()
        {
            return Instance;
        }
        public void end_report(RunReportInfo rpt_info)
        {
            lock (Instance)
            {
                //Interlocked.Decrement(ref rpt_cnt);
                running.TryRemove(rpt_info.id, out _);
            }
        }
        public void start_report(RunReportInfo rpt_info)
        {
            lock (Instance)
            {
                Interlocked.Increment(ref rpt_cnt);
                running.TryAdd(rpt_info.id, rpt_info);
            }
        }


    }
}
