using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using reportWeb;
using SqlKata.Execution;
namespace reportWeb.Controllers
{
    
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    
    public class Rpt_groupController : Controller 
    {
        private readonly ReportDbContext reportDb;
        public Rpt_groupController(ReportDbContext reportDb)
        {
            
            this.reportDb = reportDb;
        }
        private String cur_userid { get { return HttpContext.User.Claims.FirstOrDefault(x => x.Type == "userid").Value; } }
        // GET: api/Rpt_group
        [HttpGet]
        public ActionResult<IEnumerable<Rpt_group>> getList()
        {
            var grp_register =reportDb.getList(cur_userid);
            var rpt_config = reportDb.Query("Rpt_config").FirstOrDefault();
            //var rpt_config = _context.Rpt_config.FirstOrDefault();
            //var grp_register = await _context.Rpt_group.Include(x => x.db_connection_list).ToListAsync();
            //if (cur_userid != "admin")
            //    grp_register = grp_register.FindAll(x => x.owner == cur_userid);

            var zc_dict=CellReport.util.KeyAndPassword.yan_zheng_zcm(rpt_config?.zcm);
            return new JsonResult ( new {
                grp_register,
                login_script= rpt_config?.login_script,
                machine_key = CellReport.util.KeyAndPassword.getMachine_key(),
                zc_dict = zc_dict,
                zcm= rpt_config?.zcm,
                version= CellReport.util.KeyAndPassword.getVersion(),
                link_type =DbProviderFactories.GetProviderInvariantNames()
        } );
        }

        // PUT: api/Rpt_group/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PutRpt_group([FromBody] Rpt_group rpt_group)
        {
            
            await reportDb.UpdateRpt_group(cur_userid,rpt_group);
            
            return new JsonResult(new { errcode = 0, message = "成功" });
        }

        // DELETE: api/Rpt_group/5
        [HttpPost]
        public async Task<IActionResult> DeleteRpt_group(string id)
        {
            await reportDb.DeleteRpt_group(id);
            return new JsonResult(new { errcode = 0, message = "成功" });
        }
    }
}
