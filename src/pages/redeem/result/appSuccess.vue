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
        goodsType: ''
      };
    },
    methods: {
     toCheck() {
       switch(this.goodsType) {
         case 1 :
           this.$router.push({name: 'ebookshelf'});
           break;
         case 2 :
           this.$router.push({name: 'couponmine'});
           break;
         case 3 :
           this.$router.push({name: 'orderlist'});
           break;
       }
     }
    },
    created() {
      this.goodsName = this.$route.query.goodsName;
      this.goodsType = this.$route.query.goodsType;
      // console.log(this.goodsType);
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/appSuccess.scss" lang="scss">

</style>
