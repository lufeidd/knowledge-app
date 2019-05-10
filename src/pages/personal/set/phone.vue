<template>
  <div id="phonePage" style="margin-top: 0;">
    <div class="fieldBox" style="margin-top: 0;">
      <p style="padding: 10px 0 30px 0;">更换手机号后，下次可用新手机号登录</p>
      <van-field
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

      <div class="submitBox" style="margin-top:50px;">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">提交</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="gotoPage">提交</van-button>
        </template>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/login/phone.scss" lang="scss"></style>
<style>
html {
    background-color: #fff;
}
</style>

<script>
export default {
  data() {
    return {
      phone: "",
      isPhone: true,
      code: "",
      codeData: {
        disabled: true,
        timeMsg: "获取验证码",
        time: 3
      },
      submitData: {
        disabled: true
      }
    };
  },
  mounted() {
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    getCode() {
      this.$countDown(this.codeData);
    },
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (type === "phone") {
        if (regPhone.test(this.phone)) {
          this.codeData.disabled = false;
        } else {
          this.codeData.disabled = true;
        }
      }
      if (!this.codeData.disabled && this.code.length === 4) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    gotoPage() {
    }
  }
};
</script>