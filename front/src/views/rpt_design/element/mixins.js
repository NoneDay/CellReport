import {request} from 'axios'
import x2js from 'x2js' 
import {baseUrl} from '../api/report_api'
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
        }
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
          deep: true
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
          ds=[
            ['product', '2015', '2016', '2017'],
            ['苹果', 43.3, 85.8, 93.7],
            ['柚子', 23.1, 73.4, 55.1],
            ['香蕉', 36.4, 65.2, 82.5],
            ['菠萝', 42.4, 53.9, 39.1],
            ['枇杷', 53.3, 85.8, 93.7],
            ['草莓', 63.1, 73.4, 55.1],
            ['柠檬', 76.4, 65.2, 82.5],
            ['红枣', 72.4, 53.9, 39.1],
            ['葡萄', 48.3, 85.8, 93.7],
            ['芒果', 88.1, 73.4, 55.1],
            ['山竹', 88.4, 65.2, 82.5],
            ['桂圆', 78.4, 53.9, 39.1]                        
        ]
          return ds.slice(from,to)
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
        
        this.fresh_ele.splice(0) 
        this.fresh_ele.push("元素选中行:"+this.self.gridName)//: Date.now() + '_' + Math.ceil(Math.random() * 99999});
        if(this.self.fresh_ds.length==0) //没有需要刷新的对象，就返回
          return;
        if(this.context.in_exec_url.stat){
          this.$notify({title: '提示',message: "已经在执行一个查询！",type: 'error',duration:3000});
          return
        }
        let x2jsone=new x2js(); //实例
        let _this=this
        let data=new FormData();
        data.append("_content", x2jsone.js2xml({report:_this.context.report}) )
        data.append("_createFormParam", false )
        let all_gridname=Object.keys(_this.context.report_result.data)
        let real_fresh_ds=this.self.fresh_ds.filter(x=>x.split(":")[0]!='表格'  ||( x.split(":")[0]=='表格'  && all_gridname.includes( x.split(":")[1] )) )
        data.append("_fresh_ds", JSON.stringify(real_fresh_ds))
        let t_params=[];
        this.self.fresh_params.forEach(ele=>{
          if(ele.value.startsWith("原始参数:"))
            return;
          t_params.push({"name":ele.name,"value":p_data.data[ele.value]})
          data.append(ele.name,p_data.data[ele.value])
        })        
        _this.context.in_exec_url.stat=true;
        
        let url
        if(_this.context.mode=='run')
        {
          url=_this.context.in_exec_url.run_url
        }else{
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
          Object.keys(_this.context.report_result.dataSet).forEach(name => {
            _this.context.report_result.dataSet[name] =_this.context.report_result.dataSet[name]  
            _this.fresh_ele.push("数据集:"+name);
          });
          Object.keys(response.data).forEach(name => {
            _this.context.report_result.data[name] =response.data[name]  
            _this.fresh_ele.push("表格:"+name);
          });
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