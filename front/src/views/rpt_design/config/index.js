import Custom from './custom.vue'
import Input from './input.vue'
import Textarea from './textarea.vue'
import Number from './number.vue'
import Dynamic from './dynamic.vue'
import Switch from './switch.vue'
import Rate from './rate.vue'
import Slider from './slider.vue'
import Color from './color.vue'
import Select from './select.vue'
import Tree from './tree.vue'
import Date from './date.vue'
import Upload from './upload.vue'
import UEditor from './ueditor.vue'
import Map from './map.vue'
import Group from './group.vue'
import Array from './array.vue'
import Title from './title.vue'
import cr_htmltext from './cr_htmltext.vue'
import cr_echarts from './cr_echarts.vue'
import cr_report from './cr_report.vue'
import cr_text from './cr_text.vue'
import cr_span from './cr_span.vue'
import codemirror from "../element/vue-codemirror.vue";

const components = [
  Custom,cr_htmltext,cr_echarts,cr_report,cr_text,cr_span,
  codemirror,
  Input,
  Textarea,
  Number,
  Dynamic,
  Switch,
  Rate,
  Slider,
  Color,
  Select,
  Tree,
  Date,
  UEditor,
  Upload,
  Map,
  Group,
  Array,
  Title,

]

const Config = {
  install (Vue) {
    if (this.installed) return
    this.installed = true

    components.map(component => {
      Vue.component(component.name, component);
    })
  }
}

export default Config
