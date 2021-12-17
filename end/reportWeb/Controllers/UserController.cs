using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CellReport.exporter;
using CellReport.running;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using reportWeb.Model;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Cryptography;

namespace reportWeb.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
        IConfiguration configuration;
        JsonSerializerOptions json_option;
        ReportDbContext reportDbContext;
        public UserController(IConfiguration configuration,
             ReportDbContext reportDbContext,
            ScopedObj reportGrp)
        {
            this.configuration = configuration;
            this.reportDbContext = reportDbContext;
            json_option = new JsonSerializerOptions()
            {
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All),
                //System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            };
            json_option.Converters.Add(new CellReport.math.BigDecimalConverter());
            json_option.Converters.Add(new CellReport.util.DateConverter());
            json_option.Converters.Add(new CellReport.util.DateTimeConverter());
        }
        #region a
        
        public IActionResult test_connection([FromBody] Rpt_db_connection rpt_Db_Connection)
        {
            var ret = DbProviderFactories.GetFactory(rpt_Db_Connection.db_type).CreateConnection();
            if (ret == null)
            {
                throw new Exception("程序在取数据库连接时异常。通知开发人员升级");
            }
            ret.ConnectionString = rpt_Db_Connection.conn_str;
            ret.Open();
            if(ret.State==System.Data.ConnectionState.Open)
                ret.Close();
            return Json(new { errcode = 0, message = "测试连接成功" });
        }
        public IActionResult test_login(String login_script,string test_user, string test_password)
        {
            
            var ef = new CellReport.core.expr.ExprFaced2();
            ef.addNewScopeForScript();
            ef.addVariable("env", new Env());
            ef.addVariable("__env__", new Env());
            ef.addVariable("userid", test_user);
            ef.addVariable("password", test_password);
            var result = ef.addNewScopeForScript(login_script) as IDictionary<Object, Object>;            
            if (!"0".Equals(result["errcode"]?.ToString()))
            {
                return Json(new { errcode = 0, message = "测试成功", result }, json_option);
            }
            return Json(new { errcode = 0, message = "测试成功", result }, json_option);
        }
        public IActionResult save_config(String login_script)
        {
            reportDbContext.Rpt_config.First().login_script = login_script;
            reportDbContext.SaveChanges();
            return Json(new { errcode = 0, message = "login_script保存成功" }, json_option);
        }
        [AllowAnonymous]
        public IActionResult index() {
            return Redirect("index.html");
        }
        [HttpPost]
        [AllowAnonymous]        
        public IActionResult login([FromBody] UserInfo userinfo)
        {
            IDictionary<Object, Object> result = new Dictionary<Object, Object>() { { "errcode", 1 }, {"message" ,"用户名或密码错误" } };
            String username = AESDecrypt(userinfo.username, configuration["aes_key"]);
            var password = AESDecrypt(userinfo.password, configuration["aes_key"]);
            if (username == configuration["admin_user"]) { 
                if(password == configuration["admin_password"])
                {
                    result = new Dictionary<Object, Object>()
                    {
                        { "errcode", 0 },
                        { "userid", username },
                        { "username", username },
                    };
                }
            }
            else
            {
                var ef = new CellReport.core.expr.ExprFaced2();
                ef.addNewScopeForScript();
                ef.addVariable("env", new Env());
                ef.addVariable("__env__", new Env());
                ef.addVariable("userid", username);
                ef.addVariable("password", password);
                var conf=reportDbContext.Rpt_config.FirstOrDefault();
                if(conf!=null && conf.login_script.Trim()!="")
                    result = ef.addNewScopeForScript(conf.login_script) as IDictionary<Object, Object>;
                else
                    return Unauthorized("用户名或密码错误");
            }
            if (!"0".Equals(result["errcode"]?.ToString()))
            {
                return Unauthorized(result);
            }
            var user = new UserInfo()
            {
                userid = result["userid"].ToString(),
                username = result["username"].ToString(),
            };
            if (user == null)
            {
                var ret = Json(new { errcode = 1, message = "用户名或密码错误" });
                ret.StatusCode = StatusCodes.Status203NonAuthoritative;
                return ret;
            }
            else
            {
                //await HttpContext.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));
                string jwtToken = GenerateJwtToken(user);
                HttpContext.Response.Cookies.Append("access_token", jwtToken);
                return Json(new { errcode = 0, message = "登录成功", data = jwtToken, refresh_token = GenerateJwtToken(user,refresh:true) });
            }
        }
        [AllowAnonymous]
        public IActionResult logout()
        {
            Response.Cookies.Delete("access_token");
            return Json(new
            {
                errcode = 0,
                message = "成功"
            });
        }
        [AllowAnonymous]
        [HttpPost]
        public IActionResult refresh()
        {
            if(HttpContext.User.Claims.FirstOrDefault(x => x.Type == "token_type")?.Value == "refresh")
            {
                var user = new UserInfo() {
                    userid = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "userid").Value,
                    username = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "username").Value
                };
                string jwtToken = GenerateJwtToken(user);
                HttpContext.Response.Cookies.Append("access_token", jwtToken);
                return Json(new { code = 0, message = "登录成功", data = jwtToken });
            }
            var ret = Json(new { code = 0, message = "刷新失效，重新登录" });
            ret.StatusCode = StatusCodes.Status401Unauthorized;
            return ret;
        }
        public IActionResult getUserInfo()
        {
            var userid = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "userid").Value;
            return Json(new { code = 0, message = "登录成功", data = new {
                name= userid,
                userInfo = new
                {
                    username= userid,
                    name= HttpContext.User.Claims.FirstOrDefault(x => x.Type == "username").Value,
                    avatar= "img/bg/vip2.png"
                },
                permission=new List<String>() { },
                roles= new List<String>() { "Admin", "Vistor" },
                menus = new List<String>() { },
            } });
        }
        public IActionResult getTopMenu()
        {
            //{'label': "报表平台",'icon="el-icon-document','path': "/wel/index", 'parentId': 1,'meta': {'edit': False,'prefix':"zb"}},
            return Json(new
            {
                data = new List<Object>(){ new
                {
                    label = "报表平台",
                    icon = "el-icon-document",
                    path = "/rpt-list/index",
                    parentId = 1
                }
            }
            });

        }

        public JsonResult getMenu(string parentId)
        {
            return  Json(new
            {
                data = new List<Object>(){
                    new{
                        path = "/rpt-list/index",
                        icon = "el-icon-document",
                        component = "views/zhanbao/zb_index",
                        label = "报表目录"
                    },new{
                        path = "/manger/index",
                        icon = "el-icon-document",
                        component = "views/zhanbao/zb_index",
                        label = "报表组管理"
                    }
                }
            }
            );
        }
        public static string AESDecrypt(String Data, String Key)
        {
            Byte[] encryptedBytes = Convert.FromBase64String(Data);
            Byte[] bKey = new Byte[32];
            Array.Copy(Encoding.UTF8.GetBytes(Key.PadRight(bKey.Length)), bKey, bKey.Length);

            MemoryStream mStream = new MemoryStream(encryptedBytes);
            //mStream.Write( encryptedBytes, 0, encryptedBytes.Length );  
            //mStream.Seek( 0, SeekOrigin.Begin );  
            //RijndaelManaged aes = new RijndaelManaged();
            Aes aes = Aes.Create();
            aes.Mode = CipherMode.ECB;
            aes.Padding = PaddingMode.PKCS7;
            aes.KeySize = 128;
            aes.Key = bKey;
            //aes.IV = _iV;  
            CryptoStream cryptoStream = new CryptoStream(mStream, aes.CreateDecryptor(), CryptoStreamMode.Read);
            try
            {
                byte[] tmp = new byte[encryptedBytes.Length + 32];
                int len = cryptoStream.Read(tmp, 0, encryptedBytes.Length + 32);
                byte[] ret = new byte[len];
                Array.Copy(tmp, 0, ret, 0, len);
                return Encoding.UTF8.GetString(ret);
            }
            finally
            {
                cryptoStream.Close();
                mStream.Close();
                aes.Clear();
            }
        }
        public string GenerateJwtToken(UserInfo user,bool refresh=false)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes("[SECRET USED TO SIGN AND VERIFY JWT TOKENS, IT CAN BE ANY STRING]");
            var jwtConfig = HttpContext.RequestServices.GetService<JwtConfig>();
            var key = Encoding.UTF8.GetBytes(jwtConfig.SigningKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer= jwtConfig.Issuer,
                Audience= jwtConfig.Audience,
                Subject = new ClaimsIdentity(new[] {
                     //new Claim("sub",user.userid.ToString()),
                     new Claim("userid",user.userid),
                     //new Claim(ClaimTypes.Name,user.userid),
                     new Claim("username",user.username),
                     new Claim("token_type", refresh?"refresh":""),
                }),
                Expires = DateTime.Now.AddMinutes(refresh ? jwtConfig.REFRESH_TOKEN_EXPIRES : jwtConfig.ACCESS_TOKEN_EXPIRES),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public static UserInfo ValidateJwtToken(HttpContext HttpContext, string raw_token)
        {
            if (String.IsNullOrEmpty(raw_token))
                return null;
            //var jwtConfig = configuration.GetSection("Jwt").Get<JwtConfig>();
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtConfig = HttpContext.RequestServices.GetService<JwtConfig>();
            try
            {
                var token =tokenHandler.ReadJwtToken(raw_token);
                TimeZoneInfo.ConvertTimeFromUtc(token.ValidFrom, TimeZoneInfo.Local);
                tokenHandler.ValidateToken(raw_token, new TokenValidationParameters
                {
                    ValidIssuer = jwtConfig.Issuer,
                    ValidAudience = jwtConfig.Audience,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,//jwtConfig.ValidateLifetime,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.SigningKey)),
                    //缓冲过期时间，总的有效时间等于这个时间加上jwt的过期时间
                    ClockSkew = TimeSpan.FromSeconds(0)
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var user = new UserInfo()
                {
                    userid = jwtToken.Claims.FirstOrDefault(x => x.Type == "userid").Value,
                    username = jwtToken.Claims.FirstOrDefault(x => x.Type == "username").Value
                };
                // return account id from JWT token if validation successful
                return user;
            }
            catch (Exception)
            {
                // return null if validation fails
                return null;
            }
        } 
        #endregion
    }
}
