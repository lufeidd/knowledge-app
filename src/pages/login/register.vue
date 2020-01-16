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
        <van-checkbox v-model="checked" @click="checkAction">阅读并同意</van-checkbox>
        <span style="position:absolute;top:0px;left:90px;">
          <router-link :to="{name: 'prototype', query: {type: 'prototype'}}">《火把平台用户注册协议》</router-link>
          <router-link :to="{name: 'prototype', query: {type: 'private'}}">《隐私条款》</router-link>
        </span>
      </div>

      <div class="submitBox">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">确认并提交</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="submitAction">确认并提交</van-button>
        </template>
      </div>
      <!-- 验证码倒计时，刷新保留当前手机倒计时时间 -->
      <!-- 
      <div>{{ cdata.phone }}</div>
      <div v-if="cdata.time">{{ cdata.time }}s后重新发送</div>-->
    </div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/login/register.scss" scoped lang="scss"></style>

<style lang="scss">
@import url("./../../style/scss/components/checkbox.scss");
// @import url("./../../style/scss/components/button.scss");
#registerPage {
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
  .phone .van-field__label {
    border-right: 1px #d6d6d6 solid;
  }

  .van-field__label {
    max-width: 50px;
    margin-right: 10px;
  }
}
</style>

<script>
//  引入接口
import { REG, SMS, PASSPORT_CHECKPHONE } from "../../apis/passport.js";

export default {
  data() {
    return {
      // 验证码倒计时，刷新保留当前手机倒计时时间
      // cdata: {
      //   time: sessionStorage.getItem("second")
      //     ? parseInt(sessionStorage.getItem("second"))
      //     : 60,
      //   phone: "15000000005"
      // },

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
      checked: true
    };
  },
  mounted() {
    // 验证码倒计时，刷新保留当前手机倒计时时间
    // this.$countDown2(this.cdata);
  },
  methods: {
    // 格式校验
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
      if (type === "phone") {
        if (regPhone.test(this.phone)) {
          this.check_phone();
        } else {
          this.codeData.disabled = true;
        }
      }
      if (
        regPassword.test(this.password) &&
        regPhone.test(this.phone) &&
        this.code.length === 4 &&
        this.checked == true
      ) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    checkAction() {
      this.checkSubmit("submit");
    },
    // 获取验证码
    async sms() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        mobile: this.phone,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await SMS(data);
      console.log(res);
    },
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    //判断手机号是否已注册
    async check_phone() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        mobile: this.phone,
        version: "1.0"
      };
      data.sign = this.$getSign(data);

      let res = await PASSPORT_CHECKPHONE(data);

      if (res.hasOwnProperty("response_code")) {
        this.codeData.disabled = false;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 确认并注册
    async regist() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        mobile: this.phone,
        auth_code: this.code,
        pwd: this.password,
        source_url: localStorage.getItem("defaultLink"),
        version: "1.0"
      };
      data.sign = this.$getSign(data);

      let res = await REG(data);

      if (res.hasOwnProperty("response_code")) {
        // this.$router.push({ name: "personalIndex", query: data });
        // console.log(res);

        // 不需要登录的页面，如果未登录，进入登录页，登录成功后回退到指定页面
        window.location.href = localStorage.getItem("defaultLink");
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



