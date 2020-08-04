<template>
  <div id="typePage">
    <div class="content">
      <div class="huoba-goods-list huoba-goods-list-one">
        <div class="huoba-goods-list-left">
          <div class="ratioBox">
            <div class="box">
              <img :src="goodsInfo.pic" alt />
            </div>
            <span class="huoba-goods-list-label" v-if="goodsInfo.goods_type == 1">音频</span>
            <span class="huoba-goods-list-label" v-if="goodsInfo.goods_type == 2">视频</span>
            <span class="huoba-goods-list-label" v-if="goodsInfo.goods_type == 3">图书</span>
            <span class="huoba-goods-list-label" v-if="goodsInfo.goods_type == 4">电子书</span>
            <span class="huoba-goods-list-label" v-if="goodsInfo.goods_type == 9">专辑</span>
          </div>
        </div>
        <div class="huoba-goods-list-mid">
          <span class="huoba-goods-title">
            <span>{{goodsInfo.goods_name}}</span>
          </span>
          <div>
            <span class="huoba-goods-price">￥{{goodsInfo.real_price.toFixed(2)}}</span>
            <span class="huoba-goods-num">x{{goodsInfo.buy_count}}</span>
          </div>
        </div>
        <div class="huoba-goods-list-right">
          <span></span>
          <span class="huoba-goods-opera"></span>
        </div>
      </div>
    </div>
    <div class="huoba-cell huoba-cell-three" @click="torefundThree">
      <div class="huoba-cell-left">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-refundmoney-block" />
        </svg>
      </div>
      <div class="huoba-cell-mid">
        <div class="huoba-cell-type">
          <span>退货退款</span>
        </div>
        <div class="huoba-cell-typedesc">已收到货，需要退换已收到的货物</div>
      </div>
      <div class="huoba-cell-right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </div>
    <div class="huoba-cell huoba-cell-three" @click="torefundTwo">
      <div class="huoba-cell-left">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-onlyrefund-block" />
        </svg>
      </div>
      <div class="huoba-cell-mid">
        <div class="huoba-cell-type">
          <span>仅退款</span>
        </div>
        <div class="huoba-cell-typedesc">未收到货或与卖家协商同意下申请</div>
      </div>
      <div class="huoba-cell-right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </div>
    <!-- <CopyRight></CopyRight> -->
    <!-- <EazyNav type="order" :isShow="false"></EazyNav> -->
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
import{ORDER_REFUND_ADDINFO} from "../../../apis/shopping.js"
export default {
  data() {
    return {
      order_id: null,
      detail_id: null,
      goodsInfo:{
        real_price:0,
      },
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    this.getInfo()
  },
  methods: {
    torefundThree() {
      this.$router.push({
        name: "refundthree",
        query: {
          order_id: this.order_id,
          detail_id: this.detail_id,
          goods_length: this.$route.query.goods_length
        }
      });
    },
    torefundTwo() {
      this.$router.push({
        name: "refundtwo",
        query: {
          order_id: this.order_id,
          detail_id: this.detail_id,
          goods_length: this.$route.query.goods_length
        }
      });
    },
    //获取退款信息
    async getInfo() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.1",
        timestamp: tStamp,
        order_id: this.order_id,
        detail_ids: this.detail_id,
        refund_type: 1
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_ADDINFO(data);

      if (res.hasOwnProperty("response_code")) {
          this.goodsInfo = res.response_data.refund_goods[0]
      } else {
        this.$toast(res.error_message);
      }
    },
  }
};
</script>
