<template>
  <div id="resultPage">
    <div class="nullBox" v-if="programFinished && brandData.length == 0">
      <img src="../../assets/null/list.png" width="100%" />
      <div>您搜索的内容为空</div>
    </div>
    <van-list
      v-else
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      class="list"
    >
      <div class="content" v-for="(item,index) in brandData" @click="gotoDetail(item)" :key="index">
        <div class="ratiobox">
          <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
        </div>
        <div class="right">
          <div class="text">{{item.title}}</div>
          <div class="pinpai">{{item.sub_title}}</div>
          <div class="nice">
            <span class="good" v-if="item.goods_type == 6">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-good-line" />
              </svg>
              <span>{{item.praise_num}}</span>
            </span>
            <span class="comment">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-comment-line" />
              </svg>
              <span>{{ item.comment_num }}</span>
            </span>
          </div>
        </div>
      </div>
    </van-list>
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand"></EazyNav>
    
  </div>
</template>

<style src="@/style/scss/pages/brand/result.scss" lang="scss"></style>

<script>
import { BRAND_SEARCH_GOODS_GETS } from "../../apis/brand.js";
import { WX_SHARE } from "../../apis/public.js";
// import easyNav from "../../components/easyNav";
import resultVue from "../personal/order/result.vue";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/",
      //   search: true,
      //   searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "brand"
      // },
      iconUrl:
        "https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75",
      state: "brand",
      brandData: [],
      programLoading: false,
      programFinished: false,
      // 搜索结果参数
      goods_type: null,
      searchContent: "",
      page: 1,
      title: null,
      page_size: 10
    };
  },
  mounted() {
    this.searchContent = this.$route.query.searchContent
      ? this.$route.query.searchContent
      : null;
    this.goods_type = this.$route.query.goods_type;
    // title
    this.title = this.$route.query.title ? this.$route.query.title : "";
    document.title = "搜索结果-" + this.title;

    // if(this.goods_type != null) this.getGoods();
  },
  methods: {
    // 获取页面分享信息
    // async wxShareData() {
    //   var tStamp = this.$getTimeStamp();
    //   var data = {};
    //   switch (this.$route.query.type) {
    //     case "mall":
    //       var tmp = {};
    //       tmp.supplier_id = this.$route.query.supplier_id;
    //       tmp.brand_id = this.$route.query.brand_id;
    //       if (this.$route.query.searchContent)
    //         tmp.keywords = this.$route.query.searchContent;
    //       if (this.$route.query.goods_type)
    //         tmp.goods_type = this.$route.query.goods_type;

    //       data = {
    //         page_name: "mall/goods/search",
    //         params: JSON.stringify(tmp),
    //         version: "1.0",
    //         timestamp: tStamp
    //       };
    //       break;
    //     case "brand":
    //       data = {
    //         page_name: "brand/goods/search",
    //         params: JSON.stringify({
    //           brand_id: this.$route.query.brand_id,
    //           keywords: this.$route.query.searchContent
    //         }),
    //         version: "1.0",
    //         timestamp: tStamp
    //       };
    //       break;
    //   }
    //   data.sign = this.$getSign(data);
    //   let res = await WX_SHARE(data);
    //   if (res.hasOwnProperty("response_code")) {
    //     // console.log(res.response_data)
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
    // },
    gotoDetail(item) {
      var goodsType = item.goods_type;
      if (goodsType == 1 || goodsType == 2) {
        // 音频/视频，当前页更新
        this.$router.push({
          name: "albumdetail",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 6) {
        // 文章
        this.$router.push({
          name: "article",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 9) {
        // 专辑
        this.$router.push({
          name: "album",
          query: { goods_id: item.goods_id }
        });
      } else if (goodsType == 3) {
        // 图书
        this.$router.push({
          name: "detail",
          query: { goods_id: item.goods_id }
        });
      } else {
        
      }
    },
    programLoad() {
      this.getGoods();
    },
    async getGoods() {
      var tStamp = this.$getTimeStamp();
      var data = {
        keywords: this.searchContent,
        goods_type: this.goods_type,
        brand_id: this.$route.query.brand_id,
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_SEARCH_GOODS_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;

        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.brandData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);

        // 获取页面分享信息
        var _pageName = "";
        var _params = "";
        switch (this.$route.query.type) {
          case "mall":
            var tmp = {};
            tmp.supplier_id = this.$route.query.supplier_id;
            tmp.brand_id = this.$route.query.brand_id;
            if (this.$route.query.searchContent)
              tmp.keywords = this.$route.query.searchContent;
            if (this.$route.query.goods_type)
              tmp.goods_type = this.$route.query.goods_type;
            _pageName = "mall/goods/search";
            _params = JSON.stringify(tmp);
            break;
          case "brand":
            _pageName = "brand/goods/search";
            _params = JSON.stringify({
              brand_id: this.$route.query.brand_id,
              keywords: this.$route.query.searchContent
            });
            break;
        }
        // if (this.isWxLogin) this.wxShareData();
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

