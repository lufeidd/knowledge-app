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

    <!-- 介绍 - 评论 -->
    <van-tabs v-model="tabModel" sticky>
      <van-tab @click="onClick" v-for="(item, key) in tabData" :title="item.title" :key="key">
        <template v-if="item.type == 'info'">
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
          <van-cell title="评论 25" is-link value="我要评论"/>
        </template>
        <template v-if="item.type == 'list'"></template>
      </van-tab>
    </van-tabs>

    <!-- 试听 - 购买 -->
    <van-goods-action :class="{ iphx: this.isIphx }">
      <van-goods-action-mini-btn icon="play-circle-o" text="试听" @click="onClickMiniBtn"/>
      <van-goods-action-big-btn primary :text="'¥ '+money + ' 购买专辑'" @click="onClickBigBtn"/>
    </van-goods-action>

    <miniAudio :audioData="audioData"></miniAudio>
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
    onClick(index, title) {
      this.$toast(title);
      console.log(title);
      alert(888);
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

