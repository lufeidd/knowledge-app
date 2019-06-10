<template>
  <div id="listPage">
    <div class="nullBox" v-if="programFinished && publishData.length == 0">
      <img src="../../../assets/null/list.png" width="100%">
      <div>您的订单列表为空</div>
    </div>
    <!-- <div class="content">
      <div class="head">
        <div class="titleFrom">
          <img v-lazy="iconUrl" class="icon">
          <span class="publish">浙江出版传媒集团</span>
        </div>
        <span class="order1">待支付</span>
      </div>
      <div class="section">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
        </swiper>
        <div class="tip1">
          <span class="actulPay">
            实付款：
            <span class="money">￥ 134.00</span>
          </span>
        </div>
      </div>
      <div class="foot">
        <span class="button2">去支付</span>
      </div>
    </div>-->

    <!-- <div class="content">
      <div class="head">
        <div class="titleFrom">
          <img v-lazy="iconUrl" class="icon">
          <span class="publish">浙江出版传媒集团</span>
        </div>
        <span class="order2">已完成</span>
      </div>
      <div class="section">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="imgUrl"></a>
            </div>
          </swiper-slide>
        </swiper>
        <div class="tip1">
          <span class="actulPay">
            实付款：
            <span class="money">￥ 134.00</span>
          </span>
        </div>
      </div>
      <div class="footFinish">
        <span class="more">更多</span>
        <div>
          <span class="button1">评价</span>
          <span class="button1">再次购买</span>
        </div>
      </div>
    </div>-->
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      v-else
    >
      <div class="content" v-for="item,index in publishData">
        <div class="head" @click="toBrandindex(item)">
          <div class="titleFrom">
            <img v-lazy="item.brand_header_pic" alt class="icon">
            <span class="publish">{{item.brand_name}}</span>
          </div>
          <span :class="item.state ==0? 'order1':'order2'">{{item.state_desc}}</span>
        </div>
        <div class="section" v-for="item1 in item.details" @click="toDetail(item)">
          <div class="bookDetail">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="item1.pic"></a>
            </div>
            <span class="title">{{item1.goods_name}}</span>
          </div>
          <div class="tip2">
            <span class="noChange">虚拟内容不退不换</span>
            <span class="actulPay">
              实付款：
              <span class="money">￥{{item1.real_price}}</span>
            </span>
          </div>
        </div>
        <div class="foot">
          <span class="button button1" @click="repply(item)" v-if="item.invoice_id == 0">申请发票</span>
          <span class="button button1" v-else>查看发票</span>
          <div>
            <span class="button button1">评价</span>
            <!-- <span class="button1" v-if="item.state ==1">再次购买</span> -->
            <!-- <span class="button2" >去支付</span> -->
            <!-- <span class="button2" v-if="item.state ==0">确认收货</span> -->
          </div>
        </div>
      </div>
    </van-list>

    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped  src="@/style/scss/pages/personal/order/list.scss" lang="scss"></style>

<script>
import easyNav from "./../../../components/easyNav";
import { USER_ORDER_DETAIL_GETS } from "../../../apis/user.js";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: true,
        searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type: "order"
      },
      publishData: [],
      state: { evaluate: true, isPay: true, rePurchase: true, confirm: true },
      swiperOption: {
        slidesPerView: 5.3
      },
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10,
      order_id: ""
    };
  },
  mounted() {
    // this.getData();
    // console.log(brandId);
  },
  methods: {
    programLoad() {
      this.getData();
    },
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        // order_id:1905062000270095,
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GETS(data);
      if (
        res.hasOwnProperty("response_code") &&
        res.response_data.hasOwnProperty("result")
      ) {
        var result = res.response_data.result;

        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        

        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.publishData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          
        }

        this.$toast(res.error_message);
      }
    },
    toDetail(item) {
      // console.log(item);
      this.$router.push({
        name: "orderdetail",
        query: {
          order_id: item.order_id
        }
      });
    },
    //申请发票
    repply(item) {
      // console.log(item);
      this.$router.push({
        name: "orderinvoice",
        query: {
          order_id: item.order_id,
          money: item.order_money
        }
      });
    },
    //跳转公号主页
    toBrandindex(item) {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: item.brand_id
        }
      });
    }
  }
};
</script>


