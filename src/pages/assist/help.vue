<template>
  <div id="helpPage" :style="{'background-color':bgcolor}">
    <div class="active-bg">
      <div class="bg-piture" v-lazy:background-image="activityData.base.activity_cover"></div>
      <div class="activeRules" @click="activeRules">活动规则</div>
    </div>
    <div class="helpBoss" :class="user.state == 0? '':'dn'">你已成功助力星期八！</div>
    <div class="couponImg">
      <div class="text" :class="user.state == 0? '':'dn'">你已获得：</div>
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
      <div class="moreText" v-if="this.newuser" @click="supportCheck">
        帮好友助力，我也领5元
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myactive_jiantou" />
        </svg>
      </div>
      <div class="moreText" v-else>
        我也要领
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myactive_jiantou" />
        </svg>
      </div>
    </div>
    <div class="myText dn" :class="user.state == 0? 'dn':''">我也要领</div>
    <div class="rules" id="rules">
      <div class="rules-tit">
        <div class="line"></div>
        <div class="rulesTitle">活动规则</div>
        <div class="line"></div>
      </div>
      <div class="rulesCount">{{ activityData.base.rules }}</div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/assist/help.scss" scoped lang="scss"></style>

<style lang="scss" scoped>
  #helpPage{

  }
</style>
<script>
  import { ASSISTANCE_DETAIL , ASSISTANCE_SUPPORTER ,ASSISTANCE_INVITEDETAIL ,ASSISTANCE_SUPPORTCHECK } from "../../apis/assist";
  export default {
    data () {
      return {
        phone: "",
        isPhone: true,
        newuser: true,
        supportNew: false,
        supportOld: false,
        supportSuccess: true,
        code: "",
        bgcolor: "",
        activityData: {},
        helpinitData: {},
        activity_id: 1,
        launch_id: 0,
        unionid: "",
        supportCheckData: {},
        codeData: {
          disabled: true,
          timeMsg: "获取验证码",
          time: 60
        },
        submitData: {
          disabled: true
        },
        checked: true,
        helpRule: "我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则我是规则",
        couponImg: [
          {pic:"http://file.mhuoba.com/picture/book/20190731/11/20190731110131468.jpg"}
        ],
        user: {
          state: 1
        },
        newUser: {
          count: 1
        }
      }
    },
    mounted () {
      this.activeGetData();
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
      // 获取活动页基本信息
      async activeGetData () {
        var tStamp = this.$getTimeStamp();
        var data = {
          activity_id: this.activity_id,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_DETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          this.activityData = res.response_data;
          this.bgcolor = res.response_data.base.background;
          this.helpGetData();
        } else {
          this.$toast(res.error_message);
        }
      },
      // 获取助力页初始化基本信息
      async helpGetData () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.activityData.base.launch_id,
          unionid: "xx",
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await ASSISTANCE_INVITEDETAIL(data);
        if (res.hasOwnProperty("response_code")) {
          this.helpinitData = res.response_data;
          this.bgcolor = this.activityData.base.background;
        } else {
          this.$toast(res.error_message);
        }
      },
      //验证用户为新用户还是老用户
      async supportCheck () {
        var tStamp = this.$getTimeStamp();
        var data = {
          launch_id: this.activityData.base.launch_id,
          unionid: "xx",
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
          } else {
            this.supportNew = false;
            this.supportOld = true;
            this.supportSuccess = false;
          }
        } else {
          this.$toast(res.error_message);
        }
      }
    }
  }
</script>
