export const widget_row_col_layout=function(item){
  let column=[]
  if(item)
    column.push(item)
  return{
    type:"layout_row_col"  ,
    label: 'row_col布局',span: 24,
    icon: 'icon-group',
    display: true,style:{height:'100%'},
    component:'widget-form-group',
    prop:"_random_",
    children: {
      column: column
    }
  }
}
export const widget_div_layout=function(item){
  let column=[]
  if(item)
    column.push(item)
  return {
    type:"layout_div" , 
    label: 'div布局',span: 24,
    icon: 'icon-group',
    display: true,style:{height:'100%'},
    component:'widget-form-group',
    prop:"_random_",
    children: {
      column: column
    }
  }
}
export default [
    { title: '核心元素',
        list: [   
          {"type":"luckySheetProxy",'label':'自由格式报表',h:12, span:12,icon: 'icon-table',display: true,style:{height:'100%'},
          gridName:"_random_",'component':'luckySheetProxy',fit:true,
          page_size:20,no_use_parent_css:false,
          page_sizes:"[20, 50, 100, 200]"
        },  
        
            {"type":"dync_template",'label':'动态模板',gridName:"_random_",icon: 'icon-table','color':'#fff',display: true,style:{height:'100px'}, 
            'content':`
        <div>
        <div>Hello {{ name }}!</div>
        <button @click="sayHi">Say Hi!</button>
      </div>`,
            'component':'dync-template'},

            {type:"ele-grid",'label':'ele_grid',icon: 'icon-table','color':'#fff',display: true, 
            pageSize:20,
            gridName:'_random_',
           datasource:"示例",fresh_ds:[],fresh_params:[],
            fields:[],style:{height:'100%'},
            content:`<div style="width:100%;height:100%" v-if="tableData.length>0"> 
            <el-table stripe border height="calc(100% - 28px)"  @cell-click="cell_click"
              :data="tableData.slice((currentPage - 1) * self.pageSize, currentPage*self.pageSize)" 
            >
                <el-table-column v-for="(one,idx) in Object.keys(tableData[0])"  sortable
                  :key="one+idx" :prop="one" :label="one"> 
                </el-table-column>
            </el-table>
            <el-pagination  
                :current-page.sync="currentPage"
                :page-sizes="[2, 5, 10, 20]"
                :page-size.sync="self.pageSize" 
                layout="total, sizes, prev, pager, next, jumper"
                :total.sync="tableData.length">
            </el-pagination>
            </div> `
        ,
            'component':'ele-grid'},

            {
              type: 'tabs',
              label: 'tab面板',
              icon: 'icon-table',
              span: 24,
              display: true,style:{height:'100%'},
              component:'widget-form-tabs',
              children: {
                align: 'center',
                headerAlign: 'center',
                column: []
              }
            },
                            
            ]
    },
]
  