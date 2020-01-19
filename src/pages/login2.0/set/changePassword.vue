<template>
  <div id="changePasswordPage">
    <p class="info">设置新密码</p>
    <div class="action_wrapper">
      <van-field
        v-model="password"
        class="password"
        type="password"
        clearable
        maxlength="20"
        placeholder="6-20位数字/字母/字符组合"
        @input="checkSubmit ('submit')"
      />
      <van-button slot="button" size="large" type="danger">确认设置</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        password: ''
      };
    },
    methods: {
      checkSubmit() {

      }
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/set/changePassword.scss" lang="scss" scoped>

</style>
