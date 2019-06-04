<template>
  <div id="mallPage" v-if="goodsInfo != null">
    <div class="popular">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">{{modleInfo.module_title}}</span>
      </div>
      <div class="showContent">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="item,index in modleInfo.list" :key="index">
            <div class="slide" @click="linktoDetail(item.contents.link_params)">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.contents.pics[0]"></div>
              </div>
              <div class="content">
                <p class="title">{{item.contents.title}}</p>
                <p class="message">{{item.contents.sub_title}}</p>
                <p class="money">¥ {{item.contents.price}}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="materialObject" v-for="item,index in goodsInfo">
      <div class="materialTitle" @click="linktoDetail(item.module_more)">
        <div class="text">
          <span class="verticleLine"></span>
          <span class="lh titleOver">{{item.module_title}}</span>
        </div>
        <span class="all">
          全部
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line"></use>
          </svg>
        </span>
      </div>
      <div class="goods">
        <div class="goodsInfo"
          v-for="value,index in item.list"
          @click="linktoDetail(value.contents.link_params)"
        >
          <div class="ratiobox">
            <div class="bookImg" v-lazy:background-image="value.contents.pics[0]"></div>
          </div>
          <p class="name">{{value.contents.title}}</p>
          <p class="message">{{value.contents.sub_title}}</p>
          <p class="money">¥ {{value.contents.price}}</p>
        </div>
      </div>
    </div>

    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/brand/mall.scss" lang="scss"></style>

<script>
import qs from "Qs";
import easyNav from "../../components/easyNav";
import { BRAND_PAGE_MALL_INDEX } from "../../apis/brand";
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
        type: "brand"
      },
      swiperOption: {
        slidesPerView: 1.2
      },
      supplier_id: null,
      title: null,
      modleInfo: [],
      goodsInfo: null,
    };
  },
  mounted() {
    this.title = this.$route.query.title;
    this.supplier_id = this.$route.query.supplier_id;
    // title
    document.title = '商城-' + this.title;
    this.getData();
  },
  // 进入当前页面
  beforeRouteEnter (to, from, next) { 

    // console.log(to, from ,next);

    // 外链进入
    // if(from.name != null) {
    // }
    next();
  },
  methods: {
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        supplier_id: this.supplier_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_PAGE_MALL_INDEX(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        this.modleInfo = res.response_data.module_list[0];
        this.goodsInfo = res.response_data.module_list.slice(1);
      } else {
        this.$toast(res.error_message);
      }
    },
    linktoDetail(link) {
      // console.log(link);
      var data = this.$translate(JSON.parse(link));
      this.$router.push(data);
    }
  }
};
</script>
