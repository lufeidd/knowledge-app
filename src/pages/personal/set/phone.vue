<template>
  <div id="phonePage" style="margin-top: 0;">
    <div class="fieldBox" style="margin-top: 0;">
      <p style="padding: 10px 0 30px 0;" v-if="pageType == 'new'">更换手机号后，下次可用新手机号登录</p>

      <van-field
        v-if="pageType == 'old'"
        v-bind:class="{ phone: isPhone }"
        v-model="phone"
        clearable
        disabled
        label="+86"
        placeholder="请输入新手机号码"
        error-message
        type="tel"
        maxlength="11"
        @input="checkSubmit ('phone')"
      />
      <van-field
        v-if="pageType == 'new'"
        v-bind:class="{ phone: isPhone }"
        v-model="phone"
        clearable
        label="+86"
        placeholder="请输入新手机号码"
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

      <div class="submitBox" v-if="pageType == 'new'" style="margin-top:50px;">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">提交</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="submitAction">提交</van-button>
        </template>
      </div>

      <div class="bottomBox" v-if="pageType == 'old'" :class="{ iphx: this.isIphx }">
        <template v-if="submitData.disabled">
          <van-button size="large" type="danger" disabled>下一步</van-button>
        </template>
        <template v-else>
          <van-button size="large" type="danger" @click="newPhone">下一步</van-button>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import url("./../../../style/scss/components/button.scss");
#phonePage {
  background-color: #fff;
  min-height: 100%;

  .van-cell {
    border-bottom: 1px #d6d6d6 solid;
    font-size: 15px;
    color: #000;
    padding: 10px 0;
    margin-bottom: 10px;
    align-items: center;
  }

  .fieldBox {
    padding: 20px;
    margin-top: 50px;
  }

  .phone .van-field__label {
    border-right: 1px #d6d6d6 solid;
  }

  .van-field__label {
    max-width: 50px;
    margin-right: 10px;
  }

  .van-checkbox__label {
    font-size: $fontSize - 1;
    color: #999;
  }

  .tip {
    font-size: $fontSize - 2;
    color: #999;
    line-height: 1.8;
  }
}
</style>

<script>
//  引入接口
import { SMS } from "../../../apis/passport.js";
import { USER_PHONE_RESET, USER_PHONE_RESETSAVE } from "../../../apis/user.js";

export default {
  data() {
    return {
      // 页面类型，old是旧手机号验证，new是新手机号验证
      pageType: "old",
      phone: "",
      isPhone: true,
      code: "",
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
    this.pageType = this.$route.params.pageType;
    if (this.pageType == "old") {
      this.phone = this.$route.params.phone;
      this.codeData.disabled = false;
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
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
    // 新手机号申请接口
    async resetSave() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        mobile: this.phone,
        auth_code: this.code,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_PHONE_RESETSAVE(data);
      console.log("123", res.response_data);
      if (res.hasOwnProperty("response_code")) {
        this.$toast("手机号更改成功~");
        this.$router.push("/personal/set/index");
      } else {
        this.$toast(res.error_message);
      }
    },
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (type === "phone") {
        if (regPhone.test(this.phone) && !this.clock) {
          this.codeData.disabled = false;
        } else {
          this.codeData.disabled = true;
        }
      }
      if (regPhone.test(this.phone) && this.code.length == 4) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    // 手机号重置申请接口
    async resetApply() {
      // console.log("code:", this.code);
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        auth_code: this.code,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_PHONE_RESET(data);
      console.log("123", res.response_data);
      if (res.hasOwnProperty("response_code")) {
        this.phone = "";
        this.pageType = "new";
        this.codeData.disabled = true;
        this.codeData.timeMsg = "获取验证码";
        this.code = "";
        this.submitData.disabled = true;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 下一步
    newPhone() {
      // 新手机号
      clearInterval(this.clock);
      this.clock = null;
      // 手机号重置申请接口
      this.resetApply();
    },
    // 提交
    submitAction() {
      if (this.phone == this.$route.params.phone) {
        this.$toast("请输入正确的手机号~");
        return;
      }
      this.resetSave();
    }
  }
};
</script>