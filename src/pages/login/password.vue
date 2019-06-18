<template>
  <div id="lpasswordPage" class="passwordPage">
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

<style src="@/style/scss/pages/login/password.scss" scoped lang="scss"></style>

<style lang="scss">
@import url("./../../style/scss/components/button.scss");
#lpasswordPage {
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
import { SMS, FIND } from "../../apis/passport.js";

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
      }
    };
  },
  mounted() {
    this.phone = this.$route.query.mobile ? this.$route.query.mobile : '';
    this.checkSubmit("phone");
    // 获取并储存服务器和本地时间差
    this.$getServerTime();
  },
  methods: {
    // 校验格式
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
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
    // 确认并提交
    async findPwd() {
      var tStamp = this.$getTimeStamp();
      var data = {
        mobile: this.phone,
        auth_code: this.code,
        pwd: this.password,
        timestamp: tStamp,
        version: "1.0"
      };

      data.sign = this.$getSign(data);

      let res = await FIND(data);

      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          
        }
        this.$toast(res.error_message);
      }
    },
    submitAction() {
      let data = {
        mobile: this.phone,
        pwd: this.password
      };
      this.findPwd();
      this.$router.push({ name: "login", query: data });
    }
  }
};
</script>