<template>
  <div id="resultPage">


    <div class="nullBox" v-if="brandData.length == 0">
      <img src="../../assets/null/list.png" width="100%">
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
        <div class="content" v-for="item,index in brandData">
          <div class="ratiobox">
            <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
          </div>
          <div class="right">
            <div class="text">{{item.sub_title}}</div>
            <div class="pinpai">{{item.title}}</div>
            <div class="nice">
              <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-good-line"></use>
                </svg>
                <span>{{item.praise_num}}</span>
              </span>
              <span class="comment">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-comment-line"></use>
                </svg>
                <span>266</span>
              </span>
            </div>
          </div>
        </div>
      </van-list>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/brand/result.scss" lang="scss"></style>

<script>
import { BRAND_SEARCH_GOODS_GETS } from "../../apis/brand.js";
import easyNav from "../../components/easyNav";
import resultVue from '../personal/order/result.vue';
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
        personalLink: "/personal/index",
        type:'brand',
      },
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
      page_size: 10,
    };
  },
  mounted() {
    this.searchContent = this.$route.params.searchContent ? this.$route.params.searchContent : null;
    this.goods_type = this.$route.params.goods_type ? this.$route.params.goods_type : null;
    this.getGoods();
  },
  methods: {
    programLoad(){
      this.getGoods();
    },
    async getGoods() {
      var tStamp = this.$getTimeStamp();
      var data = {
        keywords: this.searchContent,
        goods_type: this.goods_type,
        brand_id: localStorage.getItem('globalBrandId'),
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp,
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_SEARCH_GOODS_GETS(data);

console.log(123, res)
      if (res.hasOwnProperty("response_code")) {
          var result = res.response_data.result;

          console.log(123, result)


          setTimeout(() => {
            for (let i = 0; i < result.length; i++) {
              this.brandData.push(result[i]);
            }
            this.programLoading = false;
            this.page++;

            // 数据全部加载完成
            if (this.brandData.length >= res.response_data.total_count) {
              this.programFinished = true;
              this.page = 1;
            }
          }, 500);
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

