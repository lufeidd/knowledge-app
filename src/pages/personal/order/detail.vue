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
    </div>-->
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
              <!-- <img v-lazy="item.pic" class="bookImg"> -->
              <!-- <div class="tip">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-sound-line"></use>
                </svg>
                {{ publishData.watch }}
              </div>-->
            </div>
          </div>
          <div class="rightInfo">
            <span class="title">{{item.goods_name}}</span>
            <span class="title red">￥{{item.real_price}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="priceInfo">
      <div class="first">
        <van-cell title="商品总额" v-model="'¥'+infoData.order_money"/>
      </div>
      <van-cell
        title="运费"
        v-model="'¥'+infoData.dispatch_price"
        v-if="infoData.dispatch_price !== 0"
      />
      <!-- <van-cell title="商品优惠" v-model="discount"/> -->
      <!-- <van-cell title="余额" v-model="'-¥'+priceInfo.remain.toFixed(2)"/> -->
      <p class="acturalPay" style="margin-top:10px;">
        实付款
        <span>¥{{infoData.pay_money}}</span>
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
        <van-cell
          title="支付方式"
          v-if="infoData.pay_info && infoData.pay_info.length > 0"
          v-model="infoData.pay_info[0].pay_bank"
        />
        <van-cell title="支付时间" v-model="infoData.pay_time"/>
      </div>
    </div>

    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div v-if="infoData.if_comment == 0 || showInvoice">
      <div style="height: 60px;"></div>

      <div
        class="foot bottomBox"
        :class="{iphx:this.isIphx}"
        :style="{'justify-content': !showInvoice ? 'flex-end':'space-between'}"
      >
        <span class="button button1" @click="apply" v-if="showInvoice">申请发票</span>
        <div>
          <span class="button button2" @click="toComment" v-if="infoData.if_comment == 0">评价</span>
          <!-- <span class="button button1" @click="repurchase">再次购买</span> -->
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
// import easyNav from "./../../../components/easyNav";
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
      order_id: "",
      invoice: {},
      showInvoice: false
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.showInvoice =
      parseInt(this.$route.query.invoice_id) == 0 ? true : false;
    this.getData();

    console.log(this.$route.query.invoice_id);
  },
  computed: {
    discount: function() {
      // return '-￥' + (this.infoData.order_money - this.infoData.pay_money);
      return "-￥" + 0;
    }
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

        // if (Object.keys(res.response_data.invoice_info).length > 0)
        // this.showInvoice = true;
        // this.articleInfo = res.response_data.brand_info;
      } else {
        this.$toast(res.error_message);
      }
    },
    //再次购买
    repurchase() {},
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
    },
    //评价
    toComment() {
      console.log(this.infoData.order_id);
      this.$router.push({
        name: "ordercomment",
        query: {
          order_id: this.infoData.order_id
        }
      });
    }
  }
};
</script>
