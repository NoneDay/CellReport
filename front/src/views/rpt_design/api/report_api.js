import x2js from 'x2js' 
const x2jsone=new x2js(); //实例
import loading from "@/util/loading"
import axios, {request} from 'axios'
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
export function get_pdf(report_obj,paperSetting) {
    let data=new FormData();
    data.append('report_obj',JSON.stringify(report_obj))
    data.append('paperSetting',JSON.stringify(paperSetting))
    let run_url
    if(window.location.pathname.endsWith("run.html"))
        run_url=`${baseUrl}/report5/pdf`
    else
        run_url=`pdf`
    return request({
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          responseType: 'blob',  //设置响应的数据类型为一个包含二进制数据的 Blob 对象，必须设置！！！
        method: 'post',
        data,
        url: run_url,       
        withCredentials: true,
  })
}


export function open_one(reportName,zb_dict,zb_param) {
    let arr=reportName.split(":")
    let grpId,reportFilePath
    let data=new FormData();
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
export function test_expr(expr,line,column) {
    let data=new FormData();
    data.append('expr',expr)
    data.append('line',line)
    data.append('column',column)
    return request({
        method: 'post',data,
        url: `${baseUrl}/design/test_expr`,       
        withCredentials: true,
        noloading:true
  })
}

export function grid_range_level(report) {
    let data=new FormData();
    data.append('content',x2jsone.js2xml({report}))
    data.append('reportName',report.reportName)
    return request({
        method: 'post',
        data,
        url: `${baseUrl}/design/grid_range_level` ,       
        withCredentials: true,
        noloading:true
    })
}

export function save_one(report,zb_data,imgFile) {
    let arr=report.reportName.split(":")
    let grpId=arr[0]
    let reportFilePath=arr[1]
    report.dataSets.dataSet.forEach(x=>
        {if(x.__text)
            x.__text=x.__text.replaceAll("\r","")
        })
    let data=new FormData();
    data.append('reportName',reportFilePath)
    data.append('content',x2jsone.js2xml({report}))
    if(imgFile)
        data.append('imgFile', imgFile)
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

export async function getAllWidget(action) {
    let data=new FormData();
    data.append('action',action)
    return request({
        method: 'post',
        data,
        url: `${baseUrl}/design/getAllWidget` ,       
        withCredentials: true
    })
}
export async function saveWidget(txt) {
    let data=new FormData();
    data.append('txt',txt)
    return request({
        method: 'post',
        data,
        url: `${baseUrl}/design/saveWidget` ,       
        withCredentials: true
    })
}

export async function preview_one(_this,createFormParam=false,param_name=null) {
    
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
        data.append("_connectionId", connectionId)
        data.append("_content", x2jsone.js2xml({report:_this.context.report}) )
        data.append("reportName", _this.context.report.reportName)
        data.append("_createFormParam", createFormParam??false)
        if(param_name!=null)
            data.append("_param_name_", param_name)
        Object.entries(_this.queryForm).forEach(kv=>{
            data.append(kv[0], kv[1]??'')    
        })
        let _fresh_ds=_this.queryForm._fresh_ds
        request({
        method: 'post',
        url: `${baseUrl}/design/preview${_this.grpId==0?"":":"+_this.grpId}`,
        data
        ,withCredentials: true,noloading:true
        }).then(response_data => {
            delete _this.queryForm._fresh_ds
            delete _this.queryForm._cur_page_num_
            delete _this.queryForm._page_size_
            if(response_data.errcode==1){
                _this.$notify({title: '提示',message: response_data.message,type: 'error',duration:0});
                return
            }
            _this.$set(_this,'previewFormParam',response_data)            
            Object.assign(_this.result,response_data)
            console.info( _this.result)
            _this.result.fresh_dataset=Enumerable.from( Object.keys(response_data.dataSet??{})).select(x=>"数据集:"+x).toArray().join(",")
            _this.result.fresh_report=Enumerable.from( Object.keys(response_data.data??{})).select(x=>"表格:"+x).toArray().join(",")
    
            response_data.form.forEach(ele=>{
                let val=ele.value
                if(ele.data_type=='date' && val!="")
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
                if(_fresh_ds){
                    Object.assign(_this.context.report_result.dataSet,response_data.dataSet)
                    Object.assign(_this.context.report_result.data,response_data.data)
                }
                else
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
            if(createFormParam || _fresh_ds)
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
export function run_download(_this,file_name="",needType="excel") {
    let loading_conf={type: 'loading',options: {fullscreen: true,lock: true,text: '正在生成文件，请稍候...',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.8)'}}
    let data=new FormData();
    Object.entries({..._this.queryForm,reportName:_this.reportName}).forEach(kv=>{
        data.append(kv[0], kv[1]??'')    
    })
    if(window.location.pathname.endsWith("run.html"))
        _this.in_exec_url.run_url=`${baseUrl}/report5/run${_this.grpId==0?"":":"+_this.grpId}?`+_this.queryPara
    else
        _this.in_exec_url.run_url=window.location.href
    loading.show(loading_conf)
    request({
        method: 'post',
        url:_this.in_exec_url.run_url,
        data,headers:{needType},
        withCredentials: true
      }).then(response => {
        console.info(response)
        const url = _this.in_exec_url.run_url.split("?")[0]+"/"+response.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file_name??"filename.xlsx");
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        loading.hide(loading_conf)
    })
    .catch(error => {
        _this.$notify({title: '文件下载失败：',message: error,duration: 0});
        loading.hide(loading_conf)
    });        
}
const conf_loading_conf={type: 'loading',options: {fullscreen: true,lock: true,text: '正在载入...',spinner: 'el-icon-loading',background: 'rgba(0, 0, 0, 0.8)'}}
export function run_one(_this,reportFilePath,_param_name_=null,loading_conf=null,needType="json") {
    if(loading_conf==null)
        loading_conf=conf_loading_conf
    let data=new FormData();
    Object.entries(_this.queryForm).forEach(kv=>{
        data.append(kv[0], kv[1]??'')    
    })
    let _fresh_ds=_this.queryForm._fresh_ds
    
    data.append("reportName", reportFilePath)
    data.append("_createFormParam", window.cellreport.exec_num==0)
    window.cellreport.exec_num++
    if(_param_name_!=null)
        data.append("_param_name_", _param_name_)
    let url
    if(window.location.pathname.endsWith("run.html"))
        _this.in_exec_url.run_url=`${baseUrl}/report5/run${_this.grpId==0?"":":"+_this.grpId}?`+_this.queryPara
    else
        _this.in_exec_url.run_url=window.location.href
    loading.show(loading_conf)
    request({
      method: 'post',
      url:_this.in_exec_url.run_url,
      data,
      withCredentials: true
    }).then(response_data => {
        if(_this.reportName!=reportFilePath){
            for(let k in _this.queryForm)
                delete _this.queryForm[k]
            for(let k in _this.clickedEle)
                delete _this.clickedEle[k]
            _this.allElementSet.clear()
        }
        delete _this.queryForm._fresh_ds
        delete _this.queryForm._cur_page_num_
        delete _this.queryForm._page_size_
        _this.executed =true
        if(response_data.errcode && response_data.errcode ==1){
            _this.$notify({title: '提示',message: response_data.message,duration: 0});
            loading.hide(loading_conf)
            return;
        }
        if(response_data.zb_var) //兼容老写法
            response_data._zb_var_=response_data.zb_var
        if(response_data._zb_var_?.watermark){
            $(".mask_div").remove()
            _this.watermark(response_data._zb_var_.watermark);
        }
        
        response_data.form.forEach(ele=>{
            let val=ele.value
            if(ele.data_type=='date' && val!="")
                val=new Date(ele.value).format("yyyy-MM-dd")
            _this.$set(_this.queryForm,ele.name,val)
            _this.$set(_this.queryForm_show,ele.name,false)
        })
        _this.result.fresh_dataset=Enumerable.from( Object.keys(response_data.dataSet??{})).select(x=>"数据集:"+x).toArray().join(",")
        _this.result.fresh_report=Enumerable.from( Object.keys(response_data.data??{})).select(x=>"表格:"+x).toArray().join(",")
        if(_param_name_!=null){
            _this.result.dataSet=response_data.dataSet
            _this.result.form=response_data.form
            loading.hide(loading_conf)
            return
        }
        else if(_fresh_ds){
            Object.assign(_this.result.dataSet,response_data.dataSet)
            Object.assign(_this.result.data,response_data.data)
        }
        else{
            Object.assign(_this.result,response_data)
        }
        
        _this.last_js_cript=load_css_js(_this.result.footer2,"report_back_css")
        let tool=require('../utils/util.js')
        eval("(function(){\n"+_this.last_js_cript+"\n})()")
        _this.setTimeout_function=eval("(function(){\n return "+_this.setTimeout_function.toString()+"\n})()")
        if(_fresh_ds){
            loading.hide(loading_conf)
            return  
        }
            
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
        
        //手机端列表头转按钮
        if( window.convert_col_to_button && _this.layout.length==1 && Object.keys(_this.result.data).length==1)
        { 
            let grid_result
            if( _this.layout[0].element.children && _this.layout[0].element.children.column.length==1 
                && _this.layout[0].element.children.column[0].type=="luckySheetProxy"
                && _this.result.data[_this.layout[0].element.children.column[0].gridName].optimize)
            {
                grid_result=_this.result.data[_this.layout[0].element.children.column[0].gridName]
            }
            else if(_this.layout[0].element.type=="luckySheetProxy" && _this.result.data[_this.layout[0].element.gridName].optimize){
                grid_result=_this.result.data[_this.layout[0].element.gridName]
            }

            if(grid_result){
                let all_t_arr=[]
                for(let line_idx=grid_result.colName_lines[0];line_idx<grid_result.colName_lines[1];line_idx++){
                    let start_str,start_col=Number.parseInt(grid_result.fix_cols)
                    let t_arr=[]
                    all_t_arr.push(t_arr)
                    for(let col_idx=Number.parseInt(grid_result.fix_cols);col_idx<grid_result.tableData[line_idx].length;col_idx++)
                    {
                        if(start_str ==undefined)
                            start_str=grid_result.tableData[line_idx][col_idx]
                        else if(start_str!=grid_result.tableData[line_idx][col_idx]){
                            t_arr.push({'txt':start_str,col_span:[start_col,col_idx-1],arr:[]})
                            start_str=grid_result.tableData[line_idx][col_idx]
                            start_col=col_idx
                        }
                    }
                }
                let col_vaild=(all_t_arr.length>0)
                for(let idx=all_t_arr.length-1;idx>0;idx--) {
                    if(idx==0)
                    break
                    let parent_idx=0
                    for(let i=0;i<all_t_arr[idx].length;i++)
                    {
                        let parent_col_span=all_t_arr[idx-1][parent_idx].col_span
                        let cur_span=all_t_arr[idx][i].col_span
                        if(cur_span[0]>=parent_col_span[0] && cur_span[1]<=parent_col_span[1])
                        {
                            all_t_arr[idx-1][parent_idx].arr.push(all_t_arr[idx][i])
                            continue
                        }
                        if(cur_span[0]<parent_col_span[0]){
                            col_vaild=false
                            break
                        }
                        i--
                        parent_idx++
                    }
                    if(col_vaild==false)
                        break
                }
                if(col_vaild ){
                    _this.mobile_col_arr=all_t_arr[0]
                    _this.mobile_col_button_arr=[ {selected:0,arr:_this.mobile_col_arr}]  
                    for(let idx=0;;idx++){
                        if(_this.mobile_col_button_arr[idx].arr[0].arr.length>0)
                            _this.click_col_button(idx,0)
                        else
                            break
                    }
                    grid_result.mobile_col_button_arr=_this.mobile_col_button_arr
                }
            }
        }

        _this.isShow=false
        setTimeout(() => {
            _this.isShow=true
            _this.refresh_layout(null,_this)
            
            loading.hide(loading_conf)
            
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
        url: `${baseUrl}/Rpt_group/getList` ,        
        withCredentials: true
    })
}
export function grp_save(data) {
    return request({
        method: 'post',
        url: `${baseUrl}/Rpt_group/PutRpt_group` ,
        data,    
        withCredentials: true
    })
}
export function grp_delete(data) {
    return request({
        method: 'post',
        url: `${baseUrl}/Rpt_group/DeleteRpt_group?id=${data.id}` ,    
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

export function test_zcm(zcm) {
    let data=new FormData();
    data.append("zcm", zcm)
    return request({
        method: 'post',
        url: `${baseUrl}/user/test_zcm/` ,    
        data,    
        withCredentials: true
    })
}

export function getImgFileList(path) {
    let data=new FormData();
    data.append("path", path)
    return request({
        method: 'post',
        url: `${baseUrl}/design/getImgFileList/` ,    
        data,    
        withCredentials: true
    })
}

