<template>
  <div id="bookPage">
    <!-- 头部书籍信息模块 -->
    <div class="bookInfo">
      <div class="info">
        <div class="ratiobox">
          <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
        </div>
        <div class="bookContent">
          <p class="title">{{bookInfo.title}}</p>
          <p class="author">{{bookInfo.author}}</p>
          <p class="message">
            <span v-if="!collect" @click="collection">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-collect-line"></use>
              </svg> 收藏
            </span>
            <span class="collect" v-else @click="cacellCollect">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-collect-block"></use>
              </svg> 收藏
            </span>
            <span class="xinxi">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-list-line"></use>
              </svg> 信息
            </span>
          </p>
        </div>
      </div>
      <swiper class="swiperTags" :options="swiperOption1" ref="mySwiper">
        <swiper-slide v-for="(item, index) in bookTag" data-index="index" :key="index" class="item">
          <van-tag text-color="#666" size="large" color="#f5f5f5">{{item}}</van-tag>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 出版媒体信息模块 -->
    <div class="publish">
      <div class="from">
        <img v-lazy="bookInfo.icon" class="icon">
        <div class="publishInfo">
          <p class="publishName">小红帽自媒体</p>
          <p class="foucsNumber">已有5万人关注</p>
        </div>
      </div>
      <span class="foucs add" v-if="foucs" @click="addFoucs">+关注</span>
      <span class="foucs" v-else @click="cancelFoucs">已关注</span>
    </div>
    <!-- 书籍简介模块 -->
    <div class="introduction">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">简介</span>
      </div>
      <p class="detail">{{introduction}}</p>
      <div class="all" @click="showIntroduction">完整简介</div>
    </div>
    <!-- 文章目录模块 -->
    <div class="list">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">目录</span>
        <span class="listNumber lh">共255章</span>
      </div>
      <ul>
        <li>
          <span>第1章</span>
          <span class="name">第一章节名称</span>
        </li>
      </ul>
      <div class="all" @click="showList">全部目录</div>
    </div>
    <!-- 作者模块 -->
    <div class="bookAuthor">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">作者</span>
      </div>
      <swiper class="swiperTags" :options="swiperOption2" ref="mySwiper">
        <swiper-slide>
          <div class="authorInfo">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
            </div>
            <div class="content">
              <p class="authorName">作者名字</p>
              <p class="works">代表作：《美国终神》、《美国终神》、《美国终神》、《美国终神》、</p>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="authorInfo">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
            </div>
            <div class="content">
              <p class="authorName">作者名字</p>
              <p class="works">代表作：《美国终神》、《美国终神》、《美国终神》、《美国终神》、</p>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!-- 相关推荐模块 -->
    <div class="recommend">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">相关推荐</span>
      </div>
      <swiper class="swiperTags" :options="swiperOption3" ref="mySwiper">
        <swiper-slide>
          <div class="recommendInfo">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
            </div>
            <div class="content">
              <p class="recommendName">新月集 飞鸟集</p>
              <p class="nickname">甘泉</p>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="recommendInfo">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
            </div>
            <div class="content">
              <p class="recommendName">新月集 飞鸟集</p>
              <p class="nickname">甘泉</p>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="recommendInfo">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
            </div>
            <div class="content">
              <p class="recommendName">新月集 飞鸟集</p>
              <p class="nickname">甘泉</p>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div class="recommendInfo">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
            </div>
            <div class="content">
              <p class="recommendName">新月集 飞鸟集</p>
              <p class="nickname">甘泉</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 底部幻灯部分 -->
    <div class="showContent">
      <swiper class="swiperTags" :options="swiperOption4" ref="mySwiper">
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
    <van-popup v-model="introduct" position="bottom">
      <div class="headTitle">
        出版信息
        <svg class="icon" aria-hidden="true" @click="closePopup">
          <use xlink:href="#icon-close-line"></use>
        </svg>
      </div>
      <div class="content">
        <ul>
          <li v-for="item in publishInfo">
            <span class="press">{{item.text}}</span>
            <span>{{item.info}}</span>
          </li>
        </ul>
      </div>
    </van-popup>
    <van-popup v-model="list" position="bottom">
      <div class="headTitle">
        目录
        <svg class="icon" aria-hidden="true" @click="closePopup">
          <use xlink:href="#icon-close-line"></use>
        </svg>
      </div>
      <div class="content">
        <ul>
          <li v-for="item in chapterList">
            <span>{{item.number}}</span>&nbsp&nbsp
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/brand/detail/book.scss" lang="scss"></style>

