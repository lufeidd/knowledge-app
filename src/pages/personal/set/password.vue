<template>
  <div id="spasswordPage" class="passwordPage">
    <div class="fieldBox">

      <van-field
        v-model="password1"
        type="password"
        clearable
        label=""
        maxlength="20"
        placeholder="请输入原密码"
        @input="checkSubmit ()"
      />
      <van-field
        v-model="password2"
        type="password"
        clearable
        label=""
        maxlength="20"
        placeholder="请设置新密码"
        @input="checkSubmit ()"
      />
      <p class="tip">需由6-20位数字、字母或符号组成，至少两种</p>

      <div class="submitBox">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">确认并提交</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="submitAction">确认并提交</van-button>
        </template>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/login/password.scss" scoped lang="scss"></style>

<style>
@import url("./../../../style/scss/components/button.scss");
</style>

<style lang="scss">
#spasswordPage {
  .van-field__label {
      max-width: 0;
  }
  .van-field__label {
      margin-right: 0;
  }
}
</style>

<script>
//  引入接口
import { SMS, FIND, EDIT_PASSWORD } from "../../../apis/passport.js";

export default {
  data() {
    return {
      password1: "",
      password2: "",
      submitData: {
        disabled: true
      },
    };
  },
  methods: {
    // 校验格式
    checkSubmit() {
      var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
      if (
        regPassword.test(this.password1) &&
        regPassword.test(this.password2) && 
        this.password1 != this.password2
      ) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    submitAction() {
      this.editPassword();
    },
    // 修改密码接口
    async editPassword() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        pwd: this.password1,
        newpwd: this.password2,
        version: "1.0",
      };
      data.sign = this.$getSign(data);
      let res = await EDIT_PASSWORD(data);
      // console.log(res.response_data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        
        this.$toast('密码修改成功~');
        this.$router.push('/login/index');
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          
        }
        this.$toast(res.error_message);
      }
    },
  }
};
</script>