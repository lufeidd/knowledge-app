<template>
  <div id="changePhonePage">
    <p class="info">修改手机号<span class="step_text"><span class="percent_step">3</span>/4</span></p>
    <div class="action_wrapper">
      <van-field
        class="phone"
        v-model="phone"
        clearable
        placeholder="请输入新手机号"
        error-message
        type="tel"
        @input="checkSubmit ('phone')"
        ref="input"
      />
      <van-button slot="button" size="large" type="danger" v-if="submitData.disabled" disabled>获取验证码</van-button>
      <van-button slot="button" size="large" type="danger" v-else @click="getCode">获取验证码</van-button>
    </div>
    <Bottom></Bottom>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
  import {PHONE_CHECK} from "@/apis/passport.js";

  import bottom from '@/pages/login/bottom.vue';
  export default {
    data() {
      return {
        oldPhone: '',
        phone: '',
        isRegister: null, // 0 未注册 1 已注册
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
          this.$refs.input.blur();

          this.submitData.disabled = false;
        } else {
          this.submitData.disabled = true;
        }
      },
      //判断手机号是否已注册
      async checkPhone() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          version: "1.1"
        };
        data.sign = this.$getSign(data);

        let res = await PHONE_CHECK(data);

        if (res.hasOwnProperty("response_code")) {
          this.isRegister = res.response_data.is_register;
          console.log(66,this.isRegister);
        } else {
          this.isRegister = null;
          this.$toast(res.error_message);
        }
      },
      getCode() {
        let _this = this;
        this.checkPhone().then(function () {
          if (_this.phone == _this.oldPhone) {
            _this.$toast('新手机号不能与原手机号相同');
          } else if(_this.isRegister == 1) {
            _this.$toast('此手机号已注册过');
          } else {
            sessionStorage.setItem('isToVerification', '1');
            _this.$router.replace({name: 'verification', query:{phone: _this.phone,type: 'newChangePhone'}});  //  跳转到新手机获取验证码页面
          }
        });

      }
    },
    mounted() {
      this.oldPhone = this.$route.query.phone;
    },
    components: {
      Bottom: bottom
    },
    beforeRouteLeave(to, from, next) {
      var _this = this;

      // console.log('to', to);
      // console.log('from', from);

      if (to.name == 'bind') {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断设置，确定返回？',
            cancelButtonText: "取消",
            confirmButtonText: "确定"
          })
          .then(() => {
            next();

          })
          .catch(() => {
            // on cancel
            next();
            _this.$router.push({
              name: "changePhone"
            });
          });
      } else {
        next();
      }
    }
  }
</script>

<style src="@/style/scss/pages/login/set/changePhone.scss" lang="scss" scoped>

</style>
