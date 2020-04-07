<template>
  <div id="changePhonePage">
    <p class="info">修改手机号</p>
    <div class="action_wrapper">
      <van-field
        class="phone"
        v-model="phone"
        clearable
        placeholder="请输入新手机号"
        error-message
        type="tel"
        @input="checkSubmit ('phone')"
      />
      <van-button slot="button" size="large" type="danger" v-if="submitData.disabled" disabled>获取验证码</van-button>
      <van-button slot="button" size="large" type="danger" v-else @click="getCode">获取验证码</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        phone: '',
        submitData: {
          disabled: true
        }
      };
    },
    methods: {
      // 校验格式
      checkSubmit() {
        // 配合正则，表单字符指定位置添加空格
        var _code = this.phone
          .replace(/[^0-9]/g, "")
          .substring(0, 11);
        var _type = 'tel';
        this.phone = this.$inputSpace(_code, _type);

        var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        if (regPhone.test(this.phone.replace(/\s/g, ''))) {
          this.submitData.disabled = false;
        } else {
          this.submitData.disabled = true;
        }
      },
      getCode() {
        this.$router.replace({name: 'verification2.0', query:{phone: this.phone,type: 'newChangePhone'}});  //  跳转到新手机获取验证码页面
      }
    }
  }
</script>

<style src="@/style/scss/pages/login2.0/set/changePhone.scss" lang="scss" scoped>

</style>
