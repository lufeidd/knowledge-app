<template>
  <div id="phoneLoginPage">
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
    </div>
    <div class="button_wrapper" v-if="submitData.disabled">
      <van-button size="large" type="danger" disabled>获取验证码</van-button>
    </div>
    <div class="button_wrapper" v-else>
      <van-button size="large" type="danger" @click="">获取验证码</van-button>
    </div>
    <router-link :to="{name: ''}" class="link_text">密码登录
    </router-link>
    <div class="wx_login">
      <p class="wx_login_text">快捷登录方式</p>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-weixin-block"/>
      </svg>
    </div>
    <van-popup v-model="registerPopShow" class="register">
      <p class="title">
        注册协议&隐私条款
      </p>
      <p class="content_one">
        在您注册成为火把用户的同时，您需要通过点击同意的方式在线签署以下协议，请您务必仔细阅读、充分理解协议中的条款内容后再点击同意。
      </p>
      <p class="content_two">
        点击同意即表示您已阅读并同意
        <router-link :to="{name: 'prototype2.0', query: {type: 'prototype'}}" class="prototype">《火把平台用户注册协议》
        </router-link>
        与
        <router-link :to="{name: 'prototype2.0', query: {type: 'private'}}" class="prototype">《火把平台用户隐私条款》</router-link>
      </p>
      <div class="btn_wrapper">
        <div class="disagree">
          <van-button type="default" size="small" style="background:#F5F5F5;" @click="">不同意</van-button>
        </div>
        <div class="agree">
          <van-button type="danger" size="small" @click="">同意</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        phone: '',
        submitData: {
          disabled: true
        },
        registerPopShow: true
      };
    },
    methods: {
      // 格式校验
      checkSubmit(type) {
        // var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        // if (type === "phone") {
        //   if (regPhone.test(this.phone)) {
        //     this.codeData.disabled = false;
        //   } else {
        //     this.codeData.disabled = true;
        //   }
        // }
        // if (regPhone.test(this.phone) && this.code.length == 4) {
        //   this.submitData.disabled = false;
        // } else {
        //   this.submitData.disabled = true;
        // }
      },
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/phoneLogin/phoneLogin.scss" lang="scss" scoped>

</style>
