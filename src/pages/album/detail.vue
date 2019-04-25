<template>
  <div id="detailPage" class="page" :class="{ active: this.isIphx }">
    <div class="ratioBox banner">
      <div class="box">
        <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
      </div>
      <router-link to="./player" class="box layer" v-if="playType == 'audio'">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-audio-circle"></use>
        </svg>
      </router-link>
      <div v-else>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-videoPause-line"></use>
        </svg>
      </div>
    </div>
    <div class="publish">
      <div class="from">
        <img v-lazy="info.icon" class="icon">
        <div class="publishInfo">
          <p class="publishName">小红帽自媒体</p>
          <p class="focusNumber">已有5万人关注</p>
        </div>
      </div>
      <span class="focus add" v-if="info.focus" @click="addFocus">+关注</span>
      <span class="focus" v-else @click="cancelFocus">已关注</span>
    </div>
    <div class="albumBox">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/10/43/20180828104329956.jpg">
          </div>
        </div>
        <div class="issue">
          <div class="title">dfgfgdf豆腐干风格豆腐干豆腐干</div>

          <div class="info">已有五万人订阅 slsdlfjslfjslfjlsfj苏联的飞机历史交锋螺丝钉解放了的是</div>
        </div>
    </div>

    <!-- 介绍 - 评论 -->
    <van-tabs v-model="tabModel" sticky @click="tabChange">
      <van-tab v-for="(item, key) in tabData" :title="item.title" :key="key">
        <template v-if="item.type == 'info'"></template>
        <template v-if="item.type == 'list'"></template>
      </van-tab>
    </van-tabs>

    <van-cell title="听了本节目的也在听" value/>
    <van-row gutter="20" class="booklist">
      <van-col span="8">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
          </div>
        </div>
        <div class="title">宝宝巴士睡前故 事合集 事合集事合集 拷贝</div>
      </van-col>
      <van-col span="8">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
          </div>
        </div>
        <div class="title">宝宝巴士睡前故 事合集 事合集事合集 拷贝</div>
      </van-col>
      <van-col span="8">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
          </div>
        </div>
        <div class="title">宝宝巴士睡前故 事合集 事合集事合集 拷贝</div>
      </van-col>
      <van-col span="8">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
          </div>
        </div>
        <div class="title">宝宝巴士睡前故 事合集 事合集事合集 拷贝</div>
      </van-col>
      <van-col span="8">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
          </div>
        </div>
        <div class="title">宝宝巴士睡前故 事合集 事合集事合集 拷贝</div>
      </van-col>
      <van-col span="8">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
          </div>
        </div>
        <div class="title">宝宝巴士睡前故 事合集 事合集事合集 拷贝</div>
      </van-col>
    </van-row>

    <!-- 评论 -->
    <div id="comment" class="commentBox">
      <van-cell title="评论 25" is-link value="我要评论" @click="openAnswer"/>

      <div class="listBox">
        <div class="left">
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
        </div>
        <div class="center">
          <div class="title">
            <div class="text">十点零分奖励积分善良的飞机螺丝钉解放了解对方的</div>
          </div>
          <div class="subTitle">手动阀手动阀手动阀奖励积分来得及</div>

          <div class="messageBox">
            <div>
              <div class="message active">
                <span class="name">受到了放进塑料袋就发了多少</span>
                <span class="dialog">士大夫士大夫罗斯福大家都是</span>
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

      <div class="listBox">
        <div class="left">
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
        </div>
        <div class="center">
          <div class="title">
            <div class="text">十点零分奖励积分善良的飞机螺丝钉解放了解对方的</div>
          </div>
          <div class="subTitle">手动阀手动阀手动阀奖励积分来得及</div>

          <div class="messageBox">
            <div>
              <div class="message active">
                <span class="name">受到了放进塑料袋就发了多少</span>
                <span class="dialog">士大夫士大夫罗斯福大家都是</span>
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
      <div class="listBox">
        <div class="left">
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
        </div>
        <div class="center">
          <div class="title">
            <div class="text">十点零分奖励积分善良的飞机螺丝钉解放了解对方的</div>
          </div>
          <div class="subTitle">手动阀手动阀手动阀奖励积分来得及</div>

          <div class="messageBox">
            <div>
              <div class="message active">
                <span class="name">受到了放进塑料袋就发了多少</span>
                <span class="dialog">士大夫士大夫罗斯福大家都是</span>
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
      <div class="listBox">
        <div class="left">
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
        </div>
        <div class="center">
          <div class="title">
            <div class="text">十点零分奖励积分善良的飞机螺丝钉解放了解对方的</div>
          </div>
          <div class="subTitle">手动阀手动阀手动阀奖励积分来得及</div>

          <div class="messageBox">
            <div>
              <div class="message active">
                <span class="name">受到了放进塑料袋就发了多少</span>
                <span class="dialog">士大夫士大夫罗斯福大家都是</span>
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

    <!-- 试听 - 购买 -->
    <van-goods-action :class="{ iphx: this.isIphx }">
      <van-goods-action-mini-btn icon="play-circle-o" text="试听" @click="onClickMiniBtn"/>
      <van-goods-action-big-btn primary :text="'¥ '+money + ' 购买专辑'" @click="onClickBigBtn"/>
    </van-goods-action>

    <!-- 音频缩略 -->
    <miniAudio :audioData="audioData"></miniAudio>
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
  </div>
</template>

<style src="@/style/scss/pages/album/detail.scss" lang="scss"></style>

<script>
import miniAudio from "./../../components/miniAudio";

export default {
  components: {
    miniAudio
  },
  data() {
    return {
      contentTotal: 30,
      contentModel: "",
      contentLength: 0,
      commentModel: false,
      playType: "audio",
      info: {
        focus: false,
        title: "新月集 飞鸟集",
        icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
        author: "尼尔·盖曼",
        imgUrl:
          "https://media2.v.bookuu.com/activity/10/43/20180828104329956.jpg"
      },
      audioData: {
        type: "play",
        id: "myMiniAudio",
        src: "",
        // 分：秒格式
        duration: "00:00",
        currentTime: "00:00",
        currentRate: 0,
        album: "宝宝在线讲好听的故事 宝宝在线讲好听的故事",
        duration: "03:45",
        program: "1.哄睡觉方法 上了飞机率领的反垄断设计费",
        popupModel: false
      },
      tabModel: 0,
      money: 5,
      collect: false,
      tabData: [
        {
          type: "info",
          title: "介绍"
        },
        {
          type: "list",
          title: "评论"
        }
      ]
    };
  },
  mounted() {
    this.audioData.src = require("./../../assets/music.mp3");
  },
  methods: {
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
    tabChange(index, title) {
      // this.$toast(index);
      if (index == 1) $(window).scrollTop($("#comment").offset().top);
    },
    addFocus() {
      this.focus = false;
    },
    cancelFocus() {
      this.focus = true;
    },
    collectAction() {
      this.collect = !this.collect;
      if (this.collect) {
        this.$toast("收藏成功~");
      } else {
        this.$toast("取消收藏~");
      }
    },
    scollectAction(key) {
      this.tabData[2].simular[key].collect = !this.tabData[2].simular[key]
        .collect;

      if (this.tabData[2].simular[key].collect) {
        this.$toast("收藏成功~");
      } else {
        this.$toast("取消收藏~");
      }
    },
    onClickMiniBtn() {
      this.$toast("点击图标");
    },
    onClickBigBtn() {
      this.$toast("点击按钮");
    }
  }
};
</script>

