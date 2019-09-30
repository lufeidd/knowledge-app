<template>
  <div id="receivePage">
    <div class="coupon" >
      <div class="shop">博库网专营店 送您一张优惠券</div>
      <div class="time">有效期：2019.09.01- 2019.10.20</div>
      <div class="couponPrice">
        ￥
        <span class="price">5</span>
      </div>
      <div class="condition">满20元可用</div>
      <span class="received">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yilingqu" />
          </svg>
      </span>
    </div>
    <div style="margin:15px 0;">
      <van-button round type="danger" size="small">点击领取</van-button>
    </div>
    <div style="margin:15px 0;">
      <van-row gutter="20">
        <van-col span="12">
          <van-button round style="height:35px;line-height:35px;">我的优惠券</van-button>
        </van-col>
        <van-col span="12">
          <van-button round type="danger" style="height:35px;line-height:35px;">领取更多好券</van-button>
        </van-col>
      </van-row>
      <div class="goodsCoupon">
        <div>以下商品可使用此优惠券</div>
        <span class="more">
          更多
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line" />
          </svg>
        </span>
      </div>
      <van-list
        v-model="commentLoading"
        :finished="commentFinished"
        finished-text="已经到底了~"
        @load="commentLoad"
      >
        <div>
          <van-row gutter="20" type="flex" class="goodsList">
            <van-col span="12" v-for="(item,index) in goodsList" :key="index">
              <div class="content">
                <div class="ratiobox" @click="toDetail(item,index)">
                  <div class="bookImg" v-lazy:background-image="item.pic"></div>
                  <span class="goodsType">专辑</span>
                </div>
                <div class="title">{{ item.title }}</div>
                <div class="price">￥{{ item.price }}</div>
              </div>
            </van-col>
          </van-row>
        </div>
      </van-list>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/coupon/receive.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
#receivePage {
  .van-button {
    width: 100%;
  }
  .van-button--small{
    font-size: $fontSize + 4;
    height: 42px;
    line-height: 42px;
  }
  .van-button--default{
    border-color:$redLight;
    color:$redLight;
  }
}
</style>
<script>
import { TICKET_GET } from "../../apis/coupon.js"
export default {
  data() {
    return {
      // 分页
      commentLoading: false,
      commentFinished: false,
      goodsList:[
        {pic:"http://file.huoba.dev.zw/shop/10016/100042/picture/ebook/20190823/13/20190823131440268.jpg",title:"我是商品标题标题标题标题标题",price:1.66},
        {pic:"http://file.huoba.dev.zw/shop/10016/100042/picture/ebook/20190823/13/20190823131440268.jpg",title:"我是商品标题标题标题标题标题",price:1.66},
        {pic:"http://file.huoba.dev.zw/shop/10016/100042/picture/ebook/20190823/13/20190823131440268.jpg",title:"我是商品标题标题标题标题标题",price:1.66},
        {pic:"http://file.huoba.dev.zw/shop/10016/100042/picture/ebook/20190823/13/20190823131440268.jpg",title:"我是商品标题标题标题标题标题",price:1.66},
      ],
      ticket_id:'e46d13e7173',
    };
  },
  mounted() {
    // this.ticket_id = this.$route.query.ticket_id;
    this.ticketDetail();
  },
  methods: {
    commentLoad() {

    },
    async ticketDetail(){
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        ticket_id: this.ticket_id,
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_GET(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
