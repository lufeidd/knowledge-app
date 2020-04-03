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
      <van-button slot="button" size="large" type="danger" v-if="submitData.disabled" disabled>确认设置</van-button>
      <van-button slot="button" size="large" type="danger" v-else @click="confirmSet">确认设置</van-button>
    </div>
  </div>
</template>

<script>
  import { FIND } from "@/apis/passport.js";
  export default {
    data() {
      return {
        phone: '',
        code: '',
        password: '',
        submitData: {
          disabled: true
        }
      };
    },
    methods: {
      // 校验格式
      checkSubmit() {
        var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
        if (regPassword.test(this.password)) {
          this.submitData.disabled = false;
        } else {
          this.submitData.disabled = true;
        }
      },
      confirmSet() {
        let data = {
          phone: this.phone
        };
        this.findPwd();

      },
      // 确认并提交
      async findPwd() {
        var tStamp = this.$getTimeStamp();
        var data = {
          mobile: this.phone.replace(/\s/g, ''),
          auth_code: this.code,
          pwd: this.password,
          timestamp: tStamp,
          version: "1.0"
        };

        data.sign = this.$getSign(data);

        let res = await FIND(data);

        if (res.hasOwnProperty("response_code")) {
          this.$router.push({ name: "passwordLogin2.0", query: data });
        } else {
          this.$toast(res.error_message);
        }
      }

    },
    mounted() {
      this.phone = this.$route.query.phone;
      this.code = this.$route.query.code;
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/set/changePassword.scss" lang="scss" scoped>

</style>
