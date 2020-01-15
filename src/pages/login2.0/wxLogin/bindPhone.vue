<template>
    <div id="bindPhonePage">
      <p class="info">还差最后一步，绑定手机号</p>
      <div class="action_wrapper">
        <van-field
          class="phone"
          v-model="phone"
          clearable
          placeholder="请输入手机号"
          error-message
          type="tel"
          maxlength="11"
          @input="checkSubmit ('phone')"
        />
        <van-button slot="button" size="large" type="danger">获取验证码</van-button>
      </div>
      <van-popup v-model="leavePopShow" class="leave">
        <p class="leave_remind">
          点击“返回”将中断登录，
          确定返回？
        </p>
        <div class="btn_wrapper">
          <span class="cancel">取消</span>
          <span class="confirm">确定</span>
        </div>
      </van-popup>
      <van-popup v-model="registerPopShow" class="register">
        <p class="title">
          注册协议&隐私条款
        </p>
        <p class="content_one">
          在您注册成为火把用户的同时，您需要通过点击同意的方式在线签署以下协议，请您务必仔细阅读、充分理解协议中的条款内容后再点击同意。
        </p>
        <p class="content_two">
          点击同意即表示您已阅读并同意
          <router-link :to="{name: 'prototype2.0', query: {type: 'prototype'}}" class="prototype">《火把平台用户注册协议》</router-link>
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
          leavePopShow: false,
          registerPopShow: true
        };
      },
      methods: {
        checkSubmit() {

        },
      }
    }
</script>

<style src="@/style/scss/pages/login2.0/wxLogin/bindPhone.scss" lang="scss" scoped>

</style>
