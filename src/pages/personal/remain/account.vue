<template>
  <div id="accountPage">
    <div class="content">
      <span>¥</span>
      <span class="money">{{money ? money : 0}}</span>

      <p class="currentRemain">当前余额</p>
    </div>
    <div class="account">
      <p>请选择充值金额</p>
      <ul class="choose">
        <li
          v-for="item,index in rechargeAmount"
          :class="activeClass == index ? 'active':''"
          @click="getActive(index)"
        >{{item}}元</li>
      </ul>
      <p class="explain" style="padding: 10px 0;">充值说明:</p>
      <div class="explain">1、充值金额仅限火把app内使用。</div>
      <div class="explain">2、充值金额暂不支持跨系统使用（ios和android系统充值金额不可通用）。</div>
      <div class="explain">3、充值成功后余额永久有效，但不可进行提现、退款、赠送他人等操作。</div>
      <div class="explain">4、若充值后长时间未生效或有充值失败等情况，请联系客服：0571-26306860，也可去微信公众号找“号名称”解决。</div>
    </div>
    <div class="recharge">
      <van-button slot="button" size="large" round type="danger" @click="account()">充值</van-button>
    </div>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/remain/index.scss" scoped lang="scss"></style>

<script>
import { USER_REMAIN_INFO } from "../../../apis/user.js";
import easyNav from "./../../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: false,
        // searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type: "order"
      },
      money: null,
      rechargeAmount: [6, 18, 38, 58, 118, 168, 218, 488],
      activeClass: 0
    };
  },
  mounted() {
    this.getRemainData();
  },
  methods: {
    getActive(index) {
      this.activeClass = index;
    },
    account() {
      if (this.activeClass >= 0) {
        console.log(this.activeClass);
      }
    },
    //获取页面数据
    async getRemainData() {
      var data = {
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        
        this.money = res.response_data.balance;
        console.log(res.response_data.balance);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          
        }
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

