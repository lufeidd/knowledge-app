<template>
  <div id="bookPage">
    <!-- 头部书籍信息模块 -->
    <div class="bookInfo">
      <div class="info">
        <div class="ratiobox">
          <a class="bookImg" v-lazy:background-image="bookInfo.imgUrl"></a>
        </div>
        <div class="bookContent">
          <span class="title">{{bookInfo.title}}</span>
          <span class="author">{{bookInfo.author}}</span>
          <span class="message">
            <span v-if="collect" @click="iconCollect">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-collect-line"></use>
              </svg> 收藏
            </span>
            <span class="collect" v-else @click="iconCollect">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-collect-block"></use>
              </svg> 收藏
            </span>
            <span class="xinxi">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-list-line"></use>
              </svg> 信息
            </span>
          </span>
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
              <span class="title">{{item.title}}</span>
              <span class="name">{{item.name}}</span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 弹层部分 -->
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
            <span>{{item.number}}</span>&nbsp;&nbsp;
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </van-popup>
    <!-- 评论 -->
    <div id="comment" class="commentBox">
      <van-cell title="评论 25" is-link value="我要评论" @click="openAnswer"/>

      <div class="listBox" v-for="item in commentMessage">
        <div class="left">
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
        </div>
        <div class="center">
          <div class="title">
            <div class="text">{{item.name}}</div>
          </div>
          <div class="subTitle">{{item.content}}</div>

          <div class="messageBox" v-show="item.state">
            <div>
              <div class="message active" v-for="value in item.comment">
                <span class="name">{{value.commentName}}</span>
                <span class="dialog">{{value.commentText}}</span>
              </div>

              <div class="message active">
                <span class="name" @click="foldAction">
                  共4条回复
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fold-line"></use>
                  </svg>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-unfold-line"></use>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- 回复 -->
          <div class="answerBox">
            <span class="date">2019.05.12 09:23</span>
            <span class="action" @click="openAnswer">回复</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 评论 -->
    <van-popup v-model="commentModel" position="bottom">
      <div class="audioList">
        <div class="title">
          <div class="action" @click="commentClose">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold-line"></use>
            </svg>
          </div>
          <div>发表评论</div>
          <div class="punish" @click="onPunish">发布</div>
        </div>
        <!-- 音频列表 -->
        <div class="content">
          <textarea v-model="contentModel" placeholder="快来写评论吧!" @input="inputChange"></textarea>
          <div class="count">
            <span :class="{ active: contentLength > contentTotal }">{{ contentLength }}</span>
            /{{ contentTotal }}
          </div>
        </div>
      </div>
    </van-popup>
    <div class="pinglun">
      <div class="write" @click="openAnswer">快来写评论吧!</div>
      <div class="nice">
        <svg class="icon" aria-hidden="true" v-if="collect" @click="iconCollect">
          <use xlink:href="#icon-collect-line"></use>
        </svg>
        <svg class="icon add" aria-hidden="true" v-else @click="iconCollect">
          <use xlink:href="#icon-collect-block"></use>
        </svg> &nbsp;|&nbsp;
        <svg class="icon" aria-hidden="true" v-if="nice" @click="iconGood">
          <use xlink:href="#icon-good-line"></use>
        </svg>
        <svg class="icon add" aria-hidden="true" v-else @click="iconGood">
          <use xlink:href="#icon-good-block"></use>
        </svg>
      </div>
    </div>
    <EazyNav type="brand" :isShow="true"></EazyNav>

  </div>
</template>

<style src="@/style/scss/pages/brand/detail/book.scss" scoped lang="scss"></style>

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
        ],
        contentTotal: 30,
        contentModel: "",
        contentLength: 0,
        commentModel: false,
        commentMessage: [
          {
            name: "路人甲",
            content: "宝宝的巴士睡前故事，非常的好听值得购买",
            date: "2019.05.12   09:23",
            state: false
          },
          {
            name: "路人甲",
            content: "宝宝的巴士睡前故事，非常的好听值得购买",
            date: "2019.05.12   09:23",
            state: true,
            comment: [
              { commentName: "萌萌龙", commentText: "其实是我的想法哈哈哈" },
              {
                commentName: "我是一个粉刷匠呀",
                commentText: "你这个也太搞笑了吧，沙雕指 数没人可比呀。"
              }
            ]
          },
          {
            name: "路人甲",
            content: "宝宝的巴士睡前故事，非常的好听值得购买",
            date: "2019.05.12   09:23",
            state: false
          }
        ],
        collect: true,
        nice: true
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
      },
      foldAction() {},
      onPunish() {
        if (this.contentLength > this.contentTotal) {
          this.$toast("你发布的字数超出，请修改后再发布!");
          return;
        }
        this.commentModel = false;
      },
      inputChange(self) {
        this.contentLength = this.contentModel.length;
      },
      openAnswer() {
        this.commentModel = true;
      },
      commentClose() {
        this.commentModel = false;
      },
      iconCollect() {
        if (this.collect) {
          this.collect = false;
        } else this.collect = true;
      },
      iconGood() {
        if (this.nice) {
          this.nice = false;
        } else this.nice = true;
      }
    }
  };
</script>
