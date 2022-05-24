<template>
  <div style="height:100%;width:100%;display: flex;align-items: center;justify-content: center;" :style="styleName" ref="main" @click="handleClick">
   {{nowDate}} 
  </div>
</template>

<script>
import mixins from "./mixins"
import { validatenull } from '@/util/validate'
export default {
  name: "datetime",
  mixins:[mixins],
  data () {
    return {
      date: new Date(),
      weekFormat:{
        0: "日",
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六"
      }
    };
  },
  computed: {
    nowDate () {
      if (this.self.option.format === "day") {
        return "星期" + this.weekFormat[this.date.getDay()]
      }
      const format = (this.self.option.format || "yyyy年MM月dd日 hh时mm分ss秒");
      return this.date.format(format);
    },
    styleName () {
        console.info(this.self.option)
      return {
        width: "100%",
        height: "100%",
        textAlign: this.self.option.textAlign,
        letterSpacing: this.setPx(this.self.option.split),
        textIndent: this.setPx(this.self.option.split),
        backgroundColor: this.self.option.backgroundColor,
        fontWeight: this.self.option.fontWeight || "normal",
        fontSize: (this.self.option.fontSize || 16) + "px",
        color: this.self.option.color || this.defaultsetting['COLOR']
      };
    }
  },
  created () {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    handleClick () {
      this.clickFormatter && this.clickFormatter({
        data: this.dataChart
      }, this.getItemRefs());
    }
  }
}
</script>


