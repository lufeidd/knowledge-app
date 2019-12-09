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
            <span class="amount">{{item.money}}</span>
          </div>
          <!--兑换条件-->
          <div class="requirement">
            <van-button type="default" color="#FFB54D" @click="">{{item.brand}}</van-button>
            <span class="state">{{item.range}}</span>
            <p class="price">满{{item.min_money}}元可用</p>
          </div>
          <div class="nothing_left" v-if="item.state == 0"></div>
          <div class="redeem_btn">
            <van-button type="primary" disabled color="#F05654" v-if="item.state == 0">免费兑换</van-button>
            <van-button type="primary" color="#F05654" @click="couponsRedeem(item)" v-else>免费兑换</van-button>
          </div>
        </div>
        <div class="goods_list">
          <!--<div class="goods_item"></div>-->
          <div class="goods_item" v-for="(subItem, index) in item.goods" :key="index" v-lazy:background-image="subItem.pic"></div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
  import {REDEEM_GOODS} from "@/apis/redeem";

  export default {
    name: "coupons",
    data() {
      return {
        code: '0',
        couponsDetail: {},
        couponsLoading: false,
        couponsFinished: false,
        couponsList: [],
        percentCoupons: {}
      };
    },
    methods: {
      couponsLoad() {
        setTimeout(() => {
          let list = this.couponsDetail.goods_list;
          list.forEach((item) => {
            if (item.goods_num == item.used_num) {
              item.state = 0; // 已领完
            }
          });
          for (let i = 0; i < list.length; i++) {
            this.couponsList.push(list[i]);
          }
          // 加载状态结束
          this.couponsLoading = false;

          // 数据全部加载完成
          if (this.couponsList.length >= list.length) {
            this.couponsFinished = true;
          }
        }, 500);
      },
      couponsRedeem(item) {
        if (item != undefined) {
          this.percentCoupons = item;
        }
        // console.log(this.percentGoods);
        // console.log(this.goodsDetail);
        if (false) { // 测试 未登录
          this.$router.push({name: 'redeemLogin', params: {goodsItem: JSON.stringify(item)}});
        } else {
          this.submitRedeem();
        }
      },
      async submitRedeem() {
        let data = {
          redeem_id: this.couponsDetail.redeem_id,
          ticket_id: this.percentCoupons.ticket_id,
          code: this.code,
          version: "1.0"
        };
        let res = await REDEEM_GOODS(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log(res);
          if (true) { // APP
            this.$router.push({name: 'appSuccess', query: {goodsName: this.percentCoupons.title}});
          } else {
            this.$router.push({name: 'wapSuccess', query: {goodsName: this.percentCoupons.title}});
          }
        } else {
          this.$router.push({name: 'fail', query: {errorMsg: res.error_message}});
        }
      }
    },
    created() {
      this.couponsDetail = JSON.parse(this.$route.params.couponsDetail);
      this.code = this.$route.params.code;
      console.log(this.couponsDetail);
      console.log('code',this.code);
    }
  }
</script>

<style src="@/style/scss/pages/redeem/coupons.scss" lang="scss">

</style>
