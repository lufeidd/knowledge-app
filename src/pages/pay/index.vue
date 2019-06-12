<template>
  <div id="payIndex">
    <div class="content">
      <div class="money">
        ¥ <span class="price">{{ money }}</span>
      </div>
      <div class="msg">支付剩余时间 {{ timeData.date }}</div>
    </div>

    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button size="large" type="danger">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wechart-block"></use>
        </svg>微信支付
      </van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" scoped lang="scss"></style>

<script>
//  引入接口
import { ORDER_VIRTUAL_ADD } from "../../apis/shopping.js";

export default {
  data() {
    return {
      timeData: {
        time: 100,
        date: '00:00:00'
      },
      money: null,
      goodsId: null,
    };
  },
  mounted() {
    this.goodsId = this.$route.query.goodsId;
    this.money = this.$route.query.money;
    // 倒计时
    this.$timeCountDown(this.timeData);
    // 新增虚拟订单
    this.addOrderData();
  },
  methods: {
    // 新增虚拟订单
    async addOrderData () {
      var tStamp = this.$getTimeStamp();
      let data = {
        timeStamp: tStamp,
        goods_id: this.goodsId,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res.response_data[0])
      } else {
        this.$toast(res.error_message);
      }

    },
  },
};
</script>

