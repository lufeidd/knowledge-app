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

/*设置input placeholder颜色*/
::-webkit-input-placeholder,
::-webkit-textarea-placeholder {
  font-size: 15px;
  color: #999;
}

:-moz-placeholder {
  font-size: 15px;
  color: #999;
}

:-ms-input-placeholder,
:-ms-textarea-placeholder {
  font-size: 15px;
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
    // this.$router.push("/login/password");

    // 个人中心
    // this.$router.push("/personal/index");

    // 品牌商城
    // this.$router.push("/brand/mall");

    // 评价
    // this.$router.push("/personal/order/comment/index");

    // 我的评论
    // this.$router.push("/personal/comment/index");

    // 我的购买
    // this.$router.push("/personal/order/list");

    // 专辑
    this.$router.push("/album/index");
  }
};
</script>
