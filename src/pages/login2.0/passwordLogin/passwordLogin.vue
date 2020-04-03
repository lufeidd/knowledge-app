<template>
  <div id="passwordLoginPage">
    <div class="huoba_pic"></div>
    <h3 class="huoba_name">火把知识</h3>
    <div class="field_wrapper">
      <van-field
        type="tel"
        class="phone_num"
        v-model="phone"
        clearable
        placeholder="请输入手机号"
        @input="checkSubmit ()"
      />
      <van-field
        v-model="password"
        type="password"
        clearable
        maxlength="20"
        placeholder="请输入密码"
        @input="checkSubmit ()"
      />
    </div>
    <div class="button_wrapper" v-if="submitData.disabled">
      <van-button size="large" type="danger" disabled>登录</van-button>
    </div>
    <div class="button_wrapper" v-else>
      <van-button size="large" type="danger" @click="passwordLogin">登录</van-button>
    </div>
    <router-link :to="{name: 'phoneLogin2.0'}" class="link_text_login">验证码登录
    </router-link>
    <router-link :to="{name: 'authentication2.0'}" class="link_text_password">忘记密码
    </router-link>
    <div class="wx_login">
      <p class="wx_login_text">快捷登录方式</p>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-weixin-block"/>
      </svg>
    </div>
  </div>
</template>

<script>
  import { LOG } from "@/apis/passport.js";
  export default {
    data() {
      return {
        phone: '',
        password: '',
        submitData: {
          disabled: true
        }
      };
    },
    methods: {
      // 校验格式
      checkSubmit() {
        // 配合正则，表单字符指定位置添加空格
        var _code = this.phone
          .replace(/[^0-9]/g, "")
          .substring(0, 11);
        var _type = 'tel';
        this.phone = this.$inputSpace(_code, _type);

        var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
        if (
          regPassword.test(this.password) &&
          regPhone.test(this.phone.replace(/\s/g, ''))
        ) {
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
          mobile: this.phone.replace(/\s/g,   ''),
          pwd: this.password,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await LOG(data);
        if (res.hasOwnProperty("response_code")) {
          this.$toast('登录成功');
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
      passwordLogin() {
        this.login();
      }
    },
    mounted() {
      this.phone = this.$route.query.phone;
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/passwordLogin/passwordLogin.scss" lang="scss" scoped>

</style>
