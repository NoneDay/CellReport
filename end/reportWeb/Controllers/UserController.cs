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
using reportWeb.Pages;
using SqlKata.Execution;

namespace reportWeb.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
        IConfiguration configuration;
        JsonSerializerOptions json_option;

        private readonly MyLogger logger;
        private ReportDbContext reportDb;
        public UserController(IConfiguration configuration, ReportDbContext reportDb,
              ILogger<UserController> logger,
            ScopedObj reportGrp)
        {
            this.configuration = configuration;

            this.logger = new MyLogger(logger);
            this.reportDb = reportDb;
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
            using var ret = DbProviderFactories.GetFactory(rpt_Db_Connection.db_type).CreateConnection();
            if (ret == null)
            {
                throw new Exception("程序在取数据库连接时异常。通知开发人员升级");
            }
            ret.ConnectionString = rpt_Db_Connection.conn_str;
            ret.Open();
            if (ret.State == System.Data.ConnectionState.Open)
                ret.Close();
            return Json(new { errcode = 0, message = "测试连接成功" });
        }
        public IActionResult test_zcm(String zcm)
        {
            var zc_dict = CellReport.util.KeyAndPassword.yan_zheng_zcm(zcm);
            if (null == zc_dict)
            {
                return Json(new { errcode = 1, message = "验证失败" }, json_option);
            }
            //reportDbContext.Rpt_config.First().zcm = zcm;
            //reportDbContext.SaveChanges();
            reportDb.Query("Rpt_config").Update(new { zcm });
            return Json(new { errcode = 0, message = "验证成功", zc_dict = zc_dict }, json_option);
        }

        public IActionResult test_login(String login_script, string test_user, string test_password)
        {

            var ef = new CellReport.core.expr.ExprFaced2();
            ef.addNewScopeForScript();
            using var report_env = new Env("test_login");
            report_env.logger = logger;
            ef.addVariable("env", report_env);
            ef.addVariable("__env__", report_env);
            ef.addVariable("__page__", Request);
            ef.addVariable("userid", test_user);
            ef.addVariable("password", test_password);
            var result = ef.addNewScopeForScript(login_script) as CR_Object;
            if (result == null)
                return Json(new { errcode = 1, message = "测试失败", result = "不是正常返回对象，请仔细看说明要求" }, json_option);
            if (!"0".Equals(result["errcode"]?.ToString()))
            {
                return Json(new { errcode = 1, message = "测试成功", result }, json_option);
            }
            return Json(new { errcode = 0, message = "测试成功", result }, json_option);
        }
        public IActionResult save_config(String login_script)
        {
            //reportDbContext.Rpt_config.First().login_script = login_script;
            //reportDbContext.SaveChanges();
            reportDb.Query("Rpt_config").Update(new { login_script });
            return Json(new { errcode = 0, message = "login_script保存成功" }, json_option);
        }
        [AllowAnonymous]
        public IActionResult index()
        {
            return Redirect("index.html");
        }
        [HttpPost]
        [AllowAnonymous]
        public IActionResult login([FromBody] UserInfo userinfo)
        {
            using var cur_env = new CellReport.running.Env("login1");
            var verfiy_code_script = cur_env.TemplateGet("verfiy_code_script");
            CR_Object result = new CR_Object() { { "errcode", 1 }, { "message", "用户名或密码错误" } };
            var verfiy_code = HttpContext.Session.GetString("verfiy_code");
            if (!string.IsNullOrWhiteSpace(verfiy_code_script) || !string.IsNullOrEmpty(verfiy_code))
            {
                var send_time_str = HttpContext.Session.GetString("send_time");
                if (String.IsNullOrEmpty(verfiy_code) || String.IsNullOrEmpty(send_time_str))
                    return Unauthorized(new { message = "请先点击发送验证码！" });

                var send_time = new DateTime(long.Parse(send_time_str));
                if (send_time.AddMinutes(5) < DateTime.Now)
                {
                    HttpContext.Session.Remove("verfiy_code");
                    HttpContext.Session.Remove("send_time");
                    return Unauthorized(new { message = "验证码已超时" });
                }

                if (!userinfo.code.Equals(verfiy_code, StringComparison.OrdinalIgnoreCase))
                    return Unauthorized(new { message = "验证码错误" });
            }

            String username = AESDecrypt(userinfo.username, configuration["aes_key"]);
            var password = AESDecrypt(userinfo.password, configuration["aes_key"]);
            if (username == configuration["admin_user"])
            {
                if (password == configuration["admin_password"])
                {
                    result = new CR_Object()
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
                using var report_env = new Env("login2");
                ef.addVariable("env", report_env);
                ef.addVariable("__env__", report_env);
                ef.addVariable("userid", username);
                ef.addVariable("password", password);
                var //conf=reportDbContext.Rpt_config.FirstOrDefault();
                conf = reportDb.Query("Rpt_config").FirstOrDefault<Rpt_config>();
                if (conf != null && conf.login_script.Trim() != "")
                    result = ef.addNewScopeForScript(conf.login_script) as CR_Object;
                else
                    return Unauthorized(new { message = "用户名或密码错误" });
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
                HttpContext.Session.Remove("verfiy_code");
                HttpContext.Session.Remove("send_time");
                //await HttpContext.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));
                string jwtToken = GenerateJwtToken(user);
                HttpContext.Response.Cookies.Append("access_token", jwtToken);
                return Json(new { errcode = 0, message = "登录成功", data = jwtToken, refresh_token = GenerateJwtToken(user, refresh: true) });
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
            if (HttpContext.User.Claims.FirstOrDefault(x => x.Type == "token_type")?.Value == "refresh")
            {
                var user = new UserInfo()
                {
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
            return Json(new
            {
                code = 0,
                message = "登录成功",
                data = new
                {
                    name = userid,
                    userInfo = new
                    {
                        username = userid,
                        name = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "username").Value,
                        avatar = "img/bg/vip2.png"
                    },
                    permission = new List<String>() { },
                    roles = new List<String>() { "Admin", "Vistor" },
                    menus = new List<String>() { },
                }
            });
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
            return Json(new
            {
                data = new List<Object>(){
                    new{
                        path = "/rpt-list/index",
                        icon = "el-icon-document",
                        component = "",
                        label = "报表目录"
                    },new{
                        path = "/manger/index",
                        icon = "el-icon-document",
                        component = "",
                        label = "报表组管理"
                    },new{
                        path = "/widget/index",
                        icon = "el-icon-document",
                        component = "",
                        label = "组件管理"
                    },new{
                        path = "/crud_template/index",
                        icon = "el-icon-document",
                        component = "",
                        label = "CRUD代码生成"
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
        public string GenerateJwtToken(UserInfo user, bool refresh = false)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes("[SECRET USED TO SIGN AND VERIFY JWT TOKENS, IT CAN BE ANY STRING]");
            var jwtConfig = HttpContext.RequestServices.GetService<JwtConfig>();
            var key = Encoding.UTF8.GetBytes(jwtConfig.SigningKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = jwtConfig.Issuer,
                Audience = jwtConfig.Audience,
                Subject = new ClaimsIdentity(new[] {
                     //new Claim("sub",user.userid.ToString()),
                     new Claim("userid",user.userid),
                     //new Claim(ClaimTypes.Name,user.userid),
                     new Claim("username",user.username),
                     new Claim("token_type", refresh?"refresh":""),
                }),
                Expires = DateTime.UtcNow.AddMinutes(refresh ? jwtConfig.REFRESH_TOKEN_EXPIRES : jwtConfig.ACCESS_TOKEN_EXPIRES),
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
                var token = tokenHandler.ReadJwtToken(raw_token);
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
                if (jwtToken.ValidTo < DateTime.UtcNow)
                    return null;
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

        [AllowAnonymous]
        public IActionResult VerifyCode(string userid, int code_len)
        {
            using var cur_env = new CellReport.running.Env("VerifyCode1");
            var verfiy_code_script = cur_env.TemplateGet("verfiy_code_script");
            if (string.IsNullOrWhiteSpace(verfiy_code_script))
                verfiy_code_script = configuration["verfiy_code_script"];
            if (string.IsNullOrWhiteSpace(verfiy_code_script))
                return new JsonResult(new { errcode = 1, message = "没有设置验证码发送脚本" });
            if (string.IsNullOrEmpty(userid))
                return new JsonResult(new { errcode = 1, message = "请先设置用户名" });
            var send_time_str = HttpContext.Session.GetString("send_time");
            if (!String.IsNullOrEmpty(send_time_str))
            {
                var send_time = new DateTime(long.Parse(send_time_str));
                if (send_time.AddMinutes(1) > DateTime.Now)
                    return new JsonResult(new { errcode = 1, message = "频繁发送！！！" });
            }
            string verfiy_code = Random.Shared.Next(999999).ToString("000000")[0..code_len];
            HttpContext.Session.SetString("verfiy_code", verfiy_code);
            HttpContext.Session.SetString("send_time", DateTime.Now.Ticks.ToString());
            var ef = new CellReport.core.expr.ExprFaced2();
            ef.addNewScopeForScript();
            using var report_env = new Env("VerifyCode2");
            report_env.logger = logger;
            ef.addVariable("env", report_env);
            ef.addVariable("__env__", report_env);
            ef.addVariable("userid", userid);
            ef.addVariable("verfiy_code", verfiy_code);
            var result = ef.addNewScopeForScript(verfiy_code_script) as CR_Object;
            //var result = new Dictionary<String, string>() { { "errcode", "0" },{ "message","发送成功" } };
            if (!"0".Equals(result["errcode"]?.ToString()))
            {
                return new JsonResult(new { errcode = 1, message = "验证码发送失败" });
            }
            //if (userid == null) return new JsonResult(new { errcode = 1,
            return new JsonResult(new { errcode = 0, message = result["message"]?.ToString() });
        }
        #endregion

        #region 报表监控
        [AllowAnonymous]
        public IActionResult rpt_montior()
        {
            return new JsonResult(new
            {
                errcode = 0,
                running = new List<Object[]> { new Object[] { "env_name","rpt_group_name", "report_name", "calc_type", "report_param", "start", "end", "datasource_name", "sql", "ds_name", "sql_start", "sql_end", "datasource_stat", "info" } }.Concat(
                    reportWeb.other.ReportMonitor.Instance.running.Values.SelectMany(rpt_info => rpt_info.DataSourceInfoBag, (rpt_info, datasource_info) => {
                        return new Object[]
                        {
                            rpt_info.env_name,
                        rpt_info.rpt_group_name,
                        rpt_info.report_name,
                        rpt_info.calc_type,
                        rpt_info.report_param,
                        rpt_info.start,
                        rpt_info.end, 
                        datasource_info.datasource_name,
                        datasource_info.sql,
                        datasource_info.ds_name,
                        datasource_info.sql_start,
                        datasource_info.sql_end,
                        datasource_info.datasource_stat,
                        datasource_info.info,
                        };
                    })),
                rpt_static = new List<Object[]> { new Object[] { "时间", "运行报表数", "打开连接数", "正在运行报表数", } }.Concat(reportWeb.other.ReportMonitor.Instance.rpt_static),
            }, json_option);
        }
        #endregion


        #region 校验码图片
        /*
        [AllowAnonymous]
        public IActionResult VerifyCodeImg(string userid, int code_len)
        {
            string captchaCode = GenerateRandomCode(code_len);
            byte[] imageBytes = GenerateCaptchaImage(captchaCode);
            HttpContext.Session.SetString("verfiy_code", captchaCode);
            HttpContext.Session.SetString("send_time", DateTime.Now.Ticks.ToString());
            // 将字节数组转换为 Base64 编码的字符串
            //string base64String = Convert.ToBase64String(imageBytes);
            return File(imageBytes, "image/jpeg");
        }

        public byte[] GenerateCaptchaImage(string captchaCode)
        {

            int width = 200;
            int height = 100;
            using (Bitmap bitmap = new Bitmap(width, height))
            {
                using (Graphics graphics = Graphics.FromImage(bitmap))
                {
                    graphics.Clear(Color.White);

                    Font font = new Font("Arial", 30);
                    SolidBrush brush = new SolidBrush(Color.Black);

                    // 绘制校验码
                    for (int i = 0; i < captchaCode.Length; i++)
                    {
                        float rotation = (new Random().Next(4) - 2) * 8;

                        Matrix matrix = new Matrix();
                        matrix.RotateAt(rotation, new PointF(i * (width / 6), height / 2));
                        graphics.Transform = matrix;

                        // 随机生成干扰线颜色
                        Color lineColor = GenerateRandomColor();
                        Pen pen = new Pen(lineColor, 2);

                        graphics.DrawString(captchaCode[i].ToString(), font, brush, i * (width / 6), (height / 2) - (font.Size / 2));

                        // 绘制干扰线
                        Random random = new Random();
                        int x1 = random.Next(width);
                        int y1 = random.Next(height);
                        int x2 = random.Next(width);
                        int y2 = random.Next(height);
                        graphics.DrawLine(pen, x1, y1, x2, y2);
                    }

                    using (MemoryStream stream = new MemoryStream())
                    {
                        bitmap.Save(stream, ImageFormat.Png);
                        return stream.ToArray();
                    }
                }
            }
        }
        private Color GenerateRandomColor()
        {
            Random random = new Random();
            return Color.FromArgb(random.Next(256), random.Next(256), random.Next(256));
        }
        private string GenerateRandomCode(int len = 4)
        {
            string characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            Random random = new Random();
            string randomCode = new string(Enumerable.Repeat(characters, len)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            return randomCode;
        }*/
        #endregion
    }
}
