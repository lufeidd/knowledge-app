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
            <div style="margin-top:15px;font-size:16px;margin-left:15px;">{{activity_name}}</div>
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
                  <div class="only" v-if="item.goods_type == 3 && item.goods_store <= 10">仅剩{{item.goods_store}}件</div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">
                    <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}
                    </van-button> -->
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 0">{{item.activity_list[0]}}</van-button>
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 1">{{item.activity_list[1]}}</van-button>
                  </div>
                  <div class="nice">
                    <span class="price" v-if="item.price">￥{{item.price}}</span>
                    <span class="price" v-else>免费</span>
                    <span class="cart">
                      <svg class="icon" aria-hidden="true" v-if="item.goods_type == 3" @click.stop="addCart(item,index)">
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
            <div style="margin-top:15px;font-size:16px;margin-left:15px;">{{activity_name}}</div>
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
                  <div class="only" v-if="item.goods_type == 3 && item.goods_store <= 10">仅剩{{item.goods_store}}件</div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">
                    <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}</van-button> -->
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 0">{{item.activity_list[0]}}</van-button>
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 1">{{item.activity_list[1]}}</van-button>
                  </div>
                  <div class="nice">
                    <span class="price" v-if="item.price">￥{{item.price}}</span>
                    <span class="price" v-else>免费</span>
                    <span class="cart">
                      <svg class="icon" aria-hidden="true" v-if="item.goods_type == 3" @click.stop="addCart(item,index)">
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
            <div style="margin-top:15px;font-size:16px;margin-left:15px;">{{activity_name}}</div>
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
                  <div class="only" v-if="item.goods_type == 3 && item.goods_store <= 10">仅剩{{item.goods_store}}件</div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">
                    <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}</van-button> -->
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 0">{{item.activity_list[0]}}</van-button>
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 1">{{item.activity_list[1]}}</van-button>
                  </div>
                  <div class="nice">
                    <span class="price" v-if="item.price">￥{{item.price}}</span>
                    <span class="price" v-else>免费</span>
                    <span class="cart">
                      <svg class="icon" aria-hidden="true" v-if="item.goods_type == 3" @click.stop="addCart(item,index)">
                        <use xlink:href="#icon-cart-line" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </van-list>
          </template>
        </van-tab>
        <van-tab>
          <div slot="title">
            价格
            <svg class="icon" v-if="activekey !== 3" aria-hidden="true">
              <use xlink:href="#icon-pricesort-block" />
            </svg>
            <svg class="icon" v-if="activekey == 3 && priceSort == 1" aria-hidden="true">
              <use xlink:href="#icon-priceup-block" />
            </svg>
            <svg class="icon" v-if="activekey == 3 && priceSort == 0" aria-hidden="true">
              <use xlink:href="#icon-pricedown-block" />
            </svg>
          </div>
          <template>
            <div style="margin-top:15px;font-size:16px;margin-left:15px;">{{activity_name}}</div>
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
                  <div class="only" v-if="item.goods_type == 3 && item.goods_store <= 10">仅剩{{item.goods_store}}件</div>
                </div>
                <div class="right">
                  <div class="text">{{item.title}}</div>
                  <div class="pinpai">
                    <!-- <van-button size="mini" round type="danger" v-for="(item1,index1) in item.activity_list" :key="index1">{{item1}}</van-button> -->
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 0">{{item.activity_list[0]}}</van-button>
                    <van-button size="mini" round type="danger" v-if="item.activity_list.length > 1">{{item.activity_list[1]}}</van-button>
                  </div>
                  <div class="nice">
                    <span class="price" v-if="item.price">￥{{item.price}}</span>
                    <span class="price" v-else>免费</span>
                    <span class="cart">
                      <svg class="icon" aria-hidden="true" v-if="item.goods_type == 3" @click.stop="addCart(item,index)">
                        <use xlink:href="#icon-cart-line" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </van-list>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <EazyNav type="coupon" ref="nav"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/coupon/result.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
#couponResultPage {
  .van-list {
    padding: 0 15px;
  }
  .van-button--danger {
    font-size: $fontSize - 4;
    background-color: transparent;
    border-color: $redLight;
    color: $redLight;
    padding: 0 3px;
  }
}
</style>
<script>
import { TICKET_DETAIL_GETS } from "../../apis/coupon.js";
import { CART_ADD } from "../../apis/shopping.js";
export default {
  data() {
    return {
      page: 1,
      programLoading: false,
      programFinished: false,
      activekey: 0,
      searchContent: "",
      ticket_id: "",
      priceSort: 0,
      couponList: [],
      coupon_sort: "default",
      activity_name: null,
      isLogin: null
    };
  },
  mounted() {
    console.log(111, this.priceSort);
    this.ticket_id = this.$route.query.ticket_id;
    this.searchContent = this.$route.query.searchContent;
  },
  methods: {
    programLoad() {
      this.getList();
    },
    // 点击tab页切换
    tabChange(index) {
      this.activekey = index;
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
      }
      this.couponList = [];
      this.page = 1;
      this.programLoading = true;//下拉加载中
      this.programFinished = false;//下拉结束
      if(this.programLoading){
        this.programLoad();
      }

      console.log(222, this.priceSort,index);
    },
    inputText() {
      this.$router.push({
        name:"search",
        query:{
          type:"coupon",
          ticket_id:this.$route.query.ticket_id,
        }
      })
    },
    addCart(item, index) {
      // console.log(222);
      this.toCartData(item.goods_id,item.price);
    },
    async getList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page,
        ticket_id: this.ticket_id,
        sort: this.coupon_sort,
        keywords: this.searchContent,
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
        }, 1);

      } else {
        this.$toast(res.error_message);
      }
    },
    // 加入购物车
    async toCartData(goods_id,price) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: goods_id,
        sku_id: goods_id,
        count: 1,
        price:price,
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.success == 1) {
          this.$toast("添加购物车成功~");
          this.shoppingcart_num++;
          this.$refs.nav.navData.goods_nums ++;
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
    }
  }
};
</script>
