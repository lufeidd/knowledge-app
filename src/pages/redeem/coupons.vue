<template>
  <div id="redeemCouponsPage">
    <van-list
      v-model="couponsLoading"
      :finished="couponsFinished"
      finished-text="没有更多了"
      @load="couponsLoad"
    >
      <div
        class="coupons_wrapper"
        v-for="item in couponsList"
        :key="item.id"
        :title="item"
      >
        <div class="content">
          <!--兑换面额-->
          <div class="denomination">
            <span class="currency">￥</span>
            <span class="amount">5</span>
          </div>
          <!--兑换条件-->
          <div class="requirement">
            <van-button type="default" color="#FFB54D" @click="">博库网</van-button>
            <span class="state">限部分实体图书</span>
            <p class="price">满20元可用</p>
          </div>
          <div class="nothing_left"></div>
          <div class="redeem_btn">
            <van-button type="primary" color="#F05654" @click="">免费兑换</van-button>
          </div>
        </div>
        <div class="goods_list">
          <div class="goods_item"></div>
          <div class="goods_item"></div>
          <div class="goods_item"></div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
  export default {
    name: "coupons",
    data() {
      return {
        couponsLoading: false,
        couponsFinished: false,
        couponsList: [
          {
            id: '1'
          },
          {
            id: '2'
          }
        ]
      };
    },
    methods: {
      couponsLoad() {

      }
    }
  }
</script>

<style src="@/style/scss/pages/redeem/coupons.scss" lang="scss">

</style>
