<template>
     <div>
        <div>选择刷新</div>
        <el-checkbox-group v-model="data.fresh_ds">
            <el-checkbox-button v-for="item in fresh_datasource" 
            :label="item" :key="item">
            {{item}}
            </el-checkbox-button>
        </el-checkbox-group>
        <div>用以下参数刷新</div>
        <el-table stripe border  :height="250" 
                :data="data.fresh_params"  
            >
            <el-table-column prop="name" label="参数名" width="90px"> </el-table-column>
            <el-table-column prop="value" label="值">
                <template slot-scope="scope">
                <el-select v-model="scope.row.value"
                allow-create filterable default-first-option
                 placeholder="请选择">
                        <el-option  
                        v-for="item in param_choose_data"
                        :key="item"
                        :label="item"
                        :value="item" >
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    inject: ["context"],
    props: ['data'],
    methods:{ 
    },
    watch:{
        'data.fresh_ds'(){
            if(this.data.fresh_params==undefined)
                this.data.fresh_params=[]
            if(this.data.fresh_ds.length==0 )
            {
                if(this.data.fresh_params.length>0){
                    this.data.fresh_params.splice(0)
                }
            }else{
                if(this.data.fresh_params.length==0){
                    let conf=this.data
                    //conf.fields.splice(0);
                    conf.fresh_params.splice(0);
                    this.context.report.params.param?.filter(x=>x._inner=='False').forEach(x=>{
                        conf.fresh_params.push({"name":x._name,value:"原始参数:"+x._name})
                    })
                }
            }
        }
    },
    computed:{
        param_choose_data(){
            let ret=[]
            this.context.report.params.param?.filter(x=>x._inner=='False').forEach(x=>{
                ret.push("原始参数:"+x._name)
            })
            this.data.fields?.forEach(x=>{
                ret.push(x.key)
            })
            if(this.data.gridName){
                let grid=this.context.report?.AllGrids.grid.find(a=>a._name==this.data.gridName)
                if(grid){
                    JSON.parse(grid._fields??"[]").forEach(x=>{ret.push(x)})
                }
            }
            ret.push("点击的值")
            ret.push("点击的列名")
            return ret;
        },
        fresh_datasource(){

            let ret=[]
            this.context.report.dataSets.dataSet.forEach(element=>{
                ret.push(`数据集:${element._name}`)
            });
            this.context.report.AllGrids.grid.forEach(element=>{
                    ret.push(`表格:${element._name}`)
                });
            let t_fresh_ds=[]
            this.data.fresh_ds?.forEach(x=>{ 
                if(ret.includes(x))
                    t_fresh_ds.push(x)
            })
            this.data.fresh_ds=t_fresh_ds

            return ret;
        }
    }
}
</script>

<style>

</style>