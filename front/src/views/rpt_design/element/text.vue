<template>
  <div style="height:100%;width:100%"
       ref="main" 
       @click="handleClick">
    <div ref="box" style="height:100%;width:100%">
      <template v-if="$slots.default">
        <div style="height:100%;width:100%" :style="[styleName,styleSizeName]">
        <slot></slot>
      </div> 
      </template>
      <template v-else>
      <a ref="text"
         v-if="self.titleOption.link"
         :href="linkHref"
         :style="[styleName,styleSizeName]"
         :target="linkTarget">{{self.label}}</a>
      <span v-else :style="[styleName,styleSizeName]">
        {{self.label}}
      </span>
      </template>
    </div>

  </div>
</template>

<script>
import { RuntimeTemplateCompiler } from 'vue-runtime-template-compiler'
import mixins from "./mixins"
import dyncTemplateMinxins from "./dyncTemplateMinxins"
import { validatenull } from '@/util/validate'
/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */

const ELEMENT = '__';
const MODS = '--';

const join = (name, el, symbol) => el ? name + symbol + el : name;

const prefix = (name, mods) => {
  if (typeof mods === 'string') {
    return join(name, mods, MODS);
  }

  if (Array.isArray(mods)) {
    return mods.map(item => prefix(name, item));
  }

  const ret = {};
  Object.keys(mods || {}).forEach(key => {
    ret[name + MODS + key] = mods[key];
  });
  return ret;
};
export default ({
  name: "text",
  components: { RuntimeTemplateCompiler }, 
  mixins:[mixins,dyncTemplateMinxins],
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },  
  data () {
    return {
      check: "",
      date: new Date(),
      left: 0,     
    };
  },
  mounted(){
    
  },
  computed: {
      "self.option.value"(){
        return this.self.label
      },
    width(){
      return this.$el.clientWidth
    },
    scroll () {
      return this.vaildData(this.self.titleOption.scroll, false);
    },
    linkHref () {
      return this.self.titleOption.linkHref || "#";
    },
    linkTarget () {
      return this.self.titleOption.linkTarget || "_self";
    },
    step () {
      return this.self.titleOption.step || 1;
    },
    reverse(){
      return this.self.titleOption.scrollReverse;
    },
    speed () {
      return this.self.titleOption.speed || 100;
    },
    lineHeight () {
      return this.self.titleOption.lineHeight;
    },
    fontSize () {
      return this.self.titleOption.fontSize || 30;
    },
    split () {
      return this.self.titleOption.split;
    },
    textAlign(){
      return this.self.titleOption.textAlign;
    },
    textWidth () {
      const textLen = (this.self.value || '').length;
      return textLen * this.fontSize;
    },
    styleName () {
      if(this.self.titleOption.gradient){
        return {
          // width: this.scroll ? this.setPx(this.textWidth) : 'auto',
          transform: "translateX(" + this.left + "px)",
          textAlign: this.self.titleOption.textAlign,
          letterSpacing: this.setPx(this.split),
          textIndent: this.setPx(this.split),
          fontWeight: this.self.titleOption.fontWeight || "normal",
          fontSize: this.fontSize + "px",
          fontFamily: this.self.titleOption.fontFamily || "",
          textShadow: (this.self.titleOption.textShadowX ||1)+ "1px" +" "+(this.self.titleOption.textShadowY|| 1)+ "px" +" "+(this.self.titleOption.textShadowZ|| 1)+"px"+" " +this.self.titleOption.textShadowColor || this.self.titleOption.color,
          lineHeight: this.lineHeight? (this.lineHeight + "px") : (this.fontSize + "px") ,
          "background-image": this.self.titleOption.gradientType==='linear'? 'linear-gradient('+ this.self.titleOption.gradientLinear+')' : 'radial-gradient('+this.self.titleOption.gradientRadial+')',
          color: "transparent",
          "margin-left":this.self.titleOption.margin_left,
          display:"block",
          "-webkit-background-clip": "text",
        };
      }
      return {
        // width: this.scroll ? this.setPx(this.textWidth) : 'auto',
        transform: "translateX(" + this.left + "px)",
        textAlign: this.self.titleOption.textAlign,
        letterSpacing: this.setPx(this.split),
        textIndent: this.setPx(this.split),
        backgroundColor: this.self.titleOption.backgroundColor,
        fontWeight: this.self.titleOption.fontWeight || "normal",
        fontSize: this.fontSize + "px",
        fontFamily: this.self.titleOption.fontFamily || "",
        textShadow: (this.self.titleOption.textShadowX+"px" || "0px") +" "+(this.self.titleOption.textShadowY+"px" || "0px")+" "+(this.self.titleOption.textShadowZ+"px" || "0px")+" " +this.self.titleOption.textShadowColor || this.self.titleOption.color,
        lineHeight: this.lineHeight? (this.lineHeight + "px") : (this.fontSize + "px") ,
        color: this.self.titleOption.color || this.defaultsetting['COLOR'],
        "margin-left":this.setPx(this.self.titleOption.margin_left),
        display:"block",
      };
    }
  },
  watch: {
    scroll () {
      this.move();
    },
    speed () {
      this.move();
    }
  },
  created () {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  },
  mounted () {
    this.move();
  },
  methods: {
    b (el, mods) {
      const { name } = this.$options;

      if (el && typeof el !== 'string') {
        mods = el;
        el = '';
      }
      el = join(name, el, ELEMENT);

      return mods ? [el, prefix(el, mods)] : el;
    },

    handleClick () {
      //this.updateClick({
      //  value: this.self.value
      //});
      this.clickFormatter && this.clickFormatter({
        data: this.self
      }, this.getItemRefs());
    },
    move () {
      clearInterval(this.check);
      if (this.scroll) {
        this.check = setInterval(() => {
          if(!this.reverse){
            if (this.left < -this.getLeftMax()) {
              this.left = this.getRightMax(); //设置到右边，重新开始滚动
            }
            this.left = this.left - this.step;
          }else{
            if (this.left > this.getRightMax()) {
              this.left = -this.getLeftMax(); //设置到右边，重新开始滚动
            }
            this.left = this.left + this.step;
          }

        }, this.speed);
      } else {
        this.left = 0;
      }
    },
    // 获取左侧到什么时候停止跑马灯
    getLeftMax(){
      if(this.textAlign === 'center'){
        return (this.width+this.textWidth) /2
      }
      if(this.textAlign === 'left'){
        return this.textWidth
      }
      return this.width
    },
    getRightMax(){
      if(this.textAlign === 'center'){
        return (this.width+this.textWidth) /2
      }
      if(this.textAlign === 'left'){
        return this.width
      }
      return this.textWidth
    }
  }
});
</script>


