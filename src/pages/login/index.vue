<template>
  <div id="loginV2">
    <div v-if="pageShow">
      <div class="huoba_pic"></div>
      <h3 class="huoba_name">火把知识</h3>
      <div class="action_wrapper">
        <van-button slot="button" size="large" type="danger" @click="wxLogin">微信快捷登录</van-button>
        <van-button slot="button" size="large" type="default" @click="phoneLogin">手机号登录</van-button>
      </div>
      <Bottom></Bottom>
      <!-- <EazyNav type="brand" :isShow="false"></EazyNav> -->
    </div>
  </div>
</template>

<script>
  import bottom from '@/pages/login/bottom.vue';
  export default {
    data() {
      return {
        pageShow: true
      };
    },
    methods: {
      wxLogin() {
        // this.$router.push({name: 'bindPhone'});
        // 重置页面来源
        localStorage.setItem("linkFrom", "");
        this.gotoLogin = true;
        localStorage.setItem("gotoLogin", "yes");
        this.$wxLogin();
      },
      phoneLogin() {
        this.$router.push({name: 'phoneLogin'});
      }
    },
    created() {
      // 如果非微信浏览器登录，默认跳转到验证码登录页
      if(localStorage.getItem('isWxLogin') == 'no') {
        this.$router.replace({name: 'phoneLogin'});
      }
    },
    mounted() {
      // 获取第三方微信登录code
      this.$getWxCode();
      // linkFrom=gzh，公众号绑定手机号入口进入，提示已绑定手机号
      if (
        this.wxCodeStr.length > 6 ||
        localStorage.getItem("linkFrom") == "gzh"
      ) {
        if (localStorage.getItem("linkFrom") == "gzh") {
          this.gotoLogin = true;
          localStorage.setItem("gotoLogin", "yes");
        }
        // 允许微信第三方登录
        if (localStorage.getItem("gotoLogin") == "yes") {
          // 第三方登录
          this.$getWxLoginData();
        }
      }

    },
    components: {
      Bottom: bottom
    }
  };
</script>

<style src="@/style/scss/pages/login/index.scss" lang="scss" scoped>

</style>
