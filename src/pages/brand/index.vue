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
      <div class="sell" @click="toMall" v-if="brandData.mall_show == 1">
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shop-line" />
          </svg> 品牌商城
        </div>
        <div class="link" v-if="brandData.statistic_list">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line" />
          </svg>
        </div>
      </div>
    </div>

    <van-tabs
      sticky
      animated
      color="#666"
      title-active-color="#333"
      @click="tabChange"
      v-if="brandData.column_list && brandData.column_list.length > 0"
      v-model="activekey"
    >
      <van-tab :title="items.name" v-for="(items,index) in brandData.column_list" :key="index">
        <template v-if="activekey == index">
          <van-list
            v-model="programLoading"
            :finished="programFinished"
            finished-text="没有更多了"
            @load="programLoad"
          >
            <div
              class="content"
              v-for="(item,index) in column_list_data"
              :key="index"
              @click="linktoDetail(item)"
            >
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
              </div>
              <div class="right">
                <div class="text">{{item.title}}</div>
                <div class="pinpai" v-if="item.goods_type == 1 || item.goods_type == 2 || item.goods_type == 6 || item.goods_type == 9">{{ item.brand_name }}</div>
                <div class="pinpai" v-if="item.goods_type == 4 || item.goods_type == 3">{{ item.book_author }}</div>
                <div class="nice">
                  <span class="good" v-if="item.goods_type == 6">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-good-line" />
                    </svg>
                    <span>{{item.praise_num}}</span>
                  </span>
                  <span class="comment" v-if="item.goods_type == 1 || item.goods_type == 2 || item.goods_type == 6 || item.goods_type == 9">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-comment-line" />
                    </svg>
                    <span>{{item.comment_num}}</span>
                  </span>
                  <span class="price" v-if="item.goods_type == 4 || item.goods_type == 3">
                    <span v-if="item.price">￥{{item.price}}</span>
                    <span v-else>免费</span>
                  </span>
                </div>
              </div>
            </div>
          </van-list>
        </template>
        <div style="position:relative;height:90px;">
          <CopyRight></CopyRight>
      </div>
      </van-tab>
    </van-tabs>

    <!-- 点击公号头像显示的弹层 -->
    <van-popup v-model="showPopup">
      <svg class="icon close" aria-hidden="true" @click="close">
        <use xlink:href="#icon-close-line" />
      </svg>
      <div class="ratiobox">
        <div class="bookImg" v-lazy:background-image="brandData.header_pic"></div>
      </div>
      <div class="name">{{brandData.name}}</div>
      <div class="company">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zimeitigongsi" />
        </svg>
        （{{brandData.create_time}}入驻）
      </div>
      <div class="line"></div>
      <div class="content">{{brandData.summary}}</div>
    </van-popup>

    <EazyNav type="brand"></EazyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/brand/index.scss" lang="scss"></style>

<script>
// vue无刷新修改url参数
import merge from "webpack-merge";
import { BRAND_INFO, BRAND_COLUMN_GETS } from "../../apis/brand.js";
import { FOCUS_ADD, FOCUS_CANCEL, WX_SHARE } from "../../apis/public.js";
export default {
  data() {
    return {
      focus: null,
      showPopup: false,
      programLoading: false,
      programFinished: false,
      brandData: {},
      column_list_data: [],
      packets_id: null,
      brand_id: null,
      supplier_id: null,
      currentPage: 1,
      activekey: 0
    };
  },
  mounted() {
    if (this.$route.query.title) document.title = this.$route.query.title;
    this.brand_id = parseInt(this.$route.query.brand_id);
    if (this.brand_id) {
      this.brandGetData();
    } else {
      this.$toast("商户信息丢失，请返回重新访问页面!");
      this.$router.replace({
        name: "personalIndex",
      });
    }
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
          if (res.hasOwnProperty("response_code")) {
            this.brandData.attention_state = 1;
            // this.$toast('已关注~');
            this.brandData.statistic_list.fans_num += 1;
          } else {
            this.$toast(res.error_message);
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              this.$router.push({ name: "login", params: {} });
            }
          }
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          if (res.hasOwnProperty("response_code")) {
            this.brandData.attention_state = 0;
            this.$toast("已取消关注~");
            this.brandData.statistic_list.fans_num -= 1;
          } else {
            this.$toast(res.error_message);
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              this.$router.push({ name: "login", params: {} });
            }
          }
          break;
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
        if (this.isWxLogin) this.wxShareData();

        // title
        document.title = this.brandData.name;

        if (res.response_data.column_list.length > 0) {
          for (let i = 0; i < res.response_data.column_list.length; i++) {
            if (this.$route.query.packets_id) {
              if (
                parseInt(this.$route.query.packets_id) ==
                res.response_data.column_list[i].packets_id
              ) {
                this.activekey = i;
              }
            }
          }

          this.packets_id =
            res.response_data.column_list[this.activekey].packets_id;
        }
      } else {
        this.$router.replace({
          name: "personalIndex",
          query: {}
        });
        this.$toast(res.error_message);
      }
    },
    // 获取页面分享信息
    async wxShareData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        page_name: "brand/index",
        params: JSON.stringify({ brand_id: this.$route.query.brand_id }),
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await WX_SHARE(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res.response_data)
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
      this.columnListData();
    },
    // 点击tab页切换
    tabChange(index) {
      this.activekey = index;
      this.column_list_data = [];
      this.programFinished = false;
      this.currentPage = 1;
      this.packets_id = this.brandData.column_list[index].packets_id;
      this.$router.push({
        query: merge(this.$route.query, { packets_id: this.packets_id })
      });
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
          if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              this.column_list_data.push(result[i]);
            }
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
        }, 1);
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
            pid: null,
            packets_id: this.packets_id
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
       //电子书
      if(item.goods_type == 4) {
        this.$router.push({
          name:"ebookdetail",
          query:{
            goods_id:item.goods_id,
          }
        })
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

