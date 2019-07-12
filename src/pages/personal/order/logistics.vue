<template>
  <div id="logisticsPage">
    <div class="orderExpress">
      <div class="ratiobox">
        <a class="bookImg" v-lazy:background-image="imgUrl"></a>
      </div>
      <div class="orderInfo">
        <p>订单编号：487956213</p>
        <p>国内承运人：中通快递</p>
      </div>
    </div>
    <div class="line"></div>
    <div class="logisticsInfo">
      <div class="text">物流信息</div>
      <van-steps direction="vertical"  active-color="#ff504e" active-icon="circle">
        <van-step>
          <p>您的快递以交由中通快递发出</p>
          <p>2019-03-14 12:12:38</p>
        </van-step>
        <van-step>
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
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
export default {
  data() {
    return {
      imgUrl: "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85"
    };
  }
};
</script>
