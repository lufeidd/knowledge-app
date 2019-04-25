<template>
  <div id="mallPage">
    <div class="popular">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">热门推荐</span>
      </div>
      <div class="showContent">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="item,index in footInfo" :key="index">
            <div class="slide">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.imgUrl"></div>
              </div>
              <div class="content">
                <p class="title">{{item.title}}</p>
                <p class="message">{{item.message}}</p>
                <p class="money">¥ {{item.money.toFixed(2)}}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="materialObject" v-for="item,index in goodsInfo">
      <div class="materialTitle">
        <div class="text">
          <span class="verticleLine"></span>
          <span class="lh">{{item.title}}</span>
        </div>
        <span class="all">
          全部
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line"></use>
          </svg>
        </span>
      </div>
      <div class="goods">
            <div class="goodsInfo" v-for="value,index in item.info">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="value.imgUrl"></div>
              </div>
              <p class="name">{{value.name}}</p>
              <p class="message">{{value.message}}</p>
              <p class="money">¥ {{value.money.toFixed(2)}}</p>
            </div>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/brand/mall.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 1.2
      },
      footInfo:[{imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
      title:'这里是内容的标题，可能会很长有两行文字',
      message:'我是一条次要信息',
      money:23.00},
      {imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
      title:'这里是内容的标题，可能会很长有两行文字',
      message:'我是一条次要信息',
      money:23.00},
      {imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
      title:'这里是内容的标题，可能会很长有两行文字',
      message:'我是一条次要信息',
      money:23.00},
      {imgUrl:'https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85',
      title:'这里是内容的标题，可能会很长有两行文字',
      message:'我是一条次要信息',
      money:23.00},],
      goodsInfo:[{title:'实物商品',
      info:[{imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},
      {imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},
      {imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},
      {imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},],},
      {title:'专辑',
      info:[{imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},
      {imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},
      {imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},
      {imgUrl:'https://media2.v.bookuu.com/activity/14/27/20181113142721512.jpg@!q75',name:'我是一条商品名称，或许有两行',message:'我是一条次要信息',money:23.00},],},]
    }
  }
};
</script>
