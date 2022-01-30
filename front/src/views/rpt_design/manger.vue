<template>
<el-tabs v-model="tab_value" value="first" v-if="ready">
    <el-tab-pane label="报表组管理" name="first">
        <avue-crud :data="data.grp_register" :option="option_grp()" v-model="grp_obj"
            @row-save="grp_rowSave"  @row-update="grp_rowUpdate" @row-del="grp_rowDelete"
        >
        <template slot="db_connection_listForm" slot-scope="scope">
            <avue-crud :option="db_connection_listOption()" :data="grp_obj.db_connection_list"  v-model="conn_obj"
                @row-save="conn_rowSave"  @row-update="conn_rowUpdate" @row-del="conn_rowDelete"
            >
            <template slot-scope="conn_scope" slot="menuForm">
                <el-button type="primary" icon="el-icon-check" size="small" plain @click.stop="test_link(conn_obj)">测试连接</el-button>
            </template>
            <template slot-scope="conn_scope" slot="menu">
                <el-button type="primary" icon="el-icon-check" size="small" plain @click.stop="test_link(conn_scope.row)">测试连接</el-button>
            </template>
            </avue-crud>
        </template>
        <template slot-scope="scope" slot="menu"  v-if="userInfo.username=='admin'">
            <el-button type="primary" icon="el-icon-check" size="small" plain @click.stop="handleClone(scope.row,scope.index)">克隆</el-button>
        </template>
        </avue-crud>
    </el-tab-pane>
    <el-tab-pane label="登陆验证管理" name="second" v-if="userInfo.username=='admin'" >
        <span class="demonstration">
        传入用户名userid和口令password，返回为json，必须有errcode，userid，username。errcode为零，表示验证成功。<br>
        {'errcode':json.errcode,'message':json.errmsg, 'userid':json.userid,'username':json.username,'old_result':result};<br>以下是脚本：
        </span>
        <codemirror  ref="editor"  v-if='tab_value=="second"'
                        v-model="data.login_script" 
                        style="height:100%" @ready="editor_ready"
                        :options="{tabSize: 4, mode: 'text/javascript', lineNumbers: true,line: true,}"  
            />        
        测试用户<el-input v-model="test_user" placeholder="请输入内容"></el-input>
        测试口令<el-input v-model="test_password" placeholder="请输入内容"></el-input>
        <el-button type="danger" @click="test_login">登陆测试</el-button>
        <el-button type="danger" @click="save_config">保存</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {grp_list,grp_save,grp_delete,test_connection,test_login,save_config} from "./api/report_api"
