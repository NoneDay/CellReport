import Config from './config'
import FormDesign from './design_index.vue'
import install_component from './install_component'

export default {
  install (Vue) {
    Vue.use(Config)
    Vue.use(install_component)
    Vue.component('CellReport' + FormDesign.name, FormDesign);
  }
}
