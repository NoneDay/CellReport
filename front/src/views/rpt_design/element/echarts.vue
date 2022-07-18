<template>
 <div ref="main_parent" style="width:100%;height:100%;display:flex; flex: 1;" >
     <div ref="main" style="width:100%;height:100%;"></div>
  </div>
</template>

<script>
import { validatenull } from '@/util/validate'
import mixins from "./mixins"
import {convert_csv_to_json,convert_array_to_json,build_chart_data,seriesLoadScripts ,randomRgbColor,test_data,select_field_data} from "../utils/util"
import elementResizeDetectorMaker from 'element-resize-detector'
//下边这两行尤为重要，数据才能正常渲染


export default {
    name:"echarts",
    mixins:[mixins],
    props:[ 'gridName'],
    watch:{
        "self":{
            handler(val,oldVal){
                let _this=this
                //if(JSON.stringify(val)==JSON.stringify(oldVal))
                //    return;
                if(this.context.mode=='design'  && ["line","pie","funnel","scatter","gauge",'bar','map'].includes(this.self.type))
                {
                    this.need_clear=false
                }
                else //if(val.content!=oldVal.content)
                {
                    this.need_clear=true
                }
                this.buildDisplayData()                
            },deep:true
        },         
    },
    data(){
        return {
            need_clear:this.context.mode=='design',
            myChart:{}, 
            zoomData: 1,
            
            geoCoordMap:{},
            map_url:"",
        }
    },
    computed:{
        labelShow () {
            return this.vaildData(this.self.option.labelShow, false);
        },
        x2 () {
            return this.self.option.gridX2 || 20;
        },
        fontSize () {
            return this.self.option.labelShowFontSize || 14;
        }
    },
    mounted(){
        let _this=this
        function inner_func(){
            _this.myChart = echarts.init(_this.$refs.main);
            // let resp=$.get("util/china.json",function(data,status){
            //        echarts.registerMap('china', data)
            //    })
            try{
                _this.buildDisplayData()
                const erd = elementResizeDetectorMaker()
                erd.listenTo(_this.$refs.main_parent,(element)=>{
                    _this.$nextTick(()=>{
                    _this.myChart.resize();
                    })
                })            
            }catch (e) {
                console.info(e)
            }
        }
       
        
        if(window.echarts==undefined)
            seriesLoadScripts("cdn/echarts.min.js",null,inner_func)
        else
            inner_func()
    },
    methods:{
        real_map_url(){
          if(this.validatenull(this.map_url))
            return this.self.option.mapData
          return this.map_url
        },
        has_self_color(){
          let field_color=Enumerable.from(this.self.fields).skip(1).where(x=>x.selected && x.color).toArray()
          return !this.validatenull(this.self.option.barColor) || !this.validatenull(field_color)
        },
        // 下面俩都是chart的公共的方法,就放这里面共用
        getColor (index, first) {
            let opt_color=Enumerable.from(this.self.fields).skip(1).where(x=>x.selected).toArray()[index]?.color
            const opt_barColor = this.self.option.barColor || [];
            let barColor=opt_color?{color1:opt_color}:opt_barColor[index]
            if (barColor) {
            const color1 = barColor.color1;
            const color2 = barColor.color2;
            if (first) return color1;
            if (color2) {
                let postion = (barColor.postion || 0.9) * 0.01;
                if (postion > 1) {
                postion = 1;
                } else if (postion < 0) {
                postion = 0;
                }
                return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0,
                    color: color1 // 0% 处的颜色
                }, {
                    offset: postion,
                    color: color2 // 100% 处的颜色
                }],
                global: false // 缺省为 false
                };
            }
            return color1;
            } else {
            return randomRgbColor()
            }
        },
        ishasprop (condition, isprop, alwaysObj) {
            return Object.assign((() => {
            return condition ? isprop : {};
            })(), alwaysObj);
        },
        
        getLabelFormatter (name) {
            if (this.self.labelFormatter) {
            return this.self.labelFormatter(name, this.self);
            }
            return name.value[name.seriesIndex+1];
        },
        buildDisplayData()
        {
            let fields=this.self.fields
            let datasource=this.self.datasource
            let __valid_data__,valid_fileds,real_data
            
            if(this.self.datasource=='静态数据'){
                if(this.self.optionData==undefined){
                  this.self.optionData=JSON.parse(JSON.stringify( test_data))
                  this.self.fields=[]
                }
                __valid_data__=select_field_data(this.self.optionData,this.self.fields)
                valid_fileds=__valid_data__[0]
                this.real_data=convert_array_to_json(__valid_data__ )             
            }else{
                try{
                    let clickedEle_data=datasource.startsWith("元素")?clickedEle[datasource.split(":")[1]].data:null
                    let ret=build_chart_data(datasource,this.context.report_result,clickedEle_data,fields)
                    __valid_data__=ret.__valid_data__
                    valid_fileds=ret.valid_fileds
                    real_data=ret.real_data
                    this.real_data=convert_array_to_json(real_data)
                }catch{
                    __valid_data__=JSON.parse(JSON.stringify( test_data))   
                    __valid_data__[0]=Enumerable.from(this.self.fields).where(x=>x.selected).select(x=>x.key).toArray()
                    this.real_data=convert_array_to_json(__valid_data__) 
                }
            }
            if(this.real_data?.length && this.self.gridName!="_random_"){ 
                this.$set(this.context.clickedEle,this.self.gridName,{data:this.real_data[0],cell:null,column:null,self:this.self})
            }

            let series_type=[]
            if(valid_fileds && this.self.series_type){
                valid_fileds.slice(1).forEach(ele=>{
                    series_type.push(JSON.parse(this.self.series_type))
                });
            }
            //__valid_data__.splice(0,1)
            let _this=this
            let _myChart=this.myChart
            let self=this.self
            let option={}
            setTimeout(function(){
                try{
                    if(_this.need_clear)
                    {
                        _myChart.clear()
                    }
                    
                    if(_this.self.type=='bar'){
                        option=bar_option(_this.self,_this,__valid_data__)
                        Object.assign(option,
                            {color:Enumerable.from(self.option.barColor).select(function(x){return {
                                    type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
                                    colorStops: [{offset: 0, color: x.color1 // 0% 处的颜色
                                    }, {offset: x.postion/100, color: x.color2 // 100% 处的颜色
                                    }],
                                    global: false // 缺省为 false
                                }
                                }
                                ).toArray()                        
                            })
                    }
                    if(_this.self.type=='line'){
                        option=line_option(_this.self,_this,__valid_data__)
                    }
                    if(_this.self.type=='pie'){
                        option=pie_option(_this.self,_this,__valid_data__)
                    }
                    if(_this.self.type=='funnel'){
                        option=funnel_option(_this.self,_this,__valid_data__)
                    }
                    if(_this.self.type=='scatter'){
                        option=scatter_option(_this.self,_this,__valid_data__)
                    }
                    if(_this.self.type=='gauge'){
                        option=gauge_option(_this.self,_this,__valid_data__)
                    }
                    if(_this.self.type=='radar'){
                        option=radar_option(_this.self,_this,__valid_data__)
                    }
                    if(_this.self.type=='map'){
                        option=map_option(_this.self,_this,__valid_data__)
                    }
                   _myChart.off('click')
                   //_myChart.getZr().off('click')
                    eval("option=(function(option,myChart,_this){"+_this.self.content+"\n return option})(option,_myChart,_this)")                    
                    
                    _myChart.setOption(option,true);
                    if(_this.context.mode=='design')
                        return;
                    
                    let func_click=function (params) {
                      let cur_data=_this.real_data[params.dataIndex]
                        if(_this.self.type=='map')
                        {
                            let click_data=Enumerable.from(__valid_data__).skip(1).where(x=>x[0]==params.name).toArray();
                            if(click_data.length==0)
                            return
                            
                            let data={'name':params.name,'componentType':params.componentType,'data':params.data}
                            
                            if(params.componentType=="geo"){
                                data.componentType=params.componentType
                                data.name=params.name
                                
                            }
                            if(params.componentType=="series"){
                                
                            }
                            _this.$set(_this.context.clickedEle,_this.self.gridName,{data:cur_data,cell:null,column:null,self:null,map_data:params})//

                        }else{
                            //因为有可选列，所以不能直接用row，要按row 找到真正的原始数据
                            _this.$set(_this.context.clickedEle,_this.self.gridName,{data:cur_data,cell:cur_data[params.seriesName],column:params.seriesName,self:_this.self})
                        }
                        _this.click_fresh(_this.context.clickedEle[_this.self.gridName])
                        console.info(_this.context.clickedEle[_this.self.gridName])
                        //dimensionNames
                        //data
                        //seriesName
                    }
                    _myChart.on('click', func_click) //*/
                }catch(e){
                    console.info(e)
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
// 散点图
function scatter_option (self,_this,__valid_data__) {
    const optionData = _this.deepClone(self.optionData);
    const option = {
    title: _this.ishasprop(self.option.titleShow, {
        text: self.option.title,
        subtext: self.option.subtext || '',
        textStyle: {
        color: self.option.titleColor || '#333',
        fontSize: self.option.titleFontSize || 16
        },
        left: self.option.titlePostion || 'auto',
        subtextStyle: {
        color: self.option.subTitleColor || '#aaa',
        fontSize: self.option.subTitleFontSize || 14
        }
    }, {}),
    tooltip: {
        formatter: self.option.formatter || '',
        backgroundColor: self.option.tipBackgroundColor || 'rgba(50,50,50,0.7)',
        textStyle: {
        fontSize: self.option.tipFontSize,
        color: self.option.tipColor || "#fff"
        }
    },
    grid: {
        left: self.option.gridX || 20,
        top: self.option.gridY || 60,
        right: _this.x2,
        bottom: self.option.gridY2 || 60
    },
    xAxis: {
        splitLine: {
        lineStyle: {
            type: 'dashed'
        }
        }
    },
    yAxis: {
        splitLine: {
        lineStyle: {
            type: 'dashed'
        }
        }
    },
    dataset: {
        // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用
        source: __valid_data__
    },
    series: (() => {
        const barColor = self.option.barColor || [];
        const list = (__valid_data__[0].slice(1)).map((ele, index) => {
        return Object.assign({}, {
            type: "scatter",
            itemStyle: {
            color: _this.getColor(index)
            },
            label: {
            show: _this.vaildData(self.option.labelShow, false), //开启显示
            position: "top",
            symbol:self.option.symbol||'circle',
            textStyle: {
                fontSize: self.option.fontSize || 14,
                color: self.option.labelShowColor || "#333",
                fontWeight: self.option.labelShowFontWeight || 500
            }
            }
        });
        });
        return list;
    })()
    };
    
    
    return option
}
function bar_option(self,_this,__valid_data__) {
    const optionData = _this.deepClone(self.optionData);
    const option = {
        title: _this.ishasprop(self.option.titleShow, 
            {
                text: self.option.title,
                subtext: self.option.subtext || '',
                textStyle: {
                    color: self.option.titleColor || _this.defaultsetting['COLOR'],
                    fontSize: self.option.titleFontSize || 16
                },
                left: self.option.titlePostion || 'auto',
                subtextStyle: {
                    color: self.option.subTitleColor || _this.defaultsetting['COLOR'],
                    fontSize: self.option.subTitleFontSize || 14
                }
            }
        , {}),
        tooltip: _this.ishasprop(_this.formatter, 
            {
                formatter: self.option.labelFormatter?.trim()!=""?self.option.labelFormatter:'{b}:{d}%'//name => { return _this.formatter(name, self.optionData) }
            }, 
            {
                backgroundColor: _this.defaultsetting['BACKGROUND-COLOR'],
                textStyle: {
                    fontSize: self.option.tipFontSize,
                    color: self.option.tipColor || _this.defaultsetting['COLOR']
                }
            }
        ),
        grid: {
            left: self.option.gridX || 20,
            top: self.option.gridY || 60,
            right: _this.x2,
            bottom: self.option.gridY2 || 60
        },
        legend: {
            show: _this.vaildData(self.option.legend, false),
            orient: self.option.legendOrient || "vertical",
            x: self.option.legendPostion || "left",
            top: self.option.legendPostionTop || 0,
            right: _this.x2,
            textStyle: {
                color: self.option.legendTextColor || _this.defaultsetting['COLOR'],
                fontSize: self.option.legendFontSize || 12,
            },
          data: (() => {
            return (__valid_data__[0].slice(1) || []).map((ele, index) => {
              return {
                name: ele,
                textStyle: _this.ishasprop(!self.switchTheme, {
                  color: _this.getColor(index, true)
                }, {})
              };
            });
          })()
        },
        xAxis: {
            type: self.option.category ? "value" : "category",
            name: self.option.xAxisName,
            axisLine: {
                show: true,
                symbol: self.option.xAxisLineSymbol ? ['none','arrow']: 'none',
                lineStyle: {
                color: self.option.lineColor || _this.defaultsetting['COLOR']
                }
            },
            
            inverse: _this.vaildData(self.option.xAxisInverse, false),
            show: _this.vaildData(self.option.xAxisShow, true),
            splitLine: {
                show: _this.vaildData(self.option.xAxisSplitLineShow, false)
            },
            axisLabel: {
                interval: self.option.xAxisinterval ,
                rotate: self.option.xAxisRotate || 0,
                textStyle: {
                color: self.option.nameColor || _this.defaultsetting['COLOR'],
                fontSize: self.option.xNameFontSize || 14
                }
            }
        },
        yAxis: {
            type: self.option.category ? "category" : "value",
            name: self.option.yAxisName,
            nameGap: self.option.yAxisNameGap|| 15,
            nameRotate: self.option.yAxisNameRotate|| 0,
            nameTextStyle:{
                color: self.option.yAxisNameColor || undefined,
                align: self.option.yAxisNameAlign || 'center'
            },
            
            axisLabel: {
                textStyle: {
                color: self.option.nameColor || _this.defaultsetting['COLOR'],
                fontSize: self.option.yNameFontSize || 14
                }
            },
            axisLine: {
                show: self.option.yAxisLineShow,
                symbol: self.option.yAxisLineSymbol ? ['none','arrow']: 'none',
                lineStyle: {
                color: self.option.lineColor || _this.defaultsetting['COLOR']
                }
            },
            axisTick:{
                show: self.option.yAxisTickShow
            },
            inverse: _this.vaildData(self.option.yAxisInverse, false),
            show: _this.vaildData(self.option.yAxisShow, true),
            splitLine: {
                show: _this.vaildData(self.option.yAxisSplitLineShow, true)
            }
        },
        dataset: {
            // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用
            source: __valid_data__
        },
        series: (() => {
        const barColor = self.option.barColor || [];
        const list = (__valid_data__[0].slice(1) || []).map((ele, index) => {
            return Object.assign({}, {
            type: "bar",
            stack: self.option.stack || false,
            barWidth: self.option.barWidth || 16,
            barMinHeight: self.option.barMinHeight || 0,
            itemStyle: _this.ishasprop(!_this.switchTheme, {
                color: _this.getColor(index)
            }, {
                barBorderRadius: self.option.barRadius || 0,
                borderColor: self.option.borderColor|| undefined,
                borderWidth: self.option.borderWidth || 0,
                borderType: self.option.borderType || 'solid',
                shadowBlur: self.option.shadowBlur|| undefined,
                shadowColor: self.option.shadowColor|| undefined,
                shadowOffsetX: self.option.shadowOffsetX|| 0,
                shadowOffsetY: self.option.shadowOffsetY|| 0,
                opacity: self.option.itemStyleOpacity || 1
            }),
            label: {
                show: _this.vaildData(self.option.labelShow, false), //开启显示
                //position: self.option.category ? "right" : "top", //在上方显示,
                
                position: self.option.LabelPosition||"top",
                distance: self.option.LabelDistance,
                align: self.option.LabelAlign,
                verticalAlign: self.option.LabelVerticalAlign,
                rotate: self.option.LabelRotate,
                
                formatter: name => _this.getLabelFormatter(name),
                textStyle: {
                    //数值样式
                    fontSize: self.option.labelShowFontSize || 14,
                    color: self.option.labelShowColor || _this.defaultsetting['COLOR'],
                    fontWeight: self.option.labelShowFontWeight || 500,
                }
            }
            });
        });
        return list;
        })()
    };
    
    
    return option
}
function line_option (self,_this,__valid_data__) {
    const optionData = _this.deepClone(self.optionData);
    const option = {
      title: _this.ishasprop(self.option.titleShow, {
        text: self.option.title,
        subtext: self.option.subtext || '',
        textStyle: {
          color: self.option.titleColor || _this.defaultsetting['COLOR'],
          fontSize: self.option.titleFontSize || 16
        },
        left: self.option.titlePostion || 'auto',
        subtextStyle: {
          color: self.option.subTitleColor || _this.defaultsetting['COLOR'],
          fontSize: self.option.subTitleFontSize || 14
        }
      }, {}),
      tooltip: (() => {
        return Object.assign(
          (() => {
            if (_this.formatter) {
              return {
                formatter: name => {
                  return _this.formatter(name, self.optionData);
                }
              };
            }
            return {};
          })(), {
          backgroundColor:_this.defaultsetting['BACKGROUND-COLOR'],
          trigger: "axis",
          textStyle: {
            fontSize: self.option.tipFontSize,
            color: self.option.tipColor || _this.defaultsetting['COLOR']
          }
        }
        );
      })(),
      grid: {
        left: self.option.gridX || 20,
        top: self.option.gridY || 60,
        right: _this.x2,
        bottom: self.option.gridY2 || 60
      },
      legend: {
        show: _this.vaildData(self.option.legend, false),
        orient: self.option.legendOrient || "horizontal",
        x: self.option.legendPostion || "right",
        top: self.option.legendPostionTop || 0,
        right: _this.x2,
        textStyle: {
          color: self.option.legendTextColor || _this.defaultsetting['COLOR'],
          fontSize: self.option.legendFontSize || 12
        },
        data: (() => {
            return (__valid_data__[0].slice(1) || []).map((ele, index) => {
              return {
                name: ele,
                textStyle: _this.ishasprop(!self.switchTheme, {
                  color: _this.getColor(index, true)
                }, {})
              };
            });
          })()
      },
      xAxis: {
        type: self.option.category ? "value" : "category",
        name: self.option.xAxisName,
        axisLine: {
          show: true,
          symbol: self.option.xAxisLineSymbol ? ['none','arrow']: 'none',
          lineStyle: {
            color: self.option.lineColor || _this.defaultsetting['COLOR']
          }
        },
        
        inverse: _this.vaildData(self.option.xAxisInverse, false),
        show: _this.vaildData(self.option.xAxisShow, true),
        splitLine: {
          show: _this.vaildData(self.option.xAxisSplitLineShow, false)
        },
        axisLabel: {
          interval: self.option.xAxisinterval || 'auto',
          rotate: self.option.xAxisRotate || 0,
          textStyle: {
            color: self.option.nameColor || _this.defaultsetting['COLOR'],
            fontSize: self.option.xNameFontSize || 14
          }
        }
      },
      yAxis: {
        type: self.option.category ? "category" : "value",
        name: self.option.yAxisName,
        nameGap: self.option.yAxisNameGap|| 15,
        nameRotate: self.option.yAxisNameRotate|| 0,
        nameTextStyle:{
          color: self.option.yAxisNameColor || undefined,
          align: self.option.yAxisNameAlign || 'center'
        },
        
        axisLabel: {
          textStyle: {
            color: self.option.nameColor || _this.defaultsetting['COLOR'],
            fontSize: self.option.yNameFontSize || 14
          }
        },
        axisLine: {
          show: self.option.yAxisLineShow,
          symbol: self.option.yAxisLineSymbol ? ['none','arrow']: 'none',
          lineStyle: {
            color: self.option.lineColor || _this.defaultsetting['COLOR']
          }
        },
        axisTick:{
          show: self.option.yAxisTickShow
        },
        inverse: _this.vaildData(self.option.yAxisInverse, false),
        show: _this.vaildData(self.option.yAxisShow, true),
        splitLine: {
          show: _this.vaildData(self.option.yAxisSplitLineShow, true)
        }
    },
    dataset: {
        // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用
        source: __valid_data__
    },
    series: (() => {
        const list = (__valid_data__[0].slice(1) || []).map((ele, index) => {
          return Object.assign({}, {
            type: "line",
            smooth: _this.vaildData(self.option.smooth, true),
            symbolSize: self.option.symbolSize || 10,
            areaStyle: (() => {
              if (self.option.areaStyle) {
                return {
                  opacity: 0.7
                };
              }
            })(),
            lineStyle: {
              width: self.option.lineWidth || 1
            },
            itemStyle: (!_this.has_self_color())?undefined:_this.ishasprop(!_this.switchTheme, {
              color: _this.getColor(index)
            }, {}),
            label: {
              show: _this.vaildData(self.option.labelShow, false), //开启显示
              position: "top", //在上方显示,
              formatter: name => _this.getLabelFormatter(name),
              textStyle: {
                //数值样式
                fontSize: self.option.labelShowFontSize || 14,
                color: self.option.labelShowColor || _this.defaultsetting['COLOR'],
                fontWeight: self.option.labelShowFontWeight || 500
              }
            }
          });
        });
        return list;
      })()
    };
    
    
    return option
}
function pie_option (self,_this,__valid_data__) {
    const optionData = _this.deepClone(self.optionData) || [];
    const option = {
      title: _this.ishasprop(self.option.titleShow, {
        text: self.option.title,
        subtext: self.option.subtext || '',
        textStyle: {
          color: self.option.titleColor || _this.defaultsetting['COLOR'],
          fontSize: self.option.titleFontSize || 16
        },
        left: self.option.titlePostion || 'auto',
        subtextStyle: {
          color: self.option.subTitleColor || _this.defaultsetting['COLOR'],
          fontSize: self.option.subTitleFontSize || 14
        }
      }, {}),
      tooltip: (() => {
        return Object.assign(
          (() => {
            if (_this.formatter) {
              return {
                formatter: name => {
                  return _this.formatter(name, self.optionData);
                }
              };
            }
            return {};
          })(),
          {
            backgroundColor:_this.defaultsetting['BACKGROUND-COLOR'],
            textStyle: {
              fontSize: self.option.tipFontSize,
              color: self.option.tipColor || _this.defaultsetting['COLOR']
            }
          }
        );
      })(),
     
      legend: {
        show: _this.vaildData(self.option.legend, false),
        orient: self.option.legendOrient || "vertical",
        x: self.option.legendPostion || "left",
        top: self.option.legendPostionTop || 0,
        right: _this.x2,
        textStyle: {
          color: self.option.legendTextColor || 'inherit',
          fontSize: self.option.legendFontSize || 12,
        }
      },
        dataset: {
            // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用
            source: __valid_data__
        },
      series: (() => {
        const list = [
          {
            type: "pie",
            roseType: self.option.roseType ? "radius" : "",
            radius: self.option.radius ? ["40%", "55%"] : "50%",
            left: self.option.gridX || 20,
            top: self.option.gridY || 20,
            right: self.option.gridX2 || 20,
            bottom: self.option.gridY2 || 20,
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
            label: {
              normal: {
                show: _this.labelShow,
                formatter: self.option.labelFormatter?.trim()!=""?self.option.labelFormatter:'{b}:{d}%',
                fontSize: _this.fontSize,
                color: self.option.labelShowColor || "inherit",
                fontWeight: self.option.labelShowFontWeight
              }
            },
            //data: (() => {
            //  let list = optionData;
            //  if (self.option.notCount) {
            //    list = list.filter(ele => {
            //      if (ele.value !== 0 && ele.value) {
            //        return true;
            //      }
            //    });
            //  }
            //  if (self.option.sort) {
            //    list.sort(function (a, b) {
            //      return a.value - b.value;
            //    });
            //  }
            //  return list;
            //})(),
            itemStyle:(!_this.has_self_color())?undefined:
             _this.ishasprop(!_this.switchTheme, {
              color: params => _this.getColor(params.dataIndex)
            }, {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            })
          }
        ];
        return list;
      })()
    };
    
    
    return option
}
// 雷达
function radar_option (self,_this,__valid_data__) {
    const optionData = _this.deepClone(self.optionData);
    const option = {
      title: _this.ishasprop(self.option.titleShow, {
        text: self.option.title,
        subtext: self.option.subtext || '',
        textStyle: {
          color: self.option.titleColor || _this.defaultsetting['COLOR'],
          fontSize: self.option.titleFontSize || 16
        },
        left: self.option.titlePostion || 'auto',
        subtextStyle: {
          color: self.option.subTitleColor || _this.defaultsetting['COLOR'],
          fontSize: self.option.subTitleFontSize || 14
        }
      }, {}),
      tooltip: (() => {
        return Object.assign(
          (() => {
            if (_this.formatter) {
              return {
                formatter: name => {
                  return _this.formatter(name, self.optionData);
                }
              };
            }
            return {};
          })(),
          {
            backgroundColor: self.option.tipBackgroundColor || 'rgba(50,50,50,0.7)',
            textStyle: {
              fontSize: self.option.tipFontSize || 14,
              color: self.option.tipColor || "#fff"
            }
          }
        );
      })(),
      legend: {//雷达的legend是单系列的和其他不一样,不能合并
        show: _this.vaildData(self.option.legend, false),
        orient: self.option.legendOrient,
        x: self.option.legendPostion,
        top: self.option.legendPostionTop || 0,
        textStyle: {
          fontSize: self.option.legendFontSize
        },
        data: (() => {
          return (__valid_data__[0].slice(1) || []).filter(x=>x[0]!='max').map((ele, index) => {
            return {
              name: ele[0],
              textStyle: _this.ishasprop(!_this.switchTheme, {
                color: self.option.legendTextColor|| _this.getColor(index, true)
              }, {}),
              itemStyle: _this.ishasprop(!_this.switchTheme, {
                color: _this.getColor(index, true)
              }, {})
            };
          });
        })()
      },
      radar: {
        name: {
          fontSize: self.option.radarNameSize || 12,
          color: self.option.radarNameColor || _this.defaultsetting['COLOR']
        },
        indicator: self.data.indicator || 
            function(){
                let max_row=__valid_data__[0].slice(1).filter(x=>x[0]=="max")
                return (
                __valid_data__[0].slice(1).map((ele, index) => {
                    if(max_row.length>0){
                        return {
                            name:ele,
                            max:max_row[index+1],
                        }
                    }
                    else
                        return {
                            name:ele,
                            max:Enumerable.from(__valid_data__.slice(1)).select(x=>x[index+1]).max(),
                        }
                }) )
                
            }()
        ,
        shape: self.option.shape || 'polygon',
        radius: `${self.option.radius}%`,
      },
      series: (() => {
        const list = [
          {
            type: "radar",
            itemStyle: {
              color: self.option.nameColor
            },
            lineStyle: {
              color: self.option.lineColor
            },
            data: (() => {
              return (__valid_data__.slice(1) || []).filter(x=>x[0]!='max').map((ele, index) => {
                return {
                  name: ele[0],
                  value: ele.slice(1),
                  label: {
                    show: self.option.labelShow, //开启显示
                    fontSize: self.option.labelShowFontSize || 14,
                    color: self.option.labelShowColor || _this.getColor(index, true),
                    fontWeight: self.option.labelShowFontWeight || 'normal'
                  },
                  areaStyle: {
                    color: _this.getColor(index),
                    opacity: self.option.areaOpacity || 0.9,
                  }
                };
              });
            })()
          }
        ];
        return list;
      })()
    }
    
    
  
    return option
}
// 仪表盘
function gauge_option (self,_this,__valid_data__) {
  let end_line=(self.option.ds_line||1)
    const optionData = _this.real_data[ end_line - 1 ];
    const option = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
      series: [
        {
          name: "业务指标",
          type: "gauge",
          detail: {
            color: self.option.valueFontColor||_this.defaultsetting['COLOR'],
            fontSize: self.option.valueFontSize || 30,
            formatter: "{value}" + (optionData?.unit || '')
          },
          
          min: optionData?.min || 0,
          max: optionData?.max|| 100,
          axisLine: {
            lineStyle: {
              color: (() => {
                let list = [];
                (self.option.barColor || []).forEach(({postion, color1, color2}) => {
                  let color;
                  if (!color1) {
                    color1 = '#23B7E5'
                  }
                  if (!color2) {
                    color = color1
                  } else {
                    color = {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: color1
                      }, {
                        offset: 1,
                        color: color2
                      }],
                      global: false
                    }
                  }
                  list.push([postion||1, color]);
                });
                if (validatenull(list)) {
                  list = [
                    [0, 2, "#91c7ae"],
                    [0.8, "#638693"],
                    [1, "#c23531"]
                  ];
                }
                return list;
              })(),
              width: self.option.lineSize || 5
            }
          },
          colorBy:'data',
          axisLabel: {
            show: _this.vaildData(self.option.axisLabelShow, true),
            color: self.option.axisLabelFontColor|| _this.defaultsetting['COLOR'],
            fontSize: self.option.axisLabelFontSize || 25
          },
          axisTick: {
            lineStyle: {
              color: self.option.lineColor || _this.defaultsetting['COLOR']
            }
          },
          title: {
            show: _this.vaildData(self.option.nameShow, true),
            color: self.option.nameFontColor||_this.defaultsetting['COLOR'],
            fontSize: self.option.nameFontSize || 20
          },
          progress: {
            show: self.option.progress_show,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#464646'
            }
          },
          startAngle: self.option.progress_show?90:225,
          endAngle: self.option.progress_show?-270:-45, 
          pointer: {
              show: self.option.pointer_show==undefined?true:self.option.pointer_show,
              itemStyle: {
              color: 'auto'
              }
          },
          data: function(){
                let series_type=[]
                let cur_data=__valid_data__[end_line] ||['',0]
                //__valid_data__.slice(1).forEach(ele=>{
                    series_type.push({
                      value: optionData?.value||optionData?.data ||cur_data[1],
                      name: optionData?.name ||optionData?.label || cur_data[0]
                    })
                //}); 
                series_type=[]
                let start_pos=100/end_line
                __valid_data__.slice(1,1+ end_line).forEach((ele,idx)=>{
                    series_type.push({
                      value: ele[1],
                      name:  ele[0],
                      title: {
                        offsetCenter: ['0%', (idx*start_pos+10) +'%']
                      },
                      detail: {
                        valueAnimation: true,
                        offsetCenter: ['0%',(idx*start_pos -5) +'%']
                      }
                    })
                    start_pos=start_pos-20
                });
                return series_type
              }()
        },        
      ]
    };
    
    return option
  }
