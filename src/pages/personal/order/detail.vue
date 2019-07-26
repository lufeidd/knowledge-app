<template>
  <div id="detailPage">
    <div class="state" v-if="infoData.state == 6||infoData.state==4">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-checked-right" />
      </svg> 订单已完成
    </div>
    <div class="state" v-else>{{infoData.state == 7? '交易取消':infoData.state_desc}}</div>
    <div v-if="infoData.type == 2">
      <div
        class="signfor"
        @click="tologistics"
        v-if="infoData.state == 2 || infoData.state == 5 || infoData.state == 4"
      >
        <svg class="icon car" aria-hidden="true">
          <use xlink:href="#icon-interflow-line" />
        </svg>
        <div class="signforFrom">
          <span class="signforPeople">{{infoData.express_info.desc}}</span>
          <span class="signDate">{{infoData.express_info.time}}</span>
        </div>
        <svg class="icon arrow" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
      <div class="signfor">
        <svg class="icon car" aria-hidden="true">
          <use xlink:href="#icon-location-line" />
        </svg>
        <div class="signforFrom">
          <div class="personalInfo">
            <span>{{infoData.consignee_name}}</span>
            <span>{{infoData.consignee_mobilephone}}</span>
          </div>
          <p class="address">收货地址：{{infoData.consignee_address}}</p>
        </div>
      </div>
    </div>
    <div class="info" v-if="infoData">
      <div class="head" @click="toBrandindex">
        <div class="titleFrom">
          <!-- <img v-lazy="infoData.brand_header_pic" class="icon"> -->
          <div class="ratiobox">
            <a class="bookImg" v-lazy:background-image="infoData.brand_header_pic"></a>
          </div>
          <span class="publish">{{infoData.brand_name}}</span>
        </div>
      </div>
      <div
        class="section"
        v-for="(item,index) in infoData.detail"
        @click="goodsDetail(item)"
        :key="index"
      >
        <div class="bookDetail">
          <div class="ratiobox">
            <div class="box">
              <a class="bookImg" v-lazy:background-image="item.pic"></a>
            </div>
          </div>
          <div class="rightInfo">
            <span class="title">{{item.goods_name}}</span>
            <span class="title red">
              ￥{{item.real_price}}
              <span
                class="count"
                style="color: #999;margin-left: 5px;"
              >×{{item.buy_count}}</span>
            </span>
          </div>
          <span
            class="button button3 applyrefund"
            @click.stop="torefund(item)"
            v-if="infoData.type == 2 && (item.if_refund == 1 || item.if_refund == 5)"
          >申请售后</span>
          <span
            class="button button2 applyrefund"
            @click.stop="toOngoing(item)"
            v-if="infoData.type == 2 && item.if_refund == 2"
          >退款中</span>
          <span
            class="button button2 applyrefund"
            @click.stop="toOngoing(item)"
            v-if="infoData.type == 2 && item.if_refund == 4"
          >退款失败</span>
          <span
            class="button button2 applyrefund"
            @click.stop="toOngoing(item)"
            v-if="infoData.type == 2 && item.if_refund == 3"
          >退款成功</span>
        </div>
      </div>
    </div>
    <div class="priceInfo">
      <div class="first">
        <van-cell v-if="infoData.order_money" title="商品总额" v-model="'¥'+infoData.order_money" />
      </div>
      <van-cell v-if="infoData.dispatch_price" title="运费" v-model="'¥'+infoData.dispatch_price" />
      <!-- <van-cell title="商品优惠" v-model="discount"/> -->
      <!-- <van-cell title="余额" v-model="'-¥'+priceInfo.remain.toFixed(2)"/> -->
      <p class="acturalPay" style="margin-top:10px;">
        {{(infoData.state == 1||infoData.state ==7) ? '待支付':'实付款'}}
        <span
          v-if="infoData.pay_money"
        >¥{{infoData.pay_money}}</span>
      </p>
    </div>
    <!-- 发票 -->
    <div class="invoiceInfo" v-if="invoice !== undefined && Object.keys(invoice).length > 0">
      <div class="invoiceContent">
        <span class="title">发票类型</span>
        <span class="text">{{invoice.type == 1 ? '普通发票':'电子发票'}}</span>
        <a
          class="button button3"
          :href="invoice.url"
          target="_blank"
          download="invoice.pdf"
          v-if="invoice !== undefined && Object.keys(invoice).length > 0 && invoice.flag == 2"
        >下载发票</a>

        <!-- 测试blob格式 -->

        <span
          class="button button1"
          v-if="invoice !== undefined && Object.keys(invoice).length > 0 && invoice.flag == 1"
        >等待开票</span>
      </div>
      <div class="invoiceContent">
        <span class="title">发票抬头</span>
        <span class="text">{{invoice.invoice_title}}</span>
      </div>
      <div class="invoiceContent">
        <span class="title">发票内容</span>
        <span class="text">{{invoice.remarks}}</span>
      </div>
    </div>
    <div class="fictitious" v-if="infoData.state !==1 || infoData.state !== 7">
      <div class="text">
        <van-cell :title="infoData.type==1?'虚拟商品(不退不换)':'实物商品'" />
      </div>
      <div class="orderNumber">
        <span class="order">订单编号</span>
        <div class="copybox">
          <span class="copy" @click="copy" :data-clipboard-text="infoData.order_id">复制</span>
        </div>
        <span class="number">{{infoData.order_id}}</span>
      </div>
      <div class="orderInfo">
        <van-cell title="下单时间" v-model="infoData.order_time" />
        <van-cell
          title="支付方式"
          v-if="infoData.pay_info && infoData.pay_info.length > 0"
          v-model="infoData.pay_info[0].pay_bank"
        />
        <van-cell
          v-if="(infoData.state !== 1 || infoData.state !== 7)&&infoData.pay_time"
          title="支付时间"
          v-model="infoData.pay_time"
        />
      </div>
    </div>

    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div v-if="infoData.if_comment == 0 || showInvoice">
      <div style="height: 60px;"></div>
      <!-- 虚拟商品 -->
      <div class="foot bottomBox" :class="{iphx:this.isIphx}" v-if="infoData.type == 1">
        <div>
          <span class="button button3" @click="apply" v-if="showInvoice">申请发票</span>
        </div>
        <div style="padding-right:15px;">
          <span class="button button2" @click="toComment" v-if="infoData.if_comment == 0 ">评价</span>
        </div>
      </div>
      <!-- 实物商品 -->
      <div class="foot bottomBox" :class="{iphx:this.isIphx}" v-else>
        <div>
          <span
            class="button button3"
            @click="apply"
            v-if="showInvoice && infoData.state == 4 && (if_refund ==1 || if_refund == 5)"
          >申请发票</span>
        </div>
        <div style="padding-right:15px;">
          <span
            class="button button2"
            @click="toComment"
            v-if="infoData.if_comment == 0 && infoData.state == 4 "
          >评价</span>
          <span
            class="button button3"
            @click="repurchase"
            v-if="infoData.state == 4 || infoData.state == 7"
          >再次购买</span>
          <span
            class="button button2"
            @click="confirmReceive"
            v-if="infoData.state == 3||infoData.state == 5 && (if_refund ==1 || if_refund == 5)"
          >确认收货</span>
          <span
            class="button button3"
            @click="tologistics"
            v-if="infoData.state == 2||infoData.state == 5"
          >查看物流</span>
          <span class="button button3" @click="cancel" v-if="infoData.state == 1">取消订单</span>
          <span class="button button2" @click="toPaid" v-if="infoData.state == 1">去支付</span>
        </div>
      </div>
    </div>

    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand"></EazyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/personal/order/detail.scss" lang="scss"></style>

