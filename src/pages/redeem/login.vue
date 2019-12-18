<template>
  <div id="redeemLoginPage">
    <header class="header_wrapper" v-if="goodsType == 'goods'">
      <!--<img src="" alt="" width="80" height="80">-->
      <div class="picture" v-lazy:background-image="goodsDetail.pic"></div>
      <div class="content">
        <h3 class="title">{{goodsDetail.title}}</h3>
        <p class="sub_title">{{goodsDetail.sub_title}}</p>
        <p class="price">
          ￥{{goodsDetail.price}}
        </p>
      </div>
    </header>
    <header class="header_wrapper" v-else></header>
    <div class="spacing_bar" v-if="goodsType == 'goods'"></div>
    <main class="main_wrapper">
      <van-cell-group>
        <van-field
          class="phone_num"
          v-model="phone"
          clearable
          maxlength="11"
          placeholder="请输入您的手机号"
          @input="checkSubmit ('phone')"
        />
        <van-field
          class="message_num"
          v-model="code"
          clearable
          maxlength="4"
          placeholder="请输入短信验证码"
          @input="checkSubmit ('')"
        >
          <template v-if="codeData.disabled">
            <van-button slot="button" size="small" disabled type="default">{{codeData.timeMsg}}</van-button>
          </template>
          <template v-else>
            <van-button slot="button" size="small" type="default" @click="getCode">{{codeData.timeMsg}}</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div class="button_wrapper" v-if="submitData.disabled">
        <van-button type="primary" style="background:#F05654;border: 1px solid #F05654;" disabled>兑换</van-button>
      </div>
      <div class="button_wrapper" v-else>
        <van-button type="primary" style="background:#F05654;border: 1px solid #F05654;" @click="validatePhone">兑换</van-button>
      </div>
    </main>
  </div>
</template>

<script>
  import {SMS, LOGIN_BIND_PARTERNER} from "@/apis/passport.js";

  export default {
    name: "login",
    data() {
      return {
        phone: '',
        code: '',
        codeData: {
          disabled: true,
          timeMsg: "获取验证码",
          time: 60
        },
        submitData: {
          disabled: true
        },
        goodsType: '',
        goodsDetail: {}
      };
    },
    methods: {
      getCode() {
        this.$countDown(this.codeData);
        this.sms();
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
        console.log(res);
      },
      // 格式校验
      checkSubmit(type) {
        var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        if (type === "phone") {
          if (regPhone.test(this.phone)) {
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
      //验证用户为新用户还是老用户
      async validatePhone() {
        if (localStorage.getItem("unionid") == "undefined" ||
          localStorage.getItem("unionid") == "null" ||
          localStorage.getItem("unionid") == undefined ||
          localStorage.getItem("unionid") == null ||
          localStorage.getItem("unionid") == ""
        ) {
          sessionStorage.setItem("gotoLogin", "no");
          sessionStorage.setItem("isWxLogin", "no");

          if (
            window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
            "micromessenger"
          ) {
            sessionStorage.setItem("isWxLogin", "yes");
            if (
              localStorage.getItem("openid") == "undefined" ||
              localStorage.getItem("openid") == undefined ||
              localStorage.getItem("openid") == "null" ||
              localStorage.getItem("openid") == null ||
              localStorage.getItem("nickname") == "null" ||
              localStorage.getItem("nickname") == null ||
              localStorage.getItem("unionid") == "null" ||
              localStorage.getItem("unionid") == null ||
              localStorage.getItem("headimg") == "null" ||
              localStorage.getItem("headimg") == null ||
              this.$route.name == "pay" ||
              this.$route.name == "payaccount" ||
              this.$route.name == "account"
            ) {
              this.$getWxCode();
              if (this.wxCodeStr == "") {
                var this_count = Number(localStorage.getItem("get_count"));
                if (this_count < 2) {
                  this_count++;
                  localStorage.setItem("get_count", this_count);
                  this.$wxLogin();
                } else {
                  localStorage.setItem("get_count", 0);
                }
              }
              ;
              if (this.wxCodeStr.length > 6) {
                let url =
                  window.location.protocol +
                  "//" +
                  window.location.hostname +
                  "/callback/weixin/Userinfo?code=" +
                  this.wxCodeStr;

                var self = this;
                axios
                  .get(url)
                  .then(function (response) {
                    console.log(666, response);
                    if (
                      response.data.hasOwnProperty("code") &&
                      response.data.code == "1000"
                    ) {
                      console.log(response.data.msg);
                    } else {
                      localStorage.setItem("openid", response.data.openid);
                      localStorage.setItem("nickname", response.data.nickname);
                      localStorage.setItem("unionid", response.data.unionid);
                      localStorage.setItem("headimg", response.data.headimgurl);
                      self.wxCodeStr = "";
                      window.location.href =
                        window.location.protocol +
                        "//" +
                        window.location.hostname +
                        "/#" +
                        window.location.href.split("#")[1];
                    }
                  })
                  .catch(function (error) {
                    self.fetchError = error;
                    console.log("error:", error);
                  });
              } else {
                //this.$toast("未获取到code");
              }
            }
            console.log(
              "openid:",
              localStorage.getItem("openid"),
              "unionid:",
              localStorage.getItem("unionid"),
              "nickname:",
              localStorage.getItem("nickname")
            );
          }
          if (localStorage.getItem("unionid") != "undefined" ||
            localStorage.getItem("unionid") != "null" ||
            localStorage.getItem("unionid") != undefined ||
            localStorage.getItem("unionid") != null ||
            localStorage.getItem("unionid") != ""
          ) {
            this.toRedeem();
          }
        } else {
          this.toRedeem();
        }
      },
      async toRedeem() {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.launch_id,
          // activity_id: this.helpinitData.activity_id,
          type: 2,
          mobile: this.phone,
          auth_code: this.code,
          outer_id: localStorage.getItem("unionid"),
          outer_name: localStorage.getItem("nickname"),
          header_pic: localStorage.getItem("headimg"),
          openid: localStorage.getItem("openid"),
          // outer_id: tStamp,
          // outer_name: tStamp,
          // header_pic: tStamp,
          // openid: tStamp, //  测试
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await LOGIN_BIND_PARTERNER(data);
        if (res.hasOwnProperty("response_code")) {
        // if (true) { // 测试
          console.log(res);
          this.$router.go(-1);
        } else {
          // this.$toast(res.error_message);
        }
      }
    },
    created() {
      this.goodsType = sessionStorage.getItem("goodsType");
      this.goodsDetail = JSON.parse(sessionStorage.getItem("goodsItem"));
    }
  }
</script>

<style src="@/style/scss/pages/redeem/login.scss" lang="scss">

</style>
