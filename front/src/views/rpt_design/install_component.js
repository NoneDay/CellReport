import WidgetFormGroup from './element/WidgetFormGroup'
import WidgetFormItem from './element/WidgetFormItem'
import WidgetFormTabs from './element/WidgetFormTabs'
import WidgetFormContainer from './element/WidgetFormContainer'
import testdiv from './element/testdiv'
import gridLayoutForm from './gridLayoutForm'
import echarts from './element/echarts'
import htmlText from './element/HtmlText'
import luckySheetProxy from './element/luckySheetProxy'
import dyncTemplate from './element/dyncTemplate'
import eleGrid from './element/eleGrid'
import {deepClone} from './utils/util'
export default {
  install (Vue) {
    Vue.prototype.deepClone = deepClone;
    Vue.component('WidgetFormItem' , WidgetFormItem);
    Vue.component('WidgetFormGroup', WidgetFormGroup);
    Vue.component('WidgetFormTabs', WidgetFormTabs);
    Vue.component('WidgetFormContainer', WidgetFormContainer);
    Vue.component('testdiv', testdiv);
    Vue.component('gridLayoutForm', gridLayoutForm);
    Vue.component('echarts', echarts);
    Vue.component('htmlText', htmlText);
    Vue.component('dyncTemplate', dyncTemplate);    
    Vue.component('luckySheetProxy', luckySheetProxy);
    Vue.component('eleGrid', eleGrid);
  }
}
