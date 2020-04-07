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
    <p class="tips">
      <span @click="resend" v-if="cdata.time=='0'">获取验证码</span>
      <span v-else>{{cdata.time}}s后重新发送</span>
    </p>

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
  import { SMS, LOGIN_BIND_PARTERNER } from "@/apis/passport.js";
  import { REG, PHONE_LOGIN } from "@/apis/passport.js";
  import { CHECK_CODE } from "@/apis/passport.js";
  import { USER_PHONE_RESETSAVE } from "@/apis/user.js";


  export default {
    data() {
      return {
        code: '',
        phone: '',
        type: '', // 登录方式
        isRegister: Boolean,
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
    // watch: {
    //   cdata: {
    //     handler() {
    //       //  倒计时为0重新发送
    //       if (this.cdata.time == 0) {
    //
    //       }
    //     },
    //     deep: true
    //   }
    // },
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
        // console.log(res);
        this.$toast('短信已发送');
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
      // 手机号注册
      async phoneRegist() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          auth_code: this.code,
          // pwd: this.password,
          source_url: localStorage.getItem("defaultLink"),
          version: "1.0"
        };
        data.sign = this.$getSign(data);

        let res = await REG(data);

        if (res.hasOwnProperty("response_code")) {
          // this.$router.push({ name: "personalIndex", query: data });
          // console.log(res);

          // 不需要登录的页面，如果未登录，进入登录页，登录成功后回退到指定页面
          // window.location.href = localStorage.getItem("defaultLink");
        } else {
          this.$toast(res.error_message);
          this.code = '';
        }
      },
      // 手机号登录
      async phoneLogin() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          auth_code: this.code,
          version: "1.1"
        };
        let res = await PHONE_LOGIN(data);
        if (res.hasOwnProperty("response_code")) {
            // console.log('登录成功');
          // 登录将localstorage中进度数据清空
          localStorage.setItem("miniAudio", null);
          localStorage.setItem("audioProgress", null);
          localStorage.setItem("cmts", null);
          localStorage.setItem("fromLink", null);
          localStorage.setItem("closeAudio", null);
          localStorage.setItem(("loginState"), 1);

          // 不需要登录的页面，如果未登录，进入登录页，登录成功后回退到指定页面
          window.location.href = localStorage.getItem("defaultLink");
        } else {
          this.$toast(res.error_message);
          this.code = '';
        }
      },
      async checkCode() {
        let data = {
          mobile: this.phone.replace(/\s/g, ''),
          auth_code: this.code,
          version: "1.1"
        };
        let res = await CHECK_CODE(data);
        if (res.hasOwnProperty("response_code")) {
          if (this.type == 'changePassword') {
            this.$router.replace({name: 'changePassword2.0', query: {phone: this.phone, code: this.code}});
          } else if (this.type == 'oldChangePhone') {
            this.$router.replace({name: 'changePhone2.0', query: {phone: this.phone, code: this.code}});
          } else if (this.type == 'newChangePhone') {
            this.resetSave();
          }
        } else {
          this.$toast(res.error_message);
          this.code = '';
        }
      },
      // 修改手机号
      async resetSave() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          mobile: this.phone.replace(/\s/g, ''),
          auth_code: this.code,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await USER_PHONE_RESETSAVE(data);
        // console.log(res.response_data);
        if (res.hasOwnProperty("response_code")) {
          this.$toast("手机号更改成功~");
          this.$router.push({name: 'login2.0'});
        } else {
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

            // 如果已注册，请求登录接口
            if (this.isRegister) {
              // console.log('已注册');
              this.phoneLogin();
            } else {  // 如果未注册，请求注册接口
              // console.log('未注册');
              this.phoneRegist();
            }

          } else {
            this.checkCode();
          }
        }
      },
      deleteCode() {
        this.code = this.code.slice(0, this.code.length - 1);
      },
      resend() {
        this.sms();
        let cdata = this.cdata;
        cdata.phone = this.phone.replace(/\s/g, '');
        this.$countDown2(cdata);
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
      this.isRegister = this.$route.query.isRegister;
      // 刷新是否应该限制发短信？
      this.sms();
      this.countdown();

      // 绑定
      this.bindtype = parseInt(this.$route.query.bindtype);
      this.outerId = this.$route.query.outerId;
      // this.activity_id = this.$route.query.activity_id ? this.$route.query.activity_id : false;
    },
    beforeRouteLeave(to, from, next) {
      var _this = this;

      // console.log('to', to);
      // console.log('from', from);

      if (to.name == 'login2.0') {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断登录，确定返回？',
            cancelButtonText: "取消",
            confirmButtonText: "确定"
          })
          .then(() => {
            next();
            if (_this.type == 'wxLogin') {
              _this.$router.push({name: 'login2.0'});

            }
          })
          .catch(() => {
            // on cancel
            next();
            _this.$router.push({
              name: "verification2.0",
              query: {phone: this.phone}
            });
          });
      } else if (to.name == 'phoneLogin2.0') {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断登录，确定返回？',
            cancelButtonText: "取消",
            confirmButtonText: "确定"
          })
          .then(() => {
            next();
            if (_this.type == 'phoneLogin') {
              _this.$router.push({name: 'phoneLogin2.0', query: {phone: this.phone}});
            }
          })
          .catch(() => {
            // on cancel
            next();
            _this.$router.push({
              name: "verification2.0",
              query: {phone: this.phone}
            });
          });
      } else if (to.name == 'passwordLogin2.0') {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断登录，确定返回？',
            cancelButtonText: "取消",
            confirmButtonText: "确定"
          })
          .then(() => {
            next();
              _this.$router.push({name: 'passwordLogin2.0'});
          })
          .catch(() => {
            // on cancel
            next();
            _this.$router.push({
              name: "verification2.0",
              query: {phone: this.phone}
            });
          });
      } else if (to.name == 'safe') {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断登录，确定返回？',
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
              name: "authentication2.0"
            });
          });
      } else if (to.name == 'bind') {
        this.$dialog
          .confirm({
            title: '点击"返回"将中断登录，确定返回？',
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
              name: "authentication2.0"
            });
          });
      }
      else {
        next();
      }
  },



  }
</script>

<style src="@/style/scss/pages/login2.0/verification.scss" lang="scss" scoped>

</style>
