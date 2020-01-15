<template>
  <div id="loginV2">
    <div class="huoba_pic"></div>
    <h3 class="huoba_name">火把知识</h3>
    <div class="action_wrapper">
      <van-button slot="button" size="large" type="danger">微信快捷登录</van-button>
      <van-button slot="button" size="large" type="default">手机号登录</van-button>
    </div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<script>
  export default {

  };
</script>

<style src="@/style/scss/pages/login2.0/index.scss" lang="scss" scoped>

</style>
