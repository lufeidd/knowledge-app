<template>
  <div id="logisticsPage">
    <div class="desc" v-if="logisticsInfo.package_desc">{{logisticsInfo.package_desc}}</div>
    <div class="content">
      <div class="huoba-goods-list huoba-goods-list-six">
        <div class="huoba-goods-list-content">
          <!-- <div class="huoba-goods-list-left">
            <div class="ratioBox">
              <div class="box">
                <img
                  src="https://file.mhuoba.com/shop/7/100032/picture/pages/20200421/14/20200421144745117.jpg"
                  alt
                />
              </div>
            </div>
          </div> -->
          <div class="huoba-goods-list-right">
            <span>
              物流单号：{{logisticsInfo.number}}
              <svg class="icon copy-number" aria-hidden="true" style="top:-1px;"@click="copy" :data-clipboard-text="logisticsInfo.number">
                <use xlink:href="#icon-copy-line" />
              </svg>
            </span>
            <span>国内承运人：{{logisticsInfo.com}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="text">物流信息</div>
      <div class="huoba-logtic-info">
        <van-steps direction="vertical" :active="0" active-color="#F05654">
          <van-step v-for="(item,index) in logisticsInfo.traces" :key="index">
            <template slot="active-icon">
              <span class="huoba-refund-step-icon"></span>
            </template>
            <div>{{item.desc}}</div>
            <div class="logtic-time">{{item.time}}</div>
          </van-step>
        </van-steps>
      </div>
    </div>
    <EazyNav type="order" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
//调用cilpboard
import Clipboard from "clipboard";
import { ORDER_EXPRESS_GET } from "../../../apis/shopping.js";
export default {
  data() {
    return {
      imgUrl:
        "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
      order_id: null,
      express_id: null,
      logisticsInfo: {}
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.express_id = this.$route.query.express_id;
    this.getInfo();
  },
  methods: {
    async getInfo() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.1",
        timestamp: tStamp,
        order_id: this.order_id,
        express_id: this.express_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_EXPRESS_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.logisticsInfo = res.response_data;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 复制订单编号
    copy() {
      const clipboard = new Clipboard(".copy-number");
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
  }
};
</script>
