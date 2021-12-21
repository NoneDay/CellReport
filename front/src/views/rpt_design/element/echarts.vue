<template>
 <div ref="main_parent" style="width:100%;height:100%;" >
     <div ref="main" style="width:100%;height:100%;"></div>
  </div>
</template>

<script>
var echarts = require('echarts'); 
import mixins from "./mixins"
import {convert_csv_to_json,convert_array_to_json,build_chart_data } from "../utils/util"
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
    name:"echarts",
    mixins:[mixins],
    props:[ 'gridName'],
    watch:{
        "self":{
            handler(val,oldVal){
                this.buildDisplayData()
            },deep:true
        }, 
    },
    data(){
        return {
            myChart:{}, 
        }
    },
    computed:{

    },
    mounted(){
        this.myChart = echarts.init(this.$refs.main);
        try{
            this.buildDisplayData()
            const _this = this
            const erd = elementResizeDetectorMaker()
            erd.listenTo(this.$refs.main_parent,(element)=>{
                _this.$nextTick(()=>{
                _this.myChart.resize();
                })
            })            
        }catch (e) {
             console.info(e)
        }
    },
    methods:{
        
        buildDisplayData()
        {
            if(Object.keys(this.context.report_result).length<2  && this.self.datasource!='示例'){
                this.$message.warning("先点击预览，才能配置与报表结果有关的元素");
                return;
            }
            let {valid_data,valid_fileds,real_data}=build_chart_data(this.self.datasource,this.context,this.self.fields)
            this.real_data=convert_array_to_json(real_data)
            if(this.real_data.length && this.self.gridName!="_random_"){ 
                this.$set(this.context.clickedEle,this.self.gridName,{data:this.real_data[0],cell:null,column:null})
            }

            let series_type=[]
            valid_fileds.slice(1).forEach(ele=>{
                series_type.push(JSON.parse(this.self.series_type))
            });
            
            //valid_data.splice(0,1)
            let _this=this
            let _myChart=this.myChart
            let option=this.self.content;
            setTimeout(function(){
                try{
                    eval("option=(function(myChart,build_chart_data){"+option+"\n return option})(_myChart,this.build_chart_data)")
                    _myChart.clear()
                    _myChart.setOption(option);
                    _myChart.off('click')
                    _myChart.on('click', function (params) {
                        //因为有可选列，所以不能直接用row，要按row 找到真正的原始数据
                        let row=convert_array_to_json([valid_data[0],params.data])[0]
                        let cur_data=_this.real_data.filter(x=>{
                            for(let key in row){
                                if(key.startsWith("__"))
                                    continue
                                if(row[key]!=x[key])
                                {
                                    return false
                                }
                            }
                            return true
                        } )
                        console.info(cur_data[0])
                        if(cur_data.length){ 
                            _this.$set(_this.context.clickedEle,_this.self.gridName,{data:cur_data[0],cell:cur_data[0][params.seriesName],column:params.seriesName})
                        }
                        _this.click_fresh(_this.context.clickedEle[_this.self.gridName])
                        //dimensionNames
                        //data
                        //seriesName
                    })
                }catch(e){
                    console.info("this.self.chart_option不正确")
                    console.info(option)
                    _this.myChart.dispose()
                    _this.myChart = echarts.init(_this.$refs.main);
                    console.error(e)
                }
            })
            
        }
    }
}
</script>

<style>

</style>