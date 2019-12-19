<template>
  <div id="indexPage">
    <div>
      <div class="searhResult">
        <svg class="icon searchIcon" aria-hidden="true">
          <use xlink:href="#icon-search-line" />
        </svg>
        <input type="text" @focus="inputText" placeholder="搜索栏目里的内容" />
      </div>
      <div class="sliderImage" v-if="slideData.length > 0">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide
            v-for="(litem,lindex) in slideData"
            :key="lindex"
            @click="goodsDetail(item)"
          >
            <div class="slide">
              <div class="ratiobox">
                <!-- <div class="bookImg" v-lazy:background-image="litem.pic[0]"></div> -->
                <div class="bookImg" :style="{'background-image':'url('+litem.pic[0]+')'}"></div>
              </div>
              <div class="title">{{litem.title}}</div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>

      <div class="list">
        <!-- 音频 -->
        <van-list
          v-model="programLoading"
          :finished="programFinished"
          finished-text="没有更多了"
          @load="programLoad"
        >
          <div v-for="(item,index) in listData" :key="index">
            <!-- 音频 -->
            <div class="content" v-if="item.goods_type == 1" @click="goodsDetail(item)">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
                <span class="radio">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-video-block" />
                  </svg>
                </span>
              </div>
              <div class="right">
                <div class="text">{{item.title}}</div>
                <!-- <div class="pinpai">我飞洒</div> -->
                <div class="nice">
                  <span>
                    <span class="time" v-if="item.duration">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-time-line" />
                      </svg>
                      <span>{{item.duration}}</span>
                    </span>
                  </span>
                  <span class="price" v-if="item.price">￥{{item.price}}</span>
                </div>
              </div>
            </div>
            <!-- 视频 -->
            <div class="content" v-if="item.goods_type == 2" @click="goodsDetail(item)">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
                <span class="radio">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-video-play" />
                  </svg>
                </span>
              </div>
              <div class="right">
                <div class="text">{{item.title}}</div>
                <!-- <div class="pinpai">我飞洒</div> -->
                <div class="nice">
                  <span>
                    <span class="time" v-if="item.duration">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-time-line" />
                      </svg>
                      <span>{{item.duration}}</span>
                    </span>
                  </span>
                  <span class="price" v-if="item.price">￥{{item.price}}</span>
                </div>
              </div>
            </div>
            <!-- 专辑,图书 -->
            <div
              class="content book"
              v-if="item.goods_type == 9 || item.goods_type == 3"
              @click="goodsDetail(item)"
            >
              <div class="ratiobook">
                <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
              </div>
              <div class="right">
                <div class="text">
                  {{item.title}}
                  <div class="pinpai">{{item.sub_title}}</div>
                </div>
                <div class="nice">
                  <span>
                    <span class="time" v-if="item.goods_type == 9">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-album-line" />
                      </svg>
                      <span>共{{item.item_count}}集</span>
                    </span>
                  </span>
                  <span class="price" v-if="item.price">￥{{item.price}}</span>
                </div>
              </div>
            </div>
            <!-- 电子书 -->
            <div
              class="content ebook"
              v-if="item.goods_type == 4"
              @click="goodsDetail(item)"
            >
              <div class="ratiobook">
                <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
              </div>
              <div class="right">
                <div class="text">
                  {{item.title}}
                </div>
                <div class="nice">
                  <span>
                    <span class="time">
                      <span>{{item.author}}</span>
                    </span>
                  </span>
                  <span class="price" v-if="item.price">￥{{item.price}}</span>
                </div>
              </div>
            </div>
            <!-- 文章 -->
            <div class="content" v-if="item.goods_type == 6" @click="goodsDetail(item)">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.pic[0]"></div>
              </div>
              <div class="right">
                <div class="text">{{item.title}}</div>
                <!-- <div class="pinpai">我飞洒</div> -->
                <div class="nice">
                  <span>
                    <!-- <span class="time" v-if="item.goods_type == 9">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-album-line" />
                    </svg>
                    <span>共{{item.item_count}}集</span>
                    </span>-->
                  </span>
                  <span class="price" v-if="item.price">￥{{item.price}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <CopyRight></CopyRight>
    <EazyNav type="index" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/index.scss" scoped lang="scss"></style>

<script>
import { BRAND_COLUMN_GETS } from "../apis/brand.js";
export default {
  data() {
    return {
      type: "index",
      swiperOption: {
        loop: true,
        autoplay: {
          disableOnInteraction: false, //手动滑动之后不打断播放
          delay: 2000
        },
        pagination: {
          el: ".swiper-pagination"
        }
      },
      slideData: [],
      listData: [],
      brand_id: null,
      packets_id: null,
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    this.brand_id = this.$route.query.brand_id;
    this.packets_id = this.$route.query.packets_id
      ? this.$route.query.packets_id
      : null;
  },
  methods: {
    inputText() {
      this.$router.push({
        name: "search",
        query: {
          type: this.type,
          brand_id: this.brand_id,
          packets_id: this.packets_id
        }
      });
    },
    programLoad() {
      this.getData();
    },
    // 获取数据
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        brand_id: this.brand_id,
        packets_id: this.packets_id,
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_COLUMN_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        this.slideData = res.response_data.topresult;
        document.title = res.response_data.title;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.listData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
      }
    },
    goodsDetail(item) {
      // console.log(item);return
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
      // 文章
      if (item.goods_type == 6) {
        this.$router.push({
          name: "article",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      //专辑
      if (item.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 实物商品
      if (item.goods_type == 3) {
        this.$router.push({
          name: "detail",
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
    }
  }
};
</script>

