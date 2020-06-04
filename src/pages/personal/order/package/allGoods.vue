<template>
  <div id="allGoodsPage">
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="已经到底了~"
      @load="programLoad"
    >
      <div
        class="huoba-goods-list huoba-goods-list-one"
        v-for="(item,index) in infoData.detail"
        :key="index"
        @click="goodsDetail(item)"
      >
        <div class="huoba-goods-list-left">
          <div class="ratioBox">
            <div class="box">
              <img :src="item.pic" alt />
            </div>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 1">音频</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 2">视频</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 3">图书</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 4">电子书</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 9">专辑</span>
          </div>
        </div>
        <div class="huoba-goods-list-mid">
          <span class="huoba-goods-title">
            <span>{{item.goods_name}}</span>
          </span>
          <div>
            <span class="huoba-goods-price">￥{{item.real_price.toFixed(2)}}</span>
            <span class="huoba-goods-num">x{{item.buy_count}}</span>
          </div>
        </div>
        <div class="huoba-goods-list-right">
          <span></span>
          <span
            class="huoba-goods-opera"
            v-if="infoData.type == 2 && (item.if_refund == 1 || item.if_refund == 5) && item.real_price > 0"
            @click.stop="torefund(item)"
          >申请售后</span>
          <span
            class="huoba-goods-opera"
            v-if="infoData.type == 2 && item.if_refund == 2 && item.real_price > 0"
            @click.stop="toOngoing(item)"
          >退款审核中</span>
          <span
            class="huoba-goods-opera"
            v-if="infoData.type == 2 && item.if_refund == 3 && item.real_price > 0"
            @click.stop="toOngoing(item)"
          >退款成功</span>
          <span
            class="huoba-goods-opera"
            v-if="infoData.type == 2 && item.if_refund == 4 && item.real_price > 0"
            @click.stop="toOngoing(item)"
          >退款失败</span>
        </div>
      </div>
    </van-list>
  </div>
</template>
<style lang="scss">
#allGoodsPage {
  background-color: $greyLight;
  min-height: 100%;
}
</style>
<script>
import { USER_ORDER_DETAIL_GET } from "../../../../apis/user.js";
export default {
  data() {
    return {
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10,
      order_id: null,
      goods_list: [],
      infoData: {}
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
  },
  methods: {
    programLoad() {
      this.getData();
    },
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
        this.programFinished = true;
        this.programLoading = false;
      } else {
        this.$toast(res.error_message);
        this.programFinished = true;
      }
    },
    // 申请售后
    torefund(item) {
      if(this.infoData.if_account == 1){
        this.$toast('抱歉，此商品已超过退款周期')
        return
      }else if (this.infoData.state == 2) {
        // this.$toast("抱歉，此商品已超过退款周期");
        this.$router.push({
          name:"refundtwo",
          query:{
            order_id: this.infoData.order_id,
            detail_id: item.id,
            goods_length:this.infoData.detail.length
          }
        })
      } else if (this.infoData.state == 4 || this.infoData.state == 5){
        this.$router.push({
          name: "refundtype",
          query: {
            order_id: this.infoData.order_id,
            detail_id: item.id,
            pic: item.pic,
            goods_type: item.goods_type,
            goods_num: item.buy_count,
            goods_name: item.goods_name,
            real_price: item.real_price,
            goods_length:this.infoData.detail.length
          }
        });
      }
    },
    // 查看退款进度
    toOngoing(item) {
      this.$router.push({
        name: "ongoing",
        query: {
          order_id: this.infoData.order_id,
          detail_id: item.id
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
            pid: item.album_id ? item.album_id : 0
          }
        });
      }
      // 文章
      else if (item.goods_type == 6) {
        this.$router.push({
          name: "article",
          query: {
            goods_id: item.goods_id
          }
        });
      }
      //专辑
      else if (item.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: {
            goods_id: item.goods_id
          }
        });
      }
      // 实物商品
      else if (item.goods_type == 3) {
        this.$router.push({
          name: "detail",
          query: {
            goods_id: item.goods_id
          }
        });
      }
      // 电子书
      else if (item.goods_type == 4) {
        this.$router.push({
          name: "ebookdetail",
          query: {
            goods_id: item.goods_id
          }
        });
      }
    }
  }
};
</script>
