<template>
  <div id="failPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换失败</h3>
    <p class="content">
      {{this.errorMsg}}
    </p>
    <div class="button_wrapper">
      <van-button type="primary" color="#F05654" @click="toIndexPage">返回首页</van-button>
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
      toIndexPage() {
        this.$router.push({name: 'personalIndex'});
      }
    },
    created() {
      this.errorMsg = this.$route.query.errorMsg;
      // console.log(this.errorMsg);
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/appFail.scss" lang="sass">

</style>
