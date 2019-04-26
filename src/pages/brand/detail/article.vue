<template>
  <div id="articlePage">
    <div class="article">
      <div class="title">{{title}}</div>
      <div class="from">
        <div class="articleInfo">
          <img v-lazy="articleInfo.icon" class="icon">
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
          </svg>
          {{message.watch}}
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-good-line"></use>
          </svg>
          {{message.foucs}}
        </span>
        <span>{{message.time}}</span>
      </div>
    </div>
    <div class="showContent">
      <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
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
        </svg> &nbsp|&nbsp
        <svg class="icon" aria-hidden="true" v-if="nice" @click="iconGood">
          <use xlink:href="#icon-good-line"></use>
        </svg>
        <svg class="icon add" aria-hidden="true" v-else @click="iconGood">
          <use xlink:href="#icon-good-block"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/brand/detail/article.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      title:
        "这里是内容的标题，可能会很长有两行文字这里是内容的标题，可能会很长有两行文字",
      foucs: true,
      articleInfo: {
        name: "磨铁教育",
        foucs: 23456,
        icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png"
      },
      message: { watch: 25641, foucs: 25641, time: "01.29 15:51" },
      swiperOption: {
        slidesPerView: 1.1
      },
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
        }
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
    addfoucs() {
      this.foucs = false;
    },
    cancelfoucs() {
      this.foucs = true;
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
