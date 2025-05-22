<template>
  <div class="user-info">
    <el-row :span="24">
      <el-col :span="8">
        <basic-container>
          <div class="user-info__content">
            <img class="user-info__img"
                 :src="form.img"
                 alt="" />
            <p class="user-info__name">{{form.name}}</p>
            <router-link class="user-info__setting"
                         :to="{path:'/info/setting'}">个人设置</router-link>
            <p class="user-info__desc">{{form.ms}}</p>
            <div class="user-info__detail-desc">
              <p><i class="el-icon-message"></i><span>{{form.yx}}</span></p>
              <p><i class="el-icon-postcard"></i><span>{{form.gs}} · {{form.bm}} · {{form.zw}}</span></p>
              <p><i class="el-icon-location-information"></i><span>{{form.dz}}</span></p>
            </div>
            <div class="user-info__divider"></div>
            <h4>标签</h4>
            <div class="user-info__tags">
              <el-tag effect="plain"
                      v-for="(tag,index) in tags"
                      :key="index">
                {{tag}}
              </el-tag>
            </div>
          </div>
        </basic-container>
      </el-col>
      <el-col :span="16">
        <basic-container>
          <avue-tabs :option="option"
                     v-model="form"
                     @chang="handleChange"
                     @submit="handleSubmit"></avue-tabs>
        </basic-container>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import option from "@/const/user/info";
export default {
  data () {
    return {
      type: "info",
      option: option,
      tags: [
        ' 善解人意',
        '开朗乐观',
        '真诚热情',
        '心地善良',
        '谦恭有礼',
        '彬彬有礼',
        '虚怀若谷',
        '严于律己',
        '雍容大度',
        '热情洋溢',
        '从容自若',
        '诚挚',
        '温厚',
        '谦让',
        '勤恳',
        '耿直'
      ],
      form: {
        img: 'img/vip.png',
        username: "smallwei",
        name: "smallwei",
        ms: "保护头发，人人有责",
        yx: "123@qq.com",
        gs: '某某公司',
        bm: '某某部门',
        zw: '前端开发工程师',
        dz: '内蒙古',
        bq: [1, 2, 3, 4],
        oldpassword: 11111111,
        newpassword: 22222222,
        newpasswords: 22222222
      }
    };
  },
  created () {

  },
  methods: {
    handleSubmit () {
      this.$message({
        message: this.form,
        type: "success"
      });
    },
    handleChange (item) {
      this.type = item.prop;
    }
  }
};
</script>

<style lang="scss">
.user-info {
  .avue-tabs {
    padding: 0 10px;
  }
  .el-tabs__content {
    padding: 20px 0;
  }
  &__img {
    display: block;
    margin: 0 auto;
    border-radius: 100%;
    width: 100px;
    height: 100px;
  }
  &__name {
    text-align: center;
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 0;
    margin-top: 10px;
  }
  &__setting {
    margin-bottom: 12px;
    display: block;
    font-size: 12px;
    color: #409eff;
    text-align: center;
  }
  &__desc {
    text-align: center;
    width: 200px;
    margin: 0 auto;
  }
  &__detail-desc {
    margin-top: 50px;
    font-size: 14px;
    p {
      margin-bottom: 10px;
    }
    span {
      margin-left: 10px;
    }
  }
  &__divider {
    border-top: 1px dashed #e8e8e8;
    display: block;
    height: 0;
    width: 100%;
    margin: 24px 0;
    clear: both;
  }
  &__tags {
    .el-tag {
      margin: 0 5px 5px 0;
    }
  }
}
</style>
