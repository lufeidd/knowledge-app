<template>
  <div id="changePasswordPage">
    <p class="info">设置新密码<span class="step_text"><span class="percent_step">3</span>/3</span></p>
    <div class="action_wrapper">
      <van-field
        v-model="password"
        class="password"
        type="password"
        clearable
        maxlength="20"
        placeholder="6-20位数字/字母/字符组合"
        @input="checkSubmit ('submit')"
      />
      <van-button slot="button" size="large" type="danger" v-if="submitData.disabled" disabled>确认设置</van-button>
      <van-button slot="button" size="large" type="danger" v-else @click="confirmSet">确认设置</van-button>
    </div>
  </div>
</template>

<script>
  import { FIND, LOGOUT } from "@/apis/passport.js";
  export default {
    data() {
      return {
        setFlag: false, // 是否点击确认设置按钮
        phone: '',
        code: '',
        password: '',
        submitData: {
          disabled: true
        }
      };
    },
    methods: {
      // 校验格式
      checkSubmit() {
        var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
        if (regPassword.test(this.password)) {
          this.submitData.disabled = false;
        } else {
          this.submitData.disabled = true;
        }
      },
      confirmSet() {
        this.setFlag = true;
        let data = {
          phone: this.phone
        };
        this.findPwd();

      },
      // 确认并提交
      async findPwd() {
        var tStamp = this.$getTimeStamp();
        var data = {
          mobile: this.phone.replace(/\s/g, ''),
          auth_code: this.code,
          pwd: this.password,
          timestamp: tStamp,
          version: "1.0"
        };

        data.sign = this.$getSign(data);

        let res = await FIND(data);

        if (res.hasOwnProperty("response_code")) {
          this.$toast('设置成功');
          this.logoutData();  // 退出登录
          this.$router.push({ name: "passwordLogin", query: {phone: this.phone} });
        } else {
          this.$toast(res.error_message);
        }
      },

      async logoutData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await LOGOUT(data);
        console.log(res.response_data);
        if (res.hasOwnProperty("response_code")) {
          // 退出登录将localstorage中进度数据清空
          localStorage.setItem("miniAudio", null);
          localStorage.setItem("audioProgress", null);
          localStorage.setItem("cmts", null);
          localStorage.setItem("fromLink", null);
          localStorage.setItem("closeAudio", null);

          localStorage.setItem("headPic", null);
        } else {
          this.$toast(res.error_message);
        }
      }

    },
    mounted() {
      this.phone = this.$route.query.phone;
      this.code = this.$route.query.code;
    },
    beforeRouteLeave(to, from, next) {
      var _this = this;

      console.log('to', to);
      console.log('from', from);

      if (to.name == 'passwordLogin' && !this.setFlag) {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断设置，确定返回？',
            cancelButtonText: "取消",
            confirmButtonText: "确定"
          })
          .then(() => {
            next();
            _this.$router.push({
              name: "passwordLogin",
              query: {phone: _this.phone}
            });
          })
          .catch(() => {
            // on cancel
            next();
            _this.$router.push({
              name: "changePassword"
            });
          });
      } else if (to.name == 'safe') {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断设置，确定返回？',
            cancelButtonText: "取消",
            confirmButtonText: "确定"
          })
          .then(() => {
            next();

          })
          .catch(() => {
            // on cancel
            next();
            _this.$router.push({
              name: "changePassword"
            });
          });
      } else {
        next();
      }


    },
  }
</script>

<style src="@/style/scss/pages/login/set/changePassword.scss" lang="scss" scoped>

</style>
