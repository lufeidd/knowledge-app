<template>
  <div id="helpPage" :style="{'background-color':bgcolor}">
    <div class="active-bg">
      <div class="bg-piture" v-lazy:background-image="helpinitData.activity_cover"></div>
      <div class="activeRules" @click="activeRules">
        <div class="activeText">活动规则</div>
      </div>
    </div>
    <div class="helpBoss" v-if="supportGet">你已成功助力星期八！</div>
    <div class="couponImg">
      <div class="text" v-if="supportGet">你已获得：</div>
      <div class="bookImg" v-lazy:background-image="helpinitData.support_award_pic" v-if="supportSuccess"></div>
    </div>
    <div class="fieldBox" v-if="supportNew">
      <van-field
        :class="{ phone: isPhone }"
        v-model="phone"
        clearable
        placeholder="请输入您的手机号"
        error-message
        type="tel"
        maxlength="11"
        @input="checkSubmit ('phone')"
      />
      <van-field
        v-model="code"
        clearable
        maxlength="4"
        placeholder="请输入短信验证码"
        @input="checkSubmit ('')"
        class="codestyle"
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
    </div>
    <div class="newPrompt" v-if="supportOld">
      只有新用户可以助力哦！
    </div>
    <div class="activeMore">
      <div class="moreText" v-if="this.initButton" @click="supportCheck">
        帮好友助力，我也领5元
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myactive_jiantou" />
        </svg>
      </div>
      <div class="moreText" v-else-if="this.newuser" @click="supportNewCheck">
        帮好友助力，我也领5元
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myactive_jiantou" />
        </svg>
      </div>
      <router-link :to="{name: 'assistactive'}" v-else>
        <div class="moreText">
          我也要领
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-myactive_jiantou" />
          </svg>
        </div>
      </router-link>
    </div>
    <router-link :to="{name: 'assistactive', query: {activity_id: this.activity_id}}" v-if="this.initButton">
      <div class="myText">我也要领</div>
    </router-link>
    <div class="rules" id="rules">
      <div class="rules-tit">
        <div class="line"></div>
        <div class="rulesTitle">活动规则</div>
        <div class="line"></div>
      </div>
      <div class="rulesCount">{{ helpinitData.rules }}</div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/assist/help.scss" scoped lang="scss"></style>

<style lang="scss" scoped>
  #helpPage{
    .van-field__clear {
      color: red;
    }
  }

</style>
<script>
  import {  ASSISTANCE_SUPPORTER ,ASSISTANCE_INVITEDETAIL ,ASSISTANCE_SUPPORTCHECK } from "../../apis/assist";
  import { REG, SMS, PASSPORT_CHECKPHONE, LOGIN_BIND_PARTERNER } from "../../apis/passport.js";
  export default {
    data () {
      return {
        phone: "",
        isPhone: true,
        newuser: true,
        supportNew: false,
        supportOld: false,
        supportSuccess: true,
        initButton: true,
        supportGet: false,
        headimg: "",
        nickname: "",
        openid: "",
        unionid: "",
        launch_id:0,
        code: "",
        bgcolor: "",
        helpinitData: {},
        activity_id: 0,
        supportCheckData: {},
        codeData: {
          disabled: true,
          timeMsg: "获取验证码",
          time: 60
        },
        submitData: {
          disabled: true
        },
        checked: true
      }
    },
    mounted () {
      this.launch_id = this.$route.query.launch_id;
      this.helpGetData();
      //获取微信信息
      this.headimg = localStorage.getItem("headimg");
      this.nickname = localStorage.getItem("nickname");
      this.openid = localStorage.getItem("openid");
      this.unionid = localStorage.getItem("unionid");
    },
    methods: {
      activeRules () {
        document.querySelector("#rules").scrollIntoView(true);
      },
      // 格式校验
      checkSubmit (type) {
        var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        if (type === "phone") {
          if (regPhone.test(this.phone)) {
            this.codeData.disabled = false;
          } else {
            this.codeData.disabled = true;
          }
        }
        if (
          regPhone.test(this.phone) &&
          this.code.length === 4 &&
          this.checked == true
        ) {
          this.submitData.disabled = false;
        } else {
          this.submitData.disabled = true;
        }
      },
      // 获取验证码
      async sms () {
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
      getCode () {
        this.$countDown(this.codeData);
        this.sms();
      },
      // 获取助力页初始化基本信息
      async helpGetData () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.launch_id,
          unionid: this.unionid,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_INVITEDETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          this.helpinitData = res.response_data;
          this.activity_id = res.response_data.activity_id;
          this.bgcolor = this.helpinitData.background;
        } else {
          this.$toast(res.error_message);
        }
      },
      //验证用户为新用户还是老用户
      async supportCheck () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.launch_id,
          unionid: this.unionid,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_SUPPORTCHECK(data);
        if (res.hasOwnProperty("response_code")) {
          if(res.response_data.state == "suc") {
            this.supportNew = true;
            this.supportOld = false;
            this.supportSuccess = false;
            this.initButton = false;
          } else {
            this.supportNew = false;
            this.supportOld = true;
            this.supportSuccess = false;
            this.initButton = false;
          }
        } else {
          this.$toast(res.error_message);
        }
      },
      async supportNewCheck () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.launch_id,
          activity_id: this.helpinitData.activity_id,
          type: 2,
          mobile: this.phone,
          auth_code: this.code,
          outer_id: this.unionid,
          outer_name: this.nickname,
          header_pic: this.headimg,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await LOGIN_BIND_PARTERNER(data);
        if (res.hasOwnProperty("response_code")) {
          if(res.response_data.user_id) {
            this.supportNew = false;
            this.initButton = false;
            this.supportSuccess = true;
            this.supportGet = true;
            this.newuser = false;
          } else {
            this.$toast(res.error_message);
          }
        } else {
          this.$toast(res.error_message);
        }
      }
    }
  }
</script>
