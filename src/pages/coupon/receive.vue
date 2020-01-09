<template>
  <div id="receivePage">
    <div class="receiveContainer" v-if="Object.keys(couponInfo).length > 0">
      <div class="coupon" :class="(couponInfo.state==2||couponInfo.state==4)?'overdue':''">
        <div class="ratiobox" v-if="couponInfo.state==2||couponInfo.state==4">
          <div class="bookImg" :style="overbgUrl"></div>
        </div>
        <div class="ratiobox" v-else>
          <div class="bookImg" :style="bgUrl"></div>
        </div>
        <div class="shop">{{couponInfo.brand_name}}&nbsp;送您一张优惠券</div>
        <div class="time">
          <span v-if="couponInfo.state !== 0"><span v-if="couponInfo.state == 3">{{couponInfo.use_stime.replace(/-/g,'.').substring(0,10)}}- {{couponInfo.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
          <span v-else>
            <span v-if="couponInfo.use_time_type == 2">领取后{{couponInfo.use_time_day}}天有效</span>
            <span
              v-else
            >{{couponInfo.use_stime.replace(/-/g,'.').substring(0,10)}}- {{couponInfo.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
          </span></span>
          <div class="couponPrice">
            ￥
            <span class="price">{{couponInfo.money}}</span>
          </div>
        </div>

        <div class="condition">满{{couponInfo.use_min_money}}元可用</div>
        <span class="received" v-if="couponInfo.state == 3">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yilingqu" />
          </svg>
        </span>
        <span class="received" v-if="couponInfo.state == 4">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-overed-line" />
          </svg>
        </span>
        <span class="received" v-if="couponInfo.state == 2">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-received-line" />
          </svg>
        </span>
      </div>
      <div style="margin:15px 0;" v-if="couponInfo.state == 1">
        <van-button round type="danger" size="small" @click="receive">点击领取</van-button>
      </div>
      <div style="margin:15px 0;" v-if="couponInfo.state == 2 || couponInfo.state == 4">
        <van-button round type="danger" size="small" @click="receiveMore">领更多好券</van-button>
      </div>
      <div style="margin:30px 0;" v-if="couponInfo.state == 3">
        <van-row gutter="20">
          <van-col span="12">
            <van-button round style="height:35px;line-height:35px;" @click="toMyCoupon">我的优惠券</van-button>
          </van-col>
          <van-col span="12">
            <van-button
              round
              type="danger"
              style="height:35px;line-height:35px;"
              @click="receiveMore"
            >领取更多好券</van-button>
          </van-col>
        </van-row>
      </div>
      <div style="margin:30px 0;" v-if="couponInfo.state == 0">
        <van-row gutter="20">
          <van-col span="12">
            <van-button round style="height:35px;line-height:35px;" @click="receiveMore">领更多好券</van-button>
          </van-col>
          <van-col span="12">
            <van-button
              round
              type="danger"
              style="height:35px;line-height:35px;"
            >{{couponInfo.get_stime_desc}}</van-button>
          </van-col>
        </van-row>
      </div>
      <!-- v-if="showMore" -->
      <div v-if="couponInfo.state !== 1 ">
        <div class="goodsCoupon">
          <div v-if="couponInfo.state == 3">以下商品可使用此优惠券</div>
          <div v-else>为您推荐</div>
          <span class="more" v-if="couponInfo.state == 3" @click="toResult">
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
          v-if="couponInfo.state == 3"
        >
          <div>
            <van-row gutter="20" type="flex" class="goodsList">
              <van-col span="12" v-for="(item,index) in goodsList" :key="index">
                <div class="content" @click="toDetail(item,index)">
                  <div class="ratiobox" @click="toDetail(item,index)">
                    <div class="bookImg" v-lazy:background-image="item.pic"></div>
                    <span class="goodsType" v-if="item.goods_type == 9">专辑</span>
                    <span class="goodsType" v-if="item.goods_type == 4">电子书</span>
                    <span class="goodsType" v-if="item.goods_type == 3">纸书</span>
                    <span class="goodsType" v-if="item.goods_type == 1">音频</span>
                    <span class="goodsType" v-if="item.goods_type == 2">视频</span>
                    <span class="goodsType" v-if="item.goods_type == 6">文章</span>
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price" v-if="item.price">￥{{ item.price }}</div>
                  <div class="price" v-else>免费</div>
                </div>
              </van-col>
            </van-row>
          </div>
        </van-list>
        <van-list
          v-model="commentLoading1"
          :finished="commentFinished1"
          finished-text="已经到底了~"
          @load="commentLoad1"
          v-else
        >
          <div>
            <van-row gutter="20" type="flex" class="goodsList">
              <van-col span="12" v-for="(item,index) in goodsList1" :key="index">
                <div class="content" @click="toDetail(item,index)">
                  <div class="ratiobox" @click="toDetail(item,index)">
                    <div class="bookImg" v-lazy:background-image="item.pic"></div>
                    <span class="goodsType" v-if="item.goods_type == 9">专辑</span>
                    <span class="goodsType" v-if="item.goods_type == 4">电子书</span>
                    <span class="goodsType" v-if="item.goods_type == 3">纸书</span>
                    <span class="goodsType" v-if="item.goods_type == 1">音频</span>
                    <span class="goodsType" v-if="item.goods_type == 2">视频</span>
                    <span class="goodsType" v-if="item.goods_type == 6">文章</span>
                  </div>
                  <div class="title">{{ item.title }}</div>
                  <div class="price" v-if="item.price">￥{{ item.price }}</div>
                  <div class="price" v-else>免费</div>
                </div>
              </van-col>
            </van-row>
          </div>
        </van-list>
      </div>
    </div>
    <van-popup v-model="failedModel" :close-on-click-overlay=false>
      <div class="faildContent">
        <p>此优惠券不存在</p>
        <p>
          <img src="../../assets/redeem/outdated.png" alt width="55px" />
        </p>
        <div class="descrip">
          <span class="seconds">3</span>秒后回到首页
        </div>
      </div>
    </van-popup>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/coupon/receive.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
#receivePage {
  .van-button {
    width: 100%;
  }
  .van-button--small {
    font-size: $fontSize + 4;
    height: 42px;
    line-height: 42px;
  }
  .van-button--default {
    border-color: $redLight;
    color: $redLight;
  }
  .van-popup {
    border-radius: 5px;
  }
  .faildContent {
    padding: 15px 30px;
    p {
      text-align: center;
      font-size: $fontSize + 1;
    }
    .descrip {
      text-align: center;
      color: $cl9;
      .seconds {
        color: $redDark;
      }
    }
  }
}
</style>
<script>
import {
  TICKET_GET,
  TICKET_LINK,
  TICKET_DETAIL_GETS,
  TICKET_GOODS_RECOMMEND
} from "../../apis/coupon.js";
import { USER_HOMEPAGE } from "../../apis/user.js";
export default {
  data() {
    return {
      // 分页
      commentLoading: false,
      commentFinished: false,
      commentLoading1: false,
      commentFinished1: false,
      goodsList: [],
      goodsList1: [],
      bgUrl: {
        backgroundImage: "url(" + require("../../assets/null/coupon.png") + ")"
      },
      overbgUrl: {
        backgroundImage:
          "url(" + require("../../assets/null/received.png") + ")"
      },
      ticket_id: "",
      couponInfo: {},
      showMore: false,
      isReceived: false,
      page: 1,
      page1: 1,
      islogin: null,
      failedModel: true
    };
  },
  mounted() {
    this.ticket_id = this.$route.query.ticket_id;
    this.ticketDetail();
    this.judgeisLogin();
  },
  methods: {
    commentLoad() {
      // console.log(89898,this.couponInfo.state)
      this.getList();
    },
    commentLoad1() {
      // console.log(89898,this.couponInfo.state)
      this.getList1();
    },
    async judgeisLogin() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_HOMEPAGE(data);

      if (res.hasOwnProperty("response_code")) {
        this.islogin = res.response_data.is_login;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 优惠券详情
    async ticketDetail() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        ticket_id: this.ticket_id
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_GET(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.couponInfo = res.response_data;
        // console.log(111,this.couponInfo.use_stime<this.couponInfo.use_etime)
      } else {
        if (res.error_message == "优惠券不存在") {
          this.failedModel = true;
          var _this = this;
          setTimeout(() => {
            _this.$router.replace({
              name: "brand",
              query: {
                brand_id: _this.$route.query.brand_id
              }
            });
          }, 3000);
        } else {
          this.$toast(res.error_message);
        }
      }
    },
    // 优惠券领取
    async ticketLink() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        ticket_id: this.ticket_id
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_LINK(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.$toast("领取成功！");
        this.couponInfo.use_stime = res.response_data.use_stime
        this.couponInfo.use_etime = res.response_data.use_etime
        this.couponInfo.state = 3;
      } else {
        this.$toast(res.error_message);
      }
    },
    receive() {
      if (this.islogin) {
        this.ticketLink();
      } else {
        this.$toast("用户未登录");
        this.$router.push({
          name: "login"
        });
      }
      // this.showMore = true;
    },
    toMyCoupon() {
      if (this.islogin) {
        this.$router.push({
          name: "couponmine"
        });
      } else {
        this.$toast("用户未登录");
        this.$router.push({
          name: "login"
        });
      }
    },
    receiveMore() {
      // window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      console.log(u, app, _ios, _android);
      if (_ios) {
        window.location.href =
          "https://apps.apple.com/cn/app/%E7%81%AB%E6%8A%8A%E7%9F%A5%E8%AF%86/id1473766311";
      } else if (_android) {
        window.location.href =
          "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      }
    },
    async getList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page,
        ticket_id: this.ticket_id
      };
      data.sign = this.$getSign(data);
      var res = await TICKET_DETAIL_GETS(data);
      // var res = await TICKET_GOODS_RECOMMEND(data);

      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.goodsList.push(result[i]);
          }
          // 加载状态结束
          this.commentLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.commentFinished = true;
            this.page = 1;
          }
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    async getList1() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page1,
        ticket_id: this.ticket_id
      };
      data.sign = this.$getSign(data);
      var res = await TICKET_GOODS_RECOMMEND(data);

      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.goodsList1.push(result[i]);
          }
          // 加载状态结束
          this.commentLoading1 = false;
          this.page1++;

          // 数据全部加载完成
          if (this.page1 > res.response_data.total_page) {
            this.commentFinished1 = true;
            this.page1 = 1;
          }
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    toResult() {
      this.$router.push({
        name: "couponresult",
        query: {
          ticket_id: this.ticket_id
        }
      });
    },
    toDetail(item, index) {
      // 音频/视频
      if (item.goods_type == 1 || item.goods_type == 2) {
        this.$router.push({
          name: "albumdetail",
          query: { goods_id: item.goods_id }
        });
      }
      // 文章
      if (item.goods_type == 6) {
        this.pid = null;
        this.$router.push({
          name: "article",
          query: { goods_id: item.goods_id }
        });
      }
      // 专辑
      if (item.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: { goods_id: item.goods_id }
        });
      }
      // 电子书
      if (item.goods_type == 4) {
        this.$router.push({
          name: "ebookdetail",
          query: { goods_id: item.goods_id }
        });
      }
      //纸书
      if (item.goods_type == 3) {
        this.$router.push({
          name: "detail",
          query: { goods_id: item.goods_id }
        });
      }
    }
  }
};
</script>
