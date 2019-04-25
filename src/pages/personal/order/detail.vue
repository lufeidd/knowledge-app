<template>
  <div id="detailPage">
    <div class="state">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-checked-right"></use>
      </svg> 订单已完成
    </div>
    <div class="signfor">
      <svg class="icon car" aria-hidden="true">
        <use xlink:href="#icon-interflow-line"></use>
      </svg>
      <div class="signforFrom">
        <span class="signforPeople">浙江省杭州市西湖中公司 已签收   签收人：西湖</span>
        <span class="signDate">2017.04.21  14:00:22</span>
      </div>
      <svg class="icon arrow" aria-hidden="true">
        <use xlink:href="#icon-next-line"></use>
      </svg>
    </div>
    <div class="signfor">
      <svg class="icon car" aria-hidden="true">
        <use xlink:href="#icon-location-line"></use>
      </svg>
      <div class="signforFrom">
       <div class="personalInfo">
         <span>王老板</span>
         <span>15000007777</span>
       </div>
       <p class="address">收货地址：浙江省 杭州市 西湖区 西湖边东区23树6洞 3-3楼 </p>
      </div>
    </div>
    <div class="info">
      <div class="head">
        <div class="titleFrom">
          <img v-lazy="publishData.icon" class="icon">
          <span class="publish">{{publishData.from}}</span>
        </div>
      </div>
      <div class="section">
        <div class="bookDetail">
          <div class="ratiobox">
            <div class="box">
              <!-- <a class="bookImg" v-lazy:background-image="publishData.imgUrl"></a> -->
              <img v-lazy="publishData.imgUrl" class="bookImg">
              <div class="tip">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-sound-line"></use>
                </svg>
                {{ publishData.watch }}
              </div>
            </div>
          </div>
          <span class="title">{{publishData.title}}</span>
        </div>
      </div>
    </div>
    <div class="priceInfo">
      <div class="first">
        <van-cell title="商品总额" v-model="'-¥'+priceInfo.totalPrice.toFixed(2)"/>
      </div>
      <van-cell title="运费" v-model="'¥'+priceInfo.freight.toFixed(2)"/>
      <van-cell title="商品优惠" v-model="'¥'+priceInfo.discount.toFixed(2)"/>
      <van-cell title="余额" v-model="'-¥'+priceInfo.remain.toFixed(2)"/>
      <p class="acturalPay">
        实付款
        <span>¥{{priceInfo.acturalPay}}</span>
      </p>
    </div>
    <div class="fictitious">
      <div class="text">
        <van-cell title="虚拟物品"/>
      </div>
      <div class="orderNumber">
        <span class="order">订单编号</span>
        <div class="copybox">
          <span class="copy" @click="copy" :data-clipboard-text="fictitious.orderNumber">复制</span>
        </div>
        <span class="number">{{fictitious.orderNumber}}</span>
      </div>
      <div class="orderInfo">
        <van-cell title="下单时间" v-model="fictitious.orderTime"/>
        <van-cell title="支付方式" v-model="fictitious.payWay"/>
        <van-cell title="支付时间" v-model="fictitious.payTime"/>
      </div>
    </div>
    <div class="foot">
      <span class="button2">评价</span>
      <span class="button1">再次购买</span>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/detail.scss" lang="scss"></style>

<script>
//调用cilpboard
import Clipboard from "clipboard";

export default {
  data() {
    return {
      publishData: {
        icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
        from: "浙江出版集团",
        imgUrl:
          "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
        title: "宝宝巴士在线讲故事",
        watch:'32.7w',
      },
      priceInfo: {
        totalPrice: 95.0,
        freight: 22.3,
        discount: 5.0,
        remain: 22.3,
        acturalPay: 22.3
      },
      fictitious: {
        orderNumber: 1955655265521222,
        orderTime: "2019.4.17 19:15:22",
        payWay: "支付宝支付",
        payTime: "2019.4.17 19:16:02"
      }
    };
  },
  methods: {
    copy() {
      const clipboard = new Clipboard(".copy");
      clipboard.on("success", e => {
        this.$toast('复制成功');
        // this.$message({ type: 'success', message: '复制成功' });

        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // this.$message({ type: 'waning', message: '该浏览器不支持自动复制' });

        clipboard.destroy();
      });
    }
  }
};
</script>
