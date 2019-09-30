<template>
  <div id="loginPage">
    <div class="fieldBox">
      <div class="phone">
        <van-field
          v-model="phone"
          clearable
          label="+86"
          placeholder="手机号码"
          error-message
          type="tel"
          maxlength="11"
          @input="checkSubmit"
        />
      </div>

      <div class="password">
        <van-field
          v-model="password"
          type="password"
          clearable
          label="密码"
          maxlength="20"
          placeholder="6-20位数字、字母或符号，至少两种"
          @input="checkSubmit"
        />
      </div>

      <van-row class="row">
        <van-col span="12">
          <router-link to="/login/register">注册</router-link>
        </van-col>
        <van-col span="12">
          <span @click="findPassword">找回密码</span>
        </van-col>
      </van-row>

      <div class="submitBox">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">登录</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="loginAction">登录</van-button>
        </template>
      </div>

      <van-row class="loginType">
        <van-col span="24" v-if="isWxLogin">
          <svg class="icon myIconStyle" aria-hidden="true" @click="wxLogin">
            <use xlink:href="#icon-weixin-block"></use>
          </svg>
        </van-col>
        <!-- <van-col span="12">
          <svg class="icon myIconStyle" aria-hidden="true">
            <use xlink:href="#icon-qq-block"></use>
          </svg>
        </van-col>-->
      </van-row>
    </div>
    <div style="height:150px;position:relative;">
        <CopyRight></CopyRight>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/login/index.scss" scoped lang="scss"></style>

<style lang="scss">
#loginPage {
  .van-field__label {
    max-width: 50px;
    margin-right: 10px;
  }

  .phone .van-field__label {
    border-right: 1px #d6d6d6 solid;
  }
}
</style>

<script>
import axios from "axios";
//  引入接口
import { LOG, LOGIN_PARTERNER } from "../../apis/passport.js";

export default {
  data() {
    return {
      phone: "",
      password: "",
      submitData: {
        disabled: true
      }
    };
  },
  mounted() {
    this.phone = this.$route.query.mobile;
    this.password = this.$route.query.pwd;
    this.checkSubmit();

    // 获取第三方微信登录code
    this.$getWxCode();
    console.log(999, this.wxCodeStr, sessionStorage.getItem('gotoLogin'));
    if (this.wxCodeStr.length > 6 && sessionStorage.getItem('gotoLogin') == 'yes') this.$getWxLoginData();
  },
  methods: {
    // 微信登录
    wxLogin() {
      this.gotoLogin = true;
      sessionStorage.setItem('gotoLogin', 'yes');
      this.$wxLogin();
    },
    // 校验格式
    checkSubmit() {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
      if (regPassword.test(this.password)) this.isPassword = true;
      if (regPassword.test(this.password) && regPhone.test(this.phone)) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    // 登录
    async login() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        mobile: this.phone,
        pwd: this.password,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await LOG(data);

      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);
        // console.log(res);
        // this.$router.push({ name: "personalIndex", query: "" });

        var fromLink = localStorage.getItem("fromLink");
        console.log("fromLink:", fromLink);

        if (
          fromLink.indexOf("/login/index") != -1 ||
          fromLink.indexOf("/personal/set/index") != -1 ||
          fromLink.indexOf("/login/password") != -1 ||
          fromLink.indexOf("/login/register") != -1 ||
          fromLink.indexOf("/personal/set/password") != -1 ||
          fromLink == "/"
        ) {
          this.$router.replace({ name: "personalIndex" });
        } else {
          this.$router.go(-1);
        }
      } else {
        this.$toast(res.error_message);
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          localStorage.setItem("loginState", 100);
        }
      }
    },
    loginAction() {
      this.login();
    },
    findPassword() {
      let data = {
        mobile: this.phone
      };
      localStorage.setItem("loginState", 1);
      this.$router.push({ name: "password", query: data });
    }
  }
};
</script>
