<template>
    <div id="verificationPage">
      <p class="info">验证码已经发送到您的手机</p>
      <p class="phone">182 8390 2019</p>
      <van-password-input
        :value="code"
        :mask="false"
        @focus="showKeyboard = true"
        :length= 4
      />
      <p class="tips">59s后重新发送</p>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          code: ''
        };
      }
    }
</script>

<style src="@/style/scss/pages/login2.0/verification.scss" lang="scss" scoped>

</style>
