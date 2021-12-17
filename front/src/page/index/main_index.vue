<template>
  <div class="avue-contail"
       :class="{'avue--collapse':isCollapse}">
    <!-- <screenshot></screenshot> -->
    <div class="avue-header">
      <!-- 顶部导航栏 -->
      <top ref="top" />
    </div>

    <div class="avue-layout">
      <div class="avue-left">
        <!-- 左侧导航栏 -->
        <treemenu v-if="isEditMenu>0" />
        <sidebar v-else/>
      </div>
      <div class="avue-main"
           :class="{'avue-main--fullscreen':!isMenu}">
        <!-- 顶部标签卡 -->
        <tags />
        <transition name="fade-scale">
          <search class="avue-view"
                  v-show="isSearch"></search>
        </transition>
        <!-- 主体视图层 -->
        <div style="height:100%;overflow-y:auto;overflow-x:hidden;"
             id="avue-view"
             v-show="!isSearch">
          <keep-alive>
            <router-view class="avue-view"
                         v-if="$route.meta.keepAlive" />
          </keep-alive>
          <router-view class="avue-view"
                       v-if="!$route.meta.keepAlive" />
        </div>
      </div>
    </div>
    <!-- <el-footer class="avue-footer">
      <img src="/svg/logo.svg"
           alt=""
           class="logo">
      <p class="copyright">© 2018 Avue designed by smallwei</p>
    </el-footer> -->
    <div class="avue-shade"
         @click="showCollapse"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import screenshot from './screenshot';
import search from "./search";
import top from "./top/";
import sidebar from "./sidebar/";
import treemenu from "../treeMenu/treeMenu";
import admin from "@/util/admin";
import { validatenull } from "@/util/validate";
import { calcDate } from "@/util/date.js";
import { getStore } from "@/util/store.js";
import { resetRouter } from '@/router/router'
export default {
  components: {
    top,
    tags,
    search,
    sidebar,
    screenshot,treemenu
  },
  name: "main_index",
  provide () {
    return {
      index: this
    };
  },
  data () {
    return {
      //搜索控制
      isSearch: false,
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: "",
      isEditMenu:0
    };
  },
  created () {
    //实时检测刷新token
    this.refreshToken();
  },
  mounted () {
    this.init();
  },
  computed: mapGetters(["isMenu", "isLock", "isCollapse", "website", "menu","menuAll"]),
  props: [],
  methods: {
    showCollapse () {
      this.$store.commit("SET_COLLAPSE");
    },
    // 屏幕检测
    init () {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    //打开菜单
    async openMenu (item = {}) 
    {
      if(["{}","[]"].includes(JSON.stringify(item)))
      {
        const res=await this.$store.dispatch("GetTopMenu")
        item=res[0]
      }
      this.$store.commit('SET_MENUID', item);
      if(item.hasOwnProperty('meta') && item.meta.hasOwnProperty("edit"))
      {
        if(item.meta.edit==true)
          this.isEditMenu= 2
          else
          this.isEditMenu= 1
      }
      else
        this.isEditMenu= 0
 
      this.$store.dispatch("GetMenu", item.parentId).then(data => {
        if (data.length !== 0) {
          resetRouter()
          this.$router.$avueRouter.formatRoutes(data, true);
        }
        //当点击顶部菜单做的事件
        if (!this.validatenull(item)) {
          let itemActive = {},
            childItemActive = 0;
          //vue-router路由
          if (item.path) {
            itemActive = item;
          } else {
            if (this.menu[childItemActive].length == 0) {
              itemActive = this.menu[childItemActive];
            } else {
              itemActive = this.menu[childItemActive].children[childItemActive];
            }
          }
          this.$store.commit('SET_MENUID', item);
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: itemActive.label,
              src: itemActive.path
            }, itemActive.meta)
          });
        }

      });
    },
    // 1分钟检测一次token
    refreshToken () {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: "token",
          debug: true
        }) || {};
        const date = calcDate(token.datetime, new Date().getTime());
        if (validatenull(date)) return;
        if (date.seconds >= this.website.tokenTime && !this.refreshLock) {
          this.refreshLock = true;
          this.$store.dispatch("RefreshToken")
          .then(() => {
              this.refreshLock = false;
            })
            .catch(() => {
              this.refreshLock = false;
            });
        }
      }, 2000);//2分钟执行一次检查
    }
  }
};
</script>