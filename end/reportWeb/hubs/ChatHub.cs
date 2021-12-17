using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;

namespace reportWeb.hubs
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        IHttpContextAccessor _httpContextAccessor;
        public ChatHub(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public override Task OnConnectedAsync()
        {
            //// 从http中根据“access_token“字段获取，token，然后校验token
            //string token = _httpContextAccessor.HttpContext.Request.Query["access_token"];
            //// 实际校验过程根据个人项目决定，成功则连接，不成功直接返回
            //if (string.IsNullOrEmpty(token))
            //{
            //    return null;
            //}
            //Console.Error.WriteLine("OnConnectedAsync :" + Context.ConnectionId);
            //Console.Error.WriteLine("HttpContext:" +
            //    _httpContextAccessor.HttpContext.User.Claims.First(x => x.Type == ClaimTypes.Name));
            //Console.Error.WriteLine("HubContext :" +
            //    Context.User.Claims.First(x => x.Type == ClaimTypes.Name));
            return base.OnConnectedAsync();
        }
        public async Task SendMessage(string user, string message)
        {
            //this.HttpContext.User
            //Context.UserIdentifier
            await Clients.All.SendAsync("ReceiveMessage", message,Context.ConnectionId);
        }
        public String GetConnectionId()
        {
            return Context.ConnectionId;
        }
    }
}
