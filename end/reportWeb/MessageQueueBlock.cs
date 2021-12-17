using Microsoft.AspNetCore.SignalR;
using reportWeb.hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace reportWeb
{
    /// <summary>
    /// BlockingCollection演示消息队列
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class MessageQueueBlock<T> where T : class
    {
        private static BlockingCollection<T> Colls;
        private MessageQueueBlock()
        {

        }
        public static bool IsComleted()
        {
            if (Colls != null && Colls.IsCompleted)
            {
                return true;
            }
            return false;
        }
        public static bool HasEle()
        {
            if (Colls != null && Colls.Count > 0)
            {
                return true;
            }
            return false;
        }

        public static bool Add(T msg)
        {
            if (Colls == null)
            {
                Colls = new BlockingCollection<T>();
            }
            Colls.Add(msg);
            return true;
        }
        public static T Take()
        {
            if (Colls == null)
            {
                Colls = new BlockingCollection<T>();
            }
            return Colls.Take();
        }
    }

    /// <summary>
    /// 消息体
    /// </summary>
    public class DemoMessage
    {
        public string BusinessType { get; set; }
        public string ConnectionId  { get; set; }
        public ClaimsPrincipal User { get; set; }
        public IHubContext<ChatHub> hubContext { get; set; }
        public string Body { get; set; }
    }
}
