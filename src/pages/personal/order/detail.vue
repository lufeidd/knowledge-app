<template>
  <div id="detailPage">
    <div class="state">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-checked-right"></use>
      </svg> 订单已完成
    </div>
    <!-- <div class="signfor">
      <svg class="icon car" aria-hidden="true">
        <use xlink:href="#icon-interflow-line"></use>
      </svg>
      <div class="signforFrom">
        <span class="signforPeople">浙江省杭州市西湖中公司 已签收 签收人：西湖</span>
        <span class="signDate">2017.04.21 14:00:22</span>
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
        <p class="address">收货地址：浙江省 杭州市 西湖区 西湖边东区23树6洞 3-3楼</p>
      </div>
    </div> -->
    <div class="info" v-if="infoData">
      <div class="head">
        <div class="titleFrom">
          <img v-lazy="infoData.brand_header_pic" class="icon">
          <span class="publish" >{{infoData.brand_name}}</span>
        </div>
      </div>
      <div class="section" v-for="item in infoData.detail" >
        <div class="bookDetail">
          <div class="ratiobox">
            <div class="box">
              <!-- <a class="bookImg" v-lazy:background-image="publishData.imgUrl"></a> -->
              <img v-lazy="item.pic" class="bookImg">
              <!-- <div class="tip">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-sound-line"></use>
                </svg>
                {{ publishData.watch }}
              </div> -->
            </div>
          </div>
          <span class="title">{{item.goods_name}}</span>
        </div>
      </div>
    </div>
    <!-- <div class="priceInfo">
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
    </div> -->
    <div class="fictitious">
      <div class="text">
        <van-cell title="虚拟物品"/>
      </div>
      <div class="orderNumber">
        <span class="order">订单编号</span>
        <div class="copybox">
          <span class="copy" @click="copy" :data-clipboard-text="infoData.order_id">复制</span>
        </div>
        <span class="number">{{infoData.order_id}}</span>
      </div>
      <div class="orderInfo">
        <van-cell title="下单时间" v-model="infoData.order_time"/>
        <van-cell title="支付方式" v-if="infoData.pay_info && infoData.pay_info.length > 0" v-model="infoData.pay_info[0].pay_bank"/>
        <van-cell title="支付时间" v-model="infoData.pay_time"/>
      </div>
    </div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <!-- <div class="foot bottomBox" :class="{iphx:this.isIphx}">
      <span class="button2">评价</span>
      <span class="button1" @click="repurchase">再次购买</span>
    </div> -->
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/personal/order/detail.scss" lang="scss"></style>

<script>
//调用cilpboard
import Clipboard from "clipboard";
import{USER_ORDER_DETAIL_GET} from "../../../apis/user.js"
import easyNav from "./../../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      // fictitious: {
      //   orderNumber: 1955655265521222,
      //   orderTime: "2019.4.17 19:15:22",
      //   payWay: "支付宝支付",
      //   payTime: "2019.4.17 19:16:02"
      // },
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: true,
        searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type:'order',
      },
      infoData:{},
      order_id:'',
    };
  },
  mounted(){
    this.order_id = this.$route.params.order_id;
    this.getData()
  },
  methods: {
    copy() {
      const clipboard = new Clipboard(".copy");
      clipboard.on("success", e => {
        this.$toast("复制成功");
        // this.$message({ type: 'success', message: '复制成功' });

        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // this.$message({ type: 'waning', message: '该浏览器不支持自动复制' });

        clipboard.destroy();
      });
    },
    //获取页面基本信息
    async getData(){
      var tStamp = this.$getTimeStamp();
      var data={
        order_id: this.order_id,
        version:"1.0",
        timestamp:tStamp,
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);
      if(res.hasOwnProperty("response_code")){
        this.infoData = res.response_data;
        // this.articleInfo = res.response_data.brand_info;
        console.log(res);
      }else{
        this.$toast(res.error_message);
      }
    },
    //再次购买
    repurchase(){

    },
  }
};
</script>
