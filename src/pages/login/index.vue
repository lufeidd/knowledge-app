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
      <!-- 
      <van-row class="loginType">
        <van-col span="12">
          <svg class="icon myIconStyle" aria-hidden="true">
            <use xlink:href="#icon-weixin-block"></use>
          </svg>
        </van-col>
        <van-col span="12">
          <svg class="icon myIconStyle" aria-hidden="true">
            <use xlink:href="#icon-qq-block"></use>
          </svg>
        </van-col>
      </van-row>
      -->
    </div>
  </div>
</template>

<style src="@/style/scss/pages/login/index.scss" lang="scss"></style>

<script>
//  引入接口
import { LOG } from "../../apis/passport.js";

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
  },
  methods: {
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
      let data = {
        mobile: this.phone,
        pwd: this.password,
        version: "1.0"
      };
      let res = await LOG(data);
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        this.$router.push({ path: "/album/index", query: '' });
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
      this.$router.push({ path: "/login/password", query: data });
    }
  }
};
</script>