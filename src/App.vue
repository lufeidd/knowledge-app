<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url("./style/font/PingFangBold.css");
@import url("./style/font/PingFangMedium.css");

html {
  max-width: 750px;
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

* {
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
    // this.$router.push("/personal/set/cancel");
    // this.$router.push("/personal/comment/index");
    // this.$router.push("/personal/remain/record");
    // this.$router.push("/loginBF");
    this.$router.push("/search");
    // this.$router.push("/login/register");
    // this.$router.push("/personal/index");
  }
};
</script>
