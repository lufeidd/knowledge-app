<template>
  <div id="authenticationPage">
    <p class="info">我们需要验证您的身份</p>
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        phone: ''
      };
    },
    methods: {
      checkSubmit() {

      }
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/set/authentication.scss" lang="scss" scoped>

</style>
