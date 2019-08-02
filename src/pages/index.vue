<template>
  <div id="indexPage">
    <div class="searhResult">
      <svg class="icon searchIcon" aria-hidden="true">
        <use xlink:href="#icon-search-line" />
      </svg>
      <input type="text" @focus="inputText" placeholder="搜索栏目里的内容" />
    </div>
    <div class="sliderImage">
      <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(litem,lindex) in sliderData" :key="lindex">
          <div class="slide">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="litem"></div>
            </div>
            <div class="title">比深度思考更重要的是专注力！</div>
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
        <div>
          <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="pic"></div>
              <span class="radio">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-video-block" />
                </svg>
              </span>
            </div>
            <div class="right">
              <div class="text">asdfasdf</div>
              <div class="pinpai">我飞洒</div>
              <div class="nice">
                <span class="time">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-time-line" />
                  </svg>
                  <span>2262</span>
                </span>
                <span class="price">￥666</span>
              </div>
            </div>
          </div>
          <!-- 视频 -->
          <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="pic"></div>
              <span class="radio">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-video-play" />
                </svg>
              </span>
            </div>
            <div class="right">
              <div class="text">asdfasdf</div>
              <div class="pinpai">我飞洒</div>
              <div class="nice">
                <span class="time">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-time-line" />
                  </svg>
                  <span>2262</span>
                </span>
                <span class="price">￥666</span>
              </div>
            </div>
          </div>
          <!-- 专辑,图书 -->
          <div class="content book">
            <div class="ratiobook">
              <div class="bookImg" v-lazy:background-image="pic"></div>
            </div>
            <div class="right">
              <div class="text">asdfasdf</div>
              <div class="pinpai">我飞洒</div>
              <div class="nice">
                <span class="time">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-album-line" />
                  </svg>
                  <span>共55集</span>
                </span>
                <span class="price">￥666</span>
              </div>
            </div>
          </div>
          <!-- 文章 -->
          <div class="content">
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="pic"></div>
            </div>
            <div class="right">
              <div class="text">asdfasdf</div>
              <div class="pinpai">我飞洒</div>
              <div class="nice">
                <span class="time">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-time-line" />
                  </svg>
                  <span>2262</span>
                </span>
                <span class="price">￥666</span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <EazyNav type="index"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/index.scss" scoped lang="scss"></style>

<script>
import { BRAND_COLUMN_GETS } from "../apis/brand.js";
export default {
  data() {
    return {
      sliderData: [
        "https://media2.v.bookuu.com/activity/14/39/20190730143958346.jpg@!q75",
        "https://media2.v.bookuu.com/activity/13/55/20190726135546167.jpg@!q75"
      ],
      pic: "https://wdimg3.bookuu.com/goods/11/45/32/1562730332.jpg@!w210q85",
      type: "index",
      swiperOption: {
        autoplay: true,
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
  },
  methods: {
    inputText() {
      this.$router.push({
        name: "search",
        query: { type: this.type }
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
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {}
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
    }
  }
};
</script>

