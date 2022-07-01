<template>
<div   style="height:100%;width:100%;display: flex;flex-direction: row;"  >  
   <img v-if="!validatenull(self.option.inline_Image)" style="height: 100%;width: auto;" :src="self.option.inline_Image">
   <div   style="height:100%;width:100%;display: flex;flex-direction: column;"  >  
      <div :style="[prefixStyle]" v-if="getValByArray(item,'prefixText')">{{getValByArray(item,'prefixText')}}</div>

      <div style="height:100%;width:100%;" class="cr-flop__count" :class="'cr-flop__count-'+self.option.textAlign">
      
        <div  v-for="one in dataArr" :key="one" style="display: inline-block;" :style="styleName" >
            <avue-count-up :start='0' :end='one' ref="count"
            :decimals="self.option.decimals||0" :duration='self.option.duration||2'></avue-count-up>
        </div>  
        <div :style="[inline_suffixStyle]" v-if="getValByArray(item,'inline_suffixText')">{{getValByArray(item,'inline_suffixText')}}</div>  
      </div>
      <div :style="[suffixStyle]" v-if="getValByArray(item,'suffixText')">{{getValByArray(item,'suffixText')}}</div>
      </div>
  </div>
</template>

<script>
import mixins from "./mixins"
export default ({
  name: "flop",
  components: {  }, 
  mixins:[mixins,],
  props:['data'],  
  data () {
    return {
      orign_data:null,
      dataArr:[],
    };
  },
  mounted(){
    this.initData()
  },
  computed: {
    styleParentSize () {
      let obj = {
        boxSizing: 'border-box',
        display: 'inline-block',
        width: (100 / (this.self.option.span|| 1)) - 1 + '%'
      }
      if (this.self.option.splitx) {
        obj.paddingRight = this.setPx(this.self.option.splitx)
      }
      if (this.self.option.splity) {
        obj.paddingBottom = this.setPx(this.self.option.splity)
      }
      return obj
    },    
    prefixStyle () {
      //console.info(this.setPx(this.self.option.prefixSplitx))
      return {
        display: this.self.option.prefixInline ? 'inline-block' : 'block',
        textAlign: this.self.option.prefixTextAlign,
        marginBottom: this.setPx(this.self.option.prefixSplity),
        marginLeft: this.setPx(this.self.option.prefixSplitx),
        color: this.self.option.prefixColor || this.defaultsetting['COLOR'],
        fontSize: this.setPx(this.self.option.prefixFontSize || 24)
      };
    },
    suffixStyle () {
      return {
        display: this.self.option.suffixInline ? 'inline-block' : 'block',
        textAlign: this.self.option.suffixTextAlign,
        marginLeft: this.setPx(this.self.option.suffixSplitx),
        marginBottom: this.setPx(this.self.option.suffixSplity),
        color: this.self.option.suffixColor || this.defaultsetting['COLOR'],
        fontSize: this.setPx(this.self.option.suffixFontSize || 24),
        //'align-self': 'flex-end'
      };
    },
    inline_suffixStyle () {
      return {
        display: this.self.option.inline_suffixInline ? 'inline-block' : 'block',
        textAlign: this.self.option.inline_suffixTextAlign,
        marginLeft: this.setPx(this.self.option.inline_suffixSplitx),
        marginBottom: this.setPx(this.self.option.inline_suffixSplity),
        color: this.self.option.inline_suffixColor || this.defaultsetting['COLOR'],
        fontSize: this.setPx(this.self.option.inline_suffixFontSize || 24),
        'align-self': this.self.option.inline_suffixTextAlign??'flex-end'
      };
    },
    styleName () {
      return Object.assign(
        (() => {
          let obj = {}
          if (this.self.option.splitx) {
            obj.marginRight = this.setPx(this.self.option.splitx)
          }
          if (this.self.option.splity) {
            obj.marginBottom = this.setPx(this.self.option.splity)
          }
          if (this.self.option.type === 'img' && this.self.option.backgroundImage) {
            obj = Object.assign(obj, {
              backgroundImage: `url(${this.self.option.backgroundImage})`,
              backgroundSize: "100% 100%",
              "padding": "0 5px",
              "border-image-slice": "10 16 15 10 fill",
              'border-width': '10px 16px 15px 10px'
            })
          }
          return obj;
        })(),
        {
          textAlign: this.self.option.textAlign,
          backgroundColor: this.self.option.backgroundColor,
          color: this.self.option.color || this.defaultsetting['COLOR'],
          fontSize: this.setPx(this.self.option.fontSize || 64),
          fontWeight: this.self.option.fontWeight
        },
        (() => {
           if (this.self.option.type === "border") {
            return {
              borderColor: this.self.option.borderColor || "#fff",
              borderStyle: "solid",
              borderWidth: this.setPx(this.self.option.borderWidth),
              "padding": "0 5px",
              "border-image-slice": "10 16 15 10 fill",
              'border-width': '10px 16px 15px 10px',
              'border-style': 'solid'

            };
          }
        })()
      );
    }
  },
  watch: {
    data(val,oldVal){
      this.orign_data=val
        if(this.self.option.whole)
          this.dataArr=[val]
        else
          this.dataArr= Array.from(""+val)
    }
  },
  created () {

  },
  methods: { 
    initData(){
      this.orign_data=this.data
        if(this.self.option.whole)
          this.dataArr=[this.data]
        else
          this.dataArr= Array.from(""+this.data)
    },
    getValByArray (item, prop) {
      return this.isArray ? item[prop] : this.self.option[prop];
    }
  }
});
</script>

<style>

.cr-flop__count {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center
}

.cr-flop__count-right {
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end
}

.cr-flop__count-left {
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start
}
.cr-flop__item {
    font-family: Microsoft Yahei;
    font-size: 28px;
    font-weight: 400;
    color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block
}

.cr-flop__item--img {
    padding: 0 5px;
    border-image-slice: 10 16 15 10 fill;
    border-width: 10px 16px 15px 10px;
    border-style: solid
}

.cr-flop__item--none {
    padding: 0 !important;
    border-width: 0 !important;
    background-color: transparent !important
}
</style>
