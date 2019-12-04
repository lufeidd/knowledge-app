<template>
  <div id="couponResultPage">
    <div>
      <div class="searhResult">
        <svg class="icon searchIcon" aria-hidden="true">
          <use xlink:href="#icon-search-line" />
        </svg>
        <input type="text" v-model="searchContent" placeholder="在结果中搜索" @focus="inputText" />
        <!-- <span class="cancel" @click="inputText">取消</span> -->
      </div>
      <van-tabs
        sticky
        animated
        color="#666"
        title-active-color="#f05654"
        @click="tabChange"
        v-model="activekey"
      >
        <van-tab title="综合">
          <template>
            <div class="activityName">{{activity_name}}</div>
            <van-list
              v-model="programLoading1"
              :finished="programFinished1"
              finished-text="已经到底了~"
              @load="programLoad1"
            >
              <div
                class="content"
                v-for="(item,index) in couponList1"
                :key="index"
                @click="toDetail(item,index)"
              >
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="item.pic"></div>
                  <div
                    class="only"
                    v-if="item.goods_type == 3 && item.goods_store <= 10"
                  >仅剩{{item.goods_store}}件</div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">
                    <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}
                    </van-button>-->
                    <van-button
                      size="mini"
                      round
                      type="danger"
                      v-if="item.activity_list.length > 0"
                    >{{item.activity_list[0]}}</van-button>
                    <van-button
                      size="mini"
                      round
                      type="danger"
                      v-if="item.activity_list.length > 1"
                    >{{item.activity_list[1]}}</van-button>
                  </div>
                  <div class="nice">
                    <span class="price" v-if="item.price">￥{{item.price}}</span>
                    <span class="price" v-else>免费</span>
                    <span class="cart">
                      <svg
                        class="icon"
                        aria-hidden="true"
                        v-if="item.goods_type == 3"
                        @click.stop="addCart(item,index)"
                      >
                        <use xlink:href="#icon-cart-line" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </van-list>
          </template>
        </van-tab>
        <van-tab title="新品">
          <template>
            <div class="activityName">{{activity_name}}</div>
            <van-list
              v-model="programLoading2"
              :finished="programFinished2"
              finished-text="已经到底了~"
              @load="programLoad2"
            >
              <div
                class="content"
                v-for="(item,index) in couponList2"
                :key="index"
                @click="toDetail(item,index)"
              >
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="item.pic"></div>
                  <div
                    class="only"
                    v-if="item.goods_type == 3 && item.goods_store <= 10"
                  >仅剩{{item.goods_store}}件</div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">
                    <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}</van-button> -->
                    <van-button
                      size="mini"
                      round
                      type="danger"
                      v-if="item.activity_list.length > 0"
                    >{{item.activity_list[0]}}</van-button>
                    <van-button
                      size="mini"
                      round
                      type="danger"
                      v-if="item.activity_list.length > 1"
                    >{{item.activity_list[1]}}</van-button>
                  </div>
                  <div class="nice">
                    <span class="price" v-if="item.price">￥{{item.price}}</span>
                    <span class="price" v-else>免费</span>
                    <span class="cart">
                      <svg
                        class="icon"
                        aria-hidden="true"
                        v-if="item.goods_type == 3"
                        @click.stop="addCart(item,index)"
                      >
                        <use xlink:href="#icon-cart-line" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </van-list>
          </template>
        </van-tab>
        <van-tab title="销量">
          <template>
            <div class="activityName">{{activity_name}}</div>
            <van-list
              v-model="programLoading3"
              :finished="programFinished3"
              finished-text="已经到底了~"
              @load="programLoad3"
            >
              <div
                class="content"
                v-for="(item,index) in couponList3"
                :key="index"
                @click="toDetail(item,index)"
              >
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="item.pic"></div>
                  <div
                    class="only"
                    v-if="item.goods_type == 3 && item.goods_store <= 10"
                  >仅剩{{item.goods_store}}件</div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">
                    <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}</van-button> -->
                    <van-button
                      size="mini"
                      round
                      type="danger"
                      v-if="item.activity_list.length > 0"
                    >{{item.activity_list[0]}}</van-button>
                    <van-button
                      size="mini"
                      round
                      type="danger"
                      v-if="item.activity_list.length > 1"
                    >{{item.activity_list[1]}}</van-button>
                  </div>
                  <div class="nice">
                    <span class="price" v-if="item.price">￥{{item.price}}</span>
                    <span class="price" v-else>免费</span>
                    <span class="cart">
                      <svg
                        class="icon"
                        aria-hidden="true"
                        v-if="item.goods_type == 3"
                        @click.stop="addCart(item,index)"
                      >
                        <use xlink:href="#icon-cart-line" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </van-list>
          </template>
        </van-tab>
        <van-tab title="价格">
          <template>
            <div class="activityName">{{activity_name}}</div>
            <div v-if="priceSort == 0">
              <van-list
                v-model="programLoading"
                :finished="programFinished"
                finished-text="已经到底了~"
                @load="programLoad"
              >
                <div
                  class="content"
                  v-for="(item,index) in couponList"
                  :key="index"
                  @click="toDetail(item,index)"
                >
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic"></div>
                    <div
                      class="only"
                      v-if="item.goods_type == 3 && item.goods_store <= 10"
                    >仅剩{{item.goods_store}}件</div>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">
                      <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}</van-button> -->
                      <van-button
                        size="mini"
                        round
                        type="danger"
                        v-if="item.activity_list.length > 0"
                      >{{item.activity_list[0]}}</van-button>
                      <van-button
                        size="mini"
                        round
                        type="danger"
                        v-if="item.activity_list.length > 1"
                      >{{item.activity_list[1]}}</van-button>
                    </div>
                    <div class="nice">
                      <span class="price" v-if="item.price">￥{{item.price}}</span>
                      <span class="price" v-else>免费</span>
                      <span class="cart">
                        <svg
                          class="icon"
                          aria-hidden="true"
                          v-if="item.goods_type == 3"
                          @click.stop="addCart(item,index)"
                        >
                          <use xlink:href="#icon-cart-line" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </van-list>
            </div>
            <div v-if="priceSort == 1">
              <van-list
                v-model="programLoading4"
                :finished="programFinished4"
                finished-text="已经到底了~"
                @load="programLoad4"
              >
                <div
                  class="content"
                  v-for="(item,index) in couponList4"
                  :key="index"
                  @click="toDetail(item,index)"
                >
                  <div class="ratiobox">
                    <div class="bookImg" v-lazy:background-image="item.pic"></div>
                    <div
                      class="only"
                      v-if="item.goods_type == 3 && item.goods_store <= 10"
                    >仅剩{{item.goods_store}}件</div>
                  </div>
                  <div class="right">
                    <div class="text">{{item.title}}</div>
                    <div class="pinpai">
                      <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}</van-button> -->
                      <van-button
                        size="mini"
                        round
                        type="danger"
                        v-if="item.activity_list.length > 0"
                      >{{item.activity_list[0]}}</van-button>
                      <van-button
                        size="mini"
                        round
                        type="danger"
                        v-if="item.activity_list.length > 1"
                      >{{item.activity_list[1]}}</van-button>
                    </div>
                    <div class="nice">
                      <span class="price" v-if="item.price">￥{{item.price}}</span>
                      <span class="price" v-else>免费</span>
                      <span class="cart">
                        <svg
                          class="icon"
                          aria-hidden="true"
                          v-if="item.goods_type == 3"
                          @click.stop="addCart(item,index)"
                        >
                          <use xlink:href="#icon-cart-line" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </van-list>
            </div>
          </template>
        </van-tab>
      </van-tabs>
      <!-- 底部 -->
      <div v-if="this.isIphx" style="height: 34px;"></div>
      <van-submit-bar
        :class="{iphx:this.isIphx}"
        safe-area-inset-bottom
        button-text="去购物车"
        @submit="onSubmit"
      >
        <template>
          <div class="multi_bottom">
            <div>
              合计：
              <span class="price" v-if="multi_money">￥{{multi_money}}</span>
              <span class="price" v-else>￥0.00</span>
            </div>
            <div class="desc">{{multi_desc}}</div>
          </div>
        </template>
      </van-submit-bar>
    </div>
    <EazyNav type="coupon" ref="nav"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/coupon/result.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
