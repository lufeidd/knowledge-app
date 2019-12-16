<template>
  <div id="redeemCouponsPage" :style="{'background-color': couponsDetail.colour.bg?couponsDetail.colour.bg: ''}">
    <van-list
      v-model="couponsLoading"
      :finished="couponsFinished"
      finished-text="没有更多了"
      @load="couponsLoad"
    >
      <div class="propaganda" v-if="couponsDetail.pic">
        <img :src="couponsDetail.pic" alt="" width="100%">
      </div>
      <div class="coupons_wrapper" v-for="item in couponsList" :key="item.id" :title="item">
        <div class="content">
          <!--兑换面额-->
          <div class="denomination">
            <span class="currency">￥<span class="amount">{{item.money}}</span></span>
          </div>
          <!--兑换条件-->
          <div class="requirement">
            <van-button type="default" size="mini" round color="#FFB54D">{{item.brand}}</van-button>
            <span class="state">{{item.range}}</span>
            <p class="price">满{{item.min_money}}元可用</p>
          </div>
          <div class="nothing_left" v-if="item.state == 0"></div>
          <div class="redeem_btn">
            <van-button type="primary" disabled color="#F05654" v-if="item.state == 0">免费兑换</van-button>
            <van-button type="primary" color="#F05654" @click="couponsRedeem(item)" v-else>免费兑换</van-button>
          </div>
          <span class="right_radio" :style="{'background-color': couponsDetail.colour.bg?couponsDetail.colour.bg: ''}"></span>
          <span class="left_radio" :style="{'background-color': couponsDetail.colour.bg?couponsDetail.colour.bg: ''}"></span>
        </div>
        <div class="goods_list">
          <!--<div class="goods_item"></div>-->
          <van-row gutter="15">
            <van-col span="8" v-for="(subItem, index) in item.goods" :key="index">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="subItem.pic"></div>
              <div class="price">￥{{subItem.price}}</div>
              <div class="type" v-if="subItem.goods_type == 1">音频</div>
              <div class="type" v-if="subItem.goods_type == 2">视频</div>
              <div class="type" v-if="subItem.goods_type == 3">图书</div>
              <div class="type" v-if="subItem.goods_type == 4">电子书</div>
              <div class="type" v-if="subItem.goods_type == 9">专辑</div>
            </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </van-list>
    <div class="rule">
      <p :style="{'color':couponsDetail.colour.text?couponsDetail.colour.text:''}">{{couponsDetail.description}}</p>
    </div>
    <EazyNav type="brand" v-if="!isApp()"></EazyNav>
  </div>
</template>

<script>
  import easyNav from "@/components/easyNav";
  import { REDEEM_ITEM_GET, REDEEM_GOODS } from "@/apis/redeem";

export default {
  name: "coupons",
  data() {
    return {
      code: "0",
      redeem: "0",
      couponsDetail: {
        colour: {bg: '', text: ''}
      },
      couponsLoading: false,
      couponsFinished: false,
      couponsList: [],
      percentCoupons: {}
    };
  },
  methods: {
    async getCouponsDetail() {
      let data = {
        code: this.code,
        redeem_id: this.redeem,
        is_captcha: 1,
        version: "1.0"
      };
      // console.log(data);
      let res = await REDEEM_ITEM_GET(data);
      // console.log(res);
      if (res.hasOwnProperty("response_code")) {
        this.couponsDetail = res.response_data;
        this.couponsDetail.colour = JSON.parse(this.couponsDetail.colour);
        document.title = this.couponsDetail.page_title?this.couponsDetail.page_title:'火把知识';
        // console.log(this.couponsDetail.colour);
      }

      let list = this.couponsDetail.goods_list;
      // console.log(list);
      list.forEach(item => {
        if (item.goods_num == item.used_num) {
          item.state = 0; // 已领完
        }
      });
      this.couponsList = [];
      //  加载
      for (let i = 0; i < list.length; i++) {
        this.couponsList.push(list[i]);
      }
      // console.log(this.couponsList);
      // 加载状态结束
      this.couponsLoading = false;

      // 数据全部加载完成
      if (this.couponsList.length >= list.length) {
        this.couponsFinished = true;
      }
    },
    couponsLoad() {
      this.getCouponsDetail();
    },
    couponsRedeem(item) {
      if (item != undefined) {
        this.percentCoupons = item;
      }
      // console.log(this.percentGoods);
      // console.log(this.goodsDetail);
      this.submitRedeem(item);
    },
      async submitRedeem(item) {
        let data = {
          redeem_id: this.couponsDetail.redeem_id,
          ticket_id: this.percentCoupons.ticket_id,
          code: this.code,
          version: "1.0"
        };
        let res = await REDEEM_GOODS(data);
        // console.log(res);
        if (res.error_code == 100) { // 未登录
          sessionStorage.setItem("goodsItem", JSON.stringify(item));
          sessionStorage.setItem("goodsType", "coupons");
          // console.log(sessionStorage.getItem("goodsItem"));
          this.$router.push({name: 'redeemLogin'});

        } else if (res.hasOwnProperty("response_code")) {
          let data = res.response_data;
          console.log(res);
            // this.$router.push({name: 'appSuccess', query: {goodsName: this.percentCoupons.title, resData: data}});
          if (this.isApp()) { // APP
            this.$router.push({name: 'appSuccess', query: {goodsName: this.percentCoupons.title, resData: data}});
          } else {  // WAP
            this.$router.push({name: 'wapSuccess', query: {goodsName: this.percentCoupons.title}});
          }
        } else {
          if (this.isApp()) { // APP
            this.$router.push({name: 'appFail', query: {errorMsg: res.error_message}});
          } else {  // WAP
            this.$router.push({name: 'wapFail', query: {errorMsg: res.error_message}});
          }
        }
      },
    // 是否是APP
    isApp() {
      // var u = navigator.userAgent,
      //   app = navigator.appVersion;
      // var _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      // var _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      // console.log(u, app, _ios, _android);
      if (
        sessionStorage.getItem("isHuobaIosLogin") == "yes" ||
        sessionStorage.getItem("isHuobaAndroidLogin") == "yes"
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.code = this.$route.params.code;
    this.redeem = sessionStorage.getItem("redeemId");
    // console.log(this.couponsDetail);
    // console.log('code',this.code);
  },
  mounted() {
    this.couponsLoad();
  },
  components: {
    EazyNav: easyNav
  }
};
</script>

<style src="@/style/scss/pages/redeem/coupons.scss" lang="scss">
</style>
