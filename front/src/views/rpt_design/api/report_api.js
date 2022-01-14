import x2js from 'x2js' 
import loading from "@/util/loading"
const x2jsone=new x2js(); //实例
import {request} from 'axios'
import {load_css_js} from '../utils/util'
let baseUrl=""
//import { baseUrl } from '@/config/env'; 
export { baseUrl}
import {loadFile,deepClone,build_layout,get_signalR_connection,getObjType,sleep} from '../utils/util.js'
export function open_template(grpId,path) {
    return request({
        method: 'post',
        url: `${baseUrl}/design/open_template${grpId==0?"":":"+grpId}?path=${path}`,       
        withCredentials: true
  })
}
export function save_template(grpId,path,content) {
    let data=new FormData();
    
    data.append('path',path)
    data.append('content',content)

    return request({
        method: 'post',
        data,
        url: `${baseUrl}/design/Save_template${grpId==0?"":":"+grpId}`,       
        withCredentials: true
  })
}

export function open_one(reportName,zb_dict,zb_param) {
    let arr=reportName.split(":")
    let grpId,reportFilePath
    let data=new FormData();
    //let test_zb_data={"b": "{\"columns\":[\"机构名称\",\"报案件数\",\"发起探访件数\",\"完成探访件数\",\"结案件数\",\"结案金额\",\"机构号\"],\"index\":[0],\"data\":[[\"合计\",322,314,181,230,177166.11,\"合计\"]]}", "a": "{\"columns\":[\"机构名称\",\"报案件数\",\"发起探访件数\",\"完成探访件数\",\"结案件数\",\"结案金额\"],\"index\":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],\"data\":[[\"开封\",12,3,4,27,15384.72],[\"洛阳\",61,64,48,44,14720.14],[\"平顶山\",27,26,35,21,14921.66],[\"安阳\",7,9,12,9,11029.37],[\"鹤壁\",18,25,11,8,8120.17],[\"新乡\",6,3,2,4,15728.18],[\"焦作\",26,29,31,35,16406.01],[\"濮阳\",27,17,8,11,12072.37],[\"许昌\",30,67,4,16,6619.2],[\"漯河\",1,0,0,1,687.82],[\"三门峡\",21,20,10,11,9123.22],[\"商丘\",21,11,2,8,11850.16],[\"周口\",7,1,4,5,6379.94],[\"驻马店\",3,0,0,0,0.0],[\"南阳\",32,36,8,15,20990.96],[\"信阳\",23,3,2,15,13132.19]]}"}
    //let test_param={}
    if(zb_dict)
        data.append('zb_dict_str',JSON.stringify(zb_dict))
    if(zb_param)
        data.append('zb_param',JSON.stringify(zb_param))
    grpId=arr[0]
    reportFilePath=arr[1]
    return request({
        method: 'post',data,
        url: `${baseUrl}/design/open${grpId==0?"":":"+grpId}?reportName=${reportFilePath}`,       
        withCredentials: true
  })
}
export function test_expr(expr) {
    let data=new FormData();
    data.append('expr',expr)
    return request({
        method: 'post',data,
        url: `${baseUrl}/design/test_expr`,       
        withCredentials: true
  })
}

export function grid_range_level(report) {
    let data=new FormData();
    data.append('content',x2jsone.js2xml({report}))
    return request({
        method: 'post',
        data,
        url: `${baseUrl}/design/grid_range_level` ,       
        withCredentials: true
    })
}

export function save_one(report,zb_data) {
    let arr=report.reportName.split(":")
    let grpId=arr[0]
    let reportFilePath=arr[1]
    let data=new FormData();
    data.append('reportName',reportFilePath)
    data.append('content',x2jsone.js2xml({report}))
    if(zb_data && zb_data.zb_dict){
        data.append('zb_dict_str',JSON.stringify( zb_data.zb_dict))
    }
    if(zb_data && zb_data.zb_param){
        data.append('zb_param',JSON.stringify(  zb_data.zb_param))
    }
    return request({
        method: 'post',
        data,
        url: `${baseUrl}/design/save${grpId==0?"":":"+grpId}?reportName=${reportFilePath}` ,       
        withCredentials: true
    })
}

