<template>
  <div id="appSuccessPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换成功</h3>
    <p class="content">
      恭喜您获得商品名“{{goodsName}}”
      快去看看吧！
    </p>
    <div class="button_wrapper">
      <van-button type="default" @click="toRedeem">继续兑换</van-button>
      <van-button type="primary" color="#F05654" @click="toCheck">去看看</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "app-success",
    data() {
      return {
        goodsName: ''
      };
    },
    methods: {
     toRedeem() {

     },
     toCheck() {

     }
    },
    created() {
      this.goodsName = this.$route.query.goodsName;
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/appSuccess.scss" lang="scss">

</style>
