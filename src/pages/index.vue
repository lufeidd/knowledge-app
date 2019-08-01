<template>
  <div id="indexPage">
    <div class="searhResult">
      <svg class="icon searchIcon" aria-hidden="true">
        <use xlink:href="#icon-search-line" />
      </svg>
      <input type="text" v-model="searchContent" @focus="inputText" placeholder="搜索栏目里的内容" />
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
    </div>

    <EazyNav type="index"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/index.scss" scoped lang="scss"></style>

<script>
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
        // autoplay:true,
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  mounted() {},
  methods: {
    inputText() {
      this.$router.push({
        name: "search",
        query: { type: this.type }
      });
    }
  }
};
</script>

