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
          v-for="(item,index) in rechargeAmount"
          :class="activeClass == index ? 'active':''"
          @click="getActive(index)"
          :key="index"
        >{{item}}元</li>
      </ul>
      <p class="explain" style="padding: 10px 0;">充值说明:</p>
      <div>
        <div class="explain" v-html="rechargeExplain">{{rechargeExplain}}</div>
      </div>
    </div>
    <div class="recharge" style="padding-bottom: 40px;">
      <van-button slot="button" size="large" round type="danger" @click="account()">充值</van-button>
    </div>
      <CopyRight></CopyRight>
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/personal/remain/index.scss" scoped lang="scss"></style>

<script>
import {
  USER_WALLET_RECHARGE_INFO,
  USER_WALLET_RECHARGE_ADD
} from "../../../apis/user.js";
import { CASHIER_PAY_ADD } from "../../../apis/public.js";
// import easyNav from "./../../../components/easyNav";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   // searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "order"
      // },
      money: null,
      rechargeAmount: [],
      activeClass: 0,
      rechargeExplain: "",
      goods_id:null,
    };
  },
  mounted() {
    this.goods_id = this.$route.query.goods_id;
    this.getRemainData();
  },
  methods: {
    getActive(index) {
      this.activeClass = index;
    },
    account() {
      if (this.activeClass >= 0) {
        // console.log("money:", this.rechargeAmount[this.activeClass]);
        // 用户余额充值申请创建
        this.rechargeAddData(this.rechargeAmount[this.activeClass]);
      }
    },
    // 用户余额充值申请创建
    async rechargeAddData(_money) {
      var tStamp = this.$getTimeStamp();
      let data = {
        money: _money,
        type: "NORMAL",
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_WALLET_RECHARGE_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log( res.response_data);
        // 交易支付请求发起
        this.cashierPayData(res.response_data.pay_id);
      } else {
        this.$toast(res.error_message);

      }
    },
    // 交易支付请求发起
    async cashierPayData(_payId) {
      var tStamp = this.$getTimeStamp();
      let data = {
        pay_id: _payId,
        openid: localStorage.getItem("openid"),
        type: "WXJS",
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CASHIER_PAY_ADD(data);

      if (res.hasOwnProperty("response_code")) {
        // var _package = "prepay_id=" + res.response_data.pay_arr.prepayid;
        console.log(
          res.response_data.pay_arr.timeStamp,
          res.response_data.pay_arr.nonceStr,
          res.response_data.pay_arr.sign
        );
        this.$onBridgeReady(
          res.response_data.pay_arr.timeStamp,
          res.response_data.pay_arr.nonceStr,
          res.response_data.pay_arr.package,
          res.response_data.pay_arr.sign,
          '',
          ''
        );
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取页面数据
    async getRemainData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_WALLET_RECHARGE_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.rechargeAmount = res.response_data.prices;
        this.money = res.response_data.wallet_info.balance;
        this.rechargeExplain = res.response_data.desc.replace(/\n/g, "<br>");
        // console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

