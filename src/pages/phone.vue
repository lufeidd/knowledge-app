<template>
  <div id="phonePage">
    <van-nav-bar title="绑定手机号" left-text right-text left-arrow @click-left="onClickLeft"/>

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

      <p
        class="tip"
      >根据《中华人民共和国网络安全法》要求，使用信息发布、即时通讯等互联网服务进行身份信息验证。为保障您的使用体验，建议您尽快完成手机号绑定验证，感谢您的支持和理解。</p>

      <div class="submitBox">
        <template v-if="submitData.disabled">
          <van-button slot="button" size="large" disabled round type="danger">确认并提交</van-button>
        </template>
        <template v-else>
          <van-button slot="button" size="large" round type="danger" @click="gotoPage">确认并提交</van-button>
        </template>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/phone.scss" lang="scss"></style>

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
  mounted() {},
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
      let queryData = {
        phone: this.phone,
        password: this.password
      };
      this.$router.push({ path: "login", query: queryData });
    }
  }
};
</script>