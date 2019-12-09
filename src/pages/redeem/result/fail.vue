<template>
  <div id="failPage">
    <div class="top_bg"></div>
    <h3 class="title">兑换失败</h3>
    <p class="content">
      {{this.errorMsg}}
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
        errorMsg: ''
      };
    },
    methods: {
    },
    created() {
      this.errorMsg = this.$route.query.error_message;
    }
  }
</script>

<style src="@/style/scss/pages/redeem/result/fail.scss" lang="sass">

</style>
