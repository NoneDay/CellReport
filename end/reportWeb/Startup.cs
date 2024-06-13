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

//using PolarDB.PolarDBClient;
using Serilog;
using Microsoft.Extensions.FileProviders;
using Dapper;
using SqlKata;
using SqlKata.Execution;
using SqlKata.Compilers;
using System.Timers;

namespace reportWeb
{
     public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            
        }
        private static void Timer_Elapsed(object sender, ElapsedEventArgs e, string directoryPath)
        {
            string[] files = Directory.GetFiles(directoryPath);

            // �����ļ����������ʱ��
            foreach (string file in files)
            {
                FileInfo fileInfo = new FileInfo(file);
                if(DateTime.Now - fileInfo.CreationTime > TimeSpan.FromMinutes(1))
                {
                    try
                    {
                        fileInfo.Delete();
                    }
                    catch
                    {
                    }
                }
            }
        }
        public IConfiguration Configuration { get; }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            iText.Kernel.Font.PdfFontFactory.RegisterSystemDirectories();
            //services.AddSingleton(HtmlEncoder.Create(System.Text.Unicode.UnicodeRanges.All));
            CellReport.core.expr.ExprHelper.buildFuncMap();
            //CellReport.core.expr.ExprHelper.AddFunc(typeof(CellReport.function.Func_md5));
            CellReport.core.expr.ExprHelper.AddFunc(typeof(CellReport.function.Func_qr_code));
            CellReport.core.expr.ExprHelper.AddFunc(typeof(CellReport.function.Func_kata));
            CellReport.core.expr.ExprHelper.AddFunc(typeof(CellReport.function.Func_kata_Variable));

            //IWebHostEnvironment env;
            //ReportDbContext.EnsureDbExists(env);

            services.AddScoped<ReportDbContext>();

            //services.AddDbContext<ReportDbContext>(optionsBuilder =>
            //{
            //    var folder = Environment.SpecialFolder.LocalApplicationData;
            //    var path = Environment.GetFolderPath(folder);
            //    var DbPath = $"{path}{System.IO.Path.DirectorySeparatorChar}report.db";
            //    //var dataAppSetting = Configuration.GetSection("ConnectionSetting").Get<ConnectionSetting>();
            //    optionsBuilder.UseSqlite($"Data Source=report.db");
            //});
            //��������֤����
            var jwtConfig = Configuration.GetSection("Jwt").Get<JwtConfig>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           /*.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, option =>
           {
               option.Cookie.Name = "adCookie";//���ô洢�û���¼��Ϣ���û�Token��Ϣ����Cookie����
               option.Cookie.HttpOnly = true;//���ô洢�û���¼��Ϣ���û�Token��Ϣ����Cookie���޷�ͨ���ͻ���������ű�(��JavaScript��)���ʵ�
               option.ExpireTimeSpan = TimeSpan.FromDays(3);// ����ʱ��
               option.SlidingExpiration = true;// �Ƿ��ڹ���ʱ������ʱ���Զ�����
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
                       context.Response.WriteAsJsonAsync(new { code = -1, message = "token����" });
                       return Task.CompletedTask;
                   },
                   OnAuthenticationFailed = context =>
                   {
                       
                       //ASP.NET Core Web Api֮JWTˢ��Token(��)
                       //https://blog.csdn.net/weixin_30483013/article/details/99642627?utm_medium=distribute.pc_relevant_download.none-task-blog-baidujs-1.nonecase&depth_1-utm_source=distribute.pc_relevant_download.none-task-blog-baidujs-1.nonecase
                       // ������ڣ����<�Ƿ����>��ӵ�������ͷ��Ϣ��
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
                           //var jwtConfig = context.HttpContext.RequestServices.GetService<JwtConfig>();
                           //tokenHandler.ValidateToken(raw_token, new TokenValidationParameters
                           //{
                           //    ValidIssuer = jwtConfig.Issuer,
                           //    ValidAudience = jwtConfig.Audience,
                           //    ValidateAudience = false,
                           //    ValidateIssuer = false,
                           //    ValidateLifetime = true,//jwtConfig.ValidateLifetime,
                           //    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.SigningKey)),
                           //    //�������ʱ�䣬�ܵ���Чʱ��������ʱ�����jwt�Ĺ���ʱ��
                           //    ClockSkew = TimeSpan.FromSeconds(0)
                           //}, out SecurityToken validatedToken);

                           if ("refresh" != token.Claims.FirstOrDefault(x => x.Type == "token_type")?.Value)
                               context.Response.Headers.Add("token-expired", "true");
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
                   //�������ʱ�䣬�ܵ���Чʱ��������ʱ�����jwt�Ĺ���ʱ��
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
                                   .AllowCredentials();//��������Ҫ�ģ�û�����ͻ��п�������
                    });
            });
            services.AddSignalR();
            services.AddMvc();
            services.AddSession(options =>
            {
                //options.Cookie.IsEssential = true;
                options.Cookie.SameSite = SameSiteMode.Unspecified;//
                options.IdleTimeout = TimeSpan.FromSeconds(60 * 60);
                options.Cookie.Name = ".cellreport.Session"; // <--- û����һ�У���ʱ�ᱨ��"Error unprotecting the session cookie"�쳣
            });
            services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(Directory.GetCurrentDirectory() + Path.DirectorySeparatorChar + "DataProtection"));

            CellReport.Redis_Cache.redis_str = Configuration["redis_str"];
            if(!String.IsNullOrEmpty( CellReport.Redis_Cache.redis_str ))
            {
                CSRedisClient redisClient = new CSRedisClient(CellReport.Redis_Cache.redis_str);
                RedisHelper.Initialization(redisClient);
            }
            var loc=System.Reflection.Assembly.GetEntryAssembly().Location;
            DbProviderFactories.RegisterFactory("Microsoft.Data.Sqlite", SqliteFactory.Instance);
            foreach(var one in Configuration.GetSection("DbProviderFactories").Get<DbProviderCfg[]>())
            {
                //var ass = System.Reflection.Assembly.Load( one.DllName);
                var file_name = Path.GetDirectoryName(loc) + "/" + one.DllName + (one.DllName.EndsWith(".dll") ? "" : ".dll");
                var ass = System.Reflection.Assembly.LoadFrom(file_name);
                DbProviderFactory f = ass.GetType(one.FactoryClass).GetField(one.InstanceName).GetValue(null) as DbProviderFactory;
                DbProviderFactories.RegisterFactory(one.Name, f );
            }

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            ReportDbContext.EnsureDbExists(env);
            reportWeb.other.ReportMonitor.start();
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
                        System.Exception inner_e = ex;
                        StringBuilder sb = new();
                        while (inner_e != null)
                        {
                            sb.Append("��").AppendLine(inner_e.Message).Append("��");
                            inner_e = inner_e.InnerException;
                        }
                        var errObj = JsonSerializer.Serialize(new
                        {
                            errocode = -1,
                            message = sb.ToString(),
                            stackerr = ex.StackTrace
                        }, json_option);
                        await context.Response.WriteAsync(errObj);
                    }
                };
                builder.Use(p);
            });
            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            string static_path = Configuration["static_path"];
            if (String.IsNullOrEmpty(static_path))
                static_path = Path.Combine(env.WebRootPath, "../static");
            if (!(new DirectoryInfo(static_path).Exists))
            {
                Directory.CreateDirectory(static_path);
            }
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(static_path),
                RequestPath = new PathString("/Static"),
            });
            static_path = Path.Combine(env.WebRootPath, "../static/tmp_files");
            if (!(new DirectoryInfo(static_path).Exists))
            {
                Directory.CreateDirectory(static_path);
            }
            // ������ʱ��
            Timer timer = new();
            // ���ö�ʱ���ļ�����Ժ���Ϊ��λ��
            timer.Interval = 60*1000; // ÿ��ִ��һ��
            // ���ö�ʱ�����ظ���Ϊ
            timer.AutoReset = true; // ����Ϊ true����ʾ�ظ�ִ�У�����Ϊ false����ʾִֻ��һ��
            // ��Ӷ�ʱ�����¼��������
            timer.Elapsed += (sender, e) => Timer_Elapsed(sender, e, Path.Combine(env.WebRootPath, "../static/tmp_files")); ;
            // ʹ�� Tag ���Դ洢����
            // ������ʱ��
            timer.Start();

            app.Use(next => context =>
            {
                var cur_path = context.Request.Path.Value;
                if (cur_path.Contains("/design"))
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
                var query=context.RequestServices.GetService<ReportDbContext>();
                scopedObj.rpt_group = query.GetRpt_Group(grp);
                scopedObj.WebHostEnvironment = env;
                
                context.Request.Path = seg_arr[0];
                if (context.Request.Path == "/run")
                {
                    if (scopedObj.rpt_group == null)
                    {
                        context.Response.StatusCode = 500;
                        context.Response.ContentType = "application/json";
                        return context.Response.WriteAsync("{ \"errcode\":1, \"message\":\"grpû�ж���\" }");
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
            app.UseCors("CorsTest");//����app.UseCors()�������app.UseRouting()��app.UseEndpoints֮�䣬��Ȼ���ǽ����������

            app.UseAuthentication();//��֤(Authentication)  
            app.UseAuthorization(); //��Ȩ (Authorization)

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
                //�Ӷ�����ȡԪ�ء�
                while (!MessageQueueBlock<DemoMessage>.IsComleted())
                {
                    try
                    {
                        var m = MessageQueueBlock<DemoMessage>.Take();//Client(m.ConnectionId)
                        if(m.ConnectionId!=null)
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
