<template>
  <div id="paysuccessPage">
    <div class="content">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-pay-success"></use>
      </svg>
      <div class="msg">订单支付成功</div>
      <div class="money">
        支付金额
        <span class="price">¥{{money.toFixed(2)}}</span>
      </div>
    </div>
    <div class="recharge">
      <van-button size="large" round type="danger">查看订单</van-button>
      <van-button size="large" round plain type="danger">返回商铺</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      money: 12.5
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

