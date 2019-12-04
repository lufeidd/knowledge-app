<template>
  <div id="failPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换失败</h3>
    <p class="content">
      活动已经结束！
    </p>
    <div class="button_wrapper">
      <van-button type="primary" color="#F05654" @click="">重新兑换</van-button>
    </div>
    <!--<img src="./../../../assets/redeem/fail.png" alt="">-->
  </div>
</template>

<script>
  export default {
    name: "fail",
    data() {
      return {

      };
    },
    methods: {
    },
    created() {
      this.$toast({
        icon: './../../../assets/redeem/failed-line.png',
        message: '兑换失败'
      });
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/fail.scss" lang="sass">

</style>
