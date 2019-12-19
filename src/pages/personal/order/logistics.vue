<template>
  <div id="logisticsPage">
    <div class="orderExpress">
      <!-- <div class="ratiobox">
        <a class="bookImg" v-lazy:background-image="imgUrl"></a>
      </div> -->
      <div class="orderInfo">
        <p>物流单号：{{logisticsInfo.number}}</p>
        <p>国内承运人：{{logisticsInfo.com}}</p>
      </div>
    </div>
    <div class="line"></div>
    <div class="logisticsInfo">
      <div class="text">物流信息</div>
      <van-steps direction="vertical"  active-color="#ff504e" active-icon="circle">
        <van-step v-for="(item,index) in logisticsInfo.traces" :key="index">
          <p>{{item.desc}}</p>
          <p>{{item.time}}</p>
        </van-step>
        <!-- <van-step>
          <p>您的订单出库中</p>
          <p>2016-07-11 10:00</p>
        </van-step>
        <van-step>
          <p>拣货完成，等待快递揽收</p>
          <p>2019-03-06 09:23:08</p>
        </van-step>
        <van-step>
          <p>您已提交订单，系统确认中</p>
          <p>2019-03-06 09:23:08</p>
        </van-step> -->
      </van-steps>
    </div>
    <EazyNav type="order" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
import { ORDER_EXPRESS_GET } from "../../../apis/shopping.js"
export default {
  data() {
    return {
      imgUrl: "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
      order_id:null,
      logisticsInfo:{},
    };
  },
  mounted(){
    this.order_id = this.$route.query.order_id;
    this.getInfo()
  },
  methods:{
    async getInfo(){
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id:this.order_id,
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_EXPRESS_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.logisticsInfo = res.response_data;
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
