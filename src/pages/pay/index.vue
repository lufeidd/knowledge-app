<template>
  <div id="payIndex">
    <div class="content">
      <div class="money">
        ¥
        <span class="price">{{ money }}</span>
      </div>
      <div class="msg">支付剩余时间 {{ timeData.date }}</div>
    </div>

    <div class="bottomBox" :class="{ iphx: this.isIphx }" @click="wxPayAction">
      <van-button size="large" type="danger">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wechart-block" />
        </svg>微信支付
      </van-button>
    </div>
    
    <EazyNav type="order"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" scoped lang="scss"></style>

<script>
//  引入接口
import { ORDER_PHYSICAL_PAYINFO } from "../../apis/shopping.js";
import { CASHIER_PAY_ADD } from "../../apis/public.js";

export default {
  data() {
    return {
      timeData: {
        time: 100,
        date: "00:00:00"
      },
      money: null,
      pay_id: null
    };
  },
  mounted() {
    this.pay_id = this.$route.query.pay_id;
    this.money = this.$route.query.money;
    // 新增订单
    this.addOrderData();
  },
  methods: {
    // 微信支付
    wxPayAction () {
        this.cashierPayData();
    },
    // 新增订单
    async addOrderData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        pay_id: this.pay_id,
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_PHYSICAL_PAYINFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.timeData.time = res.response_data.payinfo.end_paytime;
        // 倒计时
        this.$timeCountDown(this.timeData);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 交易支付请求发起
    async cashierPayData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        pay_id: this.pay_id,
        openid: localStorage.getItem("openid"),
        type: "WXJS",
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CASHIER_PAY_ADD(data);
      console.log(999, res.response_data);
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
          this.order_id,
          this.pay_money
        );
      } else {
        this.$toast(res.error_message);
      }
    },
  }
};
</script>

