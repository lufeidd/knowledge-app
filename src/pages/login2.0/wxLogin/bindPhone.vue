<template>
  <div id="bindPhonePage">
    <p class="info">还差最后一步，绑定手机号</p>
    <div class="action_wrapper">
      <van-field
        class="phone"
        v-model="phone"
        clearable
        placeholder="请输入手机号"
        error-message
        type="tel"
        @input="checkSubmit ()"
      />
      <template v-if="submitData.disabled">
        <van-button slot="button" size="large" type="danger" disabled>获取验证码</van-button>
      </template>
      <template v-else>
        <van-button slot="button" size="large" type="danger" @click="getCode">获取验证码</van-button>
      </template>
    </div>
    <van-popup v-model="leavePopShow" class="leave">
      <p class="leave_remind">
        点击“返回”将中断登录，
        确定返回？
      </p>
      <div class="btn_wrapper">
        <span class="cancel">取消</span>
        <span class="confirm">确定</span>
      </div>
    </van-popup>
    <van-popup v-model="registerPopShow" class="register">
      <p class="title">
        注册协议&隐私条款
      </p>
      <p class="content_one" v-text="content">
        <!--在您注册成为火把用户的同时，您需要通过点击同意的方式在线签署以下协议，请您务必仔细阅读、充分理解协议中的条款内容后再点击同意。-->
      </p>
      <p class="content_two">
        点击同意即表示您已阅读并同意
        <router-link :to="{name: 'prototype2.0', query: {type: 'prototype'}}" class="prototype">《火把平台用户注册协议》
        </router-link>
        与
        <router-link :to="{name: 'prototype2.0', query: {type: 'private'}}" class="prototype">《火把平台用户隐私条款》</router-link>
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
  import {PASSPORT_CHECKPHONE, LOGIN_BIND_PARTERNER, REGISTER_ITEMS} from "@/apis/passport.js";

  export default {
    data() {
      return {
        phone: '',
        isRegister: null, // 0 未注册 1 已注册
        content: '',
        submitData: {
          disabled: true
        },
        leavePopShow: false,
        registerPopShow: false
      };
    },
    methods: {
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
      //判断手机号是否已注册
      async checkPhone() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          version: "1.1"
        };
        data.sign = this.$getSign(data);

        let res = await PASSPORT_CHECKPHONE(data);

        if (res.hasOwnProperty("response_code")) {
          this.isRegister = res.response_data.is_register;
          // console.log(66,this.isRegister);
        } else {
          this.isRegister = null;
          this.$toast(res.error_message);
        }
      },
      // 绑定手机号  还需修改
      async bindphoneData() {
        // console.log(localStorage.getItem('nickname'));
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone,
          header_pic: localStorage.getItem('headimg'),
          auth_code: this.code,
          outer_id: this.outerId,
          type: this.bindtype,
          outer_name: localStorage.getItem('nickname'),
          openid: localStorage.getItem('openid'),
          source_url: localStorage.getItem("defaultLink"),
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await LOGIN_BIND_PARTERNER(data);
        console.log("bindphone:", res.response_data);
        if (res.hasOwnProperty("response_code")) {
          // 手机号未绑定到其他微信 // 跳转回唤醒登录页

        } else {
          // 绑定失败
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
        console.log(res);
      },
      getCode() {
        //  先判断此手机是否注册
        let _this = this;
        this.checkPhone().then(function () {
          console.log(_this.isRegister);
          if (_this.isRegister == 0) {  // 未注册
            console.log('未注册');
            _this.registerItems();
            _this.registerPopShow = true; //  弹注册条款

          } else if (_this.isRegister == 1) { // 已注册
            this.bindphoneData();
          }
        });
      },
      agree() {
        this.$router.push({name: 'verification2.0', query: {phone: this.phone}});
      },
      disagree() {
        this.registerPopShow = false;
      }
    },
    mounted() {
      // this.bindtype = parseInt(this.$route.query.bindtype);
      // this.outerId = this.$route.query.outerId;
      // this.activity_id = this.$route.query.activity_id ? this.$route.query.activity_id : false;
    }

  }
</script>

<style src="@/style/scss/pages/login2.0/wxLogin/bindPhone.scss" lang="scss" scoped>

</style>
