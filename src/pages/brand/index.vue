<template>
  <div id="indexPage">
    <div class="head">
      <div class="brand">
        <div class="ratiobox" @click="show">
          <div class="bookImg" v-lazy:background-image="brandData.header_pic"></div>
        </div>
        <div class="right">
          <div class="name">{{brandData.name}}</div>
          <div class="fans" v-if="brandData.statistic_list">{{brandData.statistic_list.fans_num}}粉丝</div>
        </div>

        <div class="focus" v-if="brandData.attention_state == 0" @click="focusAction">+关注</div>
        <div class="focus add" v-else @click="focusAction">已关注</div>
      </div>
      <div class="sell" @click="toMall">
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shop-line"></use>
          </svg> 品牌商城
        </div>
        <div class="link" v-if="brandData.statistic_list">
          {{brandData.statistic_list.goods_num}}件商品在售
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line"></use>
          </svg>
        </div>
      </div>
    </div>

    <van-tabs sticky animated color="#666" title-active-color="#333" @click="tabChange">
      <van-tab :title="items.name" v-for="items,index in brandData.column_list" :key="index">
        <template v-if="activekey == index">
          <van-list
            v-model="programLoading"
            :finished="programFinished"
            finished-text="没有更多了"
            @load="programLoad"
          >
            <div class="content" v-for="item,index in column_list_data" @click="linktoDetail(item)">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
              </div>
              <div class="right">
                <div class="text">{{item.title}}</div>
                <div class="pinpai">{{ item.brand_name }}</div>
                <div class="nice">
                  <span class="good" v-if="item.goods_type == 6">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-good-line"></use>
                    </svg>
                    <span>{{item.praise_num}}</span>
                  </span>
                  <span class="comment">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-comment-line"></use>
                    </svg>
                    <span>{{item.comment_num}}</span>
                  </span>
                </div>
              </div>
            </div>
          </van-list>
        </template>
      </van-tab>
    </van-tabs>

    <!-- 点击公号头像显示的弹层 -->
    <van-popup v-model="showPopup">
      <svg class="icon close" aria-hidden="true" @click="close">
        <use xlink:href="#icon-close-line"></use>
      </svg>
      <div class="ratiobox">
        <div class="bookImg" v-lazy:background-image="brandData.header_pic"></div>
      </div>
      <div class="name">{{brandData.name}}</div>
      <div class="company">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zimeitigongsi"></use>
        </svg>
        （{{brandData.create_time}}入驻）
      </div>
      <div class="line"></div>
      <div class="content">{{brandData.summary}}</div>
    </van-popup>

    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/brand/index.scss" lang="scss"></style>

<script>
import { BRAND_INFO, BRAND_COLUMN_GETS } from "../../apis/brand.js";
import { FOCUS_ADD, FOCUS_CANCEL, WX_SHARE } from "../../apis/public.js";
import easyNav from "./../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      navData: {
        fold: false,
        home: false,
        // homeLink: "/brand/index",
        search: true,
        searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type: "brand"
      },
      focus: null,
      showPopup: false,
      programLoading: false,
      programFinished: false,
      brandData: {},
      column_list_data: [],
      packets_id: null,
      brand_id: null,
      currentPage: 1,
      activekey: 0
    };
  },
  mounted() {
    this.brand_id = this.$route.query.brand_id;
    this.brandGetData();
  },
  methods: {
    show() {
      this.showPopup = true;
    },
    close() {
      this.showPopup = false;
    },
    // 获取关注接口信息
    async focusData(__type) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            brand_id: this.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_ADD(data);
          this.brandData.attention_state = 1;
          // this.$toast('已关注~');
          this.brandData.statistic_list.fans_num += 1;
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          this.brandData.attention_state = 0;
          this.$toast("已取消关注~");
          this.brandData.statistic_list.fans_num -= 1;
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    focusAction() {
      if (this.brandData.attention_state > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("focus");
      }
    },
    // 获取页面基本信息
    async brandGetData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        brand_id: this.brand_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.brandData = res.response_data;

        // 获取页面分享信息
        this.wxShareData();

        // title
        document.title = this.brandData.name;
        if (res.response_data.column_list.length > 0)
          this.packets_id = res.response_data.column_list[0].packets_id;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取页面分享信息
    async wxShareData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        page_name: "brand/index",
        params: JSON.stringify({brand_id: this.$route.query.brand_id}),
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await WX_SHARE(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(res.response_data)
        // 微信分享
        this.$getWxData(
          res.response_data.share_info.title,
          res.response_data.share_info.desc,
          res.response_data.share_info.pic,
          res.response_data.share_info.url
        );
      } else {
        this.$toast(res.error_message);
      }
    },
    // 列表下拉加载
    programLoad() {
      // console.log('--load：');
      this.columnListData();
      // console.log('page:',this.currentPage,this.column_list_data);
    },
    // 点击tab页切换
    tabChange(index) {
      this.activekey = index;
      this.column_list_data = [];
      this.programFinished = false;
      this.currentPage = 1;
      // console.log(index,this.brandData.column_list[index].packets_id);
      this.packets_id = this.brandData.column_list[index].packets_id;
    },
    // 获取对应tab页下的列表
    async columnListData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        brand_id: this.brand_id,
        packets_id: this.packets_id,
        page: this.currentPage,
        page_size: 10,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_COLUMN_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.column_list_data.push(result[i]);
          }
          // console.log('column:',this.column_list_data,result)
          // 加载状态结束
          this.programLoading = false;
          this.currentPage++;

          // 数据全部加载完成
          if (this.currentPage > res.response_data.total_page) {
            this.programFinished = true;
            this.currentPage = 1;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
      }
    },
    linktoDetail(item) {
      // console.log(item);
      // 音频/视频
      if (item.goods_type == 1 || item.goods_type == 2) {
        this.$router.push({
          name: "albumdetail",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 专辑
      if (item.goods_type == 6) {
        this.$router.push({
          name: "article",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 文章
      if (item.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
    },
    toMall() {
      this.$router.push({
        name: "mall",
        query: {
          supplier_id: this.brandData.supplier_id,
          title: this.brandData.name
        }
      });
    }
  }
};
</script>

