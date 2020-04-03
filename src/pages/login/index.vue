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
            <use xlink:href="#icon-weixin-block" />
          </svg>
        </van-col>
        <!-- <van-col span="12">
          <svg class="icon myIconStyle" aria-hidden="true">
            <use xlink:href="#icon-qq-block"></use>
          </svg>
        </van-col>-->
      </van-row>
    </div>
    <CopyRight></CopyRight>
    <EazyNav type="brand" :isShow="false"></EazyNav>
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
    // linkFrom=gzh，公众号绑定手机号入口进入，提示已绑定手机号
    if (
      this.wxCodeStr.length > 6 ||
      localStorage.getItem("linkFrom") == "gzh"
    ) {
      if (localStorage.getItem("linkFrom") == "gzh") {
        this.gotoLogin = true;
        localStorage.setItem("gotoLogin", "yes");
      }
      // 允许微信第三方登录
      if (localStorage.getItem("gotoLogin") == "yes") {
        // 第三方登录
        this.$getWxLoginData();
      }
    }
  },
  methods: {
    // 微信登录
    wxLogin() {
      // 重置页面来源
      localStorage.setItem("linkFrom", "");
      this.gotoLogin = true;
      localStorage.setItem("gotoLogin", "yes");
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
        // 登录将localstorage中进度数据清空
        localStorage.setItem("miniAudio", null);
        localStorage.setItem("audioProgress", null);
        localStorage.setItem("cmts", null);
        localStorage.setItem("fromLink", null);
        localStorage.setItem("closeAudio", null);
        localStorage.setItem(("loginState"), 1);

        // 不需要登录的页面，如果未登录，进入登录页，登录成功后回退到指定页面
        window.location.href = localStorage.getItem("defaultLink");
      } else {
        this.$toast(res.error_message);
      }
    },
    loginAction() {
      this.login();
    },
    findPassword() {
      let data = {
        mobile: this.phone
      };
      this.$router.push({ name: "password", query: data });
    }
  }
};
</script>
