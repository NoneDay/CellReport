import WidgetFormGroup from './element/WidgetFormGroup'
import WidgetFormItem from './element/WidgetFormItem'
import WidgetFormTabs from './element/WidgetFormTabs'
import WidgetFormRowSpan from './element/WidgetFormRowSpan'

import WidgetFormContainer from './element/WidgetFormContainer'
import gridLayoutForm from './gridLayoutForm'
import echarts from './element/echarts'
import htmlText from './element/HtmlText'
import luckySheetProxy from './element/luckySheetProxy'
import dyncTemplate from './element/dyncTemplate'
import eleGrid from './element/eleGrid'
import text from './element/text'
import datetime from './element/datetime'
import flop from './element/flop'
import dyncDialog from './element/dyncDialog'
import {deepClone} from './utils/util'
export default {
  install (Vue) {
    Vue.prototype.deepClone = deepClone;
    Vue.component('WidgetFormItem' , WidgetFormItem);
    Vue.component('WidgetFormGroup', WidgetFormGroup);
    Vue.component('WidgetFormTabs', WidgetFormTabs);
    Vue.component('WidgetFormRowSpan', WidgetFormRowSpan);
    
    Vue.component('WidgetFormContainer', WidgetFormContainer);
    Vue.component('gridLayoutForm', gridLayoutForm);
    
    Vue.component('echarts', echarts);
    Vue.component('htmlText', htmlText);
    Vue.component('eleText', text);
    Vue.component('eleDateTime', datetime);
    Vue.component('eleFlop', flop);
    Vue.component('dyncTemplate', dyncTemplate);    
    Vue.component('luckySheetProxy', luckySheetProxy);
    Vue.component('eleGrid', eleGrid);
    Vue.component('dyncDialog', dyncDialog);
  }
}
