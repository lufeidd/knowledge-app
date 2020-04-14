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
  import {CHECK_BINDING, REGISTER_ITEMS} from "@/apis/passport.js";

  export default {
    data() {
      return {
        phone: '',
        code: '',
        isRegister: null, // 0 未绑定 1 已绑定
        content: '',
        submitData: {
          disabled: true
        },
        leavePopShow: false,
        isBack: true, // 是否是离开页面
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
      //判断手机号是否已绑定微信
      async checkPhone() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          type: 2,
          version: "1.1"
        };
        data.sign = this.$getSign(data);

        let res = await CHECK_BINDING(data);

        if (res.hasOwnProperty("response_code")) {
          this.isRegister = 0;
          // console.log(66,this.isRegister);
        } else {
          this.isRegister = 1;
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
        //  先判断此手机是否已绑定微信
        let _this = this;
        this.checkPhone().then(function () {
          console.log(_this.isRegister);
          if (_this.isRegister == 0) {  // 未绑定
            console.log('未注册');
            _this.registerItems();
            _this.registerPopShow = true; //  弹注册条款

          } else if (_this.isRegister == 1) { // 已绑定
            // this.bindphoneData();
          }
        });
      },
      agree() {
        this.isBack = false;
        this.$router.replace({name: 'verification2.0', query: {phone: this.phone, type: 'wxLogin'}});

      },
      disagree() {
        this.registerPopShow = false;
      }
    },
    mounted() {

    },
    beforeRouteLeave(to, from, next) {
      var _this = this;

      if (this.isBack == true) {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断登录，确定返回？',
            cancelButtonText: "取消",
            confirmButtonText: "确定"
          })
          .then(() => {
            next();
            this.$router.push({name: 'login2.0'});
          })
          .catch(() => {
            // on cancel
            next();
            //  为什么用replace只生效了一次？
            _this.$router.push({
              name: "bindPhone2.0"
            });
          });
      } else {
        next();
      }

    }

  }
</script>

<style src="@/style/scss/pages/login2.0/wxLogin/bindPhone.scss" lang="scss" scoped>

</style>
