using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CSRedis;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using reportWeb.hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Routing.Patterns;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using reportWeb.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
//using PolarDB.PolarDBClient;
using Serilog;

namespace reportWeb
{
     public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            
            //services.AddSingleton(HtmlEncoder.Create(System.Text.Unicode.UnicodeRanges.All));
            CellReport.core.expr.ExprHelper.buildFuncMap();
            //CellReport.core.expr.ExprHelper.AddFunc(typeof(CellReport.function.Func_md5));
            services.AddDbContext<ReportDbContext>(optionsBuilder =>
            {
                var folder = Environment.SpecialFolder.LocalApplicationData;
                var path = Environment.GetFolderPath(folder);
                var DbPath = $"{path}{System.IO.Path.DirectorySeparatorChar}report.db";
                //var dataAppSetting = Configuration.GetSection("ConnectionSetting").Get<ConnectionSetting>();
                optionsBuilder.UseSqlite($"Data Source=report.db");
            });

            //添加身份认证方案
            var jwtConfig = Configuration.GetSection("Jwt").Get<JwtConfig>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           /*.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, option =>
           {
               option.Cookie.Name = "adCookie";//设置存储用户登录信息（用户Token信息）的Cookie名称
               option.Cookie.HttpOnly = true;//设置存储用户登录信息（用户Token信息）的Cookie，无法通过客户端浏览器脚本(如JavaScript等)访问到
               option.ExpireTimeSpan = TimeSpan.FromDays(3);// 过期时间
               option.SlidingExpiration = true;// 是否在过期时间过半的时候，自动延期
               option.LoginPath = "/Account/Login";
               option.LogoutPath = "/Account/LoginOut";
           })*/
           .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, option =>
           {
               option.SaveToken = true;              
               option.Events = new JwtBearerEvents()
               {
                   OnMessageReceived = context =>
                   {
                       if(context.Request.Headers["Authorization"].ToString()=="" && context.Request.Cookies["access_token"]!=null)
                            context.Token = context.Request.Cookies["access_token"];
                       return Task.CompletedTask;
                   },
                   OnChallenge= context =>
                   {
                       context.HandleResponse();
                       context.Response.WriteAsJsonAsync(new { code = -1, message = "token过期" });
                       return Task.CompletedTask;
                   },
                   OnAuthenticationFailed = context =>
                   {
                       
                       //ASP.NET Core Web Api之JWT刷新Token(三)
                       //https://blog.csdn.net/weixin_30483013/article/details/99642627?utm_medium=distribute.pc_relevant_download.none-task-blog-baidujs-1.nonecase&depth_1-utm_source=distribute.pc_relevant_download.none-task-blog-baidujs-1.nonecase
                       // 如果过期，则把<是否过期>添加到，返回头信息中
                       if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                       {
                           //context.Exception = null;
                           context.Response.StatusCode = 401;
                           string raw_token = context.HttpContext.Request.Headers["Authorization"];
                           if (String.IsNullOrEmpty(raw_token))
                               raw_token = context.HttpContext.Request.Cookies["access_token"];
                           else
                               raw_token = raw_token.Substring("Bearer ".Length);
                           var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                           var token = tokenHandler.ReadJwtToken(raw_token);
                           if("refresh" != token.Claims.FirstOrDefault(x => x.Type == "token_type")?.Value)
                               context.Response.Headers.Add("Token-Expired", "true");
                       }
                       return Task.CompletedTask;
                   },
                   OnTokenValidated = context =>
                   {
                       return Task.CompletedTask;
                   }
               };
               option.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidIssuer = jwtConfig.Issuer,
                   ValidAudience = jwtConfig.Audience,
                   ValidateAudience=false,
                   ValidateIssuer = false,                   
                   ValidateLifetime = true,//jwtConfig.ValidateLifetime,
                   IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.SigningKey)),
                   //缓冲过期时间，总的有效时间等于这个时间加上jwt的过期时间
                   ClockSkew = TimeSpan.FromSeconds(0)
               };
           }); 
            //================================
            // If using Kestrel:
            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });
            services.AddScoped<ScopedObj>();
            services.AddSingleton<JwtConfig>(jwtConfig);
            
            // If using IIS:
            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });
            services.AddOptions();
            services.AddRazorPages().AddRazorRuntimeCompilation();
            services.Configure<CookiePolicyOptions>(option =>
            {
                option.CheckConsentNeeded = context => false;
                option.MinimumSameSitePolicy = SameSiteMode.None;
            });
            //services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpContextAccessor();
            services.AddCors(op => {
                op.AddPolicy("CorsTest",
                    set => {
                    set.SetIsOriginAllowed(origin => true)
                                   .AllowAnyHeader()
                                   .AllowAnyMethod()
                                   .AllowCredentials();//这是是重要的，没有他就会有跨域问题
                    });
            });
            services.AddSignalR();
            services.AddMvc();
            services.AddSession(options =>
            {
                //options.Cookie.IsEssential = true;
                options.Cookie.SameSite = SameSiteMode.Unspecified;//
                options.IdleTimeout = TimeSpan.FromSeconds(60 * 60);
            });
            services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(Directory.GetCurrentDirectory() + Path.DirectorySeparatorChar + "DataProtection"));

            CellReport.Redis_Cache.redis_str = Configuration["redis_str"];
            if(!String.IsNullOrEmpty( CellReport.Redis_Cache.redis_str ))
            {
                CSRedisClient redisClient = new CSRedisClient(CellReport.Redis_Cache.redis_str);
                RedisHelper.Initialization(redisClient);
            }
            DbProviderFactories.RegisterFactory("Microsoft.Data.Sqlite", SqliteFactory.Instance);
            foreach (var one in Configuration.GetSection("DbProviderFactories").Get<DbProviderCfg[]>())
            {
                //var ass = System.Reflection.Assembly.LoadFile(Path.Combine((new DirectoryInfo(Environment.ProcessPath)).Parent.FullName, one.DllName + ".dll"));
                var ass = System.Reflection.Assembly.Load( one.DllName);
                DbProviderFactory f = ass.GetType(one.FactoryClass).GetField(one.InstanceName).GetValue(null) as DbProviderFactory;
                DbProviderFactories.RegisterFactory(one.Name, f );
                
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env,ReportDbContext _reportDbContext)
        {
            
            _reportDbContext.Database.EnsureCreated();//数据库不存在的话，会自动创建
            if (_reportDbContext.Rpt_group.Count() == 0)
            {
                var main_path = Path.Combine(Directory.GetDirectoryRoot(env.ContentRootPath), "reportdefine_root", "default");
                _reportDbContext.Rpt_group.Add(new Rpt_group()
                {
                    Id = "default",
                    owner = "admin",
                    default_page = "default",
                    name = "缺省",
                    report_path = main_path
                });
                if (!Directory.Exists(main_path))
                    Directory.CreateDirectory(main_path);
                main_path = new DirectoryInfo(Path.Combine(env.ContentRootPath, "../example")).FullName;
                _reportDbContext.Rpt_group.Add(new Rpt_group()
                {
                    Id = "example",
                    owner = "admin",
                    default_page = "default",
                    name = "例子",
                    report_path = main_path,
                    db_connection_list=new List<Rpt_db_connection>()
                    { 
                        new Rpt_db_connection() { conn_str=$"Data Source={main_path}/test.db", db_type="Microsoft.Data.Sqlite", name="testsqlite"},
                    }
                });
                _reportDbContext.SaveChanges();
            }
            if (_reportDbContext.Rpt_config.Count() == 0)
            {
                _reportDbContext.Rpt_config.Add(new Rpt_config()
                {
                    login_script = "",
                });
                _reportDbContext.SaveChanges();
            }
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseSerilogRequestLogging();
            app.UseExceptionHandler(builder =>
            {
                Func<HttpContext, RequestDelegate, Task> p = async (context, next) =>
                //builder.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var exception = context.Features.Get<IExceptionHandlerFeature>();
                    if (exception != null)
                    {
                        var ex = exception.Error;
                        //if (ex.InnerException != null)
                        //    ex = ex.InnerException;
                        var json_option = new JsonSerializerOptions()
                        {
                            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
                            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All),
                            //System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                            WriteIndented = true
                        };
                        var errObj = JsonSerializer.Serialize(new
                        {
                            errocode = -1,
                            message = ex.Message,
                            stackerr = ex.StackTrace
                        }, json_option);
                        await context.Response.WriteAsync(errObj);
                    }
                };
                builder.Use(p);
            });
            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            
            app.Use(next => context =>
            {
                var cur_path = context.Request.Path.Value;
                if (cur_path.Contains("/design/"))
                {
                    cur_path = cur_path.Substring(cur_path.IndexOf("/design/"));
                }
                if (cur_path.Contains("/chatHub"))
                {
                    cur_path = cur_path.Substring(cur_path.IndexOf("/chatHub"));
                }
                var seg_arr = cur_path.Split(":");
                string grp = "default";
                if (seg_arr.Length>=2)
                {
                    grp=seg_arr[1];
                }
                
                var scopedObj = context.RequestServices.GetService<ScopedObj>();
                //scopedObj.rpt_group = context.RequestServices.GetService<ReportDb>().findGroupById(grp);
                scopedObj.rpt_group = context.RequestServices.GetService <ReportDbContext>().Rpt_group.AsNoTracking()
                .Include(x=>x.db_connection_list)
                .Where(i => i.Id == grp)
                .FirstOrDefault();
                scopedObj.WebHostEnvironment = env;
                
                context.Request.Path = seg_arr[0];
                if (context.Request.Path == "/run")
                {
                    if (scopedObj.rpt_group == null)
                    {
                        context.Response.StatusCode = 500;
                        context.Response.ContentType = "application/json";
                        return context.Response.WriteAsync("{ \"errcode\":1, \"message\":\"grp没有定义\" }");
                    }
                    var rn=context.Request.Query["reportName"];
                    if (rn.Count == 1)
                    {
                        context.Request.Path = "/" + scopedObj.rpt_group.getPageNameByReportName(rn[0]);
                    }
                }
                return next(context);
            });
            app.UseRouting();
            app.Use(next => context =>
            {
                return next(context);
            });
            app.UseCors("CorsTest");//其中app.UseCors()必须放在app.UseRouting()和app.UseEndpoints之间，不然还是解决不了问题

            app.UseAuthentication();//认证(Authentication)  
            app.UseAuthorization(); //授权 (Authorization)

            app.UseSession(); 

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapHub<ChatHub>("/chathub");
                endpoints.MapControllerRoute(name: "default",pattern: "{controller=user}/{action=Index}/{id?}");
                //endpoints.MapDynamicPageRoute<GrpRouteTransformer>("{page}/{**grp}");
                //endpoints.MapDynamicControllerRoute<GrpRouteTransformer>("{area}/{controller=Home}/{action=Index}/{id:int?}");
                //endpoints.Map(RoutePatternFactory.Parse("/run/{act}/{grp}/{a0}/{a1}"), rpt_execute);
            });
            Task.Factory.StartNew(async () =>
            {
                //从队列中取元素。
                while (!MessageQueueBlock<DemoMessage>.IsComleted())
                {
                    try
                    {
                        var m = MessageQueueBlock<DemoMessage>.Take();//Client(m.ConnectionId)
                        if (m.ConnectionId != null)
                            await m.hubContext.Clients.Client(m.ConnectionId)?.SendAsync("ReceiveMessage",m.ConnectionId,m.Body);                    
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            });
        }
    }
}
