using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;
using reportWeb.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SqlKata.Execution;
using Microsoft.Data.Sqlite;
using System.Data.Common;
using SqlKata.Compilers;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace reportWeb
{
    public class ScopedObj
    {
        public Rpt_group rpt_group { get; set; }
        public IWebHostEnvironment WebHostEnvironment { get; internal set; }
    }
    public class ReportDbContext : SqlKata.Execution.QueryFactory
    {
        private readonly ILogger<ReportDbContext> _logger;
        public ReportDbContext(ILogger<ReportDbContext> logger)
        {
            this._logger = logger;
            var report_db = SqliteFactory.Instance.CreateConnection();
            report_db.ConnectionString = "Data Source=report.db;";
            this.Connection = report_db;
            this.Compiler = new SqlKata.Compilers.SqliteCompiler();
            Logger = result =>
            {
                _logger.LogDebug(result.ToString());
                //Console.WriteLine(result.ToString());
            };
        }
        public IEnumerable<Rpt_group> getList(string cur_userid)
        {
            IEnumerable<Rpt_group> ret = rpt_Groups;

            if (cur_userid != "admin")
                ret = rpt_Groups.Where(x => x.owner == cur_userid);

            return ret;
        }
        public Rpt_group GetRpt_Group(string id)
        {
            return rpt_Groups.Where(x => x.Id == id).FirstOrDefault<Rpt_group>();
        }
        private bool Rpt_groupExists(string id)
        {
            return rpt_Groups.Count(x => x.Id == id) > 0;
            //return _context.Rpt_group.Any(e => e.Id == id);
        }
        private bool Rpt_connectionExists(int id)
        {
            return rpt_Groups.SelectMany(x => x.db_connection_list).Count(x => x.Id == id) > 0;
            //return _context.Rpt_db_connection.Any(e => e.Id == id);
        }
        public async Task DeleteRpt_group(string id)
        {
            await Query("Rpt_db_connection").Where(new { rpt_id = id }).DeleteAsync();
            await Query("Rpt_group").Where(new { id }).DeleteAsync();
            ConcurrentBag<Rpt_group> tmp_list = new();
            rpt_Groups.Where(x => x.Id != id).ToList().ForEach(x => tmp_list.Add(x));
            rpt_Groups = tmp_list;
            return;
        }
        public async Task UpdateRpt_group(string cur_userid, Rpt_group rpt_group)
        {

            if (cur_userid != "admin" && rpt_group.owner != cur_userid)
            {
                throw new Exception("非管理员不能修改管理员信息。如果需要，请通知管理员修改。");
            }
            rpt_group?.db_connection_list?.ForEach(one =>
            {
                one.grp_id = rpt_group.Id;
            });
            List<int> all_conn_id_list = new List<int>();
            rpt_group?.db_connection_list?.ForEach(one =>
            {
                if (Rpt_connectionExists(one.Id))
                {
                    all_conn_id_list.Add(one.Id);
                }
            });
            List<int> del_conn_id_list = new List<int>();

            if (Rpt_groupExists(rpt_group.Id))
            {
                await Query("Rpt_group").UpdateAsync(rpt_group);
            }
            else
            {
                await Query("Rpt_group").InsertAsync(rpt_group);
            }
            var ddd = await Query("Rpt_db_connection").Where(new { grp_id = rpt_group.Id }).WhereNotIn("id", all_conn_id_list).Select("id").GetAsync<int>();
            foreach (var id in ddd)
            {
                Query("Rpt_db_connection").WhereIn("id", ddd).Delete();
            };

            rpt_group?.db_connection_list?.ForEach(one =>
            {
                if (del_conn_id_list.Contains(one.Id))
                    return;
                if (one.Id != 0 && Rpt_connectionExists(one.Id))
                {
                    Query("Rpt_db_connection").Where(new { id = one.Id }).Update(one);
                }
                else
                    Query("Rpt_db_connection").Insert(one);
            });
            FreshCache(this);
        }
        public static void EnsureDbExists(IWebHostEnvironment env)
        {
            var connection = SqliteFactory.Instance.CreateConnection();
            connection.ConnectionString = "Data Source=report.db";
            using var db = new QueryFactory(connection, new SqliteCompiler());
            db.Logger = result =>
            {
                Console.WriteLine(result.ToString());
            };

            if (!File.Exists("report.db"))
            {
                Console.WriteLine("db not exists creating db");
                db.Statement(@"BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS Rpt_group (
	Id	TEXT NOT NULL,
	name	TEXT,
	owner	TEXT,
	default_page	TEXT,
	allow	TEXT,
	report_path	TEXT,
	test_report_path	TEXT,
	members	TEXT,
	zb_user	TEXT,
	zb_password	TEXT,
	CONSTRAINT PK_Rpt_group PRIMARY KEY(Id)
);
CREATE TABLE IF NOT EXISTS Rpt_db_connection (
	id	INTEGER NOT NULL,
	name	TEXT,
	grp_id	TEXT,
	db_type	TEXT,
	conn_str	TEXT,
	test_conn_str	TEXT,
    sql_prefix text,
	CONSTRAINT FK_Rpt_db_connection_Rpt_group_grp_id FOREIGN KEY(grp_id) REFERENCES Rpt_group(Id),
	CONSTRAINT PK_Rpt_db_connection PRIMARY KEY(id AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS Rpt_config (
	id	INTEGER NOT NULL,
	login_script	TEXT,
	version	NUMERIC,
	zcm	TEXT,
	CONSTRAINT PK_Rpt_config PRIMARY KEY(id AUTOINCREMENT)
);
CREATE INDEX IF NOT EXISTS IX_Rpt_db_connection_grp_id ON Rpt_db_connection (
	grp_id
);
COMMIT; "
                );
                var main_path = new DirectoryInfo(Path.Combine(env.ContentRootPath, "..", "reportdefine_root", "default")).FullName;
                if (db.Query("Rpt_group").AsCount().First<int>() == 0)
                {
                    db.Query("Rpt_group").Insert(new
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
                    var id = db.Query("Rpt_group").Insert(new
                    {
                        Id = "example",
                        owner = "admin",
                        default_page = "default",
                        name = "例子",
                        report_path = main_path,
                    });
                    db.Query("Rpt_db_connection").Insert(new Rpt_db_connection()
                    {
                        grp_id = "example",
                        conn_str = $"Data Source={main_path}/test.db",
                        db_type = "Microsoft.Data.Sqlite",
                        name = "testsqlite"
                    });
                }
            }
            if (!env.IsDevelopment())
            {
                var report_path = new DirectoryInfo(Path.Combine(env.ContentRootPath, "../example")).FullName;
                db.Query("Rpt_db_connection").Where("grp_Id", "example").Update(new { conn_str = $"Data Source={report_path}/test.db" });
            }
            if (db.Query("Rpt_config").AsCount().First<int>() == 0)
            {
                db.Query("Rpt_config").Insert(new Rpt_config()
                {
                    login_script = "",
                });
            }
            if (0 == db.Select(" SELECT * FROM pragma_table_info('Rpt_db_connection') where name='sql_prefix'").Count())
            {
                db.Statement("alter table Rpt_db_connection add column sql_prefix text");
            };

            var rpt_config = db.Query("Rpt_config").First<Rpt_config>();
            CellReport.util.KeyAndPassword.yan_zheng_zcm(rpt_config.zcm);

            FreshCache(db);
        }
        private static void FreshCache(QueryFactory db)
        {
            ConcurrentBag<Rpt_group> tmp_list = new();
            db.Query("Rpt_group").Get<Rpt_group>().ToList().ForEach(x => tmp_list.Add(x));
            var rpt_Db_Connections = db.Query("Rpt_db_connection").Get<Rpt_db_connection>().ToList();
            foreach (var one in tmp_list)
            {
                one.db_connection_list = rpt_Db_Connections.Where(x => x.grp_id == one.Id).ToList();
            }
            rpt_Groups = tmp_list;
        }
        private static ConcurrentBag<Rpt_group> rpt_Groups = new();
    }
    public class Rpt_group
    {
        [Key]
        [SqlKata.Key]
        public string Id { get; set; }
        public string name { get; set; }
        public string owner { get; set; }
        public string default_page { get; set; }
        public string allow { get; set; }
        public string report_path { get; set; }
        public string test_report_path { get; set; }
        [ForeignKey("grp_id")]
        [SqlKata.Ignore]
        public List<Rpt_db_connection> db_connection_list { get; set; }
        public string members { get; set; }
        public string zb_user { get; set; }
        public string zb_password { get; set; }

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
        [SqlKata.Key]
        [SqlKata.Ignore]
        public int Id { get; set; }
        public string name { get; set; }
        public string grp_id { get; set; }
        public string db_type { get; set; }
        public string conn_str { get; set; }
        public string test_conn_str { get; set; }
        public string sql_prefix { get; set; }
    }
    public class Rpt_config
    {
        [Key]
        [SqlKata.Key]
        public int Id { get; set; }
        public string login_script { get; set; }

        public string zcm { get; set; }
    }
}