<script>
import { fail } from "assert";
export default {
  data() {
    return {
      bookInfo: {
        title: "新月集 飞鸟集",
        icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
        author: "尼尔·盖曼",
        imgUrl:
          "https://media2.v.bookuu.com/activity/10/43/20180828104329956.jpg"
      },
      collect: false,
      foucs: true,
      bookTag: [
        "2.2k人读过",
        "尼尔·盖曼",
        "奇幻",
        "尼尔·盖曼",
        "尼尔·盖曼特里布",
        "2.2k人读过"
      ],
      footInfo: [
        {
          imgUrl:
            "https://media2.v.bookuu.com/activity/09/31/20190325093115149.jpg@!q75",
          title: "这里是内容的标题，可能会很长有两行文字",
          name: "品牌名称"
        },
        {
          imgUrl:
            "https://media2.v.bookuu.com/activity/09/31/20190325093115149.jpg@!q75",
          title: "这里是内容的标题，可能会很长有两行文字",
          name: "品牌名称"
        },
        {
          imgUrl:
            "https://media2.v.bookuu.com/activity/09/31/20190325093115149.jpg@!q75",
          title: "这里是内容的标题，可能会很长有两行文字",
          name: "品牌名称"
        },
        {
          imgUrl:
            "https://media2.v.bookuu.com/activity/09/31/20190325093115149.jpg@!q75",
          title: "这里是内容的标题，可能会很长有两行文字",
          name: "品牌名称"
        }
      ],
      swiperOption1: {
        slidesPerView: "auto",
        spaceBetween: 10,
        freeMode: true
      },
      swiperOption2: {
        pagination: {
          el: ".swiper-pagination"
        }
      },
      swiperOption3: {
        slidesPerView: 3.5
      },
      swiperOption4: {
        slidesPerView: 1.1
      },
      introduction:
        "日本文学评论家吉田精一评论：“他的文学可以看作是大正期小市民知识阶层的良心、感觉、神经、趣味等经提纯而获得的结晶。他的创作是他学识与才华的化身。”他的文学创作“在日本近代文学史上开拓了一个不曾有过的领域”。",
      introduct: false,
      list: false,
      publishInfo: [
        { text: "出版社:", info: "中信出版社; 第1版 (2018年9月1日)" },
        { text: "丛书名:", info: "无" },
        { text: " 精装:", info: "344页" },
        { text: "语种:", info: "简体中文" },
        { text: "开本:", info: 32 },
        { text: "ISBN:", info: "9787508690254, 7508690257" },
        { text: "条形码:", info: "9787508690254" },
        { text: "商品尺寸:", info: "21.4 x 15.4 x 2.6 cm" },
        { text: "商品重量:", info: "558 g" },
        { text: "品牌:", info: "中信出版集团股份有限公司" },
        { text: "ASIN:", info: "B07GJG4QTL" }
      ],
      chapterList: [
        { number: "第1章", name: "石内藏助" },
        { number: "第2章", name: "神犬与魔笛" },
        { number: "第3章", name: "第教人之死" },
        { number: "第4章", name: "大导寺信辅的半生" },
        { number: "第5章", name: "第大导寺信辅的半生2" },
        { number: "第6章", name: "神犬与魔笛" },
        { number: "第7章", name: "第教人之死" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" },
        { number: "第8章", name: "大导寺信辅的半生" }
      ]
    };
  },
  methods: {
    collection() {
      this.collect = true;
    },
    cacellCollect() {
      this.collect = false;
    },
    addFoucs() {
      this.foucs = false;
    },
    cancelFoucs() {
      this.foucs = true;
    },
    showIntroduction() {
      this.introduct = true;
    },
    showList() {
      this.list = true;
    },
    closePopup() {
      this.introduct = false;
      this.list = false;
    }
  }
};
</script>
