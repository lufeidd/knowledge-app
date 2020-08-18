<template>
  <div id="orderdetailPage">
    <div v-for="(citem, cindex) in cartlist" :key="cindex">
      <van-row class="editBox">
        <van-col span="12">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-package-line" />
          </svg>
          <span class="title">{{ citem.brand_name }}</span>
          <!-- <span class="type">自营</span> -->
          <span class="count">共{{ citem.goods_nums }}件</span>
        </van-col>
        <van-col span="12" class="postage" style="text-align: right;">{{ citem.dispatch_price_str }}</van-col>
      </van-row>

      <div v-for="(gitem, gindex) in citem.goodslist" :key="gindex" class="listBox">
        <div class="left">
          <div class="ratioBox">
            <router-link :to="{name: 'detail', query: {goods_id: gitem.goods_id}}" class="box">
              <img :src="gitem.pic" />
            </router-link>
          </div>
        </div>
        <div class="center">
          <div class="title">
            <router-link
              :to="{name: 'detail', query: {goods_id: gitem.goods_id}}"
              class="text"
            >{{ gitem.title }}</router-link>
          </div>
          <div class="subTitle"></div>
          <div class="info">
            <span class="history">¥{{ gitem.price }}</span>
            <span class="count">×{{ gitem.count }}</span>
          </div>
        </div>
      </div>
    </div>
    <EazyNav type="order" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/order.scss" scoped lang="scss"></style>

<script>
import { CART_INFO } from "./../../apis/shopping";
export default {
  data() {
    return {
      money: null,
      goods_nums: null,
      cartlist: [],
      order_ticket_ids:'',
      location:null,
      detail:null,
    };
  },
  mounted() {
    this.order_ticket_ids = this.$route.query.order_ticket_ids;
    let _obj = {},_objd = {};
    _obj.province_id = this.$route.query.province_id;
    _obj.city_id = this.$route.query.city_id;
    _objd.goods_id = this.$route.query.goods_id;
    _objd.sku_id = this.$route.query.sku_id;
    _objd.count = this.$route.query.count;
    this.location = JSON.stringify(_obj);
    this.detail = JSON.stringify(_objd);
    this.cartData();
  },
  methods: {
    // 获取购物车信息
    async cartData() {
      var tStamp = this.$getTimeStamp();
      var data = {};
      data.timestamp = tStamp;
      data.version = "1.0";
      if (this.$route.query.detail_ids) data.detail_ids = this.$route.query.detail_ids;
      if (this.detail) data.detail = this.detail;
      if (this.$route.query.groupbuy_id) data.groupbuy_id = this.$route.query.groupbuy_id;
      if (this.$route.query.groupbuy_open_id) data.groupbuy_open_id = this.$route.query.groupbuy_open_id;
      data.ticket_ids = this.order_ticket_ids;
      data.location = this.location;
      data.sign = this.$getSign(data);
      let res = await CART_INFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.goods_nums = res.response_data.goods_nums;
        this.cartlist = res.response_data.cartlist;
        this.money =
          res.response_data.money * 100
            ? res.response_data.money * 100
            : this.money;
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

