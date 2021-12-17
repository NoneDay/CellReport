using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace reportWeb.Model
{
    public class JwtConfig
    {
        /// <summary>
        /// 谁颁发的
        /// </summary>
        public string Issuer { get; set; }

        /// <summary>
        /// 颁发给谁
        /// </summary>
        public string Audience { get; set; }

        /// <summary>
        /// 令牌密码
        /// a secret that needs to be at least 16 characters long
        /// </summary>
        public string SigningKey { get; set; }

        /// <summary>
        /// 过期时间(分钟)
        /// </summary>
        public int Expires { get; set; }

        /// <summary>
        /// 是否校验过期时间
        /// </summary>
        public bool ValidateLifetime { get; set; }
        public int REFRESH_TOKEN_EXPIRES { get; set; } = 10*60*24;
        public int ACCESS_TOKEN_EXPIRES { get; set; } = 10;
    }
}
