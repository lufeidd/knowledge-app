<template>
  <div
    id="redeemCouponsPage"
    :style="{'background-color': couponsDetail.colour.bg?couponsDetail.colour.bg: ''}"
    v-show="pageShow"
  >
    <div v-if="!remindPopShow">
      <!--<van-list-->
        <!--v-model="couponsLoading"-->
        <!--:finished="couponsFinished"-->
        <!--finished-text="没有更多了"-->
        <!--@load="couponsLoad"-->
      <!--&gt;-->
        <div class="propaganda" v-if="couponsDetail.pic">
          <img :src="couponsDetail.pic" alt width="100%" />
        </div>
        <div class="coupons_wrapper" v-for="item in couponsList" :key="item.id" :title="item">
          <div class="content">
            <!--兑换面额-->
            <div class="denomination">
            <span class="currency">
              ￥
              <span class="amount">{{item.money}}</span>
            </span>
            </div>
            <!--兑换条件-->
            <div class="requirement">
              <van-button
                type="default"
                size="mini"
                round
                style="background:#FFB54D;border: 1px solid #FFB54D;"
              >{{item.brand}}</van-button>
              <span class="state">{{item.range}}</span>
              <p class="price">满{{item.min_money}}元可用</p>
            </div>
            <div class="nothing_left" v-if="item.state == 0"></div>
            <div class="redeem_btn">
              <van-button
                type="primary"
                disabled
                style="background:#F05654;border: 1px solid #F05654;"
                v-if="item.state == 0"
              >免费兑换</van-button>
              <van-button
                type="primary"
                style="background:#F05654;border: 1px solid #F05654;"
                @click="couponsRedeem(item)"
                v-else
              >免费兑换</van-button>
            </div>
            <span
              class="right_radio"
              :style="{'background-color': couponsDetail.colour.bg?couponsDetail.colour.bg: ''}"
            ></span>
            <span
              class="left_radio"
              :style="{'background-color': couponsDetail.colour.bg?couponsDetail.colour.bg: ''}"
            ></span>
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
      <!--</van-list>-->
      <div class="rule">
        <p
          :style="{'color':couponsDetail.colour.text?couponsDetail.colour.text:''}"
          v-html="couponsDetail.description"
        ></p>
      </div>
    </div>
    <van-popup class="limit_info" v-model="remindPopShow">
      <h4 class="limit_title">此活动仅限受邀用户参加</h4>
      <div class="limit_img"></div>
      <p class="limit_remind"><span>{{time}}</span>秒后回到个人中心</p>
    </van-popup>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
import easyNav from "@/components/easyNav";
import { REDEEM_ITEM_GET, REDEEM_GOODS } from "@/apis/redeem";

export default {
  name: "coupons",
  data() {
    return {
      code: '0',
      redeem: '',
      secShare: '',
      remindPopShow: false,
      time: 3,
      couponsDetail: {
        colour: { bg: "", text: "" }
      },
      // couponsLoading: false,
      // couponsFinished: false,
      couponsList: [],
      percentCoupons: {},
      pageShow: true
    };
  },
  methods: {
    async getCouponsDetail() {
      let data = {
        code: this.code,
        redeem_id: this.redeem,
        access: 1,
        encrypt: 1,
        is_captcha: 1,
        version: "1.0"
      };
      // console.log(data);
      let res = await REDEEM_ITEM_GET(data);
      // console.log(res);
      if (res.hasOwnProperty("response_code")) {
        this.couponsDetail = res.response_data;
        this.secShare = res.response_data.sec_share;
        this.visitPage();
        this.couponsDetail.colour = JSON.parse(this.couponsDetail.colour);
        document.title = this.couponsDetail.page_title
          ? this.couponsDetail.page_title
          : "火把知识";
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
      // this.couponsLoading = false;

      // 数据全部加载完成
      if (this.couponsList.length >= list.length) {
        // this.couponsFinished = true;
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
      if (res.error_code == 100) {
        // 未登录

        sessionStorage.setItem("goodsItem", JSON.stringify(item));
        sessionStorage.setItem("goodsType", "coupons");
        // console.log(localStorage.getItem("goodsItem"));
        if (localStorage.getItem("unionid")) {
        //   if (true) {
          this.$router.push({ name: "redeemLogin" });
        } else {
          this.$router.push({ name: "login" });
        }
      } else if (res.hasOwnProperty("response_code")) {
        let data = res.response_data;
        console.log(res);
        // this.$router.push({name: 'appSuccess', query: {goodsName: this.percentCoupons.title, resData: data}});
        if (this.isApp()) {
          // APP
          this.$router.push({
            name: "appSuccess",
            query: {
              goodsName: this.percentCoupons.title,
              resData: data,
              goodsNameType: "coupons"
            }
          });
        } else {
          // WAP
          this.$router.push({
            name: "wapSuccess",
            query: {
              goodsName: this.percentCoupons.title,
              goodsNameType: "coupons"
            }
          });
        }
      } else {
        if (this.isApp()) {
          // APP
          this.$router.push({
            name: "appFail",
            query: { errorMsg: res.error_message }
          });
        } else {
          // WAP
          this.$router.push({
            name: "wapFail",
            query: { errorMsg: res.error_message }
          });
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
        localStorage.getItem("isHuobaIosLogin") == "yes" ||
        localStorage.getItem("isHuobaAndroidLogin") == "yes"
      ) {
        return true;
      } else {
        return false;
      }
    },
    visitPage() {
      if (this.secShare == 0 &&  localStorage.getItem('originLink') != 1) { // 不可二次分享
        this.remindPopShow = true;
        const timer = setInterval(() => {
          this.time--;
          if (this.time == 0) {
            this.remindPopShow = false;
            clearInterval(timer);
            this.$router.push({name: 'personalIndex'});
          }
        }, 1000);
      }
    }
  },
  created() {
    this.code = this.$route.query.code;
    this.redeem = decodeURI(this.$route.query.redeem_id).replace(/\s/g, '+');
    localStorage.setItem("hash", window.location.hash);
  },
  mounted() {
    let _this = this;
    this.getCouponsDetail().then(function () {
      if (sessionStorage.getItem('fromRedeemLogin') == '1') {
        _this.pageShow = false;
        console.log('goodsItem',JSON.parse(sessionStorage.getItem('goodsItem')));
        _this.couponsRedeem(JSON.parse(sessionStorage.getItem('goodsItem')));
        sessionStorage.setItem('fromRedeemLogin', '0');
      }
    });
  }
};
</script>

<style src="@/style/scss/pages/redeem/coupons.scss" lang="scss">
</style>