<script>
//调用cilpboard
import Clipboard from "clipboard";
import { USER_ORDER_DETAIL_GET } from "../../../apis/user.js";
import {
  ORDER_EXPRESS_GET,
  ORDER_RECEIVE,
  ORDER_CANCEL,
  ORDER_AGAIN
} from "../../../apis/shopping.js";

export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // fictitious: {
      //   orderNumber: 1955655265521222,
      //   orderTime: "2019.4.17 19:15:22",
      //   payWay: "支付宝支付",
      //   payTime: "2019.4.17 19:16:02"
      // },
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: true,
      //   searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "order"
      // },

      infoData: {},
      order_id: null,
      invoice: {},
      showInvoice: false,
      if_refund: true,
      detail_ids: null
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.showInvoice =
      parseInt(this.$route.query.invoice_id) == 0 ? true : false;
    this.getData();
    // this.getAgainData();
  },
  computed: {
    discount: function() {
      // return '-￥' + (this.infoData.order_money - this.infoData.pay_money);
      return "-￥" + 0;
    }
  },
  methods: {
    // 去支付
    toPaid() {
      this.$router.push({
        name: "pay",
        query: { pay_id: this.infoData.pay_id }
      });
    },
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
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.infoData = res.response_data;
        this.invoice = res.response_data.invoice_info;
        for (let i = 0; i < this.infoData.detail.length; i++) {
          if (this.infoData.detail[i].if_refund == 2) {
            this.if_refund = false;
          }
        }
        // if (Object.keys(res.response_data.invoice_info).length > 0)
        // this.showInvoice = true;
        // this.articleInfo = res.response_data.brand_info;
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取再次购买信息
    async getAgainData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_AGAIN(data);

      if (res.hasOwnProperty("response_code")) {
        this.detail_ids = res.response_data.detail_ids;
      } else {
        this.$toast(res.error_message);
      }
    },
    //再次购买
    repurchase() {
      this.getAgainData();
      this.$router.push({ name: "cart" });
    },
    //申请发票
    apply() {
      this.$router.push({
        name: "orderinvoice",
        query: {
          order_id: this.infoData.order_id,
          money: this.infoData.pay_money
        }
      });
    },
    //跳转公号主页
    toBrandindex() {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: this.infoData.brand_id
        }
      });
    },
    goodsDetail(item) {
      // console.log(item);return
      // 音频/视频
      if (item.goods_type == 1 || item.goods_type == 2) {
        this.$router.push({
          name: "albumdetail",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 专辑
      if (item.goods_type == 6) {
        this.$router.push({
          name: "article",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 文章
      if (item.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 实物商品
      if (item.goods_type == 3) {
        this.$router.push({
          name: "detail",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
    },
    //评价
    toComment() {
      // console.log(this.infoData.order_id);
      this.$router.push({
        name: "ordercomment",
        query: {
          order_id: this.infoData.order_id
        }
      });
    },
    // 选择退款类型
    torefund(item) {
      console.log(item);
      if (this.infoData.state == 5 || this.infoData.state == 4) {
        this.$router.push({
          name: "refundtype",
          query: {
            order_id: this.infoData.order_id,
            detail_id: item.id
          }
        });
      } else if (this.infoData.state == 2) {
        this.$router.push({
          name: "refundone",
          query: {
            order_id: this.infoData.order_id,
            detail_id: item.id
          }
        });
      } else if (item.if_refund == 0 && infoData.state == 4) {
        this.$toast("该订单已结算，请找卖家协商!");
      }
    },
    toOngoing(item) {
      this.$router.push({
        name: "ongoing",
        query: {
          order_id: this.infoData.order_id,
          detail_id: item.id
        }
      });
    },
    //查看物流信息
    tologistics() {
      this.$router.push({
        name: "logistics",
        query: {
          order_id: this.infoData.order_id
        }
      });
    },
    //取消订单
    cancel() {
      this.$dialog
        .confirm({
          message: "确认取消订单？"
        })
        .then(() => {
          this.cancelOrder(this.infoData.order_id);
        })
        .catch(() => {
          // on cancel
        });
    },
    async cancelOrder(order_id) {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: order_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_CANCEL(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("已取消订单！");
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    },
    //确认收货
    confirmReceive(item) {
      this.$dialog
        .confirm({
          message: "确认收货？"
        })
        .then(() => {
          this.orderReceive();
        })
        .catch(() => {
          // on cancel
        });
    },
    async orderReceive() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: this.infoData.order_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_RECEIVE(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("确认收货成功！");
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
