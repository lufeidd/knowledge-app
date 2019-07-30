<template>
  <div id="mallPage" v-if="module_list != null">
    <!-- 
module_temp_id	
7	横向滑屏
80	一行两个-纸质图书
40	一行两个-音频
60	一行两个-视频
50	一行两个-专辑
    30	一行两个-文章-->

    <!-- 横向滑屏 -->
    <div v-for="(item, index) in module_list" :key="index">
      <div class="popular" v-if="parseInt(item.module_temp_id) == 7">
        <div class="text">
          <span class="verticleLine"></span>
          <span class="lh" v-if="item.module_title">{{item.module_title}}</span>
        </div>
        <div class="showContent">
          <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(litem,lindex) in item.list" :key="lindex">
              <div class="slide" @click="linktoDetail(litem.contents.link_params)">
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
                </div>
                <div class="content">
                  <p class="title" v-if="litem.contents.title">{{litem.contents.title}}</p>
                  <p class="message" v-if="litem.contents.sub_title">{{litem.contents.sub_title}}</p>
                  <p class="money" v-if="litem.contents.price">¥ {{litem.contents.price}}</p>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <!-- 一行两个 -->
      <div
        class="materialObject"
        v-if="parseInt(item.module_temp_id) == 80 || parseInt(item.module_temp_id) == 40 || parseInt(item.module_temp_id) == 60 || parseInt(item.module_temp_id) == 50 || parseInt(item.module_temp_id) == 30"
      >
        <div class="materialTitle" @click="linktoDetail(item.module_more)">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver" v-if="item.module_title">{{item.module_title}}</span>
          </div>
          <span class="all">
            全部
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div class="goods">
          <div
            class="goodsInfo"
            v-for="(gitem, gindex) in item.list"
            @click="linktoDetail(gitem.contents.link_params)"
            :key="gindex"
          >
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="gitem.contents.pics[0]"></div>
            </div>
            <p class="name" v-if="gitem.contents.title">{{gitem.contents.title}}</p>
            <p class="message" v-if="gitem.contents.sub_title">{{gitem.contents.sub_title}}</p>
            <p class="money" v-if="gitem.contents.price">¥ {{gitem.contents.price}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="mall"></EazyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/brand/mall.scss" lang="scss"></style>

<script>
import qs from "Qs";
// import easyNav from "../../components/easyNav";
import { BRAND_PAGE_MALL_INDEX } from "../../apis/brand";
import { WX_SHARE } from "../../apis/public.js";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: true,
      //   searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "mall",
      //   supplier_id: null
      // },
      swiperOption: {
        slidesPerView: 1.2
      },
      supplier_id: null,
      title: null,
      module_list: []
    };
  },
  mounted() {
    this.title = this.$route.query.title ? this.$route.query.title : "";
    this.supplier_id = this.$route.query.supplier_id;
    // this.navData.supplier_id = this.supplier_id;
    // title
    document.title = "商城-" + this.title;
    this.getData();
  },
  // 进入当前页面
  beforeRouteEnter(to, from, next) {
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

        for (let i = 0; i < res.response_data.module_list.length; i++) {}

        this.module_list = res.response_data.module_list;

        // 获取页面分享信息
        // if(this.isWxLogin) this.wxShareData();
        var _pageName = "mall/index";
        var _params = JSON.stringify({
          brand_id: this.$route.query.brand_id,
          supplier_id: this.$route.query.supplier_id
        });
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);
      } else {
        this.$toast(res.error_message);
      }
    },
    linktoDetail(link) {
      // console.log(link);
      var data = this.$translate(JSON.parse(link));
      if (data.name == "") return;
      data.query.type = "mall";
      this.$router.push(data);
    }
    // 获取页面分享信息
    // async wxShareData() {
    //   var tStamp = this.$getTimeStamp();
    //   var data = {
    //     page_name: "mall/index",
    //     params: JSON.stringify({
    //       brand_id: this.$route.query.brand_id,
    //       supplier_id: this.$route.query.supplier_id
    //     }),
    //     version: "1.0",
    //     timestamp: tStamp
    //   };
    //   data.sign = this.$getSign(data);
    //   let res = await WX_SHARE(data);
    //   if (res.hasOwnProperty("response_code")) {
    //     // console.log(res.response_data)
    //     document.title = res.response_data.share_info.title;
    //     // 微信分享
    //     this.$getWxData(
    //       res.response_data.share_info.title,
    //       res.response_data.share_info.desc,
    //       res.response_data.share_info.pic,
    //       res.response_data.share_info.url
    //     );
    //   } else {
    //     this.$toast(res.error_message);
    //   }
    // }
  }
};
</script>
