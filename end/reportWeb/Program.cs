using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
namespace reportWeb
{
    public class Program
    {
        
        public static void Main(string[] args)
        {
            Console.WriteLine("ÐÅÏ¢:" + String.Join(",", CellReport.util.KeyAndPassword.get_ip_mac_list()) ); 
            Console.WriteLine("»úÆ÷Âë:"+CellReport.util.KeyAndPassword.getMachine_key());
             

            System.Threading.ThreadPool.SetMinThreads(200, 200);
            int worker = 0;
            int io = 0;
            ThreadPool.GetAvailableThreads(out worker, out io);

            Console.WriteLine("Thread pool threads available at startup: ");
            Console.WriteLine("   Worker threads: {0:N0}", worker);
            Console.WriteLine("   Asynchronous I/O threads: {0:N0}", io);
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseSerilog((context, logger) =>
                    {
                        logger.ReadFrom.Configuration(context.Configuration);
                    });                  
                    webBuilder.UseStartup<Startup>();
                });
    }
}
