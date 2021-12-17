import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import { getStore } from '@/util/store'
import CronInput_zhLocale from 'vue-cron-generator/src/locale/zh-CN'
import CronInput_enLocale from 'vue-cron-generator/src/locale/en-US'

var Avue = window.AVUE;
Vue.use(VueI18n)
const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
    ...Avue.locale.en,
    ...CronInput_enLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...Avue.locale.zh,
    ...CronInput_zhLocale
  }
}

const i18n = new VueI18n({
  locale: getStore({ name: 'language' }) || 'zh',
  messages
})

export default i18n