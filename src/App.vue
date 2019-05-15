<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url("./style/font/PingFangBold.css");
@import url("./style/font/PingFangMedium.css");

html {
  margin: 0 auto;
  height: 100%;
  line-height: 1.5;
  @include font("PingFangMedium", $fontSize, #333);
}
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
a {
  color: #000;
}

*,
img {
  -webkit-tap-highlight-color: transparent;
  -ms-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
  -o-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  padding: 0;
  margin: 0;
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

/* 字体图标 */
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

<script>
export default {
  name: "App",
  mounted() {
    // 注册登录
    // this.$router.push("/login/register");
    // this.$router.push("/login/index");
    // this.$router.push("/search");

    // 个人中心
    // this.$router.push("/personal/index");
    // this.$router.push("/personal/set/index");
    // this.$router.push("/personal/set/info");
    // this.$router.push("/personal/set/bind");
    // this.$router.push("/personal/set/list");
    // this.$router.push("/personal/set/address");
    // this.$router.push("/personal/set/safe");

    // 品牌商城
    // this.$router.push("/brand/index");

    // 品牌商城
    this.$router.push("/brand/mall");
    // this.$router.push("/brand/detail/book");
    // this.$router.push("/brand/detail/article");

    // 评价
    // this.$router.push("/personal/order/comment/index");

    // 我的评论
    // this.$router.push("/personal/help/feedback");
    // this.$router.push("/personal/help/index");

    // 我的购买

    // this.$router.push("/personal/order/list");

    // this.$router.push("/personal/order/invoice");


    // 专辑
    this.$router.push("/album/index");

  }
};
</script>
