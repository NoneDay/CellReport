import {deepClone} from "./utils/util"

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
function default_chart(chart_name,series_type,chart_option=`{
  backgroundColor: '#fff',
  legend: {selectedMode:'single'},//单选模式
  tooltip: {},
  dataset: {
      // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用
      source: valid_data
  },
  grid:{left :30,right:10,top:10,bottom:30},
  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
  yAxis: {},
  // 声明一个 Y 轴，数值轴。
  xAxis: {type: 'category',"axisLabel": {
    "margin": 8,
    "interval":0,//解决代码,坐标轴上的刻度是否全显示
    "textStyle": {
        "color": "#676767"
    }}},
  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
  series:function(){
      let series_type=[]
      valid_data[0].slice(1).forEach(ele=>{
          series_type.push(__series_type__)
      }); return series_type
    }() 
}`){
  chart_option=chart_option.replace("__series_type__",series_type)
  return  {
    "type":"echart",'label':chart_name,gridName:"_random_",icon: 
      'icon-table','color':'#fff',display: true,
      'component':'echarts',style:{height:'100%'}, 
      "series_type":series_type,
      
        fields:[{key:'product',label:'product',selected:true,type: 'bar'},
            {key:'2015',label:'2015年',selected:true,type: 'bar'},
            {key:'2016',label:'2016年',selected:true,type: 'bar'},
            {key:'2017',label:'2017年',selected:true,type: 'bar'}
          ],
        datasource:'示例',fresh_ds:[],fresh_params:[],
        data:[
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
        ]
        ,content:`option = `+chart_option
      
    }     
}
export default [
    {
        title: '布局字段',
        list: [widget_row_col_layout(),
            widget_div_layout(),       
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
            column: [widget_div_layout()
            ]
          }
        }  
      ]
    },
    { title: '元素',
        list: [ 
            {"type":"dync-template",'label':'动态模板',icon: 'icon-table','color':'#fff',display: true, 
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
            fields:[{key:'product',label:'product',selected:true,type: 'bar'},
            {key:'2015',label:'2015年',selected:true,type: 'bar'},
            {key:'2016',label:'2016年',selected:true,type: 'bar'},
            {key:'2017',label:'2017年',selected:true,type: 'bar'}
          ],style:{height:'100%'},
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

            {"type":"luckySheetProxy",'label':'自由格式报表',h:12, span:24,icon: 'icon-table',display: true,style:{height:'100%'},
              gridName:"_random_",span: 24,'component':'luckySheetProxy',fit:true,
              page_size:20,no_use_parent_css:false,
              page_sizes:"[20, 50, 100, 200]"
            },
              

            {"type":"html-text",'label':'html-text',gridName:"_random_",icon: 'icon-table','color':'#fff',display: true, 'component':'html-text',style:{height:'100px'},
                'content':"<h1>哈==哈哈</h1>"},              
            ]
    },
    { title: '数据展示',
    list: [
      
      {"type":"DataPay",'label':'DataPay',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-pay :option=" {
      decimals:2, span: 8,
      data: [
        {
          title: '后台模版',
          src: 'images/vip1.png',
          money: '999999',
          dismoney: '999999',
          tip: '/永久',
          color: '#808695',
          subtext: '购买',
          click: function (item) {
            
          },
          list: [
            {
              title: '面向全屏幕尺寸的响应式适配能力',
              check: true,
              tip: \`<h2 > 后台管理模版 - <small>点击红色字体即可预览</small></h2> <br />
              1.用户名登录/验证码登录/第三方登陆(QQ, 微信)/人脸识别/多种登录方式。 <br /> <br />
              2.全新的前端错误日志监控机制 <br /> <br />
              3.灵活的10 + 多款主题自由配置<br /><br />
              4.路由权限、菜单权限、登录权限 <br /> <br />
              5.前端路由动态服务端加载和无限极动态路由加载。 <br /> <br />
              6.模块的可拆卸化, 达到开箱即用 <br /> <br />\`,
              },
          ]
        }, {
          title: 'Avuex源码',
          src: 'images/vip2.png',
          color: '#ffa820',
          money: '999999999',
          dismoney: '999999',
          tip: '/永久',
          subtext: '购买',
          click: function (item) {
            
          },
          list: [
            {
              title: '一键集成表格的导出excel,打印,等功能',
              check: true,
            },
            {
              title: '底层代码可重用轻松对接多个UI框架',
              check: true,
            },
            {
              title: '底层更加完善的开发错误调试机制',
              check: true,
            },
            {
              title: '一套代码多个终端自适应',
              check: true,
            },
          ]
        }, {
          title: '全家桶',
          src: 'images/vip3.png',
          color: '#ef4868',
          money: '999999',
          dismoney: '999999',
          tip: '/永久',
          subtext: '购买',
          click: function (item) {
            
          },
          list: [
            {
              title: '授权商业化开发,永久更新授权使用',
              check: true,
            },
            {
              title: '后期更新和新产品将全部免费',
              check: true,
            }
          ]
        }
      ]
    }"></avue-data-pay>
    `},  

    {"type":"DataTabs",'label':'DataTabs',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-tabs :option="{
      data: [
        {
          click: function (item) {
            
          },
          title: '分类统计',
          subtitle: '实时',
          count: 7993,
          allcount: 10222,
          text: '当前分类总记录数',
          color: 'rgb(27, 201, 142)',
          key: '类'
        },
        {
          click: function (item) {
            
          },
          title: '附件统计',
          subtitle: '实时',
          count: 3112,
          allcount: 10222,
          text: '当前上传的附件数',
          color: 'rgb(230, 71, 88)',
          key: '附'
        },
        {
          click: function (item) {
            
          },
          title: '文章统计',
          subtitle: '实时',
          count: 908,
          allcount: 10222,
          text: '评论次数',
          color: 'rgb(178, 159, 255)',
          key: '评'
        }
      ]
    } "></avue-data-tabs>`},

    {"type":"DataBox",'label':'DataBox',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-box  :option="{
      decimals:2, span:6,
      data: [
        {
          click: function (item) {
            
          },
          title: '错误日志',
          count: 12332,
          icon: 'el-icon-warning',
          color: 'rgb(49, 180, 141)',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '数据展示',
          count: 33,
          icon: 'el-icon-view',
          color: 'rgb(56, 161, 242)',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '权限管理',
          count: 2223,
          icon: 'el-icon-setting',
          color: 'rgb(117, 56, 199)',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '权限管理',
          count: 2223,
          icon: 'el-icon-setting',
          color: 'rgb(117, 56, 199)',
          href:'',
          target:'_blank'
        },
      ]
    } "></avue-data-box>`},

    {"type":"DataCard",'label':'DataCard',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-card :option="{
      decimals:2, span:8,
      data: [
        {
          click: function (item) {
            
          },
          name: '小马',
          src: '/images/card-1.jpg',
          text: '腾讯游戏,没钱玩你麻痹',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          name: '网易掌门人',
          src: '/images/card-3.jpg',
          text: '网易游戏,玩你麻痹',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          name: '桐谷和人',
          src: '/images/card-4.jpg',
          text: '没有我开不了的挂',
          href:'',
          target:'_blank'
        },
      ]
    } "></avue-data-card>`},

    {"type":"DataCardtext",'label':'DataCardtext',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-cardtext  :option="{
      decimals:2, span:6,
      data: [
        {
            click: function (item) {
              
            },
            title:'香菜',
            color:'yellow',
            icon:'el-icon-mobile-phone',
            content:'殷其雷，天阴霾，雨零耶，盼君留。 殷其雷，纵不零，卿若留，吾将从。',
            href:'',
            target:'_blank',
            name:'文件上传',
            date:'1天前'
        },
        {
            click: function (item) {
              
            },
            title:'钉宫',
            icon:'el-icon-bell',
            color:'green',
            content:'殷其雷，天阴霾，雨零耶，盼君留。 殷其雷，纵不零，卿若留，吾将从。',
            href:'',
            name:'流加载',
            date:'1天前'
        },
        {
            click: function (item) {
              
            },
            title:'亚丝娜',
            icon:'el-icon-service',
            color:'#3fa1ff',
            content:'殷其雷，天阴霾，雨零耶，盼君留。 殷其雷，纵不零，卿若留，吾将从。',
            href:'',
            name:'表单',
            date:'1天前'
        },
        {
            click: function (item) {
              
            },
            title:'狂三',
            icon:'el-icon-time',
            color:'red',
            content:'殷其雷，天阴霾，雨零耶，盼君留。 殷其雷，纵不零，卿若留，吾将从。',
            href:'',
            name:'文件上传',
            date:'1天前'
        }
      ]
    } "></avue-data-cardtext>`},

    {"type":"DataDisplay",'label':'DataDisplay',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-display :option="{
      decimals:2, span:6,
      data: [
      {
          click: function (item) {
            
          },
          count: 100,
          decimals:2,
          title: '日活跃数',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          count: '3,000',
          title: '月活跃数',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          count: '20,000',
          title: '年活跃数',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          count: '40,000',
          title: '周活跃数',
          href:'',
          target:'_blank'
        }
      ]
    } "></avue-data-display>`},

    {"type":"DataIcons",'label':'DataIcons',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-icons :option="{
      decimals:2, span:4,
      data: [
        {
          click: function (item) {
            
          },
          title: '今日注册',
          count: 12678,
          decimals:2,
          icon: 'el-icon-tickets',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '今日登录',
          count: 22139,
          icon: 'el-icon-success',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '今日订阅',
          count: 35623,
          icon: 'el-icon-info',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '今日评论',
          count: 16826,
          icon: 'el-icon-message',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '今日评论',
          count: 16826,
          icon: 'el-icon-message',
          href:'',
          target:'_blank'
        },
        {
          click: function (item) {
            
          },
          title: '今日评论',
          count: 16826,
          icon: 'el-icon-message',
          href:'',
          target:'_blank'
        }
      ]
    } "></avue-data-icons>`},

    {"type":"DataOperatext",'label':'DataOperatext',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-operatext :option="{
      decimals:2, span: 8,
      data: [
        {
          click: function (item) {
            
          },
          title: 'smallwei',
          subtitle: 'avue部门-前端研发工程师',
          img: 'https://avatar.gitee.com/uploads/61/632261_smallweigit.jpg!avatar100?1518660401',
          color: '#00a7d0',
          list: [{
            label: '点赞',
            value: '3,200'
          }, {
            label: '关注',
            value: '13,000'
          }, {
            label: '项目',
            value: '13,000'
          }]
        },
        {
          click: function (item) {
            
          },
          title: 'smallwei',
          subtitle: 'avue部门-前端研发工程师',
          img: 'https://avatar.gitee.com/uploads/61/632261_smallweigit.jpg!avatar100?1518660401',
          color: '#f39c12',
          list: [{
            label: '点赞',
            value: '3,200'
          }, {
            label: '关注',
            value: '13,000'
          }, {
            label: '项目',
            value: '13,000'
          }]
        },
        {
          click: function (item) {
            
          },
          title: 'smallwei',
          subtitle: 'avue部门-前端研发工程师',
          img: 'https://avatar.gitee.com/uploads/61/632261_smallweigit.jpg!avatar100?1518660401',
          colorImg: 'http://img.sccnn.com/bimg/337/15595.jpg',
          list: [{
            label: '点赞',
            value: '3,200'
          }, {
            label: '关注',
            value: '13,000'
          }, {
            label: '项目',
            value: '13,000'
          }]
        },
      ]
    } "></avue-data-operatext>`},

    {"type":"DataProgress",'label':'DataProgress',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-progress :option="{
      decimals:2, span:6,
      data: [
        {
            click: function (item) {
              
            },
            title: '转化率（日同比 28%）',
            color: 'rgb(178, 159, 255)',
            count: 32,
            href:'',
            target:'_blank'
        },
        {
            click: function (item) {
              
            },
            title: '签到率（日同比 11%）',
            color:'rgb(230, 71, 88)',
            count: 32,
            href:'',
            target:'_blank'
        },
        {
            click: function (item) {
              
            },
            title: 'CPU使用率',
            color:'rgb(27, 201, 142)',
            count: 56,
            href:'',
            target:'_blank'
        },
        {
            click: function (item) {
              
            },
            title: '使用人数',
            color:'red',
            count: 56,
            href:'',
            target:'_blank'
        }
      ]
    } "></avue-data-progress>`},

    {"type":"DataRotate",'label':'DataRotate',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-rotate  :option="{
      decimals:2, span: 8,
      data: [
        {
          click: function (item) {
            
          },
          count: '150',
          title: '新订单',
          icon: 'el-icon-warning',
          color: 'rgb(49, 180, 141)'
        }, {
          click: function (item) {
            
          },
          count: '53%',
          title: '跳出率',
          icon: 'el-icon-view',
          color: '#00a65a'
        }, {
          click: function (item) {
            
          },
          count: '44',
          title: '用户注册数',
          icon: 'el-icon-setting',
          color: '#f39c12'
        }
      ]
    } "></avue-data-rotate>`},

    {"type":"DataImgtext",'label':'DataImgtext',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-imgtext :option=" {
      decimals:2, span:8,
      data: [
        {
          click: function (item) {
            
          },
          title: '网易掌门人',
          imgsrc: '/images/card2.jpg',
          headimg: [
            {
              src:'/images/card1.jpg',
              name:'张三'
            },
            {
              src:'/images/card2.jpg',
              name:'李四'
            },
            {
              src:'/images/card3.jpg',
              name:'王五'
            },
          ],
          content: '网易游戏,玩你麻痹.网易游戏,玩你麻痹.网易游戏,玩你麻痹.网易游戏,玩你麻痹.',
          href:'',
          target:'_blank',
          time:'刚刚'
        },
        {
          click: function (item) {
            
          },
          title: '小马',
          imgsrc: '/images/card1.jpg',
          headimg: [
            {
              src:'/images/card1.jpg',
              name:'张三'
            },
            {
              src:'/images/card2.jpg',
              name:'李四'
            },
            {
              src:'/images/card3.jpg',
              name:'王五'
            },
          ],
          content: '腾讯游戏,没钱玩你麻痹.腾讯游戏,没钱玩你麻痹.腾讯游戏,没钱玩你麻痹.',
          href:'',
          target:'_blank',
          time:'几秒前'
        },
        {
          click: function (item) {
            
          },
          title: '桐人',
          imgsrc: '/images/card3.jpg',
          headimg: [
            {
              src:'/images/card1.jpg',
              name:'张三'
            },
            {
              src:'/images/card2.jpg',
              name:'李四'
            },
            {
              src:'/images/card3.jpg',
              name:'王五'
            },
          ],
          content: '没有开不了的挂,没有收不了的后宫.没有开不了的挂,没有收不了的后宫.没有开不了的挂,没有收不了的后宫.',
          href:'',
          target:'_blank',
          time:'一小时前'
        },
      ]
    } "></avue-data-imgtext>`},

    {"type":"DataPanel",'label':'DataPanel',gridName:"_random_",h:4, span:24,icon: 'icon-table','color':'#fff',
    display: true, 'component':'dync-template',style:{height:'100px'},
    'content':`<avue-data-panel :option="{
      span:8,decimals:2,
      data: [
          {
            click: function (item) {
              
            },
            title: 'New Visits',
            count: '102,400',
            icon: 'el-icon-message',
            color: '#00a7d0',
          },
          {
            click: function (item) {
              
            },
            title: 'Messages',
            count: '81,212',
            icon: 'el-icon-info',
            color: 'rgb(27, 201, 142)',
          },
          {
            click: function (item) {
              
            },
            title: 'Purchases',
            count: '9,280',
            icon: 'el-icon-success',
            color: 'rgb(230, 71, 88)',
          }
        ]
    } "></avue-data-panel>`},

    ]
  },
    { title: '图',
    list: [
          default_chart('柱状图','{"type":"bar"}') ,
          default_chart('极坐标堆叠图',
            '{"type": "bar", "coordinateSystem": "polar","stack": "a"}'
            ,`{
              backgroundColor: '#fff',
              legend: {},
              tooltip: {},
              "polar": {},"angleAxis":{},
              dataset: {
                  // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用
                  source: valid_data
              },
              // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
              
              // 声明一个 Y 轴，数值轴。
              radiusAxis: {type: 'category'},
              // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
                series:function(){
                  let series_type=[]
                  valid_data[0].slice(1).forEach(ele=>{
                      series_type.push(__series_type__)
                  }); return series_type
                }() 
            }`            
            ) ,
          default_chart('堆叠图','{"type": "bar", "stack": "one"}') ,
          default_chart('面积图','{"type":"line","stack":"z","areaStyle": {}}') ,
          default_chart('line_symbol',`{
            "type": "line",
            "smooth": true,
            "showAllSymbol": true,
            "symbol": "emptyCircle",
            "symbolSize": 5
        }`) ,
          default_chart('线型图','{"type":"line"}') ,
          default_chart('多饼图','{"type":"pie"}',`{
            backgroundColor: '#fff',
            legend: {},
            tooltip: {},
             
            dataset: {
                // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用
                source: valid_data
            }, 
              series:function(){
                let series_type=[]
                valid_data[0].slice(1).forEach(ele=>{
                    series_type.push(__series_type__)
                }); return series_type
              }() 
          }`) ,
          default_chart('上饼下线','{"type": "line", "smooth": true, "seriesLayoutBy": "row"}',
          `{
            backgroundColor: '#fff',
            legend: {},
            tooltip: {
              trigger: 'axis',
              showContent: false
          },
            xAxis: {type: 'category'},
            yAxis: {gridIndex: 0},
            grid: {top: '55%'}, 
            dataset: {
                // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用
                source: valid_data
            }, 
              series:
              function(){
                let series_type=[]
                valid_data[0].slice(1).forEach(ele=>{
                    series_type.push(__series_type__)
                }); 
                series_type=series_type.concat([{
                  type: 'pie',
                  id: 'pie',
                  radius: '30%',
                  center: ['50%', '25%'],
                  label: {
                      formatter: '{b}: {@2012} ({d}%)'
                  },
                  encode: {
                      itemName: valid_data[0][0],
                      value: valid_data[0][1],
                      tooltip: valid_data[0][1]
                  }
                }])
                return series_type
              }() 
              
          }
          myChart.on('updateAxisPointer', function (event) {
            var xAxisInfo = event.axesInfo[0];
            if (xAxisInfo) {
                var dimension = xAxisInfo.value + 1;
                myChart.setOption({
                    series: {
                        id: 'pie',
                        label: {
                            formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                        },
                        encode: {
                            value: dimension,
                            tooltip: dimension
                        }
                    }
                });
            }
        });
          `) ,
          
          default_chart('仪表盘', '{"type": "gauge"}',`
          {
            backgroundColor: '#fff',
            legend: {selectedMode:'single'},//单选模式
            tooltip: {},
            dataset: {
                // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用
                source: valid_data
            },
            grid:{left :0,right:0,top:0,bottom:0},
            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            yAxis: {},
            // 声明一个 Y 轴，数值轴。
            xAxis: {type: 'category',"axisLabel": {
              "margin": 8,
              "interval":0,//解决代码,坐标轴上的刻度是否全显示
              "textStyle": {
                  "color": "#676767"
              }}},
            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
            series:function(){
                let series_type=[]
                valid_data.slice(1).forEach(ele=>{
                    series_type.push({"type": "gauge" ,
                                  data: [{
                      value: ele[1],
                      name: ele[0]
                  }]   
                                })
                }); return series_type
              }() 
          }          
          `),
          default_chart('漏斗图', `{"type": "funnel"}`,`{
            backgroundColor: '#fff',
            legend: {},
            tooltip: {},
            dataset: {
                // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用
                source: valid_data
            },
            grid:{left :30,right:10,top:10,bottom:30},
            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
            yAxis: {},
            // 声明一个 Y 轴，数值轴。
            xAxis: {type: 'category' },
            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
              series:function(){
                let series_type=[]
                valid_data[0].slice(1).forEach(ele=>{
                    series_type.push(__series_type__)
                }); return series_type
              }() 
          }`),     
          
        ]
      }
]
  