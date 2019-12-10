<template>
  <div id="spasswordPage" class="passwordPage">
    <div class="fieldBox">
      <van-field
        v-model="password1"
        type="password"
        clearable
        label
        maxlength="20"
        :placeholder="pageType == 'add' ? '输入密码' : '输入原密码'"
        @input="checkSubmit"
      />
      <van-field
        v-model="password2"
        type="password"
        clearable
        label
        maxlength="20"
        :placeholder="pageType == 'add' ? '确认密码' : '输入新密码'"
        @input="checkSubmit"
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
    <CopyRight></CopyRight>
  </div>
</template>

<style src="@/style/scss/pages/login/password.scss" scoped lang="scss"></style>

<style lang="scss">
// @import url("./../../../style/scss/components/button.scss");

#spasswordPage {
.van-button {
  border-radius: 50px;
}

.van-button::before {
  display: none;
}

.van-button--plain.van-button--danger {
  background-color: #fff;
}

.van-button--danger {
  background-color: #f05654;
  border-color: #f05654;
}

.van-button--danger.van-button--disabled {
  background-color: #d6d6d6;
  border-color: #d6d6d6;
  opacity: 1;
}

.van-button--small {
  min-width: 80px;
}

.van-button--large {
  height: 50px;
  line-height: 50px;
}

.van-button--default {
  color: #333;
}
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
import {
  SMS,
  FIND,
  EDIT_PASSWORD,
  ADD_PASSWORD
} from "../../../apis/passport.js";

export default {
  data() {
    return {
      pageType: "",
      password1: "",
      password2: "",
      submitData: {
        disabled: true
      }
    };
  },
  mounted() {
    this.pageType = this.$route.query.type;
    if (this.pageType == "edit") document.title = "修改密码";
    if (this.pageType == "add") document.title = "设置密码";
  },
  methods: {
    // 校验格式
    checkSubmit() {
      var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
      var _bool;
      switch (this.pageType) {
        case "edit":
          _bool =
            regPassword.test(this.password1) &&
            regPassword.test(this.password2) &&
            this.password1 != this.password2;
          break;
        case "add":
          _bool =
            regPassword.test(this.password1) &&
            regPassword.test(this.password2) &&
            this.password1 == this.password2;
          break;
      }
      console.log(666, this.pageType, _bool);
      if (_bool) {
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
      var data = {};
      data.timestamp = tStamp;
      data.version = "1.0";
      switch (this.pageType) {
        case "edit":
          data.pwd = this.password1;
          data.newpwd = this.password2;
          data.sign = this.$getSign(data);
          var res = await EDIT_PASSWORD(data);

          if (res.hasOwnProperty("response_code")) {
            // store 设置登录状态
            this.$store.commit("changeLoginState", 1);
            if(res.response_data.hasOwnProperty('is_login')) localStorage.setItem("loginState", res.response_data.is_login);
            this.$toast("密码设置成功~");
            this.$router.push("/login/index");
          } else {
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              // store 设置登录状态
              this.$store.commit("changeLoginState", 100);
              localStorage.setItem("loginState", 0);
            }
            this.$toast(res.error_message);
          }
          break;
          break;
        case "add":
          data.pwd = this.password1;
          data.confirmpwd = this.password2;
          data.sign = this.$getSign(data);
          var res = await ADD_PASSWORD(data);

          if (res.hasOwnProperty("response_code")) {
            // store 设置登录状态
            this.$store.commit("changeLoginState", 1);
            if(res.response_data.hasOwnProperty('is_login')) localStorage.setItem("loginState", res.response_data.is_login);
            this.$toast("密码修改成功~");
            this.$router.push("/login/index");
          } else {
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              // store 设置登录状态
              this.$store.commit("changeLoginState", 100);
              localStorage.setItem("loginState", 0);
            }
            this.$toast(res.error_message);
          }
          break;
      }
    }
  }
};
</script>
