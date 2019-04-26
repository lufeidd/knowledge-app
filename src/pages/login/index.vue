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

      <van-row v-bind:class="{ row: isRow }">
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

      <van-row v-bind:class="{ loginType: isLoginType }">
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
      },
      isRow: true,
      isLoginType: true
    };
  },
  mounted() {
    let queryData = this.$route.query;
    this.phone = queryData.phone;
    this.password = "";
  },
  methods: {
    // 校验格式
    checkSubmit() {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
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
      let log = await LOG(data);
      // 出错提示
      if (log.error_code == 1) {
        this.$toast(log.error_message);
      }
      console.log(log);
    },
    loginAction() {
      this.login();
    },
    findPassword() {
      this.$router.push("/login/password");
    }
  }
};
</script>