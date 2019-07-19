<template>
  <div id="orderconfirmPage">
    <!-- 地址 -->
    <router-link
      :to="{name: 'address', query: {pageType: 'add'}}"
      class="listBox"
      v-if="Object.keys(address).length == 0"
    >
      <div class="center">添加收货地址</div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </router-link>

    <router-link
      :to="{name: 'address', query: {pageType: 'edit', addressId: address.address_id}}"
      class="listBox"
      v-else
    >
      <div class="right one">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-location-line" />
        </svg>
      </div>
      <div class="center">
        <ul class="addressBox">
          <li>
            <div class="info">
              <div>
                <span class="name">{{ address.consignee }}</span>
                <span class="phone">{{ address.mobile }}</span>
              </div>
              <div
                class="address"
              >{{ address.province }}{{ address.city }}{{ address.county }}{{ address.address }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </router-link>
    <!-- 商品 -->
    <div @click="gotoDetail" v-if="goodspic && goodspic.length > 0" class="listBox">
      <div class="center">
        <ul class="addressBox img">
          <li v-for="(img,index) in goodspic" :key="index">
            <div class="ratioBox">
              <div class="box">
                <img v-lazy="img" width="45px" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <span>共{{ goods_count }}件</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </div>
    <!-- 备注 -->
    <div class="priceInfo beizhu">
      <div class="first">
        <van-cell title="备注" />
      </div>
      <textarea placeholder="选填，请填写备注内容">{{ remark }}</textarea>
    </div>
    <!-- 价格 -->
    <div class="priceInfo">
      <div class="first">
        <van-cell title="商品总额" v-model="'¥'+pay_price.toFixed(2)" />
      </div>
      <van-cell title="运费" v-model="'¥'+dispatch_price.toFixed(2)" />
      <van-cell title="商品优惠" v-model="'¥'+yh_price.toFixed(2)" />
    </div>

    <van-submit-bar
      :class="{iphx:this.isIphx}"
      safe-area-inset-bottom
      :price="pay_price * 100"
      button-text="去支付"
      @submit="onSubmit"
    ></van-submit-bar>

    <EazyNav type="order"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/order.scss" scoped lang="scss"></style>

<script>
import {
  ORDER_PHYSICAL_ADDINFO,
  ORDER_PHYSICAL_ADD
} from "./../../apis/shopping";
export default {
  data() {
    return {
      address: {},
      goodspic: [],
      goods_count: 0,
      dispatch_price: 0,
      order_money: 0,
      pay_price: 0,
      ticket_price: 0,
      yh_price: 0,
      address_id: 0,
      remark: "",
      pay_id: "",
      location: 0
    };
  },
  mounted() {
    this.orderAddData();
  },
  methods: {
    gotoDetail() {
      var queryTmp = {};
      queryTmp.address_id = this.address_id;
      if (this.$route.query.detail_ids)
        queryTmp.detail_ids = this.$route.query.detail_ids;
      if (this.$route.query.detail) queryTmp.detail = this.$route.query.detail;
      queryTmp.location = JSON.stringify(this.location);
      this.$router.push({ name: "orderconfirmdetail", query: queryTmp });
    },
    // 新增实物订单
    async orderAddData() {
      var data = {};
      var tStamp = this.$getTimeStamp();
      data.timestamp = tStamp;
      data.version = "1.0";
      if (this.$route.query.detail_ids)
        data.detail_ids = this.$route.query.detail_ids;
      if (this.$route.query.detail) data.detail = this.$route.query.detail;
      data.sign = this.$getSign(data);
      let res = await ORDER_PHYSICAL_ADDINFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.address = res.response_data.address;
        this.goodspic = res.response_data.goodspic;
        this.goods_count = res.response_data.goods_count;
        this.dispatch_price = res.response_data.dispatch_price;
        this.order_money = res.response_data.order_money;
        this.pay_price = res.response_data.pay_price;
        this.ticket_price = res.response_data.ticket_price;
        this.yh_price = res.response_data.yh_price;
        if (res.response_data.address.address_id) {
          this.address_id = res.response_data.address.address_id;
          this.location = {
            province_id: res.response_data.address.province_id,
            city_id: res.response_data.address.city_id
          };
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 支付 获取pay_id
    async payIdData() {
      var data = {};
      var tStamp = this.$getTimeStamp();
      data.timestamp = tStamp;
      data.version = "1.0";
      if (this.$route.query.detail_ids)
        data.detail_ids = this.$route.query.detail_ids;
      if (this.$route.query.detail) data.detail = this.$route.query.detail;

      data.address_id = this.address_id;
      data.remark = this.remark;
      data.sign = this.$getSign(data);
      let res = await ORDER_PHYSICAL_ADD(data);

      if (res.hasOwnProperty("response_code")) {
        this.pay_id = res.response_data.pay_id;
        this.$router.push({
          name: "pay",
          query: { pay_id: this.pay_id, money: this.pay_price }
        });
      } else {
        this.$toast(res.error_message);
      }
    },
    // 去支付
    onSubmit() {
      if (this.address_id == "") {
        this.$toast("请添加收货地址~");
        return;
      }
      this.payIdData();
    }
  }
};
</script>

