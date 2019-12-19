<template>
  <div id="paysuccessPage">
    <div class="content">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-pay-success" />
      </svg>
      <div class="msg">订单支付成功</div>
      <div class="money">
        支付金额
        <span class="price">¥{{ pay_money }}</span>
      </div>
    </div>
    <div class="recharge">
      <van-button
        size="large"
        round
        type="danger"
        v-if="open_id > 0"
        @click="openPopup"
      >查看拼团详情</van-button>
      <van-button
        size="large"
        round
        type="danger"
        v-else
        @click="openPopup"
      >查看订单</van-button>
      <van-button
        style="background-color: #fff;"
        size="large"
        round
        plain
        :to="{name: 'brand', query: {brand_id: brand_id}}"
        type="danger"
      >返回商铺</van-button>
    </div>
    <van-popup v-model="popupFlag">
      <div class="app_pic"></div>
      <p class="app_txt">使用全新火把知识App查看物流信息，收获海量知识。</p>
      <div class="button">
        <div class="refuse">
          <van-button type="default" @click="refuseApp">残忍拒绝</van-button>
        </div>
        <div class="open_app">
          <van-button type="primary" color="#F05654" @click="download">打开火把知识App</van-button>
        </div>
      </div>
    </van-popup>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" lang="scss" scoped></style>

<style lang="scss">
#paysuccessPage {
  .van-button--plain.van-button--danger {
    margin-top: 25px;
  }
  .van-popup {
    width: 310px;
    height: 375px;
  }
}
</style>


<script>
import { USER_ORDER_DETAIL_GET } from "../../apis/user.js";
export default {
  data() {
    return {
      pay_money: null,
      order_id: null,
      open_id: null,
      brand_id:null,
      popupFlag: false
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.pay_money = this.$route.query.pay_money;
    this.open_id = this.$route.query.open_id;
    this.getBrandId();
    console.log('测试open_id',this.open_id)
  },
  methods: {
    async getBrandId() {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.brand_id = res.response_data.brand_id;
      } else {
        this.$toast(res.error_message);
      }
    },
    openPopup() {
      this.popupFlag = true;
    },
    toGroupDetail() {
      this.$router.push({name: 'groupdetail', query: {open_id: this.open_id}});
    },
    toOrderDetail() {
      this.$router.push({name: 'orderdetail', query: {order_id: this.order_id}});
    },
    refuseApp() {
      if (this.open_id > 0) {
        this. toGroupDetail();
      } else {
        this.toOrderDetail();
      }
    },
    download() {
      // window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      let u = navigator.userAgent,
        app = navigator.appVersion;
      let _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      let _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      console.log(u, app, _ios, _android);
      if (_ios) {
        window.location.href =
          "https://apps.apple.com/cn/app/%E7%81%AB%E6%8A%8A%E7%9F%A5%E8%AF%86/id1473766311";
      } else if (_android) {
        window.location.href =
          "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      }
    }
  }
};
</script>

