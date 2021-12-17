using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reportWeb.Model
{
    public class DbProviderCfg
    {
        /// <summary>
        /// 谁颁发的
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 颁发给谁
        /// </summary>
        public string DllName { get; set; }

        /// <summary>
        /// 令牌密码
        /// a secret that needs to be at least 16 characters long
        /// </summary>
        public string FactoryClass { get; set; }
        public string InstanceName { get;  set; }
    }
}
