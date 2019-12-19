<template>
  <div id="wapSuccessPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换成功</h3>
    <p class="content" v-if="goodsNameType == 'goods'">
      恭喜您获得商品名“{{goodsName}}”，快打开火把知识App，点击<span class="content_title">“我的-我的购买"</span>查看吧！
    </p>
    <p class="content" v-if="goodsNameType == 'coupons'">
      恭喜您获得优惠券，快打开火把知识App，点击<span class="content_title">“我的-我的优惠券"</span>查看吧！
    </p>
    <div class="button_wrapper">
      <van-button type="primary" style="background:#F05654;border: 1px solid #F05654;" @click="download">打开火把知识App</van-button>
    </div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<script>
  export default {
    name: "wap-success",
    data() {
      return {
        goodsName: '',
        goodsNameType: ''
      };
    },
    methods: {
      download() {
        // window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
        let u = navigator.userAgent,
          app = navigator.appVersion;
        let _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        let _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        console.log(u, app, _ios, _android);
        if (_ios) {
          window.location.href =
            "https://apps.apple.com/cn/app/%E7%81%AB%E6%8A%8A%E7%9F%A5%E8%AF%86/id1473766311";
        } else if (_android) {
          window.location.href =
            "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
        }
      }
    },
    created() {
      this.goodsName = this.$route.query.goodsName;
      this.goodsNameType = this.$route.query.goodsNameType;
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/wapSuccess.scss" lang="scss">

</style>