import  codemirror  from './element/vue-codemirror.vue'
import { mapGetters } from "vuex";
export default {
    components: {codemirror},
    
    async created(){

        let _this=this
        _this.data=await grp_list()
        this.db_type_dict=[]
        _this.data.link_type.forEach(x=>this.db_type_dict.push({'label':x,'value':x}))
        _this.login_tbl=[]
        
        _this.ready=true
    },
    computed:{
        ...mapGetters(["userInfo",]),
    },
    methods:{
        
        async save_config(){
            let ret=await save_config(this.data.login_script)
            this.$alert(ret.message)
        },
        async test_login(){
            let ret=await test_login(this.data.login_script,this.test_user,this.test_password)
            this.$alert(ret.result)
        },
        editor_ready(){
            this.$refs.editor.codemirror.setSize('auto','350px')
        },
        async test_link(link_obj){
            let ret=await test_connection(link_obj)
            if(ret.errcode==0)
                this.$alert(ret.message)
        },
        handleClone(row,index){
            let _this=this
            this.$prompt('请输入新的系统名字', '新增系统', {
                    confirmButtonText: '确定',
                    inputPattern:/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]*$/,
                    cancelButtonText: '取消',
                    inputValue:""
                  }).then(async({ value }) => {
                    if (_this.data.grp_register.find(x=>x.id==value)){
                        this.$alert("名字不能重复");
                        return
                    }
                    let saveObj={...JSON.parse( JSON.stringify(row)),...{id:value}}
                    let result=await this.grp_rowSave(saveObj)
                    
                }).catch(error=>error)
        }, 
        conn_rowSave(form,done,loading){
            this.grp_obj.db_connection_list.push(Object.assign({},form))
            if(done)
                done(); 
        },
        conn_rowUpdate(form,index,done,loading){
            Object.assign(this.grp_obj.db_connection_list[index],form)
            if(done)
                done(); 
        },
        conn_rowDelete(form,index){    
            this.grp_obj.db_connection_list.splice(index,1)
        },
        async grp_rowSave(form,done,loading){
            let _this=this
            let result=await grp_save(form)
            if(result['errcode']==0 ){
                _this.data.grp_register.push(Object.assign({},form))
            }
            if(done)
                done(); 
        },
        async grp_rowUpdate(form,index,done,loading){
            let _this=this
            let result=await grp_save(form)
            if(result['errcode']==0 )
                Object.assign(this.data.grp_register[index],form)
            if(done)
                done(); 
        },
         grp_rowDelete(form,index){            
            let _this=this            
            this.$confirm(`此操作将永久删除该配置<${form.name}>, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async() => {
                let result=await grp_delete(form)
                _this.data.grp_register.splice(index,1)
                _this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                }).catch(err => {
                _this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
            
      },
        option_grp(){ return {
            "addBtn": this.userInfo.username=='admin',
            "editBtn": "true",
            
            "delBtn": this.userInfo.username=='admin',
            "saveBtn": "true",
            "column": [
                    {type: 'input',label: '标识', editDisabled:true,rules: [{required: true}],span: 12,formslot:true,display: true,prop: 'id'},
                    {type: 'input',label: '名称', rules: [{required: true}],span: 12,formslot:true,display: true,prop: 'name'},
                    {type: 'input',label: '管理员',editDisabled:this.userInfo.username!='admin', rules: [{required: true}],span: 12,formslot:true,display: true,prop: 'owner'},
                    {type: 'input',label: '缺省页',value:'default',editDisabled:this.userInfo.username!='admin', rules: [{required: true}],span: 12,formslot:true,display: true,prop: 'default_page'},
                    {type: 'input',label: '报表存放根路径',editDisabled:this.userInfo.username!='admin', rules: [{required: true}],span: 12,formslot:true,display: true,prop: 'report_path'},
                    {type: 'input',label: '协助管理人员', span: 12,formslot:true,display: true,prop: 'members'},
                    {type: 'input',label: '战报用户', span: 12,formslot:true,display: true,prop: 'zb_user'},
                    {type: 'input',label: '战报口令', span: 12,formslot:true,display: true,prop: 'zb_password'},
                    {type: 'array',label: '数据库连接',span: 24,prop: 'db_connection_list',formslot:true,hide:true,},
                ]
            }
        },
        db_connection_listOption(){ return {
                            align: 'center',headerAlign: 'center',index: false,addBtn: true,delBtn: true,
                            column: [
                                {type: 'input',label: '名称',span: 12,display: true,prop: 'name'},
                                {type: 'select',label: '类型',span: 12,display: true,prop: 'db_type',dicData:this.db_type_dict },
                                {type: 'input',label: '连接串',span: 24, cell: true,display: true,prop: 'conn_str'}
                            ]
                            }}
    },
    data(){
        return {
            test_user:'',
            test_password:'',
            grp_obj:{},
            tab_value:'first',
            conn_obj:{},
            login_tbl:[],
            user_obj:{},
            parsers:[],
            data:{login_script:`var result=web_request({'url':'http://xxx.xxx.xxx/auth/user/login'  
            ,'method':'post','data':{'userid':userid,'password':password,'attrib':'mobile,phone,mail'} } );
var json=eval('='+result);	
return {'errcode':json.errcode,'message':json.errmsg, 'userid':json.userid,'username':json.username,'old_result':result};`,},
            ready:false,

        }
    }
}
</script>

<style>
.avue-crud .el-table .el-form-item{display: inline;}
</style>