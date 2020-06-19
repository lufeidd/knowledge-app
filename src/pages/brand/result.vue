<template>
  <div id="resultPage">
    <div
      class="nullBox"
      v-if="programFinished && contentData.length == 0 && summaryList.length == 0"
    >
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
      <!-- <div> -->
      <div class="searhResult">
        <svg class="icon searchIcon" aria-hidden="true">
          <use xlink:href="#icon-search-line" />
        </svg>
        <input type="text" v-model="searchContent" @focus="inputText" />
        <span class="cancel" @click="inputText">取消</span>
      </div>
      <van-tabs
        sticky
        animated
        color="#666"
        title-active-color="#333"
        @click="tabChange"
        v-if="column_list.length > 0"
        v-model="activekey"
      >
        <van-tab :title="items.name" v-for="(items,index) in column_list" :key="index">
          <template
            v-if="items.goods_type == 0 && items.search_type && items.search_type == 'summary' && activekey == index"
          >
            <div v-for="(litem,lindex) in summaryList" :key="lindex">
              <div class="summaryList" v-if="litem.search_type == 'brand'">
                <div class="head">
                  <span class="verticleLine"></span>
                  <span class="brandName">火把号</span>
                </div>
                <div
                  class="brandContent"
                  v-for="(bitem,bindex) in litem.result"
                  :key="bindex"
                  @click="toBrand(bitem,bindex)"
                >
                  <img :src="bitem.brand_pic" alt width="45px" height="45px" />
                  <span class="bname">{{bitem.brand_name}}</span>
                </div>
                <div class="readMore" v-if="litem.result_num > 2">
                  <span @click="watchMore(litem,lindex)">
                    查看更多
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </div>
              </div>
              <div class="summaryList" v-if="litem.search_type == 'goods'">
                <div class="head">
                  <span class="verticleLine"></span>
                  <span class="brandName">{{litem.column_name}}</span>
                </div>
                <div v-for="(gitem,gindex) in litem.result" :key="gindex">
                  <!-- 图书,专辑 -->
                  <div
                    class="content book"
                    @click="gotoDetail(gitem)"
                    v-if="gitem.goods_type == 3 || gitem.goods_type == 9"
                  >
                    <div class="ratiobook">
                      <div class="bookimg" v-lazy:background-image="gitem.pic[0]"></div>
                    </div>
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <div class="pinpai">{{gitem.sub_title}}</div>
                      <div class="nice">
                        <span class="good" v-if="gitem.goods_type == 6">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-good-line" />
                          </svg>
                          <span>{{gitem.praise_num}}</span>
                        </span>
                        <span class="price" v-if="gitem.goods_type == 3">
                          <span>￥{{ gitem.price }}</span>
                        </span>
                        <span class="comment" v-if="gitem.goods_type == 9">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-album-line" />
                          </svg>
                          <span>共{{ gitem.item_count }}集</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 文章 -->
                  <div class="content" @click="gotoDetail(gitem)" v-if="gitem.goods_type == 6">
                    <div class="ratiobox">
                      <div class="bookImg" v-lazy:background-image="gitem.pic[0]"></div>
                    </div>
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <div class="pinpai">{{gitem.sub_title}}</div>
                      <div class="nice">
                        <span class="good" v-if="gitem.goods_type == 6">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-good-line" />
                          </svg>
                          <span>{{gitem.praise_num}}</span>
                        </span>
                        <span class="comment">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-comment-line" />
                          </svg>
                          <span>{{ gitem.comment_num }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 音视频 -->
                  <div
                    class="content audio"
                    @click="gotoDetail(gitem)"
                    v-if="gitem.goods_type == 1 || gitem.goods_type == 2"
                  >
                    <div class="ratiobox">
                      <div class="bookImg" v-lazy:background-image="gitem.pic[0]"></div>
                    </div>
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <div class="pinpai">{{gitem.sub_title}}</div>
                      <div class="nice">
                        <span class="good">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-time-line" />
                          </svg>
                          <span>{{gitem.duration}}</span>
                        </span>
                        <span class="price">
                          <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                          </svg>-->
                          <span v-if="gitem.price">￥{{ gitem.price }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- 电子书 -->
                  <div
                    class="content ebook"
                    @click="gotoDetail(gitem)"
                    v-if="gitem.goods_type == 4"
                  >
                    <div class="ratiobox">
                      <div class="bookImg" v-lazy:background-image="gitem.pic[0]"></div>
                    </div>
                    <div class="right">
                      <div class="text">{{gitem.title}}</div>
                      <!-- <div class="pinpai">{{item.sub_title}}</div> -->
                      <div class="nice">
                        <span class="good">
                          <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-time-line" />
                          </svg>-->
                          <span>{{gitem.book_author}}</span>
                        </span>
                        <span class="price">
                          <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                          </svg>-->
                          <span v-if="gitem.price">￥{{ gitem.price }}</span>
                          <span v-else>免费</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="readMore" v-if="litem.result_num > 2">
                  <span @click="watchMore(litem,lindex)">
                    查看更多
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-next-line" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <!-- 火把号 -->
          <template
            v-if="items.goods_type == 0 && items.search_type && items.search_type == 'brand' && activekey == index"
          >
            <div class="summaryList huoba" v-if="huobaList.length>0">
              <div
                class="brandContent"
                v-for="(hbitem,hbindex) in huobaList"
                :key="hbindex"
                @click="toBrand(hbitem,hbindex)"
              >
                <img :src="hbitem.brand_pic" alt width="45px" height="45px" />
                <span class="bname">{{hbitem.brand_name}}</span>
              </div>
            </div>
          </template>
          <template
            v-if="items.goods_type > 0 && items.search_type && items.search_type == 'goods' && activekey == index"
          >
            <div v-for="(item,index) in brandData" :key="index">
              <!-- 图书,专辑 -->
              <div
                class="content book"
                @click="gotoDetail(item)"
                v-if="item.goods_type == 3 || item.goods_type == 9"
              >
                <div class="ratiobook">
                  <div class="bookimg" v-lazy:background-image="item.pic[0]"></div>
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
                    <span class="price" v-if="item.goods_type == 3">
                      <span>￥{{ item.price }}</span>
                    </span>
                    <span class="comment" v-if="item.goods_type == 9">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-album-line" />
                      </svg>
                      <span>共{{ item.item_count }}集</span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 文章 -->
              <div class="content" @click="gotoDetail(item)" v-if="item.goods_type == 6">
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
              <!-- 音视频 -->
              <div
                class="content audio"
                @click="gotoDetail(item)"
                v-if="item.goods_type == 1 || item.goods_type == 2"
              >
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">{{item.sub_title}}</div>
                  <div class="nice">
                    <span class="good">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-time-line" />
                      </svg>
                      <span>{{item.duration}}</span>
                    </span>
                    <span class="price">
                      <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                      </svg>-->
                      <span v-if="item.price">￥{{ item.price }}</span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- 电子书 -->
              <div class="content ebook" @click="gotoDetail(item)" v-if="item.goods_type == 4">
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <!-- <div class="pinpai">{{item.sub_title}}</div> -->
                  <div class="nice">
                    <span class="good">
                      <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-time-line" />
                      </svg>-->
                      <span>{{item.book_author}}</span>
                    </span>
                    <span class="price">
                      <!-- <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-comment-line" />
                      </svg>-->
                      <span v-if="item.price">￥{{ item.price }}</span>
                      <span v-else>免费</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </van-tab>
      </van-tabs>
      <!-- </div> -->
    </van-list>
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/brand/result.scss" scoped lang="scss"></style>

<script>
import {
  BRAND_SEARCH_GOODS_GETS,
  SEARCH_GOODS_SUMMARY,
  SEARCH_BRAND_GETS
} from "../../apis/brand.js";
import resultVue from "../personal/order/result.vue";
export default {
  data() {
    return {
      state: "brand",
      brandData: [],
      bookData: [],
      column_list: [{ search_type: null }],
      programLoading: false,
      programFinished: false,
      // 搜索结果参数
      goods_type: null,
      searchContent: "",
      activekey: 0,
      page: 1,
      title: null,
      page_size: 10,
      contentData: [],
      supplier_id: null,
      tagids: null,
      cids: null,
      isbrand_id: null,
      summaryList: [],
      huobapage: 1,
      huobaList: [],
      judgehome_id: null
    };
  },
  mounted() {
    this.isbrand_id = this.$route.query.isbrand_id
      ? this.$route.query.isbrand_id
      : null;
    if(this.$route.query.searchContent){
      this.searchContent = this.$route.query.searchContent;
    }else if(sessionStorage.getItem('saveSearchContent')){
      this.searchContent = sessionStorage.getItem('saveSearchContent')
    }
    this.goods_type = this.$route.query.goods_type;
    this.supplier_id = this.$route.query.supplier_id
      ? parseInt(this.$route.query.supplier_id)
      : 0;
    this.tagids = this.$route.query.tagids ? this.$route.query.tagids : null;
    this.cids = this.$route.query.cids ? this.$route.query.cids : null;

    // title
    this.title = this.$route.query.searchContent
      ? this.$route.query.searchContent
      : "";
    if (this.title != "") this.title = "-" + this.title;
    document.title = "搜索结果" + this.title;
    this.judgehome_id = localStorage.getItem("home_id");
    // this.getGoodsColum();
    // this.getGoods();
    this.getSummaryGoods();
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  },
  methods: {
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
      } else if (goodsType == 4) {
        // 电子书
        this.$router.push({
          name: "ebookdetail",
          query: { goods_id: item.goods_id }
        });
      }
    },
    programLoad() {
      var list_index = this.activekey;
      // console.log(666,this.column_list)
      if (this.column_list[list_index].search_type == "brand") {
        this.huobaBrand();
      } else if (this.column_list[list_index].search_type == "goods") {
        this.getGoods();
      } else if (this.column_list[list_index].search_type == "summary") {
        this.programFinished = true;
        this.programLoading = false;
      } else {
        this.getGoods();
      }
    },
    async getGoods() {
      var tStamp = this.$getTimeStamp();
      var data = {};
      if (this.judgehome_id == "all") {
        data = {
          scene: "platform",
          keywords: this.searchContent,
          goods_type: this.goods_type,
          // brand_id: this.isbrand_id == "no" ? 0 : this.$route.query.brand_id,
          // supplier_id: this.supplier_id,
          tagids: this.tagids,
          cids: this.cids,
          page: this.page,
          page_size: this.page_size,
          version: "1.0",
          timestamp: tStamp
        };
      } else {
        data = {
          keywords: this.searchContent,
          goods_type: this.goods_type,
          brand_id: this.isbrand_id == "no" ? 0 : this.$route.query.brand_id,
          // supplier_id: this.supplier_id?this.supplier_id:0,
          tagids: this.tagids,
          cids: this.cids,
          page: this.page,
          page_size: this.page_size,
          version: "1.0",
          timestamp: tStamp
        };
        if (this.supplier_id) {
          data.supplier_id = this.supplier_id;
        }
        if (this.$route.query.type == "brand") {
          data.scene = "brand";
        } else if (this.$route.query.type == "mall") {
          data.scene = "mall";
        } else {
          data.scene = "platform";
        }
      }
      data.sign = this.$getSign(data);
      let res = await BRAND_SEARCH_GOODS_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        // this.column_list = res.response_data.column;

        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.brandData.push(result[i]);
            this.contentData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;
          // console.log('thispage',this.page)
          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 1);

      } else {
        this.$toast(res.error_message);
      }
    },
    // 综合列表
    async getSummaryGoods() {
      var tStamp = this.$getTimeStamp();
      var data = {};
      if (this.judgehome_id == "all") {
        data = {
          scene: "platform",
          keywords: this.searchContent,
          // brand_id: this.isbrand_id == "no" ? 0 : this.$route.query.brand_id,
          // supplier_id: this.supplier_id,
          cids: this.cids,
          version: "1.0",
          timestamp: tStamp
        };
      } else {
        data = {
          keywords: this.searchContent,
          brand_id: this.isbrand_id == "no" ? 0 : this.$route.query.brand_id,
          // supplier_id: this.supplier_id?this.supplier_id:0,
          cids: this.cids,
          version: "1.0",
          timestamp: tStamp
        };
        if (this.supplier_id) {
          data.supplier_id = this.supplier_id;
        }
        if (this.$route.query.type == "brand") {
          data.scene = "brand";
        } else if (this.$route.query.type == "mall") {
          data.scene = "mall";
        } else {
          data.scene = "platform";
        }
      }

      data.sign = this.$getSign(data);
      let res = await SEARCH_GOODS_SUMMARY(data);

      if (res.hasOwnProperty("response_code")) {
        this.column_list = res.response_data.column;
        // console.log(111,this.column_list)
        if (this.goods_type > 0) {
          for (let i = 0; i < this.column_list.length; i++) {
            if (this.column_list[i].goods_type == this.goods_type) {
              this.activekey = i;
            }
          }
        }
        this.summaryList = res.response_data.list;
        this.programFinished = true;
        this.programLoading = false;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 火把公号列表
    async huobaBrand() {
      var tStamp = this.$getTimeStamp();
      var data = {
        keywords: this.searchContent,
        page: this.page,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await SEARCH_BRAND_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.huobaList.push(result[i]);
          }
          this.programLoading = false;
          this.page++;
          // console.log('thispage',this.page)
          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 1);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 跳转搜索页
    inputText() {
      this.$router.push({
        name: "search",
        query: {
          type: this.$route.query.type,
          brand_id: this.$route.query.brand_id,
          supplier_id: this.$route.query.supplier_id
        }
      });
    },
    // 跳转公众号首页
    toBrand(item, index) {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: item.brand_id
        }
      });
    },
    // 查看更多
    watchMore(item, index) {
      console.log(item);
      var _index = this.getArrayIndex(this.column_list, item);
      this.activekey = _index;
      this.goods_type = this.column_list[_index].goods_type;
      this.brandData = [];
      this.huobaList = [];
      this.page = 1;
      this.programLoading = true; //下拉加载中
      this.programFinished = false; //下拉结束
      if (this.programLoading) {
        this.programLoad();
      }
    },
    getArrayIndex(arr, obj) {
      for (var i = 0; i < this.column_list.length; i++) {
        if (obj.search_type == "goods") {
          if (this.column_list[i].goods_type == obj.goods_type) {
            return i;
          }
        } else {
          if (this.column_list[i].search_type == obj.search_type) {
            return i;
          }
        }
      }
    },
    // 点击tab页切换
    tabChange(index, title) {
      this.activekey = index;
      this.goods_type = Number(this.column_list[index].goods_type);
      // if (index > 0) {
      this.brandData = [];
      this.huobaList = [];
      this.page = 1;
      this.programLoading = true; //下拉加载中
      this.programFinished = false; //下拉结束
      if (this.programLoading) {
        this.programLoad();
      }
      // }
    }
  }
};
</script>

