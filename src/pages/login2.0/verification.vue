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
    <!--<van-popup v-model="leavePopShow" class="leave">-->
      <!--<p class="leave_remind">-->
        <!--点击“返回”将中断登录，-->
        <!--确定返回？-->
      <!--</p>-->
      <!--<div class="btn_wrapper">-->
        <!--<span class="cancel" @click="cancel">取消</span>-->
        <!--<span class="confirm" @click="confirm">确定</span>-->
      <!--</div>-->
    <!--</van-popup>-->
  </div>
</template>

<script>
  import { SMS } from "@/apis/passport.js";
  export default {
    data() {
      return {
        code: '',
        phone: '',
        leavePopShow: false,
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
      // cancel() {
      //   this.leavePopShow = false;
      //
      // },
      // confirm() {
      //   //  根据来的路由判断返回的页面
      // },
      // 输入完验证码后 带验证码replace到之前页面，此页面只做获得验证码

    },
    mounted() {
      this.phone = this.$route.query.phone;
      // this.sms();

    },
    beforeRouteLeave(to, from, next) {
      var _this = this;

      this.$dialog
        .confirm({
          title: '点击"返回"将中断登录，确定返回？',
          cancelButtonText: "取消",
          confirmButtonText: "确定"
        })
        .then(() => {
          next();
          //   //  根据来的路由判断返回的页面

          // _this.$router.push({
          //   name:"",
          //   query: {}
          // });
        })
        .catch(() => {
          // on cancel
          next();
          //  为什么用replace只生效了一次？
          _this.$router.push({
            name:"verification2.0",
            query: {phone: this.phone}
          });
        });
    },

  }
</script>

<style src="@/style/scss/pages/login2.0/verification.scss" lang="scss" scoped>

</style>
