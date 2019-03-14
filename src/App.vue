<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import url("./style/font/PingFangBold.css");
@import url("./style/iconfont/iconfont.css");
html {
  font-family: "PingFangBold";
  max-width: 750px;
  margin: 0 auto;
  font-size: 14px;
}
a {
  color: #000;
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
  color: #ccc;
}
</style>

<script>
export default {
  name: "App",
  mounted() {
    this.$router.push("/login");
  }
};
</script>
