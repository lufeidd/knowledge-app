<template>
  <div id="registerPage">
    <div class="fieldBox">
      <van-field
        :class="{ phone: isPhone }"
        v-model="phone"
        clearable
        label="+86"
        placeholder="手机号码"
        error-message
        type="tel"
        maxlength="11"
        @input="checkSubmit ('phone')"
      />

      <van-field
        v-model="code"
        clearable
        label="验证码"
        maxlength="4"
        placeholder="验证码"
        @input="checkSubmit ('')"
      >
        <template v-if="codeData.disabled">
          <van-button slot="button" size="small" round disabled type="danger">{{ codeData.timeMsg }}</van-button>
        </template>
        <template v-else>
          <van-button
            slot="button"
            size="small"
            round
            type="danger"
            @click="getCode"
          >{{ codeData.timeMsg }}</van-button>
        </template>
      </van-field>
      <div class="password">
        <van-field
          v-model="password"
          type="password"
          clearable
          label="密码"
          maxlength="20"
          placeholder="6-20位数字、字母或符号，至少两种"
          @input="checkSubmit ('submit')"
        />
      </div>

      <div class="prototype">
        <van-checkbox v-model="checked">阅读并同意</van-checkbox>
        <router-link to="/login/prototype">《火把服务用户协议》</router-link>
      </div>

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

<style src="@/style/scss/pages/login/register.scss" lang="scss"></style>

<script>
import Vue from "vue";
// import regeneratorRuntime from "./../../regenerator-runtime/runtime.js";

//  引入接口
import { REG, SMS } from "../../apis/passport.js";

export default {
  data() {
    return {
      phone: "",
      isPhone: true,
      code: "",
      password: "",
      codeData: {
        disabled: true,
        timeMsg: "获取验证码",
        time: 60
      },
      submitData: {
        disabled: true
      },
      checked: false
    };
  },
  mounted() {
    console.log(this.$route.params);
  },
  methods: {
    // 格式校验
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
      if (type === "phone") {
        if (regPhone.test(this.phone)) {
          this.codeData.disabled = false;
        } else {
          this.codeData.disabled = true;
        }
      }
      if (
        regPassword.test(this.password) &&
        regPhone.test(this.phone) &&
        this.code.length === 4
      ) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    // 获取验证码
    async sms() {
      let data = {
        mobile: this.phone,
        version: "1.0"
      };
      let res = await SMS(data);
      console.log(res);
    },
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    // 确认并注册
    async regist() {
      let data = {
        mobile: this.phone,
        auth_code: this.code,
        pwd: this.password,
        version: "1.0"
      };

      let res = await REG(data);

      if (res.hasOwnProperty("response_code")) {
        this.$router.push({ name: "personalIndex", params: data });
        console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    },
    submitAction() {
      this.regist();
    }
  }
};
</script>