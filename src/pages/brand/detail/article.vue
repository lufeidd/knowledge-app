<template>
  <div id="articlePage">
    <div class="article">
      <div class="title">{{title}}</div>
      <div class="from">
        <div class="articleInfo">
          <img v-lazy="articleInfo.icon"  class="icon">
          <div class="detail">
            <p>{{articleInfo.name}}</p>
            <p class="number">{{articleInfo.foucs}}人关注</p>
          </div>
        </div>
        <span class="foucsButton" v-if="foucs" @click="addfoucs">+关注</span>
        <span class="foucsButton cancel" v-else @click="cancelfoucs">已关注</span>
      </div>
      <div class="content"></div>
      <div class="message">
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-eye-line"></use>
          </svg>{{message.watch}}
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-good-line"></use>
          </svg>{{message.foucs}}
        </span>
        <span>{{message.time}}</span>
      </div>
    </div>
     <div class="showContent">
        <swiper class='swiperTags' :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="item,index in footInfo" :key="index">
            <div class="foot">
              <div class="ratiobox">
                <a class="bookImg" v-lazy:background-image="item.imgUrl"></a>
              </div>
              <div class="content">
                <p class="title">{{item.title}}</p>
                <p class="name">{{item.name}}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
  </div>
</template>

<style src="@/style/scss/pages/brand/detail/article.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {
      title:'这里是内容的标题，可能会很长有两行文字这里是内容的标题，可能会很长有两行文字',
      foucs:true,
      articleInfo:{name:'磨铁教育',foucs:23456,icon:'https://bnmpstyle.bookuu.com/wap/images/default_shop.png'},
      message:{watch:25641,foucs:25641,time:'01.29 15:51'},
      swiperOption: {
        slidesPerView: 1.1,
      },
      footInfo:[{imgUrl:'https://media2.v.bookuu.com/activity/09/31/20190325093115149.jpg@!q75',
      title:'这里是内容的标题，可能会很长有两行文字',
      name:'品牌名称'},
      {imgUrl:'https://media2.v.bookuu.com/activity/09/31/20190325093115149.jpg@!q75',
      title:'这里是内容的标题，可能会很长有两行文字',
      name:'品牌名称'}],
    }
  },
  methods:{
    addfoucs(){
      this.foucs=false;
    },
    cancelfoucs(){
      this.foucs=true;
    }
  }
}
</script>
