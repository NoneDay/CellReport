<template>
 <el-tabs v-model="grp_id" style="height:100%">
     
    <el-tab-pane style="height:calc(100% - 42px)" v-for="grp in rptgrps" :key="grp.Id" :label="grp.name+'('+grp.Id+')'" :name="grp.Id">
  <div style="height:100%"> 
      <el-row> 
      <el-col :span="24">当前目录：
                    
            <el-breadcrumb separator="/" style="display: inline-block;">
                <el-breadcrumb-item > <span @click="path_click(0,0)"> root </span></el-breadcrumb-item>
                    <el-breadcrumb-item v-for="(one,idx) in grp.loc_path" :key="idx" 
                    ><span @click="path_click(one,idx+1)"> {{ one}} </span></el-breadcrumb-item>
            </el-breadcrumb>   
            <el-button type="primary" v-if="cur_pre_copy_file!=''"  @click="copy_file">粘贴【{{cur_pre_copy_file}}】到当前目录</el-button>
        <div style="float:right">
            <el-button type="primary" @click="list_cmd('统计报表')" style="margin-left: 10px;">新增报表</el-button> 
            <el-button type="primary" @click="list_cmd('目录')">新增目录</el-button> 
            <el-button type="primary" @click="list_cmd('定位')">快速定位</el-button> 
            <el-button type="primary" @click="list_cmd('修改模板')">修改模板</el-button> 
        </div> 
          </el-col>
    </el-row>
    <el-table  :data="grp.tableData.children"
        style="width: 100%;margin-bottom: 20px;"
        row-key="FullPathFileName" :height="'90%'"
        border @cell-click="row_click"
        :default-expand-all='False'>
        <el-table-column sortable
        prop="FileName"
        label="FileName">
         <template slot-scope="scope">
            <img :src="scope.row.LastAccessTime?'img/xsl.png':'img/folder.png'"/>
            <span style="margin-left: 10px">{{ scope.row.FileName }}</span>
        </template>
        </el-table-column>
        <el-table-column  label="操作" :width="250">
            <template slot-scope="scope" v-if="scope.row.LastAccessTime">
                <el-tooltip class="item" effect="dark" content="克隆" placement="top-start"><el-button type="primary" icon="el-icon-edit" circle @click="handleClick('克隆',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="复制" placement="top-start"><el-button type="success" icon="el-icon-document-copy" circle @click="handleClick('复制',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="剪切" placement="top-start"><el-button type="info" icon="el-icon-message" circle @click="handleClick('剪切',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="重命名" placement="top-start"><el-button type="warning" icon="el-icon-star-off" circle @click="handleClick('rename',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="删除" placement="top-start"><el-button type="danger" icon="el-icon-delete" circle @click="handleClick('删除',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="运行" placement="top-start"><el-link :href="baseUrl+'/run'+(grp.Id=='default'?'':(':'+grp.Id))+'?reportName='+scope.row.FullPathFileName" target="_blank"><i class="el-icon-view el-icon--right"></i></el-link>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column  prop="LastAccessTime" sortable label="LastAccessTime" :width="150"/>
        <el-table-column  prop="LastWriteTime" sortable label="LastWriteTime" :width="150"/>
        <el-table-column  prop="Length" sortable label="Length" :width="100"/>

        </el-table>
  </div>
  </el-tab-pane>
  <templateManger v-if="template_dialog_visible" @submit="template_handleSubmit"
        :visible.sync="template_dialog_visible" :action_target.sync="template_xml"
        > 
    </templateManger>
 </el-tabs>
</template>

<script>
import {rptList,rptGrpList,save_one,open_template,save_template,exec_cmd} from "./api/report_api"
import  codemirror  from './element/vue-codemirror.vue'
import templateManger from "./templateManger.vue"
import { baseUrl } from '@/config/env'; 
import x2js from 'x2js' 
const x2jsone=new x2js(); //实例
export default {
    components: {codemirror,templateManger},
    async mounted(){
        let _this=this
        let result=await rptGrpList()
        _this.$set( _this,'rptgrps',result);
        if(_this.rptgrps.length==0){
            this.$message.error('没有你能管理的报表');
            return
        }
        _this.rptgrps.forEach(grp => {
            grp.Id=""+grp.Id
            _this.$set( grp,"loc_path",[])
            _this.$set(grp,"tableData",{children:[]})
        });
        _this.rptgrps.forEach(async grp => {
            grp.tableData=await rptList(grp.Id,grp.loc_path.join("/"))
        });
        setTimeout(() => {
         _this.$set( _this,'grp_id',_this.rptgrps[0].Id)   
        });
    },
    computed: {
        location_origin(){
            return location.origin
        },
        cur_grp(){
            return this.rptgrps.find(x=>x.Id==this.grp_id)
        }
    },
    data() {
        return {
            rptgrps:[], 
            grp_id:-1, 
            template_dialog_visible:false,
            template_xml:{},
            search_file_name:"",
            cur_pre_copy_file:""
        }
    },
    watch:{

    },
    methods:{
        async handleClick(command,row){
            let _this=this
            if(command=="复制"){
                this.cur_pre_copy_file="copy:"+this.grp_id+":"+row.FullPathFileName                
            }
            else if(command=="剪切"){
                this.cur_pre_copy_file="cut:"+this.grp_id+":"+row.FullPathFileName
                
            }else if(command=="克隆"){
                await exec_cmd("copy",
                            this.grp_id+":" + row.FullPathFileName,this.grp_id+":" + row.FullPathFileName
                        )
                this.fresh_cur_path()
            }
            else if(command=="删除"){
                this.$confirm(`此操作将永久删除文件【${row.FullPathFileName}】, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        await exec_cmd("delete",
                            this.grp_id+":" + row.FullPathFileName
                        )
                        this.fresh_cur_path()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });  
            }
            else if(command=="rename"){
                this.$prompt('请输入新名字', '修改名称', {confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  inputPattern:/^[\u4e00-\u9fa5a-zA-Z_0-9_]*\.cr$/,
                  inputValue:row.FileName
                }
              ).then(async ({ value }) => {  
                    if(value.endsWith(".cr")==false)
                        value=value+".cr"
                    if(_this.cur_grp.tableData.children.find(x=>x.FileName==value)){
                        _this.$message.error(`已经存在这个文件名[${value}]`);
                        return
                    }
                    let ret=await exec_cmd("rename",
                        this.grp_id+":" + this.cur_grp.loc_path.join("/")+"/"+row.FileName ,
                        this.grp_id+":"+this.cur_grp.loc_path.join("/") +"/"+value
                    )
                    if(ret.errcode==0)
                        this.fresh_cur_path()
                    else
                         _this.$message.error(ret.message);
                  }).catch(error=>
                  console.info(error)
                  ) 
            }
        },
        async open_template_dialog(){
            let _this=this
            let resp=await open_template(this.grp_id,this.cur_grp.loc_path.join("/"))
            if(resp.errcode==undefined)
                this.template_xml=x2jsone.xml2js(resp.content).template
            else
                this.template_xml={}

            this.template_dialog_visible=true
        },
        async template_handleSubmit(){
            let _this=this
            let resp=await save_template(this.grp_id,this.cur_grp.loc_path.join("/"),x2jsone.js2xml({template: this.template_xml}))
            if(resp.errcode==1){
                this.$message.error(resp.message)
                return
            }
            this.template_dialog_visible=false
        },
        has_name(name){
            return 
        },
        async copy_file(){
            let file_name=this.cur_pre_copy_file.split(":").slice(-1)[0].split("/").slice(-1)
                let ret=await exec_cmd(this.cur_pre_copy_file.split(":")[0],
                    this.cur_pre_copy_file.split(":").slice(1).join(":"),
                    this.grp_id+":" + this.cur_grp.loc_path.join("/")+"/"+ file_name
                )
            this.cur_pre_copy_file=""
            this.fresh_cur_path()
        },
        async list_cmd(command, node,data){
            if(command=="粘贴"){
                let file_name=this.cur_pre_copy_file.split(":").slice(-1)[0].split("/").slice(-1)
                 let ret=await exec_cmd(this.cur_pre_copy_file.split(":")[0],
                        this.cur_pre_copy_file.split(":").slice(1).join(":"),
                        this.grp_id+":" + this.cur_grp.loc_path.join("/")+"/"+ file_name
                    )
                this.fresh_cur_path()
                return
            }
            if(command=="修改模板"){
                let _this=this
                let resp=await open_template(this.grp_id,this.cur_grp.loc_path.join("/"))
                if(resp.errcode==undefined)
                    this.template_xml=x2jsone.xml2js(resp.content).template
                else
                    this.template_xml={}
                if(this.template_xml=="")
                    this.template_xml={}                    
                this.template_dialog_visible=true
                return
            }
            if(!["目录",'统计报表','定位'].includes( command)){
                return
            }
            let _this=this
            this.$prompt(`请输入[${command}]的名称`, '名称', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:['目录','统计报表'].includes(command)?  /^[a-zA-Z_0-9\u4e00-\u9fa5]*$/ : /.*/,
                inputValue:"ds"
            })
            .then( async ({ value }) => {
                if(command=="目录"){
                    if(_this.cur_grp.tableData.children.find(x=>x.FileName==value)){
                        _this.$message.error(`已经存在这个名称[${value}]`);
                        return
                    }
                    let ret=await exec_cmd("mkdir",this.grp_id+":"+this.cur_grp.loc_path.join("/")+"/"+value)
                    _this.fresh_cur_path()
                    return
                }else if(command=="统计报表"){
                    if(value.endsWith(".cr")==false)
                        value=value+".cr"
                    if(_this.cur_grp.tableData.children.find(x=>x.FileName==value)){
                        _this.$message.error(`已经存在这个文件名[${value}]`);
                        return
                    }
                    let reportName=this.grp_id+":"+this.cur_grp.loc_path.join("/")+"/"+value
                    save_one({reportName:reportName,
                                    dataSets:{dataSet:[]}
                                    ,params:{param:[]}
                                    ,AllGrids:{grid:[{_name:"main",_title:"main" }]}
                            })
                    //this.cur_grp.loc_path.push(row.FileName)
                    rptList(this.grp_id,this.cur_grp.loc_path.join("/")).then(response_data => {
                        _this.$set(_this.cur_grp,"tableData",response_data)
                    }).catch(error=>error)

                    this.$router.push({
                        name: '报表设计',
                        path: "/rpt-design/index",
                        query: {label:reportName}
                    });
                }else if(command=="定位"){
                    value=value.trim()
                    if(value=="")
                        return
                    if(value.endsWith(".cr")){
                        this.$router.push({
                                name: '报表设计',
                                path: "/rpt-design/index",
                                query: {label:this.grp_id+":"+value}
                            });
                    }else{
                        let _this=this                        
                        rptList(this.grp_id,value).then(response_data => {
                            _this.$set(_this.cur_grp,"tableData",response_data)
                            _this.cur_grp.loc_path=value.split("/")
                        }).catch(error=>error)
                    }
                }
                
            }).catch(error=>error)   
        },
        path_click(one,idx){
            let _this=this
            this.cur_grp.loc_path.splice(idx)
            rptList(this.grp_id,this.cur_grp.loc_path.join("/")).then(response_data => {
                _this.$set(_this.cur_grp,"tableData",response_data)
            }).catch(error=>error)
        },
        fresh_cur_path(){
            let _this=this
            rptList(this.grp_id,this.cur_grp.loc_path.join("/")).then(response_data => {
                    _this.$set(_this.cur_grp,"tableData",response_data)
                }).catch(error=>error)
        },
        row_click(row, column,evt){
            if(column["property"]==undefined && row['isFile']==true)
                return
            if (row.LastAccessTime){
                let filename=this.cur_grp.loc_path.join("/")+"/"+row.FileName
                this.$router.push({
                    name: '报表设计',
                    path: "/rpt-design/index",
                    query: {label:this.grp_id+":"+filename}
                });
            }else
            {
                let _this=this
                this.cur_grp.loc_path.push(row.FileName)
                rptList(this.grp_id,this.cur_grp.loc_path.join("/")).then(response_data => {
                    _this.$set(_this.cur_grp,"tableData",response_data)
                }).catch(error=>error)
            }
        }
    }
}
</script>

<style >
.el-tabs__content{
    height: calc(100% - 42px);
}
.el-dialog__body{
    height: calc(100% - 180px);    padding: 10px;    
}
.el-dialog__header{
    padding: 10px;
}
</style>