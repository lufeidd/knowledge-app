<template>
  <div id="authenticationPage">
    <p class="info">我们需要验证您的身份<span class="step_text"><span class="percent_step">1</span>/{{this.totalStep}}</span></p>
    <p class="phone" v-text="phone" v-if="hasPhone"></p>
    <div class="action_wrapper" v-if="hasPhone">
      <div class="button_wrapper">
        <van-button slot="button" size="large" type="danger" @click="getCode">获取验证码</van-button>
      </div>
    </div>
    <div class="action_wrapper" v-if="!hasPhone">
      <van-field
        class="inputPhone"
        v-model="phone"
        clearable
        placeholder="请输入手机号"
        error-message
        type="tel"
        @input="checkSubmit ('phone')"
      />
      <div class="button_wrapper" v-if="submitData.disabled">
        <van-button slot="button" size="large" type="danger" disabled>获取验证码</van-button>
      </div>
      <div class="button_wrapper" v-else>
        <van-button slot="button" size="large" type="danger" @click="getCode">获取验证码</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { PHONE_CHECK } from "@/apis/passport.js";
  export default {
    data() {
      return {
        totalStep: Number,
        phone: '',
        hasPhone: false,
        pageType: '',
        submitData: {
          disabled: true
        },
        isRegister: null // 0 未注册 1 已注册
      };
    },
    methods: {
      // 格式校验
      checkSubmit() {
        // 配合正则，表单字符指定位置添加空格
        var _code = this.phone
          .replace(/[^0-9]/g, "")
          .substring(0, 11);
        var _type = 'tel';
        this.phone = this.$inputSpace(_code, _type);

        var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        if (regPhone.test(this.phone.replace(/\s/g, ''))) {
          this.submitData.disabled = false;
        } else {
          this.submitData.disabled = true;
        }
      },
      //判断手机号是否已注册
      async checkPhone() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          version: "1.1"
        };
        data.sign = this.$getSign(data);

        let res = await PHONE_CHECK(data);

        if (res.hasOwnProperty("response_code")) {
          this.isRegister = res.response_data.is_register;
          // console.log(66,this.isRegister);
        } else {
          this.isRegister = null;
          this.$toast(res.error_message);
        }
      },
      getCode() {
        // 如果已注册跳转到验证码输入页
        let _this = this;
        this.checkPhone().then(function () {
          if (_this.isRegister == 1) { // 已注册
            if (_this.pageType == 'password' || _this.pageType == 'findPassword') {
              _this.$router.replace({name: 'verification2.0', query: {phone: _this.phone, type: 'changePassword'}});
            }
            if (_this.pageType == 'phone') {
              _this.$router.replace({name: 'verification2.0', query: {phone: _this.phone, type: 'oldChangePhone'}});
            }

          } else {
            _this.$toast('该用户不存在');
          }
        });
      }
    },
    beforeRouteLeave(to, from, next) {
      var _this = this;

      // console.log('to', to);
      // console.log('from', from);

      if (to.name == 'passwordLogin2.0' || to.name == 'safe' || to.name == 'bind') {
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
              name: "authentication2.0"
            });
          });
      } else {
        next();
      }


    },
    mounted() {
      let str = this.$route.query.phone ? this.$route.query.phone.toString(): '';
      let str1 = str.substring(0, 3);
      let str2 = str.substring(3, 7);
      let str3 = str.substring(7, 11);
      this.phone = str1 + ' ' + str2 + ' ' + str3;
      this.pageType = this.$route.query.pageType; // 'findPassword', 'password', 'phone'
      // console.log(this.pageType);
      if (this.pageType == 'password' || this.pageType == 'phone') {
        this.hasPhone = true;
      }
      if (this.pageType == 'findPassword' || this.pageType == 'password') {
        this.totalStep = 3;
      } else if (this.pageType == 'phone') {
        this.totalStep = 4;
      }
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/set/authentication.scss" lang="scss" scoped>

</style>
