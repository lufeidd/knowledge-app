<template>
  <div id="typePage">
    <div class="refund">
      <div class="refundText">
        <svg class="icon red" aria-hidden="true">
          <use xlink:href="#icon-refund-all"></use>
        </svg>
        <div class="text">
          <p>退款退货</p>
          <p class="receive">已收到货，需要退还已收到的货物</p>
        </div>
      </div>
      <svg class="icon grey" aria-hidden="true">
        <use xlink:href="#icon-next-line"></use>
      </svg>
    </div>
    <div class="refund">
      <div class="refundText">
        <svg class="icon red" aria-hidden="true">
          <use xlink:href="#icon-refund-money"></use>
        </svg>
        <div class="text">
          <p>仅退款</p>
          <p class="receive">未收到货或与卖家协商同意下申请</p>
        </div>
      </div>
      <svg class="icon grey" aria-hidden="true">
        <use xlink:href="#icon-next-line"></use>
      </svg>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>
