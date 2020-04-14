<template>
  <div id="app">
    <!-- 需要微信端打开，引导微信内打开 -->
    <!-- 引导app端打开 -->
    <template class="nullBox" v-if="nullPage == 1 || nullPage == 2">
      <img src="./assets/null/link.png" width="100%" />
      <div>{{ msg }}</div>
      <EazyNav type="brand" :isShow="true"></EazyNav>
    </template>
    <template v-else>
      <Download></Download>
      <!-- 页面缓存, $route.meta.keepAlive默认false -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </template>
  </div>
</template>

<style lang="scss" src="@/style/scss/app.scss">
</style>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  /* padding-top: env(safe-area-inset-top);  */
  /* 为导航栏+状态栏的高度 88px */
  /* padding-left: env(safe-area-inset-left);  */
  /* 如果未竖屏时为0 */
  /* padding-right: env(safe-area-inset-right);  */
  /* 如果未竖屏时为0 */
  /* padding-bottom: env(safe-area-inset-bottom);  */
  /* 为底下圆弧的高度 34px */
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
::-ms-scrollbar {
  width: 0;
  height: 0;
}
::scrollbar[orient="vertical"] {
  min-width: 0 !important;
}
/* 滚动条的滑轨背景颜色 */
::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}
/* 滑块颜色 */
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
}
/* 滑轨两头的监听按钮颜色 */
::-webkit-scrollbar-button {
  height: 0;
  background-color: rgba(0, 0, 0, 0.05);
}
/* 横向滚动条和纵向滚动条相交处尖角的颜色 */
::-webkit-scrollbar-corner {
  background-color: black;
}

/*设置input placeholder颜色*/
::-webkit-input-placeholder,
::-webkit-textarea-placeholder {
  font-size: 13px;
  color: #999;
}

:-moz-placeholder {
  font-size: 13px;
  color: #999;
}

:-ms-input-placeholder,
:-ms-textarea-placeholder {
  font-size: 13px;
  color: #999;
}
</style>
<script>
import axios from "axios";
// 微信分享，引入sdk
import wx from "weixin-js-sdk";
export default {
  name: "App",
  data() {
    return {
      nullPage: this.$route.query.nullPage ? this.$route.query.nullPage : 0,
      msg: ""
    };
  },
  mounted() {
    if (this.$route.query.nullPage == 1) this.msg = "请在微信端打开~";
    if (this.$route.query.nullPage == 2) this.msg = "请在app端打开~";
    // 获取适配信息，并微信授权
    this.$setLoginData();
  }
};
</script>
