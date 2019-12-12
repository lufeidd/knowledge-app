<template>
  <div id="appSuccessPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换成功</h3>
    <p class="content">
      恭喜您获得商品名“{{goodsName}}”
      快去看看吧！
    </p>
    <div class="button_wrapper">
      <van-button type="primary" color="#F05654" @click="toCheck">去看看</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "app-success",
    data() {
      return {
        goodsName: '',
        resData: {}
      };
    },
    methods: {
     toCheck() {
       this.$toast(this.resData.redeem_goods_type);
       if (this.resData.redeem_goods_type == 1) { //  虚拟
         if (this.resData.goods_type == 4) {  //  电子书
           this.$router.push({name: 'ebookdetail', query: {goods_id: this.resData.goods_id}});
         } else if (this.resData.goods_type == 9) {
           this.$router.push({name: 'albumdetail', query: {goods_id: this.resData.goods_id}});
         }
       } else if (this.resData.redeem_goods_type == 2) {  // 优惠券
         console.log('url', window.location.href);
         this.$toast(window.location.href);
          this.$router.push({name: 'couponmine'});
       } else if (this.resData.redeem_goods_type == 3) {
         this.$router.push({name: 'orderdetail', query: {order_id: this.resData.order_id}});
       }
     }
    },
    created() {
      this.goodsName = this.$route.query.goodsName;
      this.resData = this.$route.query.resData;
      // console.log(this.goodsType);
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/appSuccess.scss" lang="scss">

</style>
