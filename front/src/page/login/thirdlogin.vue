<template>
  <div class="social-container">
    <div class="box"
         @click="handleClick('wechat')">
      <span class="container"
            :style="{backgroundColor:'#6ba2d6'}">
        <i icon-class="wechat"
           class="iconfont icon-weixin"></i>
      </span>
      <p class="title">{{$t('login.wechat')}}</p>
    </div>
    <div class="box"
         @click="handleClick('tencent')">
      <span class="container"
            :style="{backgroundColor:'#8dc349'}">
        <i icon-class="qq"
           class="iconfont icon-qq"></i>
      </span>
      <p class="title">{{$t('login.qq')}}</p>
    </div>
  </div>
</template>

<script>
import { openWindow } from "@/util/util";

export default {
  name: "thirdLogin",
  methods: {
    handleClick(thirdpart) {
      let appid, client_id, redirect_uri, url;
      redirect_uri = encodeURIComponent(
        window.location.origin + "/#/authredirect"
      );
      if (thirdpart === "wechat") {
        appid = "xxxx";
        url =
          "https://open.weixin.qq.com/connect/qrconnect?appid=" +
          appid +
          "&redirect_uri=" +
          redirect_uri +
          "&state=WX&response_type=code&scope=snsapi_login#wechat_redirect";
      } else if (thirdpart === "tencent") {
        client_id = "xxxx";
        url =
          "https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ&client_id=" +
          client_id +
          "&redirect_uri=" +
          redirect_uri;
      }
      openWindow(url, thirdpart, 540, 540);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.social-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .box {
    cursor: pointer;
  }
  .iconfont {
    color: #fff;
    font-size: 30px;
  }
  .container {
    $height: 50px;
    display: inline-block;
    width: $height;
    height: $height;
    line-height: $height;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .title {
    text-align: center;
  }
}
</style>
