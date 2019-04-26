<template>
  <div id="listPage">
    <div class="content">
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
        <!-- <span class="button1">评价</span> -->
        <!-- <span class="button1">再次购买</span> -->
        <span class="button2">去支付</span>
        <!-- <span class="button2">确认收货</span> -->
      </div>
    </div>

    <div class="content">
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
          <!-- <span class="button2" >去支付</span> -->
          <!-- <span class="button2">确认收货</span> -->
        </div>
      </div>
    </div>

    <div class="content" v-for="item in publishData">
      <div class="head">
        <div class="titleFrom">
          <img v-lazy="item.icon" alt class="icon">
          <span class="publish">{{item.from}}</span>
        </div>
        <span :class="item.orderClass">{{item.order}}</span>
      </div>
      <div class="section">
        <div class="bookDetail">
          <div class="ratiobox">
            <a class="bookImg" v-lazy:background-image="item.imgUrl"></a>
          </div>
          <span class="title">{{item.title}}</span>
        </div>
        <div class="tip2">
          <span class="noChange">虚拟内容不退不换</span>
          <span class="actulPay">
            实付款：
            <span class="money">￥{{item.price.toFixed(2)}}</span>
          </span>
        </div>
      </div>
      <div class="foot">
        <span class="button1">评价</span>
        <!-- <span class="button1">再次购买</span> -->
        <!-- <span class="button2" >去支付</span> -->
        <span class="button2">确认收货</span>
      </div>
    </div>

    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/list.scss" lang="scss"></style>

<script>
import easyNav from "./../../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      navData: {
        fold: false,
        home: true,
        homeLink: "/",
        search: true,
        searchLink: "/search",
        personal: true,
        personalLink: "/personal/index"
      },
      publishData: [
        {
          icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
          from: "人民出版集团",
          order: "待支付",
          orderClass: "order1",
          imgUrl:
            "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
          title: "新版中国少年儿童百科全书共4册浩瀚宇宙+恐龙王国",
          price: 134.0
        },
        {
          icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
          from: "人民出版集团",
          order: "待收货",
          orderClass: "order1",
          imgUrl:
            "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
          title: "新版中国少年儿童百科全书共4册浩瀚宇宙+恐龙王国",
          price: 134.21
        },
        {
          icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
          from: "人民出版集团",
          order: "已完成",
          orderClass: "order2",
          imgUrl:
            "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
          title: "新版中国少年儿童百科全书共4册浩瀚宇宙+恐龙王国",
          price: 134.0
        }
      ],
      state: { evaluate: true, isPay: true, rePurchase: true, confirm: true },
      iconUrl: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
      imgUrl:
        "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
      swiperOption: {
        slidesPerView: 5.3
      }
    };
  }
};
</script>


