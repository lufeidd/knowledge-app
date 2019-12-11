<template>
  <div id="failPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换失败</h3>
    <p class="content">
      {{this.errorMsg}}
    </p>
    <div class="button_wrapper">
      <van-button type="primary" color="#F05654" @click="download">打开火把知识App</van-button>
    </div>
    <!--<img src="./../../../assets/redeem/fail.png" alt="">-->
  </div>
</template>

<script>
  export default {
    name: "fail",
    data() {
      return {
        errorMsg: ''
      };
    },
    methods: {
      download() {
        // window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
        // let u = navigator.userAgent,
        //   app = navigator.appVersion;
        // let _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        // let _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        // console.log(u, app, _ios, _android);
        if (sessionStorage.getItem("isHuobaIosLogin") == "yes") {
          window.location.href =
            "https://apps.apple.com/cn/app/%E7%81%AB%E6%8A%8A%E7%9F%A5%E8%AF%86/id1473766311";
        } else if (sessionStorage.getItem("isHuobaAndroidLogin") == "yes") {
          window.location.href =
            "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
        }
      }
    },
    created() {
      this.errorMsg = this.$route.query.errorMsg;
      // console.log(this.errorMsg);
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/wapFail.scss" lang="sass">

</style>
