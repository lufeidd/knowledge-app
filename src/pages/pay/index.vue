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

    <EazyNav type="order" :isShow="false"></EazyNav>
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
      pay_id: null,
      open_id: null,
      isLeave: false,
    };
  },
  mounted() {
    this.pay_id = parseInt(this.$route.query.pay_id);
    this.open_id = parseInt(this.$route.query.open_id);
    // this.money = this.$route.query.money;
    // 新增订单
    this.addOrderData();
  },
  beforeRouteLeave(to, from, next) {
    var _this = this;
    var _hour = this.timeData.date.substring(0, 2);
    var _minute = this.timeData.date.substring(3, 5);
    // console.log(123, to, 123, from, 123, next);
    if (to.fullPath.indexOf("/pay/success") != -1) {
      next()
    } else {
      // next(false);
      this.$dialog
        .confirm({
          title: "确认要离开支付页面？",
          message:
            "您的订单在" +
            _hour +
            "小时" +
            _minute +
            "分钟内未支付将被取消，请尽快完成支付。",
          cancelButtonText: "继续支付",
          confirmButtonText: "确认离开"
        })
        .then(() => {
          // next({path:"/personal/order/list"})
          // location.reload()
          next()
          var replaceUrl = window.location.href.split('#')[0] + '#' + '/personal/order/list'
          window.location.replace(replaceUrl)
        })
        .catch(() => {
          next(false)
        });
        // next();
    }
  },
  methods: {
    // 微信支付
    wxPayAction() {
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
        this.money = res.response_data.payinfo.amount;
        this.order_id = res.response_data.payinfo.product_id;
        this.pay_money = res.response_data.payinfo.amount;
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
    }
  }
};
</script>

