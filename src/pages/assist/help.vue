<template>
  <div id="helpPage">
    <div class="active-bg">
      <div class="bg-piture"></div>
      <div class="promptTwo">
        <div class="prompt dn">邀请好友助力即可获得</div>
        <div class="prompt">星期八邀你助力,免费领取</div>
      </div>
    </div>
    <div class="helpBoss" :class="user.state == 0? '':'dn'">你已成功助力星期八！</div>
    <div class="couponImg">
      <div class="text" :class="user.state == 0? '':'dn'">你已获得：</div>
      <div class="bookImg" :class="newUser.count == 0? '':'dn'" v-lazy:background-image="couponImg[0].pic"></div>
    </div>
    <div class="fieldBox dn">
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
    <div class="newPrompt">
      只有新用户可以助力哦！
    </div>
    <div class="activeMore">
      <div class="moreText" v-if="this.newuser">
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
    <div class="rules dn" :class="user.state == 0? 'dn':''">
      <div class="rules-tit">
        <div class="line"></div>
        <div class="rulesTitle">活动规则</div>
        <div class="line"></div>
      </div>
      <div class="rulesCount">{{this.helpRule}}</div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/assist/help.scss" scoped lang="scss"></style>

<style lang="scss" scoped>
  #helpPage{

  }
</style>
<script>
  export default {
    data () {
      return {
        phone: "",
        isPhone: true,
        newuser: true,
        code: "",
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
    methods: {
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
      }
    }
  }
</script>
