import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import { getStore } from '@/util/store'
import avue_zhLocale from '../../public/cdn/avue/2.10.4/locale/lang/zh'
import avue_enLocale from '../../public/cdn/avue/2.10.4/locale/lang/en'
var Avue = window.AVUE;
Vue.use(VueI18n)
const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
    ...Avue.locale.en,
    ...avue_enLocale,
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...Avue.locale.zh,
    ...avue_zhLocale
  }
}

const i18n = new VueI18n({
  locale: getStore({ name: 'language' }) || 'zh',
  messages
})

export default i18n