<template>
  <div id="verificationPage">
    <p class="info">验证码已经发送到您的手机</p>
    <p class="phone" v-text="phone"></p>
    <van-password-input
      :value="code"
      :mask="false"
      @focus="showKeyboard = true"

      :length=4
    />
    <van-number-keyboard
      :show="showKeyboard"
      @input="inputCode"
      @delete="deleteCode"
      @blur="showKeyboard = false"
    />
    <p class="tips">{{cdata.time}}s后重新发送</p>
    <!--<van-popup v-model="leavePopShow" class="leave">-->
    <!--<p class="leave_remind">-->
    <!--点击“返回”将中断登录，-->
    <!--确定返回？-->
    <!--</p>-->
    <!--<div class="btn_wrapper">-->
    <!--<span class="cancel" @click="cancel">取消</span>-->
    <!--<span class="confirm" @click="confirm">确定</span>-->
    <!--</div>-->
    <!--</van-popup>-->
  </div>
</template>

<script>
  import {SMS, LOGIN_BIND_PARTERNER} from "@/apis/passport.js";

  export default {
    data() {
      return {
        code: '',
        phone: '',
        type: '', // 登录方式
        // 验证码倒计时，刷新保留当前手机倒计时时间
        cdata: {
          time: sessionStorage.getItem("second")
            ? parseInt(sessionStorage.getItem("second"))
            : 60
        },
        leavePopShow: false,
        showKeyboard: false
      };
    },
    watch: {
      cdata: {
        handler() {
          //  倒计时为0重新发送
          if (this.cdata.time == 0) {
            // this.sms();
            let cdata = this.cdata;
            cdata.phone = this.phone.replace(/\s/g, '');
            this.$countDown2(cdata);
          }
        },
        deep: true
      }
    },
    methods: {
      // 获取验证码
      async sms() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await SMS(data);
        console.log(res);
      },
      // 绑定手机号  还需修改
      async bindphoneData() {
        // console.log(localStorage.getItem('nickname'));
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
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
          window.location.href =
            window.location.protocol +
            "//" +
            window.location.hostname +
            "/#/personal/index";
          //活动页跳转新增参数
          if (this.activity_id) {
            this.$router.push({
              name: "assistactive",
              query: {
                activity_id: this.activity_id
              }
            });
          }

        } else {
          // 绑定失败
          this.$toast(res.error_message);
        }
      },
      inputCode(key) {
        this.code = (this.code + key).slice(0, 4);

        if (this.code.length == 4) {
          // 已输入四位验证码
          if (this.type == 'wxLogin') {
            this.bindphoneData();

          } else if (this.type == 'phoneLogin') {


          } else if (this.type == 'passwordLogin') {

          }
        }
      },
      deleteCode() {
        this.code = this.code.slice(0, this.code.length - 1);
      },
      countdown() {
        // 验证码倒计时，刷新保留当前手机倒计时时间
        let cdata = this.cdata;
        cdata.phone = this.phone.replace(/\s/g, '');
        // console.log('cdata',cdata);
        this.$countDown2(cdata);
      }
      // cancel() {
      //   this.leavePopShow = false;
      //
      // },
      // confirm() {
      //   //  根据来的路由判断返回的页面
      // },

    },
    mounted() {
      this.phone = this.$route.query.phone;
      this.type = this.$route.query.type;

      // 刷新是否应该限制发短信？
      this.sms();
      this.countdown();

      // 绑定
      // this.bindtype = parseInt(this.$route.query.bindtype);
      // this.outerId = this.$route.query.outerId;
      // this.activity_id = this.$route.query.activity_id ? this.$route.query.activity_id : false;
    },
    beforeRouteLeave(to, from, next) {
      var _this = this;

      this.$dialog
        .confirm({
          title: '点击"返回"将中断登录，确定返回？',
          cancelButtonText: "取消",
          confirmButtonText: "确定"
        })
        .then(() => {
          next();
          //   //  根据来的路由判断返回的页面
          if (_this.type == 'wxLogin') {
            _this.$router.push({name: 'login2.0'});


          } else if (_this.type == 'phoneLogin') {

          } else if (_this.type == 'passwordLogin') {

          }

        })
        .catch(() => {
          // on cancel
          next();
          //  为什么用replace只生效了一次？
          _this.$router.push({
            name: "verification2.0",
            query: {phone: this.phone}
          });
        });
    },

  }
</script>

<style src="@/style/scss/pages/login2.0/verification.scss" lang="scss" scoped>

</style>
