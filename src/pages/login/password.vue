<template>
  <div id="passwordPage">
    <div class="fieldBox">
      <van-field
        v-bind:class="{ phone: isPhone }"
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
      <van-field
        v-model="password"
        type="password"
        clearable
        label="新密码"
        maxlength="20"
        placeholder="新密码"
        @input="checkSubmit ('submit')"
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

<style src="@/style/scss/pages/login/password.scss" lang="scss"></style>

<script>
//  引入接口
import { SMS, FIND, SERVER_TIME } from "../../apis/passport.js";
import crypto from "crypto";
import ksort from "../../apis/ksort.js";

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
        time: 120
      },
      submitData: {
        disabled: true
      }
    };
  },
  mounted() {
    this.phone = this.$route.query.mobile;
    this.checkSubmit("phone");
    this.getServerTime();
  },
  methods: {
    // 获取服务器时间
    getServerTime(){
      this.serverTime();
    },
    async serverTime() {
      let lT = new Date().getTime();
      let data = {
        version: "1.0"
      }
      let res = await SERVER_TIME(data);
      let sT = res.response_data.timestamp * 1000;
      this.diffTime = sT - lT;
      console.log(this.diffTime);
    },
    getmd5(str) {
      var res;
      var md5 = crypto.createHash("md5");
      //update("中文", "utf8")
      md5.update(str);
      var res = md5.digest("hex");
      console.log(res);
      //47bce5c74f589f4867dbd57e9ca9f808
      return res;
    },
    // 校验格式
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      if (type === "phone") {
        var value = this.phone;

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
    // 确认并提交
    async findPwd() {
      var lT = new Date().getTime();
      var ts = parseInt((lT + this.diffTime) / 1000);
      var data = {
        mobile: this.phone,
        auth_code: this.code,
        pwd: this.password,
        timestamp: ts,
        version: "1.0",
        ma: "123"
      };
      data.sign = this.getSign(data);

      let res = await FIND(data);
      if (res.response_code) {
        console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    },
    getSign(data) {
      let str = "";
      data = this.$ksort(data);

      Object.keys(data).forEach(function(key) {
        str += key + data[key];
        console.log(key, data[key]);
      });

      return this.getmd5(str).toUpperCase();
    },

    submitAction() {
      let data = {
        mobile: this.phone,
        auth_code: this.code,
        pwd: this.password
      };
      this.findPwd();
      // this.$router.push({ path: "login", query: queryData });
    }
  }
};
</script>