// 漏斗图  
function funnel_option (self,_this,__valid_data__) {
    const optionData = _this.deepClone(self.optionData);
    const option = {
    title: _this.ishasprop(self.option.titleShow, {
        text: self.option.title,
        subtext: self.option.subtext || '',
        textStyle: {
        color: self.option.titleColor || '#333',
        fontSize: self.option.titleFontSize || 16
        },
        left: self.option.titlePostion || 'auto',
        subtextStyle: {
        color: self.option.subTitleColor || '#aaa',
        fontSize: self.option.subTitleFontSize || 14
        }
    }, {}),
    tooltip: _this.ishasprop(_this.formatter, {
        formatter: name => { return _this.formatter(name, _this.dataChart) }
    }, {
        backgroundColor: self.option.tipBackgroundColor || 'rgba(50,50,50,0.7)',
        textStyle: {
        fontSize: self.option.tipFontSize,
        color: self.option.tipColor || "#fff"
        }
    }),
    legend: {
        show: _this.vaildData(self.option.legend, false),
        orient: self.option.legendOrient,
        x: self.option.legendPostion,
        top: self.option.legendPostionTop || 0,
        textStyle: {
        color: self.option.legendTextColor || '#aaa',
        fontSize: self.option.legendFontSize
        },
        data: (() => {
        return (__valid_data__[0]).map((ele, index) => {
            return {
            name: ele,
            textStyle: _this.ishasprop(!_this.switchTheme, {
                color: self.option.legendTextColor|| _this.getColor(index, true)
            }, {}),
            itemStyle: _this.ishasprop(!_this.switchTheme, {
                color: _this.getColor(index, true)
            }, {})
            };
        });
        })()
    },
    dataset: {
        // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用
        source: __valid_data__
    },
    series: (() => {
        const list = [
        {
            type: "funnel",
            label: {
            show: _this.vaildData(self.option.labelShow, false),
            fontSize: _this.fontSize,
            position: 'inside'
            },
            
            itemStyle: _this.ishasprop(!_this.switchTheme, {
            color: params => _this.getColor(params.dataIndex)
            }, {
            borderWidth: 0
            }),
            emphasis: {
            label: {
                fontSize: 20,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            },
            top: self.option.gridY,
            bottom: self.option.gridY2,
            left: self.option.gridX,
            right: self.option.gridX2
        }
        ];
        return list;
    })()
    };
    return option;
}
function map_option (self,_this,__valid_data__) {
    const convertData = function (data) {
        var res = [];
        for (var i = 1; i < data.length; i++) {
            var geoCoord = _this.geoCoordMap[data[i][0]];
            if (geoCoord) 
            { //{name: ele.name,value: [ele.lng, ele.lat, ele.value] }
            res.push({
                name: data[i][0],
                value: geoCoord.concat(data[i][1])
            });
            }
        }
        return res;
        };
    //$.ajaxSettings.async = false;
    function map_inner_exec(result) 
    {

        _this.geoCoordMap=JSON.parse(JSON.stringify(self.geoCoordMap)) 
        //$.ajaxSettings.async = true;
      
      //_this.clone_map_ottion=JSON.parse(JSON.stringify(self.option)) 
      let max = Enumerable.from(__valid_data__).max(x=>x[1])
      let min = Enumerable.from(__valid_data__).min(x=>x[1])
      let maxSize4Pin = self.option.maxSize4Pin ||10
      let minSize4Pin = self.option.minSize4Pin || 1;
      const option = {
        dataset: {
        // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用
            source: __valid_data__ 
        },
        title: _this.ishasprop(self.option.titleShow, {
            text: self.option.title,
            subtext: self.option.subtext || '',
            textStyle: {
                color: self.option.titleColor || '#333',
                fontSize: self.option.titleFontSize || 16
            },
            left: self.option.titlePostion || 'auto',
            subtextStyle: {
                color: self.option.subTitleColor || '#aaa',
                fontSize: self.option.subTitleFontSize || 14
            }
        }, {}),
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
            }
        },
        
        tooltip: (() => {
          return Object.assign(
              (() => {
                if (self.formatter) {
                  return {
                    formatter: name => {
                      return _this.formatter(name, self.dataChart);
                    }
                  };
                }
                return {};
              })(),
              {
                  formatter: '{b}<br/>{c}',
                    backgroundColor: self.option.tipBackgroundColor || _this.defaultsetting['BACKGROUND-COLOR'],
                    textStyle: {
                        fontSize: self.option.tipFontSize,
                        color: self.option.tipColor || _this.defaultsetting['COLOR']
                    }
              }
          );
        })(),
        geo: Object.assign(
            (() => {
              if (!_this.validatenull(self.centerData)) {
                return {
                  center: self.centerData
                };
              }
              return {};
            })(),
            {
              map: _this.real_map_url(),
              label: {
                emphasis: {
                  show: false
                }
              },
              zoom: self.option.zoom,
              layoutCenter: ["50%", "50%"],
              layoutSize: 1200,
              roam: self.option.roam,
              label: {
                show: true,
                fontSize: self.option.fontSize,
                color: self.option.color
              },
              left: self.option.gridX,
              top: self.option.gridY,
              right: self.option.gridX2,
              bottom: self.option.gridY2,
              emphasis: {
                label: {
                  color: self.option.empColor
                },
                itemStyle: {
                  areaColor: self.option.empAreaColor
                }
              },
              itemStyle: {
                borderWidth: self.option.borderWidth,
                borderColor: self.option.borderColor,
                areaColor: self.option.areaColor
              }
            }
        ),
        series: [
            {
                type: self.option.mapSerieType=="airBubble"?"effectScatter":self.option.mapSerieType,
                //mapType: self.option.mapSerieType=="map"?_this.real_map_url():undefined,   // 自定义扩展图表类型  airBubble 'effectScatter' },
                
                coordinateSystem: "geo",
                showEffectOn: "emphasis",
                rippleEffect: {
                    brushType: "fill",
                    scale: 4
                },
                geoIndex:0,
                symbolSize: self.option.fontSize,
                hoverAnimation: true,
                data:convertData(__valid_data__),
                label: {
                    show: false,
                    position: ["130%", "0"],
                    fontSize: self.option.fontSize,
                    color: self.option.color,
                    formatter: params => {
                        return params.name;
                    }
                },
                symbolSize: function(val) {
                    if(self.option.mapSerieType!="airBubble")
                        return maxSize4Pin
                    if (val[2] == 0) {
                        return 0;
                    }
                    return (
                        ((maxSize4Pin - minSize4Pin) / (max - min)) * val[2] +
                        (maxSize4Pin -
                            ((maxSize4Pin - minSize4Pin) / (max - min)) * max) *
                        1.2
                    );
                },
            }
        ]
      };
        option.visualMap={
            min: min,
            max: max,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
                symbol: self.option.symbol||'circle',
                color:  self.option.barColor.length>0?Enumerable.from(self.option.barColor).select(x=>x.color1).reverse().toArray()
                            :['lightskyblue', 'yellow', 'orangered'],
                symbolSize: [minSize4Pin,maxSize4Pin]
            }
        }
        if(self.option.mapSerieType=="map")
        {
            //delete option.geo
            option.dataset= {
            // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用
                source: __valid_data__ 
            }
            delete option.series[0].data
        }else  
        //if(self.option.mapSerieType!="map")
        {
            option.series[0].data=convertData(__valid_data__)          
        }
        //else
        //    delete option.series[0].data

        _this.myChart.off("mouseover");
        _this.myChart.off("mouseout");
        _this.myChart.off("georoam");

        _this.myChart.on("mouseover", () => {
            clearInterval(self.bannerCheck);
            //_this.resetBanner();
        });
        _this.myChart.on("mouseout", () => {
            _this.bannerCount = 0;
            //_this.setBanner();
        });
        _this.myChart.on("georoam", e => {
            const option = _this.myChart.getOption();
            const geo = option.geo[0];
            _this.centerData = geo.center;
            _this.zoomData = geo.zoom;
            if (_this.zoomData < 1) _this.zoomData = 1;
        });
        let _myChart=_this.myChart
        _this.myChart.setOption(option);
        eval("option=(function(option,myChart,_this){"+self.content+"\n return option})(option,_myChart,_this)")                    
        return option
    }
    if(window.echarts.getMap(_this.real_map_url()))
        return map_inner_exec()
    else
    {
        $.get(_this.real_map_url(),function(result){
            window.echarts.registerMap(_this.real_map_url(), result);
            let option=map_inner_exec()
            _this.myChart.setOption(option,true);
            _this.myChart.resize();
            _this.myChart.setOption(option, true);  
            
        })
        return {}
    }    
  }
</script>

<style>

</style>