export async function preview_one(_this,createFormParam=false,query_data={},param_name=null) {
    
    _this.context.report.params.param?.forEach(ele=>{
        if(ele.tagValue && ele.tagValue.length==0)
        delete ele.tagValue
    })
    if(createFormParam==false){
        _this.context.report.dataSets?.dataSet.forEach(ele=>{
            _this.$set(_this.ds_log,ele._name,{color:'info',content:[]})
        })
    }
    let signalR_connection=get_signalR_connection(function(message) {
        //_this.$nextTick(function(){
        let ds_name=message.split("\n")[0].split("=>")[0].split(":")[0]
        if(_this.ds_log[ds_name]){
            if(message.indexOf("取数结束")>0){
            console.info(message)
            _this.ds_log[ds_name].color="success"  
            }
            else
            if(message.indexOf("开始")>0){
            _this.ds_log[ds_name].color="danger"  
            }
            _this.ds_log[ds_name].content.push(message)
        }else{
            if(message.includes("=>"))
            _this.ds_log[ds_name]={content:[message],color:"danger"  }
        }
        //})
        _this.exec_log=_this.exec_log+message+"\n"
        setTimeout(() => {
            if(_this.$refs.textarea)
                _this.$refs.textarea.scrollTop=_this.$refs.textarea.scrollHeight    
        },10);        
        //_this.$message.error(message);
    })
    let loop_cnt=0
    while(!signalR_connection.connectionStarted){
        await sleep(1000)
        loop_cnt++;
        _this.exec_log="等待连接服务器："+loop_cnt
        if(loop_cnt>3){
            _this.exec_log="连接服务器失败"
            return
        }
    }
    signalR_connection.invoke('GetConnectionId').then(function(connectionId){
        let data=new FormData();
        console.info(_this.context.report)
        data.append("_content", x2jsone.js2xml({report:_this.context.report}) )
        data.append("_connectionId", connectionId)
        data.append("reportName", _this.context.report.reportName)
        data.append("_createFormParam", createFormParam??false)
        if(param_name!=null)
            data.append("_param_name", param_name)
        Object.entries(query_data).forEach(kv=>{
            data.append(kv[0], kv[1])    
        })
        request({
        method: 'post',
        url: `${baseUrl}/design/preview${_this.grpId==0?"":":"+_this.grpId}`,
        data
        ,withCredentials: true,noloading:true
        }).then(response_data => {
            
            if(response_data.errcode==1){
                _this.$notify({title: '提示',message: response_data.message,type: 'error',duration:0});
                return
            }
            _this.$set(_this,'previewFormParam',response_data)            
            Object.assign(_this.result,response_data)
            console.info( _this.result)
            response_data.form.forEach(ele=>{
                let val=ele.value
                if(ele.data_type=='date')
                    val=new Date(ele.value).format("yyyy-MM-dd")
                _this.$set(_this.queryForm,ele.name,val)
                _this.$set(_this.queryForm_show,ele.name,false)
            })
            //Object.keys(_this.context.report_result).forEach(key=>{
            //    delete _this.context.report_result[key]
            //})
            //Object.keys(_this.result).forEach(key=>{
            //    _this.$set(_this.context.report_result,key,_this.result[key])
            //})
            
            if(param_name!=null){
                _this.context.report_result.dataSet=_this.result.dataSet
                _this.context.report_result.form=_this.result.form
            }
            else{
                Object.assign(_this.context.report_result,_this.result)
                _this.context.report.dataSets.dataSet.forEach(element => {
                    let define_ds= _this.context.report_result.dataSet[element._name]               
                    if(define_ds)
                    {
                        element._fields=JSON.stringify(define_ds[0][0])
                    }
                });
                _this.context.report.AllGrids.grid.forEach(element => {
                    let define_ds= _this.context.report_result.data[element._name]               
                    if(define_ds)
                    {
                        element._fields=JSON.stringify(define_ds.columns)
                    }
                });
            }
            if(response_data.errcode && response_data.errcode ==1){
                _this.$notify({title: '提示',message: response_data.message,duration: 0});
                return;
            }
            if(response_data.error ){
                _this.$notify({title: '提示',message: response_data.error,duration: 0});
                return;
            }
            _this.executed =true
            _this.showLog=false
            if(createFormParam)
                return
            if(_this.context.report_result.layout)
            {
                _this.layout=_this.context.report_result.layout
            }
            else
            {
                _this.layout=build_layout(
                    { HtmlText:Object.values(_this.result.data).filter(ele=>ele.type=="htmlText"),
                    grid:Object.values(_this.result.data).filter(ele=>ele.type=="common")
                    } )
            }
            _this.last_js_cript=load_css_js(_this.context.report_result.footer2,"report_back_css")
            eval("(function(){\n"+_this.last_js_cript+"\n})()")
            Object.entries(_this.context.clickedEle).forEach(kv=>{
                if(kv[1].self.content){
                    let old=kv[1].self.content//强制刷新设计页面有content的组件
                    if(old.endsWith(" "))
                        _this.$set(kv[1].self,"content",old.trim())
                    else
                    _this.$set(kv[1].self,"content",old+" ")                    
                }
            })
        }).catch(error=> { 
        _this.$notify({title: '提示',message: error.response_data,type: 'error',duration:0});
        })
    }).catch(error=> { 
        _this.$notify({title: '提示',message: error,type: 'error',duration:0});
    })
}
const loading_conf={type: 'loading',options: {fullscreen: true,lock: true,text: '正在载入...',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.8)'}}
export function run_one(_this,reportFilePath,query,query_data={},_param_name=null) {
    let data=new FormData();
    Object.entries(query_data).forEach(kv=>{
        data.append(kv[0], kv[1])    
    })
    loading.show(loading_conf)
    data.append("reportName", reportFilePath)
    if(_param_name!=null)
        data.append("_param_name_", _param_name)
    let url
    if(window.location.pathname.endsWith("run.html"))
        _this.in_exec_url.run_url=`${baseUrl}/report5/run${_this.grpId==0?"":":"+_this.grpId}?`+query
    else
        _this.in_exec_url.run_url=window.location.href
    request({
      method: 'post',
      url:_this.in_exec_url.run_url,
      data
      ,withCredentials: true
    }).then(response_data => {
        _this.init()
        _this.executed =true
        if(response_data.errcode && response_data.errcode ==1){
        _this.$notify({title: '提示',message: response_data.message,duration: 0});
        return;
        }
        
        
        response_data.form.forEach(ele=>{
            let val=ele.value
            if(ele.data_type=='date')
                val=new Date(ele.value).format("yyyy-MM-dd")
            _this.$set(_this.queryForm,ele.name,val)
            _this.$set(_this.queryForm_show,ele.name,false)
        })
        
        if(_param_name!=null){
            _this.result.dataSet=response_data.dataSet
            _this.result.form=response_data.form
            loading.hide(loading_conf)
            return
        }
        else
            Object.assign(_this.result,response_data)
        _this.last_js_cript=load_css_js(_this.result.footer2,"report_back_css")
        eval("(function(run_one1){\n console.info(loading_conf)\n"+_this.last_js_cript+"\n})(run_one)")
        if(_this.result.layout)
        {
            _this.layout=_this.result.layout
        }
        else
        {
            _this.layout=build_layout(
                { HtmlText:Object.values(_this.result.data).filter(ele=>ele.type=="htmlText"),
                grid:Object.values(_this.result.data).filter(ele=>["common",'large'].includes( ele.type))
                } )
        }
        _this.isShow=false
        setTimeout(() => {
            _this.isShow=true
            loading.hide(loading_conf)
            setTimeout(() => {
                _this.$nextTick(x=>{
                    let form_h=_this.$refs.form?_this.$refs.form.clientHeight:0
                    _this.$refs.report_pane.style.height=`calc(100% - ${form_h}px)`
                    document.title = _this.result.data[Object.keys(_this.result.data)[0]].title
                })
            });
        });
    }).catch(error=> {
        loading.hide(loading_conf) 
        _this.$notify({title: '提示',message: error,type: 'error',duration:0});
    })
    
}

export function rptList(grpId,loc_path) {
    return request({
        method: 'get',
        url: `${baseUrl}/design/list${grpId==0?"":":"+grpId}`+( loc_path==""?"":`?loc_path=${loc_path}` ),
        withCredentials: true,noloading:true
    })
}

export function rptGrpList() {
    return request({
        method: 'get',
        url: `${baseUrl}/design/listforallGroup` ,
        withCredentials: true,noloading:true
    })
}

export function exec_cmd(cmd,from,to) {
    let data=new FormData();
    data.append("cmd", cmd)
    data.append("from", from)
    data.append("to", to)
    
    return request({
        method: 'post',
        url: `${baseUrl}/design/exec_cmd` ,
        data,
        withCredentials: true
    })
}

export function grp_list() {
    return request({
        method: 'get',
        url: `${baseUrl}/api/Rpt_group` ,        
        withCredentials: true
    })
}
export function grp_save(data) {
    return request({
        method: 'put',
        url: `${baseUrl}/api/Rpt_group/${data.id}` ,    
        data,    
        withCredentials: true
    })
}
export function grp_delete(data) {
    return request({
        method: 'delete',
        url: `${baseUrl}/api/Rpt_group/${data.id}` ,    
        data,    
        withCredentials: true
    })
}
export function test_connection(data) {
    return request({
        method: 'post',
        url: `${baseUrl}/user/test_connection/` ,    
        data,    
        withCredentials: true
    })
}
export function test_login(login_script,test_user, test_password) {
    let data=new FormData();
    data.append("login_script", login_script)
    data.append("test_user", test_user)
    data.append("test_password", test_password)
    return request({
        method: 'post',
        url: `${baseUrl}/user/test_login/` ,    
        data,    
        withCredentials: true
    })
}
export function save_config(login_script) {
    let data=new FormData();
    data.append("login_script", login_script)
    return request({
        method: 'post',
        url: `${baseUrl}/user/save_config/` ,    
        data,    
        withCredentials: true
    })
}
