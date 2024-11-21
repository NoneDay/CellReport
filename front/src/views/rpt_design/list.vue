<template>
 <el-tabs v-model="grp_id" style="height: calc(100% - 12px);">
     
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
            <el-button type="primary" @click="list_cmd('新增报表')" style="margin-left: 10px;">新增报表</el-button> 
            <el-button type="primary" @click="list_cmd('目录')">新增目录</el-button> 
            <el-button type="primary" @click="list_cmd('定位')">快速定位</el-button> 
            <el-button type="primary" @click="list_cmd('修改模板')">修改模板</el-button> 
            <!--<el-button type="primary" @click="list_cmd('导入报表')">导入报表</el-button>  -->
            <el-upload style="float:right;margin-left: 10px;" class="upload-demo" action :auto-upload="false" :show-file-list="false
            " :on-change="load_report_file" accept=".cr"
                    >
                    <el-button size="small" type="primary">导入报表</el-button>
                    </el-upload>
        </div> 
          </el-col>
    </el-row>
    <div  v-if="(grp.loc_path.length>0 && grp.loc_path[0]=='大屏')" style="height: calc(100% - 12px);overflow: auto;"
        class="list_content">
        <div class="list_content__box">
         <div v-for="(item, index) in grp.tableData.children"
          :key="index"
          @mouseover="item._menu=true"
           @mouseout="item._menu=false"
          class="list_content__item"
        >
        <div class="list_content__info">
            <div class="list_content__menu" v-show="item._menu">
                <div class="list_content__btn"
                     @click="handleViews(item)" > 运行<i class="el-icon-view"></i>
                </div>
                <div class="list_content__btn"
                     @click="row_click(item)" >  开发<i class="el-icon-setting"></i>
                </div>                
            </div>

            <div   @click="row_click(item)" style="flex:1;height:100%;  width: 100%; overflow: auto;background-color:#012545;color:#fff">
            <img style="height:calc(100% - 4px);  width: 100%;" :src="'data:image/jpg;base64,'+ item.Img"/>
          </div>
        </div>
        <div class="list_content__main">
          
            <span> {{ item.FileName }}</span>
            <div style="float: right; padding: 3px 0">
             <template >
                <el-tooltip class="item" effect="dark" content="克隆" placement="top-start"><i  class="el-icon-copy-document"  @click="handleClick('克隆',item)"></i>
                </el-tooltip><el-tooltip class="item" effect="dark" content="复制" placement="top-start"><i  class="el-icon-copy-document"  @click="handleClick('复制',item)"></i>
                </el-tooltip><el-tooltip class="item" effect="dark" content="剪切" placement="top-start"><i class="el-icon-scissors"  @click="handleClick('剪切',item)"></i>
                </el-tooltip><el-tooltip class="item" effect="dark" content="重命名" placement="top-start"><i class="el-icon-edit"  @click="handleClick('rename',item)"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <i class="el-icon-delete" @click="handleClick('删除',item)"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="运行" placement="top-start">
                    <el-link :href="baseUrl+'/run'+(grp.Id=='default'?'':(':'+grp.Id))+'?reportName='+item.FullPathFileName" target="_blank">
                    <i class="el-icon-view" circle></i> </el-link>
                </el-tooltip>
            </template>
            
            </div>
          </div>
          </div>
        </div>
    </div>
    <el-table v-else  
        :data="grp.tableData.children"  
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
                <el-tooltip class="item" effect="dark" content="克隆" placement="top-start"><el-button type="primary" icon="el-icon-document-copy" circle @click.stop="handleClick('克隆',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="复制" placement="top-start"><el-button type="success" icon="el-icon-copy-document" circle @click.stop="handleClick('复制',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="剪切" placement="top-start"><el-button type="info" icon="el-icon-scissors" circle @click.stop="handleClick('剪切',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="重命名" placement="top-start"><el-button type="warning" icon="el-icon-edit" circle @click.stop="handleClick('rename',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="删除" placement="top-start"><el-button type="danger" icon="el-icon-delete" circle @click.stop="handleClick('删除',scope.row)"></el-button>
                </el-tooltip><el-tooltip class="item" effect="dark" content="运行" placement="top-start">
                    <el-link :href="baseUrl+'/run'+(grp.Id=='default'?'':(':'+grp.Id))+'?reportName='+scope.row.FullPathFileName" target="_blank">
                    <el-button type="danger" icon="el-icon-view" circle></el-button> </el-link>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column  prop="LastAccessTime" sortable label="LastAccessTime" :width="150"/>
        <el-table-column  prop="LastWriteTime" sortable label="LastWriteTime" :width="150"/>
        <el-table-column  prop="Length" sortable label="Length" :width="100"/>

    </el-table>
    <!--
    <el-pagination     .slice((currentPage - 1) * pageSize, currentPage*pageSize)
        :current-page.sync="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total.sync="grp.tableData.children.length">
    </el-pagination> -->
  </div>
  </el-tab-pane>
  <templateManger v-if="template_dialog_visible" @submit="template_handleSubmit"
        :visible.sync="template_dialog_visible" 
        :action_target.sync="template_xml"
        :parent_defaultsetting="parent_defaultsetting"
        > 
    </templateManger>
 </el-tabs>
</template>

<script>
import {rptList,rptGrpList,save_one,open_template,save_template,exec_cmd} from "./api/report_api"
import templateManger from "./templateManger.vue"
import { baseUrl } from '@/config/env'; 
import x2js from 'x2js' 
const x2jsone=new x2js(); //实例
export default {
    components: {templateManger},
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
            parent_defaultsetting:{},
            search_file_name:"",
            cur_pre_copy_file:"",
            currentPage:1,
            pageSize:20,
        }
    },
    watch:{

    },
    methods:{
        handleViews (item) {
            window.open(  baseUrl+'/run'+(this.grp_id=='default'?'':(':'+this.grp_id))+'?reportName='+item.FullPathFileName, '_blank');
        },
      
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
        load_report_file(file) { 
            if(!file.name.endsWith(".cr")){
                this.$alert("必须是cr后缀的文件");
                return
            }
            //声明一个文件读取器
            const fileReader = new FileReader();
            let _this=this
            fileReader.addEventListener("loadend", function(event){
                //读取的文件;
                const data = event.target.result;
                let _report=x2jsone.xml2js(data).report
                if(_this.cur_grp.tableData.children.find(x=>x.FileName==file.name)){
                        _this.$message.error(`已经存在这个文件名【${file.name}】`);
                        return
                    }
                _report.reportName=_this.grp_id+":"+_this.cur_grp.loc_path.join("/")+"/"+file.name
                save_one(_report).then((resp)=>{
                    _this.fresh_cur_path()
                    console.info(resp.data)
                })
            });
            fileReader.readAsText(file.raw);
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
                if(resp.errcode==undefined){
                    this.template_xml=x2jsone.xml2js(resp.content).template
                    this.parent_defaultsetting=resp.parent_defaultsetting
                }
                else
                    this.template_xml={}
                if(this.template_xml=="")
                    this.template_xml={}                    
                this.template_dialog_visible=true
                return
            }
            if(!["目录",'新增报表','定位'].includes( command)){
                return
            }
            let _this=this
            this.$prompt(`请输入[${command}]的名称`, '名称', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:['目录','新增报表'].includes(command)?  /^[a-zA-Z_0-9\u4e00-\u9fa5]*$/ : /.*/,
                inputValue:command=='定位'?'':"ds"
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
                }else if(command=="新增报表"){
                    if(value.endsWith(".cr")==false)
                        value=value+".cr"
                    if(_this.cur_grp.tableData.children.find(x=>x.FileName==value)){
                        _this.$message.error(`已经存在这个文件名[${value}]`);
                        return
                    }
                    let reportName=this.grp_id+":"+this.cur_grp.loc_path.join("/")+"/"+value
                    if(this.cur_grp.loc_path.length==1 && this.cur_grp.loc_path[0]=='大屏'){
                        save_one({reportName:reportName,
                                    dataSets:{dataSet:[]}
                                    ,params:{param:[]}
                                    ,AllGrids:{grid:[]}
                                    ,layout:"[]"
                                    ,template:{
                                        "BACKGROUND-COLOR": "#012545",
                                        "COLOR": "#FFFFFF",
                                        "FONT": "微软雅黑",
                                        "FONT-SIZE": "11",
                                        "border_box": "div",
                                        "layout_mode": "",
                                        "show_form": "true",
                                        "layout_row_height": "2",
                                        "layout_colNum": "240",
                                        "layout_margin": "2",
                                        "layout_pan_height": "100%",
                                        "row_col_gutter": "10",
                                        "backgroundImage": "",
                                        "big_screen": "1",
                                        "screen_width": "1920",
                                        "screen_height": "1080"
                                    }
                            }).catch(err=>this.$alert(err));
                    }
                    else{
                        save_one({reportName:reportName,
                                    dataSets:{dataSet:[]}
                                    ,params:{param:[]}
                                    ,AllGrids:{grid:[{_name:"main",_title:"main" ,
                                    rows:{row:Enumerable.range(1,10).select(x=> {return {_name:x,_height:25,_fixed:"True"}}).toArray()},
                                    columns:{column:Enumerable.range(0,10).select(x=> {return {_name:'abcdefghijklmn'[x],_width:75,_fixed:"False"}}).toArray()}
                                }]}
                            }).catch(err=>this.$alert(err));
                    }
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
            //if(column["property"]==undefined && row['isFile']==true)
            //    return
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
    height: calc(100% - 120px);    padding: 10px;
}
.el-dialog__header{
    padding: 10px 10px 5px; cursor: move;
    border-bottom: solid 1px silver;
}
/* .design-list .el-button{
  padding:7px !important;
} */
.list_content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap
}

.list_content__header {
    padding-left: 40px;
    width: 100%;
    height: 150px !important
}

.list_content__box {
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap
}
.list_content__info {
    position: relative;
    height: calc(100% - 36px)
}
.list_content__item {
    position: relative;
    margin: 16px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 266px;
    height: 184px;
    border: 1px solid #3a4659;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden
}

.list_content__item:hover {
    -webkit-box-shadow: 0 0 20px 0 #000;
    box-shadow: 0 0 20px 0 #000;
    border: 1px solid #00baff
}
.list_content__main {
    font-size: 12px;
    width: 100%;
    height: 36px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    background: #1d262e;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    color: #bcc9d4
}
.list_content__menu {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(29, 38, 46, .8);
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column
}

.list_content__btn {
    margin: 5px 0;
    display: inline-block;
    vertical-align: middle;
    height: 34px;
    line-height: 34px;
    padding: 0 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    text-align: center;
    font-size: 14px;
    background-image: linear-gradient(-225deg, #00d3f1, #12b3ff);
    background-color: #2681ff;
    border-color: #2681ff;
    color: #fff;
    border: none;
    -webkit-transition: .3s ease;
    transition: .3s ease;
    cursor: pointer
}
</style>
