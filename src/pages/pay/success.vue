<template>
  <div id="paysuccessPage">
    <div class="content">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-pay-success" />
      </svg>
      <div class="msg">订单支付成功</div>
      <div class="money">
        支付金额
        <span class="price">¥{{ pay_money }}</span>
      </div>
    </div>
    <div class="recharge">
      <van-button
        size="large"
        round
        type="danger"
        v-if="open_id"
        :to="{name: 'groupdetail', query: {open_id: open_id}}"
      >查看拼团详情</van-button>
      <van-button
        size="large"
        round
        type="danger"
        v-else
        :to="{name: 'orderdetail', query: {order_id: order_id}}"
      >查看订单</van-button>
      <van-button
        style="background-color: #fff;"
        size="large"
        round
        plain
        :to="{name: 'brand', query: {brand_id: brand_id}}"
        type="danger"
      >返回商铺</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" lang="scss" scoped></style>

<style lang="scss">
#paysuccessPage {
  .van-button--plain.van-button--danger {
    margin-top: 25px;
  }
}
</style>


<script>
import { USER_ORDER_DETAIL_GET } from "../../apis/user.js";
export default {
  data() {
    return {
      pay_money: null,
      order_id: null,
      open_id: null,
      brand_id:null,
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.pay_money = this.$route.query.pay_money;
    this.open_id = this.$route.query.open_id;
  },
  methods: {
    async getBrandId() {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.brand_id = res.response_data.brand_id;
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

