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
  import { SMS, LOGIN_BIND_PARTERNER } from "@/apis/passport.js";
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
      // 绑定手机号  还需修改
      async bindphoneData() {
        // console.log(localStorage.getItem('nickname'));
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone,
          header_pic: localStorage.getItem('headimg'),
          auth_code: this.code,
          outer_id: this.outerId,
          type: this.bindtype,
          outer_name: localStorage.getItem('nickname'),
          openid: localStorage.getItem('openid'),
          source_url: localStorage.getItem("defaultLink"),
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await LOGIN_BIND_PARTERNER(data);
        console.log("bindphone:", res.response_data);
        if (res.hasOwnProperty("response_code")) {
          // 手机号未绑定到其他微信 // 跳转回唤醒登录页

        } else {
          // 绑定失败
          this.$toast(res.error_message);
        }
      },
    },
    mounted() {
      this.phone = this.$route.query.phone;
      this.sms();

      // this.bindtype = parseInt(this.$route.query.bindtype);
      // this.outerId = this.$route.query.outerId;
      // this.activity_id = this.$route.query.activity_id ? this.$route.query.activity_id : false;
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/verification.scss" lang="scss" scoped>

</style>
