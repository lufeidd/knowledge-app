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
        maxlength="11"
        placeholder="请输入手机号"
        @input="checkSubmit ('phone')"
      />
      <van-field
        v-model="password"
        type="password"
        clearable
        maxlength="20"
        placeholder="请输入密码"
        @input="checkSubmit ('submit')"
      />
    </div>
    <div class="button_wrapper" v-if="submitData.disabled">
      <van-button size="large" type="danger" disabled>登录</van-button>
    </div>
    <div class="button_wrapper" v-else>
      <van-button size="large" type="danger" @click="">登录</van-button>
    </div>
    <router-link :to="{name: ''}" class="link_text_login">验证码登录
    </router-link>
    <router-link :to="{name: ''}" class="link_text_password">忘记密码
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
      checkSubmit(type) {
      //   var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      //   var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
      //   if (type === "phone") {
      //     var value = this.phone;
      //
      //     if (regPhone.test(this.phone)) {
      //       this.codeData.disabled = false;
      //     } else {
      //       this.codeData.disabled = true;
      //     }
      //   }
      //   if (
      //     regPassword.test(this.password) &&
      //     regPhone.test(this.phone) &&
      //     this.code.length === 4
      //   ) {
      //     this.submitData.disabled = false;
      //   } else {
      //     this.submitData.disabled = true;
      //   }
      }
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/passwordLogin/passwordLogin.scss" lang="scss" scoped>

</style>
