const path = process.env.VUE_APP_PATH;
//基本配置
export const config = {
  width: 1920,
  height: 1080,
  query: '',
  header: '',
  mark: {
    show: false,
    text: 'BIM-VIEW',
    fontSize: 20,
    textStyle: 'rgba(100,100,100,0.2)',
    degree: -20
  },
  scale: 1,
  backgroundImage: `${path}img/bg/bg.png`,
  url: '',
  gradeShow: false,
  gradeLen: 30,
};
// 颜色的配置
export const colorOption = {
  menuWidth: 150,
  refreshBtn: false,
  columnBtn: false,
  labelWidth: 100,
  column: [{
    label: '颜色1',
    prop: 'color1',
    type: 'color',
  }, {
    label: '渐变色',
    prop: 'color2',
    type: 'color',
  }, {
    label: '位置',
    prop: 'postion',
    type: 'number'
  }]
}

// 表格的列配置
export const tableOption = {
  menuWidth: 150,
  refreshBtn: false,
  columnBtn: false,
  labelWidth: 100,
  column: [{
    label: '名称',
    prop: 'label',
  }, {
    label: 'key值',
    prop: 'prop',
  }, {
    label: '宽度',
    prop: 'width',
    hide:true
  }, {
    label: '状态',
    prop: 'hide',
    type: 'select',
    value: false,
    hide:true,
    dicData: [{
      label: '显示',
      value: false
    }, {
      label: '隐藏',
      value: true
    }]
  }]
}

export const sqlOption = {
  menuWidth: 150,
  refreshBtn: false,
  columnBtn: false,
  labelWidth: 100,
  column: [{
    label: '参数名',
    prop: 'paramKey',
    rules: [{
      required: true,
      message: "请输入参数名",
      trigger: "blur"
    }]
  }, {
    label: '参数默认值',
    prop: 'paramDefaultValue',
  }, {
    label: '参数值',
    prop: 'paramValue',
  }]
}
//一些字典的配置
export const dicOption = {
  line: [{ label: '线条', value: 'line' }, { label: '圆环', value: 'circle' }],
  fontWeight: [{ label: '正常', value: 'normal' }, { label: '粗体', value: 'bolder' }, { label: '细体', value: 'lighter' }],
  border: [{ label: '无边框', value: '' }, { label: '内置图片', value: 'img' }, { label: '内置边框', value: 'border' }],
  textAlign: [{ label: '居中', value: 'center' }, { label: '左对齐', value: 'left' }, { label: '右对齐', value: 'right' }],
  verticalAlign: [{ label: '居中', value: 'middle' }, { label: '上对齐', value: 'top' }, { label: '下对齐', value: 'bottom' }],
  dataType: [{ label: '静态数据', value: 0 }, { label: '报表数据', value: 1 }, 
  //{ label: 'SQL数据', value: 2 },{ label: 'Websocket', value: 3 }
],
  orientList: [{ label: '竖排', value: 'vertical' }, { label: '横排', value: 'horizontal' }],
  dataMethod: [{ label: 'POST', value: 'post' }, { label: 'GET', value: 'get' }],
  eventList: ['tabs', 'text', 'flop'],
  labelPosList: [
    {label:'left',value:'left'},
    {label:'right',value:'right'},
    {label:'top',value:'top'},
    {label:'bottom',value:'bottom'},
    {label:'inside',value:'inside'},
    {label:'insideTop',value:'insideTop'},
    {label:'insideLeft',value:'insideLeft'},
    {label:'insideRight',value:'insideRight'},
    {label:'insideBottom',value:'insideBottom'},
    {label:'insideTopLeft',value:'insideTopLeft'},
    {label:'insideTopRight',value:'insideTopRight'},
    {label:'insideBottomLeft',value:'insideBottomLeft'},
    {label:'insideBottomRight',value:'insideBottomRight'},
  ],
  dataList: ['common', 'datav', 'text', 'wordcloud', 'img', 'tabs', 'map', 'flyingLineMap','airBubbleMap', 'video', 'clapper', 'pie',
    'pictorialbar', 'iframe', 'swiper', 'flop', 'bar', 'line', 'progress', 'table', 'gauge', 'funnel', 'scatter', 'radar',
    'img', 'imgborder', 'test', 'imgList', 'imgTabs', 'tablePlus', 'toast'],
  themeList: [{
    label: '默认配色',
    value: 'avue'
  }, {
    label: '紫色主题',
    value: 'macarons'
  }, {
    label: '绿色主题',
    value: 'wonderland'
  }, {
    label: '暗黑主题',
    value: 'dark'
  }
  ],
  barList: ['bar', 'line'],
  titleList: ['map','bar', 'pie', 'line', 'radar', 'funnel', 'pictorialbar'],
  labelList: ['bar', 'line', 'pie', 'radar', 'scatter'],
  legendList: ['bar', 'pie', 'line', 'radar', 'funnel'],
  colorList: ['common','bar', 'pie', 'line', 'gauge', 'funnel', 'scatter', 'radar','map'],
  tipList: ['bar', 'pie', 'line', 'gauge', 'funnel', 'scatter', 'radar'],
  postionList: ['bar', 'line', 'pictorialbar', 'funnel'],
  labelFormatterList: ['bar', 'map', 'line', 'pie', 'gauge', 'funnel', 'scatter', 'radar'],
  tabsTypeList: [{
    label: '选项卡',
    value: 'tabs',
  }, {
    label: '选择框',
    value: 'select',
  }],
  mapType: [{
    label: '原生',
    value: 0
  }],
  mapList: ['map', 'flyingLineMap', 'airBubbleMap'],
  target: [{ label: '本窗口', value: '_self' }, { label: '新窗口', value: '_blank', }],
  swiperType: [{ label: '普通', value: '' }, { label: '立体', value: 'card' }],
  swiperIndicator: [{ label: '外部', value: 'indicator' }, { label: '不显示', value: 'none' }],
  format: [{ label: '日期', value: 'yyyy-MM-dd' }, { label: '日期+时分', value: 'yyyy-MM-dd hh:mm' }, { label: '日期+时分秒', value: 'yyyy-MM-dd hh:mm:ss' }, { label: '日期(无年)', value: 'MM-dd' }, { label: '时分', value: 'hh:mm' }, { label: '时分秒', value: 'hh:mm:ss' }, { label: '星期', value: 'day' }]
}


function concat (prop, count, type, extend = [], defaults) {
  let list = [];
  for (let i = 1; i <= count; i++) {
    list.push({
      label: prop + i,
      value: `${path}img/${prop}/${prop}${i}.${extend.includes(i) ? defaults : type}`
    })
  }
  return list;
}
//加载图片素材库
export const imgOption = [
  concat('bg', 10, 'jpg', [1, 2, 3], 'png'),
  concat('border', 16, 'png'),
  concat('source', 260, 'svg', [1, 15, 16, 20, 239.240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260], 'png'),
  concat('banner', 10, 'png'),
]
