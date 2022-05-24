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
            content:`<template>
            <div style="width:100%;height:calc(100% - 120px);display: flex;" ref="main" v-if="cr_init">
                <avue-crud :defaults.sync="defaults" ref="crud" :option="option" 
                :data="tableData.slice((page.currentPage - 1) * page.pageSize, page.currentPage*page.pageSize)"
                :page.sync="page"
                >
                  <template slot="menuLeft" slot-scope="{size}">
                    <el-button @click="saveOption" type="danger" :size="size">保存配置</el-button> 
                  </template> 
                </avue-crud>
            </div>
            </template>
            <script>
              let key = _this.self.gridName;
              export default {
                data() {
                  let column=_this.self.fields.filter(x=>x.selected).map(x=> { return {"label":x.label,"prop":x.key}; })
                  let ret= {
                    defaults: {},
                    page: {
                      currentPage: 1,
                      total: 0,
                      //layout: "total,pager,prev, next",
                      background:false,
                      pageSize: 20
                    },
                    option: {
                      addBtn: false,
                      menu: false,
                      border: true,
                      height:_this.selfHeight-120,
                      align: 'center',
                      column: column
                    }
                  }      
                  return ret;
                },
                methods: {  
                  saveOption() { 
                    localStorage.setItem(key, JSON.stringify(this.defaults))
                    this.$message.success('配置保存成功')
                  },
                },
                computed:{
                    tableData(){
                        let {__valid_data__,valid_fileds,real_data}=tool.build_chart_data(this.self.datasource,this.context.report_result,[],this.self.fields)
                        let tableData = tool.convert_array_to_json(__valid_data__)
                        this.page.total=tableData.length
                          return tableData;
                    },
                    cr_init(){
                        if(this.context.mode=='design' && this.self.datasource!='示例')
                            return true
                        this.$nextTick(() => {
                          this.defaults = JSON.parse(localStorage.getItem(key) || '')
                        })
                        return true
                    }
                }
              }
            </script> `
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
            
            {
                "type": "text",
                "label": "文字",
                "h": 4,
                "span": 6,
                "component": "dync-template",
                "gridName": "_random_",
                "icon": "icon-table",
                "style": {
                    "height": "100%"
                },
                "titleOption": {
                    "scroll": false,
                    "step": 0.5,
                    "speed": 70,
                    "textAlign": "center",
                    "fontSize": 22,
                    "fontWeight": "normal",
                    "color": "",
                    "textShadowX": 1,
                    "textShadowY": 1,
                    "textShadowZ": 1
                },
                "color": "#fff",
                "display": true,
                "content": "<eleText value=\"\" :self=\"self\"></eleText>"
            }            
            ]
    },
]
  