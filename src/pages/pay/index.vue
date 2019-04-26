<template>
  <div id="payIndex">
    <div class="content">
      <div class="money">
        ¥
        <span class="price">{{money.toFixed(2)}}</span>
      </div>
      <div class="msg">支付剩余时间 {{ timeData.date }}</div>
    </div>

    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button size="large" type="danger">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wechart-block"></use>
        </svg>微信支付
      </van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      timeData: {
        time: 100,
        date: '00:00:00'
      },
      money: 19.77
    };
  },
  mounted() {
    this.$timeCountDown(this.timeData);
  }
};
</script>

