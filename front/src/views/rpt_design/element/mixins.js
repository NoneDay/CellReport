import {request} from 'axios'
import x2js from 'x2js' 
import {baseUrl} from '../api/report_api'
import {test_data} from "../utils/util" 
export default {
    props: {
      depth:{
        type: Number,
        default: () => {
          return 0
        }
      },
        select:{
          type: Object,
          default: () => {
            return {}
          }
        },parent:{
          type: Object,
          default: () => {
            return {}
          }
        },index:Number,
        self: {
          type: Object,
          default: () => {
            return {}
          }
        },
        params: {
          type: Object,
          default: () => {
            return {}
          }
        },
        theme: {
          type: String
        },
    },
    inject: ["fresh_ele","context"],
    data () {
      return {
        selectWidget: this.select ,
        
      }
    },
    watch: {
        select (val) {
          this.selectWidget = val
        },
        selectWidget: {
          handler (val) {
              this.$emit('update:select', val)
          },
          deep: false
        },
        'self.gridName'(newVal,oldVal){
          delete this.context.clickedEle[oldVal]
          if(this.self.gridName && this.self.gridName!="_random_")
            this.$set(this.context.clickedEle,this.self.gridName,{data:{},cell:null,column:{},self:this.self})
        },
        'fresh_ele':{//这里有个问题，会照成重复刷新.
          handler:function(newVal,oldVal){
            let cur_ds=this.self.datasource 
            if(!cur_ds || !this.buildDisplayData){
              return 
            }
            if(this.self.component=="echarts" || this.self.component=="luckySheetProxy")
                return
            if(this.self.datasource && (this.self.datasource.startsWith("数据集") || this.self.datasource.startsWith("表格")))
              return;
            if(this.buildDisplayData && this.fresh_ele.find(x=>x==this.self.datasource))
            {
              console.info("重构"+this.self.gridName)
              if(this.refresh)
                this.refresh()
              else{
                this.buildDisplayData(true)
              }
            }
          },deep:true,
        },
        "context.report_result":{
          handler(val,oldVal){
              if(this.self.component!="echarts" && this.self.component!="luckySheetProxy")
                return
              if(val.data && this.self.component=="luckySheetProxy"){
                if(["run" ,"preview" ].includes( this.context.mode) && this.buildDisplayData && val.data[this.self.gridName]){
                  if(!this.fresh_ele.includes("表格:"+this.self.gridName) && !val.fresh_report.includes("表格:"+this.self.gridName) )
                    return
                    
                  this.buildDisplayData(true)
                  return
                }
                else
                  return
              }
              if(!this.self.datasource || (!this.buildDisplayData&&!this.refresh))
                  return   
              if(!val.dataSet && !val.data)
                  return   
              let name_arr=this.self.datasource.split(":")
              if((name_arr[0]=='数据集' && val.dataSet[name_arr[1]])              
                || (name_arr[0].startsWith('表格') && val.data[name_arr[1]])
              ){
                if(this.refresh)
                  this.refresh()
                else
                  this.buildDisplayData()
                return
              }      
          },deep:true
      }, 
    },
    computed: {
        defaultsetting(){
            if(this.context.mode=='run')
              return this.context.report_result.defaultsetting  
            else
              return this.context.report.defaultsetting
              
        },
    },
    methods:{
      dataset(ds_name,from=0,to=Number.MAX_VALUE){
        let ds
        if(this.context?.report_result?.dataSet && this.context.report_result.dataSet[ds_name]  ){
            ds=this.context.report_result.dataSet[ds_name] 
            if(ds==undefined)
                return "没有数据集"+ds_name
            ds=ds[0]            
        }
        else
          ds=test_data
          return ds.slice(from,to)
      },
      findElelment(name,prop_dict){
        if(this.context?.report_result){
          let ret=this.context?.report_result.layout.concat(
            this.context?.report_result.layout_hidden||[]).filter(x=>x.element.gridName==name)
          if(ret!=null)
            return Object.assign({}, ret[0].element,prop_dict||{})
        }
      },
      find_item(item){
        if(this.context.mode!='design' || this.selectWidget.type=='layout')
            return false;
        if(this.selectWidget.type=='layout_item' && item.i==this.selectWidget.item_i)
        {
            return true;
        }
        if(item==this.selectWidget || item.element==this.selectWidget)
        {
            return true;
        }
        let children=item.element?.children?.column || item.children?.column
        if(children)
        {
            for(let one in children){
                let in_child=this.find_item(children[one])
                if(in_child)
                {
                    return true;
                }
            }
        }        
        return false;
    },
      /**
       * 刷新机制：context.clickedEle 中存放每个元素的点击数据
       * 在点击grid或report或图等元素时，需要设置 clickedEle.然后调用click_fresh，参数为点击元素的选中数据p_data
       * 通过修改 fresh_ele 来触发页面部分刷新。在正确获取远程数据后，将返回的数据集 全部添加到这里面
       * fresh_ds 存放了待刷新的数据集或grid，fresh_params 存放了需要用到的参数设置
       * @param {p_data} p_data 格式为： {data:row,cell:null,column:null}
       * @returns 
       */
      
      click_fresh(p_data){
        let _this=this
        this.fresh_ele.splice(0) 
        this.fresh_ele.push("元素选中行:"+this.self.gridName)//: Date.now() + '_' + Math.ceil(Math.random() * 99999});
        if(this.self.fresh_ds.length==0) //没有需要刷新的对象，就返回
        {
          if(window.cellreport[`cr_click_${this.self.gridName}`]){
            window.cellreport[`cr_click_${this.self.gridName}`](p_data,this)
          }
          return;
        }
        if(this.context.in_exec_url.stat){
          this.$notify({title: '提示',message: "已经在执行一个查询！",type: 'error',duration:3000});
          return
        }
        let x2jsone=new x2js(); //实例        
        let data=new FormData();        
        data.append("_createFormParam", false )
        let all_gridname=Object.keys(_this.context.report_result.data)
        let real_fresh_ds=this.self.fresh_ds.filter(x=>x.split(":")[0]!='表格'  ||( x.split(":")[0]=='表格'  && all_gridname.includes( x.split(":")[1] )) )
        data.append("_fresh_ds", JSON.stringify(real_fresh_ds))
        let t_params=[];
        this.self.fresh_params.forEach(ele=>{
          if(!ele.value.startsWith("原始参数:") && p_data?.data && p_data.data[ele.value]){
            t_params.push({"name":ele.name,"value":p_data.data[ele.value]})
            data.append(ele.name,p_data.data[ele.value])
            return;
          }else if(ele.value=="点击的列名"){
            t_params.push({"name":ele.name,"value":p_data['cell']})
            data.append(ele.name,p_data['cell'])
            return;
          }else if(ele.value=="点击的值"){
            t_params.push({"name":ele.name,"value":p_data['column']})
            data.append(ele.name,p_data['column'])
            return;
          }
          // 使用缺省原始参数
          let default_param=Enumerable.from(_this.context.report_result.form).first(x=>x.name==ele.name)
          t_params.push({"name":ele.name,"value":default_param.value})
          data.append(ele.name,default_param.value)  
        })        
        _this.context.in_exec_url.stat=true;
        
        let url
        if(_this.context.mode=='run')
        {
          url=_this.context.in_exec_url.run_url
        }else{
          data.append("_content", x2jsone.js2xml({report:_this.context.report}) )
          let grpid=_this.context.report.reportName.split(":")[0]
          url= `${baseUrl}/design/preview:${grpid}`
          data.append("_fresh_params", JSON.stringify(t_params))
        }
        request({method: 'post',url,data,withCredentials: true
        }).then(response => {
          _this.context.in_exec_url.stat=false;
          if(response.errcode && response.errcode ==1){
            _this.$notify({title: '提示',message: response.message,duration: 0});
            return;
          }
          //console.info(response)
          _this.fresh_ele.splice(0)
          if(_this.context.report_result.dataSet==undefined)
            _this.context.report_result.dataSet={}
          if(!_this.validatenull(response.dataSet)){
            Object.assign(_this.context.report_result.dataSet,response.dataSet)
            Object.keys(response.dataSet).forEach(name => {
              //if(response.dataSet[name][0].length<=1)
              //  return
              //_this.context.report_result.dataSet[name] =response.dataSet[name]  
              _this.fresh_ele.push("数据集:"+name);
            });
          }
          if(!_this.validatenull(response.data)){
            Object.assign(_this.context.report_result.data,response.data)
            Object.keys(response.data).forEach(name => {
            //  _this.context.report_result.data[name] =response.data[name]  
              _this.fresh_ele.push("表格:"+name);
            });
          }
          if(window.cellreport[`cr_click_${_this.self.gridName}`]){
            window.cellreport[`cr_click_${_this.self.gridName}`](p_data,_this)
          }
          if(!window.cellreport.cr_close_fresh_message)
            _this.$notify({title: '提示',type: 'success',message: _this.fresh_ele,position: 'bottom-right',duration: 3000});
        }).catch(error=> { 
          _this.context.in_exec_url.stat=false;
          _this.$notify({title: '提示',message: error.message,type: 'error',duration:0});
        })
      }
    },
    created(){
      if(this?.self?.gridName){
        if(this?.self?.gridName=="_random_")
          return
        //console.info(this.self.gridName+":created")
        this.$set(this.context.clickedEle,this.self.gridName,{data:{},cell:null,column:{},self:this.self})
      }
    },
    beforeDestroy(){
      if(this?.self?.gridName){
        //console.info(this.self.gridName+":beforeDestroy")
        delete this.context.clickedEle[this.self.gridName]
      }
    },
    
}