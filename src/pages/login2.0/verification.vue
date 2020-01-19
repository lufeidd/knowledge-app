<template>
  <div id="verificationPage">
    <p class="info">验证码已经发送到您的手机</p>
    <p class="phone" v-text="phone"></p>
    <van-password-input
      :value="code"
      :mask="false"
      @focus="showKeyboard = true"
      :length=4
    />
    <p class="tips">59s后重新发送</p>
  </div>
</template>

<script>
  import { SMS } from "@/apis/passport.js";
  export default {
    data() {
      return {
        code: '',
        phone: ''
      };
    },
    methods: {
      // 获取验证码
      async sms() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await SMS(data);
      },
      // 输入完验证码后 带验证码replace到之前页面，此页面只做获得验证码

    },
    mounted() {
      this.phone = this.$route.query.phone;
      this.sms();

    }
  }
</script>

<style src="@/style/scss/pages/login2.0/verification.scss" lang="scss" scoped>

</style>
