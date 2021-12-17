using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;
using reportWeb.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace reportWeb
{
    public class ScopedObj
    {
        public Rpt_group rpt_group { get; set; }
        public IWebHostEnvironment WebHostEnvironment { get; internal set; }
    }
    public class ReportDbContext : DbContext
    {
        public ReportDbContext(DbContextOptions<ReportDbContext> options)
          : base(options)
        {
            
        }
        public DbSet<Rpt_group> Rpt_group { get; set; }
        public DbSet<Rpt_db_connection> Rpt_db_connection { get; set; }
        public DbSet<Rpt_config> Rpt_config { get; set; }
    }
    public class Rpt_group
    {
        [Key]
        public string Id { get; set; }
        public string name { get; set; }
        public string owner { get; set; }
        public string default_page { get; set; }
        public string allow { get; set; }
        public string report_path { get; set; }
        public string test_report_path { get; set; }        
        [ForeignKey("grp_id")]
        public List<Rpt_db_connection> db_connection_list { get; set; }
        public string members { get; set; }
        public string zb_user { get;  set; }
        public string zb_password { get;  set; }

        public string getPageNameByReportName(string reportName)
        {
            if (reportName.StartsWith("/"))
                reportName = reportName.Substring(1);
            return this.default_page.Split(",")[0];
        }
    }
    public class Rpt_db_connection
    {
        [Key]
        public int Id { get; set; }
        public string name { get; set; }
        public string grp_id { get; set; }
        public string db_type { get; set; }
        public string conn_str { get; set; }
        public string test_conn_str { get; set; }
    }
    public class Rpt_config
    {
        [Key]
        public int Id { get; set; }
        public string login_script { get; set; }
    }
}
