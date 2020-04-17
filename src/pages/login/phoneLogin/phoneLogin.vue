<template>
  <div id="phoneLoginPage">
    <div class="huoba_pic"></div>
    <h3 class="huoba_name">火把知识</h3>
    <div class="field_wrapper">
      <van-field
        type="tel"
        class="phone_num"
        v-model="phone"
        clearable
        placeholder="请输入手机号"
        @input="checkSubmit ()"
        ref="input"
      />
    </div>
    <div class="button_wrapper" v-if="submitData.disabled">
      <van-button size="large" type="danger" disabled>获取验证码</van-button>
    </div>
    <div class="button_wrapper" v-else>
      <van-button size="large" type="danger" @click="getCode">获取验证码</van-button>
    </div>
    <router-link :to="{name: 'passwordLogin'}" class="link_text">密码登录
    </router-link>
    <div class="wx_login" v-if="isShowWx">
      <p class="wx_login_text">快捷登录方式</p>
      <svg class="icon" aria-hidden="true" @click="wxLogin">
        <use xlink:href="#icon-weixin-block"/>
      </svg>
    </div>
    <van-popup v-model="registerPopShow" class="register">
      <p class="title">
        注册协议&隐私条款
      </p>
      <p class="content_one">
        在您注册成为火把用户的同时，您需要通过点击同意的方式在线签署以下协议，请您务必仔细阅读、充分理解协议中的条款内容后再点击同意。
      </p>
      <p class="content_two">
        点击同意即表示您已阅读并同意
        <router-link :to="{name: 'prototype', query: {type: 'prototype'}}" class="prototype">《火把平台用户注册协议》
        </router-link>
        与
        <router-link :to="{name: 'prototype', query: {type: 'private'}}" class="prototype">《火把平台用户隐私条款》</router-link>
      </p>
      <div class="btn_wrapper">
        <div class="disagree">
          <van-button type="default" size="small" style="background:#F5F5F5;" @click="disagree">不同意</van-button>
        </div>
        <div class="agree">
          <van-button type="danger" size="small" @click="agree">同意</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {PHONE_CHECK, REGISTER_ITEMS} from "@/apis/passport.js";
  export default {
    data() {
      return {
        phone: '',
        content: '',
        submitData: {
          disabled: true
        },
        isRegister: null, // 0 未注册 1 已注册
        isShowWx: true,
        registerPopShow: false
      };
    },
    methods: {
      // 格式校验
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

        sessionStorage.setItem('loginPhone', this.phone);
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
          // console.log(66,this.isRegister);
        } else {
          this.isRegister = null;
          this.$toast(res.error_message);
        }
      },
      async registerItems() {
        let data = {
          version: "1.1"
        };
        let res = await REGISTER_ITEMS(data);
        if (res.hasOwnProperty("response_code")) {
          this.content = res.response_data.content;
        } else {
          this.$toast(res.error_message);
        }
        // console.log(res);
      },

      getCode() {
        //  先判断此手机是否注册
        let _this = this;
        this.checkPhone().then(function () {
          // console.log(_this.isRegister);
          if (_this.isRegister == 0) {  // 未注册
            // console.log('未注册');
            _this.registerItems();
            _this.registerPopShow = true; //  弹注册条款

          } else if (_this.isRegister == 1) { // 已注册
            sessionStorage.setItem('isToVerification', '1');
            _this.$router.push({name: 'verification', query: {phone: _this.phone,isRegister: true, type: 'phoneLogin'}});
          }
        });
      },
      agree() {
        sessionStorage.setItem('isToVerification', '1');
        this.$router.push({name: 'verification', query: {phone: this.phone,isRegister: false, type: 'phoneLogin'}});

      },
      disagree() {
        this.registerPopShow = false;
      },
      wxLogin() {
        // this.$router.push({name: 'bindPhone'});
        // 重置页面来源
        localStorage.setItem("linkFrom", "");
        this.gotoLogin = true;
        localStorage.setItem("gotoLogin", "yes");
        this.$wxLogin();
      }
    },
    created() {
      if(localStorage.getItem('isWxLogin') == 'no') {
        this.isShowWx = false;
      } else {
        this.isShowWx = true;
      }
    },
    mounted() {
      if (sessionStorage.getItem('loginPhone')) {
        this.phone = sessionStorage.getItem('loginPhone');
        this.submitData.disabled = false;
      }else if (this.$route.query.phone) {
        this.phone = this.$route.query.phone;
        this.submitData.disabled = false;
      }

      //  微信登录
      // 获取第三方微信登录code
      this.$getWxCode();
      // linkFrom=gzh，公众号绑定手机号入口进入，提示已绑定手机号
      if (
        this.wxCodeStr.length > 6 ||
        localStorage.getItem("linkFrom") == "gzh"
      ) {
        if (localStorage.getItem("linkFrom") == "gzh") {
          this.gotoLogin = true;
          localStorage.setItem("gotoLogin", "yes");
        }
        // 允许微信第三方登录
        if (localStorage.getItem("gotoLogin") == "yes") {
          // 第三方登录
          this.$getWxLoginData();
        }
      }
    }
  }
</script>

<style src="@/style/scss/pages/login/phoneLogin/phoneLogin.scss" lang="scss" scoped>

</style>
