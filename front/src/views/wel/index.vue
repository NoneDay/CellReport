<template>
  <div v-if="cr.home" style="height: 100%;width: 100%;">
    <iframe :src="cr.home" style="height: 100%;width: 100%;"></iframe>
  </div>
  <div v-else>
    <div class="wel__header">
      <div class="wel__info">
        <img :src="userInfo.avatar"
             alt=""
             class="wel__info-img">
        
        <div class="wel__info-content">
          <div class="wel__info-title">
            {{$t('wel.info')}}
          </div>
          <div class="wel__info-subtitle">
            {{$t('wel.dept')}}
          </div>
        </div>
      </div>
      <div class="wel__extra">
        <div class="wel__extra-item">
          <p class="wel__extra-title">
            {{ $t('wel.count')}}
          </p>
          <p class="wel__extra-subtitle">
            56
          </p>
        </div>
        <div class="wel__extra-item">
          <p class="wel__extra-title">
            {{ $t('wel.team')}}
          </p>
          <p class="wel__extra-subtitle">
            8 <span>/ 24</span>
          </p>
        </div>
        <div class="wel__extra-item">
          <p class="wel__extra-title">

            {{ $t('wel.project')}}
          </p>
          <p class="wel__extra-subtitle">
            2,223
          </p>
        </div>
      </div>
    </div>
    <basic-container>
      <avue-data-box :option="option1"></avue-data-box>
    </basic-container>

    <basic-container>
      捐赠支持人donator：
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "wel",
  data () {
    return {
      data: [
        
      ]
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    cr(){ 
      return window.cellreport;
     },
    option1 () {
      return {
        span: 6,
        data: [
          {
            title: "推送数",
            count: 12332,
            icon: "el-icon-warning",
            color: "rgb(49, 180, 141)",
            
            
          },
          {
            title: "战报数",
            count: 33,
            icon: "el-icon-view",
            color: "rgb(56, 161, 242)",
            
            
          },
          {
            title: "API推送数",
            count: 2223,
            icon: "el-icon-setting",
            color: "rgb(117, 56, 199)",
            
            
          },
          {
            title: "使用人数",
            count: 2223,
            icon: "el-icon-setting",
            color: "rgb(230, 71, 88)",
            
            
          }
        ]
      };
    },
    option () {
      return {
        span: 8,
        data: [
          {
            title: this.$t("wel.data.column1"),
            subtitle: this.$t("wel.data.subtitle"),
            count: 7993,
            allcount: 10222,
            text: this.$t("wel.data.text1"),
            color: "rgb(27, 201, 142)",
            key: this.$t("wel.data.key1")
          },
          {
            title: this.$t("wel.data.column2"),
            subtitle: this.$t("wel.data.subtitle"),
            count: 3112,
            allcount: 10222,
            text: this.$t("wel.data.text2"),
            color: "rgb(230, 71, 88)",
            key: this.$t("wel.data.key2")
          },
          {
            title: this.$t("wel.data.column3"),
            subtitle: this.$t("wel.data.subtitle"),
            count: 908,
            allcount: 10222,
            text: this.$t("wel.data.text3"),
            color: "rgb(56, 161, 242)",
            key: this.$t("wel.data.key3")
          }
        ]
      };
    },

  },
  created () { },
  methods: {}
};
</script>

<style scoped="scoped" lang="scss">
.wel {
  &__header {
    padding: 25px 40px;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__info {
    display: flex;
    align-items: center;
    &-img {
      border-radius: 72px;
      display: block;
      width: 72px;
      height: 72px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    &-content {
      position: relative;
      margin-left: 24px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
    &-title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
    }
    &-subtitle {
      position: relative;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
  }
  &__extra {
    &-item {
      position: relative;
      padding: 0 32px;
      display: inline-block;
      &:last-child {
        &::after {
          display: none;
        }
      }
      &:after {
        background-color: #e8e8e8;
        position: absolute;
        top: 30px;
        right: 0;
        width: 1px;
        height: 40px;
        content: "";
      }
    }
    &-title {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 4px;
    }
    &-subtitle {
      color: rgba(0, 0, 0, 0.85);
      font-size: 30px;
      line-height: 38px;
      margin: 0;
      span {
        color: rgba(0, 0, 0, 0.45);
        font-size: 20px;
      }
    }
  }
}
</style>