#couponResultPage {
  .van-list {
    padding: 0 15px;
    padding-bottom: 50px;
  }
  .van-list .van-button--danger {
    font-size: $fontSize - 4;
    background-color: transparent;
    border-color: $redLight;
    color: $redLight;
    padding: 0 3px;
  }
  .activityName {
    padding: 5px 15px;
    font-size: $fontSize - 1;
    background-color: #f5f5f5;
  }
  .multi_bottom {
    font-size: $fontSize + 1;
    padding: 0 15px;
    .price {
      font-size: $fontSize - 1;
      color: $redLight;
    }
    .desc {
      font-size: $fontSize - 2;
    }
  }
}
</style>
<script>
import { TICKET_DETAIL_GETS, SHOPPING_CART_INFO } from "../apis/coupon.js";
import { CART_ADD } from "../apis/shopping.js";
export default {
  data() {
    return {
      page: 1,
      programLoading: false,
      programFinished: false,
      page1: 1,
      programLoading1: false,
      programFinished1: false,
      page2: 1,
      programLoading2: false,
      programFinished2: false,
      page3: 1,
      programLoading3: false,
      programFinished3: false,
      page4: 1,
      programLoading4: false,
      programFinished4: false,
      activekey: 0,
      searchContent: "",
      multi_id: "",
      priceSort: 0,
      couponList: [],
      couponList1: [],
      couponList2: [],
      couponList3: [],
      couponList4: [],
      coupon_sort: "default",
      activity_name: null,
      isLogin: null,
      multi_money: null,
      multi_desc: null
    };
  },
  mounted() {
    console.log(111, this.priceSort);
    this.multi_id = this.$route.query.multi_id;
    this.searchContent = this.$route.query.searchContent;
    this.getBottomInfo();
  },
  updated() {
    $(".van-tabs .van-tabs__nav")
      .children(".van-tab")
      .eq(3)
      .children()
      .html(
        '<div>价格<svg class="icon" aria-hidden="true"><use xlink:href="#icon-pricesort-block" /></svg><svg class="icon asc" style="display:none;" aria-hidden="true"><use xlink:href="#icon-priceup-block" /></svg><svg class="icon desc" style="display:none;" aria-hidden="true"><use xlink:href="#icon-pricedown-block" /></svg></div>'
      );
  },
  methods: {
    programLoad() {
      this.getList();
    },
    programLoad1() {
      this.getList1();
    },
    programLoad2() {
      this.getList2();
    },
    programLoad3() {
      this.getList3();
    },
    programLoad4() {
      this.getList4();
    },
    // 点击tab页切换
    tabChange(index) {
      this.activekey = index;
      // this.couponList = [];
      // this.page = 1;
      if (index == 0) {
        this.coupon_sort = "default";
      } else if (index == 1) {
        this.coupon_sort = "ctime_desc";
      } else if (index == 2) {
        this.coupon_sort = "buynum_desc";
      } else if (index == 3) {
        if (this.priceSort == 1) {
          this.priceSort = 0;
          this.coupon_sort = "price_desc";
        } else {
          this.priceSort = 1;
          this.coupon_sort = "price_asc";
        }
        // this.couponList = [];
        // this.page = 1;
        // setTimeout(()=>{
        //   this.programLoading = true; //下拉加载中
        //   this.programFinished = false; //下拉结束
        //   if (this.programLoading) {
        //     this.programLoad();
        //   }
        // },1)
      }

      // console.log(222, this.priceSort, this.activekey);
    },
    inputText() {
      this.$router.push({
        name: "search",
        query: {
          type: "multi",
          multi_id: this.$route.query.multi_id
        }
      });
    },
    addCart(item, index) {
      // console.log(222);
      this.toCartData(item.goods_id, item.price);
    },
    async getBottomInfo() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.1",
        multi_id: this.multi_id
      };
      data.sign = this.$getSign(data);
      let res = await SHOPPING_CART_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.multi_money = res.response_data.block_money;
        this.multi_desc = res.response_data.block_desc;
      } else {
        this.$toast(res.error_message);
      }
    },
    async getList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page,
        multi_id: this.multi_id,
        sort: this.coupon_sort,
        keywords: this.searchContent
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_DETAIL_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.activity_name = res.response_data.activity_name;
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.couponList.push(result[i]);
          }
          // 加载状态结束
          this.programLoading = false;
          this.page++;
          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
          // console.log(this.couponList)
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
        multi_id: this.multi_id,
        sort: this.coupon_sort,
        keywords: this.searchContent
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_DETAIL_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.activity_name = res.response_data.activity_name;
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.couponList1.push(result[i]);
          }
          // 加载状态结束
          this.programLoading1 = false;
          this.page1++;
          // 数据全部加载完成
          if (this.page1 > res.response_data.total_page) {
            this.programFinished1 = true;
            this.page1 = 1;
          }
          // console.log(this.couponList)
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    async getList2() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page2,
        multi_id: this.multi_id,
        sort: this.coupon_sort,
        keywords: this.searchContent
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_DETAIL_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.activity_name = res.response_data.activity_name;
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.couponList2.push(result[i]);
          }
          // 加载状态结束
          this.programLoading2 = false;
          this.page2++;
          // 数据全部加载完成
          if (this.page2 > res.response_data.total_page) {
            this.programFinished2 = true;
            this.page2 = 1;
          }
          // console.log(this.couponList)
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    async getList3() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page3,
        multi_id: this.multi_id,
        sort: this.coupon_sort,
        keywords: this.searchContent
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_DETAIL_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.activity_name = res.response_data.activity_name;
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.couponList3.push(result[i]);
          }
          // 加载状态结束
          this.programLoading3 = false;
          this.page3++;
          // 数据全部加载完成
          if (this.page3 > res.response_data.total_page) {
            this.programFinished3 = true;
            this.page3 = 1;
          }
          // console.log(this.couponList)
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    async getList4() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page4,
        multi_id: this.multi_id,
        sort: this.coupon_sort,
        keywords: this.searchContent
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_DETAIL_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.activity_name = res.response_data.activity_name;
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.couponList4.push(result[i]);
          }
          // 加载状态结束
          this.programLoading4 = false;
          this.page4++;
          // 数据全部加载完成
          if (this.page4 > res.response_data.total_page) {
            this.programFinished4 = true;
            this.page4 = 1;
          }
          // console.log(this.couponList)
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 加入购物车
    async toCartData(goods_id, price) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: goods_id,
        sku_id: goods_id,
        count: 1,
        price: price,
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.success == 1) {
          this.$toast("添加购物车成功~");
          this.shoppingcart_num++;
          this.getBottomInfo();
          this.$refs.nav.navData.goods_nums++;
        }
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          this.$router.push({ name: "login" });
        }
        this.$toast(res.error_message);
      }
    },
    toDetail(item, index) {
      // console.log(3333)
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
      // 纸质书
      if (item.goods_type == 3) {
        this.$router.push({
          name: "detail",
          query: { goods_id: item.goods_id }
        });
      }
    },
    onSubmit() {
      if (this.$refs.nav.is_Login) {
        this.$router.push({ name: "cart" });
      } else {
        this.$router.push({ name: "login" });
      }
    }
  }
};
</script>
