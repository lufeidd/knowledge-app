<template>
  <div id="typePage">
    <div class="refund" @click="torefundThree">
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
    <div class="refund" @click="torefundTwo">
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

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
export default {
  data () {
    return {
        order_id:null,
        detail_id:null,
        refund_money:null,
        refund_count:null,
    }
  },
  mounted(){
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    this.refund_money = this.$route.query.refund_money;
    this.refund_count = this.$route.query.refund_count;
  },
  methods:{
    torefundThree(){
      this.$router.push({
        name:"refundthree",
        query:{
          order_id:this.order_id,
          detail_id:this.detail_id,
          refund_money:this.refund_money,
          refund_count:this.refund_count,
        }
      })
    },
    torefundTwo(){
      this.$router.push({
        name:"refundtwo",
        query:{
          order_id:this.order_id,
          detail_id:this.detail_id,
          refund_money:this.refund_money,
          refund_count:this.refund_count,
        }
      })
    }
  }
}
</script>
