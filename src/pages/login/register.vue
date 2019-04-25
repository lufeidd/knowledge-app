<template>
  <div id="registerPage">
    <!-- <van-nav-bar title="注册" left-text right-text left-arrow @click-left="onClickLeft"/> -->

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

      <van-checkbox v-model="checked">阅读并同意《火把服务用户协议》</van-checkbox>

      <div class="submitBox">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">确认并提交</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="gotoPage">确认并提交</van-button>
        </template>
      </div>
    </div>
    {{ axiosData }}
  </div>
</template>

<style src="@/style/scss/pages/login/register.scss" lang="scss"></style>

<script>
import qs from "Qs";
import regeneratorRuntime from './../../regenerator-runtime/runtime.js';

// 1. 引入登录的接口定义
import { LOGIN } from "../../apis/member.js";
import { TEST } from "../../apis/member.js";

export default {
  data() {
    return {
      axiosData: "",
      phone: "",
      isPhone: true,
      code: "",
      password: "",
      codeData: {
        disabled: true,
        timeMsg: "获取验证码",
        time: 3
      },
      submitData: {
        disabled: true
      },
      checked: true
    };
  },
  mounted() {
    //3. 执行登录
    this.login();
  },
  methods: {
    // 2. 定义登录的逻辑
    async login() {
      // 2.1 awiat LOGIN(this.user)
      // 等待LOGIN(this.user)执行完,
      // 把返回值给userInfo
      // let userInfo = await LOGIN(this.user);
      // 2.2假设登录成功,返回的数据应该是
      // userInfo = {code:200, msg: 'success', data: {token:'xxxxx'}}
      // 然后根据返回的数据做相应的处理，比如储存token

      let phone = '15268789899';
      // let phone = this.phone;
      let data = {
        mobile: phone
      };
      // let test = await LOGIN(data);
      let test = await TEST('');
      console.log('test:', test);
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    getCode() {
      let method = "/sendsms";
      let phone = this.phone;
      let data = {
        mobile: phone
      };
      this.$countDown(this.codeData);
    },
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (type === "phone") {
        if (regPhone.test(this.phone)) {
          this.codeData.disabled = false;
        } else {
          this.codeData.disabled = true;
        }
      }
      if (
        regPassword.test(this.password) &&
        !this.codeData.disabled &&
        this.code.length === 4
      ) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    gotoPage() {
      let method = "/register";
      let data = {
        mobile: this.phone,
        auth_code: this.code,
        pwd: this.password
      };
      console.log("提交：", data);
      // this.$router.push({ path: "login", query: queryData });
    }
  }
};
</script>