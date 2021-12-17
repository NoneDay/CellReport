// 配置编译环境和线上环境之间的切换

let baseUrl = '';
let iconfontVersion = ['567566_pwc3oottzol'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env
if (env.NODE_ENV == 'development') {
    baseUrl = `/report5`; // 开发环境地址 report5 aps
} else if (env.NODE_ENV == 'production') {
    if(location.pathname.split("/").length>2)
        baseUrl = "/"+location.pathname.split("/")[1]; //生产环境地址 /ab
    else
        baseUrl=""
} else if (env.NODE_ENV == 'test') {
    baseUrl = `/aps`; //测试环境地址
}
export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env
}