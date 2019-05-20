<template>
  <div id="paysuccessPage">
    <div class="content">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-pay-success"></use>
      </svg>
      <div class="msg">订单支付成功</div>
      <div class="money">
        支付金额
        <span class="price">¥{{ pay_money }}</span>
      </div>
    </div>
    <div class="recharge">
      <van-button size="large" round type="danger" :to="{name: 'orderdetail', params: {order_id: order_id}}">查看订单</van-button>
      <van-button size="large" round plain type="danger">返回商铺</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" lang="scss" scoped></style>

<style>

  #paysuccessPage .van-button--plain.van-button--danger {
    margin-top: 25px;
  }
</style>


<script>
export default {
  data() {
    return {
      pay_money: null,
      order_id: null,
    };
  },
  mounted () {
    this.order_id = this.$route.params.order_id;
    this.pay_money = this.$route.params.pay_money;
  },
};
</script>

