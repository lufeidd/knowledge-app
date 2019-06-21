<template>
  <div id="bindphonePage">
    <div class="fieldBox">
      <van-field
        class="phone"
        v-model="phone"
        clearable
        label="+86"
        placeholder="请输入手机号码"
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

      <p
        style="font-size: 12px;color: #999;"
      >根据《中华人民共和国网络安全法》要求，使用信息发布、即时通讯等互联网服务进行身份信息验证。为保障您的使用体验，建议您尽快完成手机号绑定验证，感谢您的支持和理解。</p>

      <div class="submitBox" style="margin-top:50px;">
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

<style lang="scss">
@import url("./../../style/scss/components/button.scss");
#bindphonePage {
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
import { SMS, LOGIN_BIND_PARTERNER } from "../../apis/passport.js";

export default {
  data() {
    return {
      outerId: "",
      phone: "",
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
    this.bindtype = parseInt(this.$route.query.bindtype);
    this.outerId = this.$route.query.outerId;
  },
  methods: {
    // 获取验证码
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    checkSubmit(_type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (_type === "phone") {
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
    },
    // 绑定手机号
    async bindphoneData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        mobile: this.phone,
        auth_code: this.code,
        outer_id: this.outerId,
        type: this.bindtype,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await LOGIN_BIND_PARTERNER(data);
      console.log("bindphone:", res.response_data);
      if (res.hasOwnProperty("response_code")) {
        window.location.href = "http://wap.huoba.net/#/personal/index";
      } else {
        this.$toast(res.error_message);
      }
    },
    // 提交
    submitAction() {
      this.bindphoneData();
    }
  }
};
</script>