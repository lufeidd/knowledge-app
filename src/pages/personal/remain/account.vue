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
      <div>
        <div class="explain" v-for="(item,index) in rechargeExplain" :key="index">{{index+1+'、'+item}}</div>
      </div>
    </div>
    <div class="recharge">
      <van-button slot="button" size="large" round type="danger" @click="account()">充值</van-button>
    </div>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/remain/index.scss" scoped lang="scss"></style>

<script>
import { USER_WALLET_RECHARGE_INFO } from "../../../apis/user.js";
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
      rechargeAmount: [],
      activeClass: 0,
      rechargeExplain:[],
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
      let res = await USER_WALLET_RECHARGE_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        
        this.rechargeAmount = res.response_data.prices;
        this.money = res.response_data.wallet_info.balance;
        this.rechargeExplain = res.response_data.desc;
        // console.log(res);
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

