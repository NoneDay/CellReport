<template>
  <span class="screenshot">
    <el-tooltip class="item"
                effect="dark"
                :content="$t('feedback')"
                placement="left">
      <el-button @click="handleOk"
                 type="primary"
                 icon="el-icon-camera"
                 circle></el-button>
    </el-tooltip>
    <el-dialog modal-append-to-body
               append-to-body
               :title="$t('feedback')"
               top="50px"
               :visible.sync="box"
               width="60%">
      <el-input type="textarea"
                placeholder="请告诉我们遇到的问题或建议"
                v-model="form.text"></el-input>
      <div v-loading="flag"
           element-loading-text="正在截取屏幕数据"
           class="screenshot__img">
        <img :src="form.img"
             width="100%" />
      </div>
      <div slot="footer"
           class="screenshot__menu">
        <el-button type="primary"
                   icon="el-icon-check"
                   @click="handleSubmit">{{$t('submit')}}</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
export default {
  data () {
    return {
      box: false,
      form: {
        img: '',
        text: ''
      }
    }
  },
  computed: {
    flag () {
      return this.validatenull(this.form.img);
    }
  },
  methods: {
    handleSubmit () {
      this.box = false;
      this.$message.success('反馈提交成功')
    },
    handleOk () {
      this.form = {
        img: '',
        text: ''
      }
      this.$Screenshot(document.querySelector("#app")).then(canvas => {
        this.form.img = canvas.toDataURL("image/jpeg", 0.8);
      });
      this.box = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.screenshot {
  position: fixed;
  bottom: 50px;
  right: 20px;
  z-index: 2048;
  &__img {
    min-height: 200px;
    margin-top: 50px;
    padding: 10px 20px;
    box-sizing: border-box;
    border: 1px solid #eee;
    width: 100%;
  }
  &__menu {
    text-align: center;
  }
}
</style>