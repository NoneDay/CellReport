<template>
  <div :style="{width:'100%',height:'100%'}">
          <div v-html="self.content" :style="{width:'100%',height:'100%'}"></div>
  </div>
</template>

<script>
import mixins from "./mixins"
import {output_largeGrid} from "../utils/util"
export default {
    mixins:[mixins],
    name:"html-text",
    props:{
        'gridName':{
           type: String,
          default: () => {
            return "this.name"
          }
        }
    },
    watch:{ 
          //"context.report":function(){this.buildDisplayData() },
      "self.gridName":{
        handler(newVal,oldVal){
          let grid=this.context.report.AllGrids.HtmlText.find(a=>a._name==oldVal)
          if(grid)
            grid._name=newVal
        }
      },
      "self.content":{
        handler(val){
          if(this.context.mode!='design')
              return
          let grid= this.context.report.AllGrids.HtmlText.find(a=>a._name==this.gridName)
          $.extend(grid, {"_name":this.gridName,"__cdata":this.self.content });
        }
      },
      gridName(newVal,oldVal){
        let grid= this.context.report.AllGrids.HtmlText.find(a=>a._name==oldVal)
        grid._name=newVal
      }
    },
    mounted(){
      this.self.gridName=this.gridName
      this.buildDisplayData()
    },
    computed:{
      real_content(){
            return this.self.content
      }
    },
    data(){
      return {
         scriptArr:[]
      }
    },
    beforeDestroy(){
      this.scriptArr.forEach(ele=>{
        ele.remove()
      });
      if(this.context.mode!='design')
        return
      let grid= this.context.report.AllGrids.HtmlText.find(a=>a._name==this.gridName)
      if(this.self.isDelete){
        if(grid!=undefined)
          this.context.report.AllGrids.HtmlText.splice(this.context.report.AllGrids.HtmlText.indexOf(grid), 1) 
        if(this.context.report_result)
          delete this.context.report_result.data[this.gridName]

        return
      }
      $.extend(grid, {"_name":this.gridName,"__cdata":this.self.content });
   },
    methods:{
      buildDisplayData()
      {
            if(!this.context.mode!='design'){
                let grid= this.context.report.AllGrids.HtmlText.find(a=>a._name==this.gridName)
                if(grid)
                  this.$set(this.self,'content',grid.__cdata)
                else{
                  this.context.report.AllGrids.HtmlText.push({"_name":this.gridName,"__cdata":this.self.content })
                }
                return
            }
            let cur_grid=this.context.report_result.data[this.gridName]
            if(cur_grid){
              output_largeGrid(this,cur_grid,this.onclickrow) 
            } 
      },
      onclickrow(idx,row){
        console.info(idx,row)
      }
    }
  }
</script>

<style scoped>

</style>