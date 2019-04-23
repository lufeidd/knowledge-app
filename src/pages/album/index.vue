<template>
  <div id="albumPage" class="page" :class="{ active: this.isIphx }">
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
          <div class="text">sdjfdlfjl三菱电机分类等级分类收到两份简历的房间里的肌肤数量的经费落实的街坊邻居受到了附近</div>
          <div class="action" @click="collectAction">
            <van-tag round color="#fff" text-color="#f05654">
              <svg class="icon" aria-hidden="true" v-if="collect">
                <use xlink:href="#icon-collect-block"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-collect-line"></use>
              </svg>
              <span>
                <template v-if="collect">已</template>收藏
              </span>
            </van-tag>
          </div>
        </div>
        <div
          class="subTitle"
        >sdjfdlfjl三菱电机分类等级分类收到两份简历的房间里的肌肤数量的经费落实的街坊邻居受到了附近sdjfdlfjl三菱电机分类等级分类收到两份简历的房间里的肌肤数量的经费落实的街坊邻居受到了附近</div>
        <div class="info">
          <div class="name">
            <van-tag round color="rgba(0,0,0,.12)" text-color="#fff">
              <img
                src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75"
                width="15"
                height="15"
              >小红帽自媒体时间少了几分
            </van-tag>
          </div>
          <div class="count">
            <van-tag round color="rgba(0,0,0,.12)" text-color="#fff">20649收藏</van-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 介绍 - 节目 - 相似 -->
    <van-tabs v-model="tabModel" animated swipeable>
      <van-tab v-for="(item, key) in tabData" :title="item.title" :key="key">
        <template v-if="item.type == 'info'">

          <div class="publish">
            <div class="from">
              <img v-lazy="item.info.icon" class="icon">
              <div class="publishInfo">
                <p class="publishName">小红帽自媒体</p>
                <p class="focusNumber">已有5万人关注</p>
              </div>
            </div>
            <span class="focus add" v-if="item.info.focus" @click="addFocus">+关注</span>
            <span class="focus" v-else @click="cancelFocus">已关注</span>
          </div>

        </template>
        <template v-if="item.type == 'list'">
          <div class="listContent">
            <van-row class="title">
              <van-col span="12">
                <span class="play">
                  <van-tag color="#f5f5f5" text-color="#666">
                    <van-icon name="play"/>全部播放
                  </van-tag>
                  <span class="tag" v-if="showTag">
                    <span class="text">宝宝睡前故事18 宝宝睡前故事18宝宝睡前故事18宝宝睡前故事18宝宝睡前故事18宝宝睡前故事18宝宝睡前故事18</span>
                    <svg class="icon" aria-hidden="true" @click="onClose">
                      <use xlink:href="#icon-close-line"></use>
                    </svg>
                  </span>
                </span>
                <span class="total">共20集</span>
              </van-col>
              <van-col span="12" style="text-align:right;" @click="onRank">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-reverse-line"></use>
                </svg>
              </van-col>
            </van-row>
            <div class="content">
              <van-row class="list" v-for="(listItem, key) in item.list" :key="key">
                <van-col span="2" class="rank">{{ key }}</van-col>
                <van-col span="16">
                  <router-link to="./detail" class="desc">
                    <span class="tag" v-if="listItem.free">免费</span>
                    {{ listItem.desc }}
                  </router-link>
                  <div class="info">
                    <template v-if="listItem.type == 'audio'">
                      <van-tag color="#c8c8c8" text-color="#fff">音频</van-tag>
                      <span class="count">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-audio-line"></use>
                        </svg>
                        {{ listItem.count }}
                      </span>
                    </template>
                    <template v-if="listItem.type == 'video'">
                      <van-tag color="#c8c8c8" text-color="#fff">视频</van-tag>
                      <span class="count">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-video-line"></use>
                        </svg>
                        {{ listItem.count }}
                      </span>
                    </template>
                    <span class="time">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-time-line"></use>
                      </svg>
                      {{ listItem.time }}
                    </span>
                    <span class="history" v-if="listItem.history">{{ listItem.history }}</span>
                  </div>
                </van-col>
                <van-col span="6" style="text-align:right;align-self:flex-start;">
                  <div class="date">{{ listItem.date }}</div>
                  <div class="status">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-play-line"></use>
                    </svg>
                  </div>
                </van-col>
              </van-row>
            </div>
          </div>
        </template>
        <template v-if="item.type == 'simular'">
          <div class="simularContent">
            <div class="listBox" v-for="(simularItem, key) in item.simular" :key="key">
              <div class="left">
                <div class="ratioBox">
                  <div class="box">
                    <img :src="simularItem.pic">
                  </div>
                </div>
              </div>
              <div class="center">
                <div class="title">
                  <router-link to="./detail" class="text">{{ simularItem.title }}</router-link>
                  <div class="action" @click="scollectAction(key)">
                    <van-tag plain round color="#fff" text-color="#f05654" type="danger">
                      <svg class="icon" aria-hidden="true" v-if="simularItem.collect">
                        <use xlink:href="#icon-collect-block"></use>
                      </svg>
                      <svg class="icon" aria-hidden="true" v-else>
                        <use xlink:href="#icon-collect-line"></use>
                      </svg>
                      <span>
                        <template v-if="simularItem.collect">已</template>收藏
                      </span>
                    </van-tag>
                  </div>
                </div>
                <div class="subTitle">{{ simularItem.subTitle }}</div>
                <div class="info">
                  <template v-if="simularItem.type == 'audio'">
                    <van-tag color="#c8c8c8" text-color="#fff">音频</van-tag>
                    <span class="count">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-audio-line"></use>
                      </svg>
                      {{ simularItem.count }}
                    </span>
                  </template>
                  <template v-if="simularItem.type == 'video'">
                    <van-tag color="#c8c8c8" text-color="#fff">视频</van-tag>
                    <span class="count">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-video-line"></use>
                      </svg>
                      {{ simularItem.count }}
                    </span>
                  </template>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line"></use>
                    </svg>
                    {{ simularItem.time }}
                  </span>
                  <span class="history" v-if="simularItem.history">{{ simularItem.history }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </van-tab>
    </van-tabs>

    <!-- 试听 - 购买 -->
    <van-goods-action :class="{ iphx: this.isIphx }">
      <van-goods-action-mini-btn icon="play-circle-o" text="试听" @click="onClickMiniBtn"/>
      <van-goods-action-big-btn primary :text="'¥ '+money + ' 购买'" @click="onClickBigBtn"/>
    </van-goods-action>

    <miniAudio :audioData="audioData"></miniAudio>

    <!-- 播放器缩略 -->
    <!-- <van-row class="miniAudio" :class="{ iphx: this.isIphx }">
      <van-col span="16">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
          </div>
        </div>

        <div class="info">
          <div class="album">{{ album }}</div>
          <div class="program">
            <span class="duration">{{ duration }}</span>
            {{ program }}
          </div>
        </div>
      </van-col>
      <van-col span="8" class="action">
        <svg class="icon category" aria-hidden="true">
          <use xlink:href="#icon-category-line"></use>
        </svg>
        <svg class="icon play" aria-hidden="true">
          <use xlink:href="#icon-play-line"></use>
        </svg>
      </van-col>
    </van-row>-->
  </div>
</template>

<style src="@/style/scss/pages/album/index.scss" lang="scss"></style>

<script>
import miniAudio from "./../../components/miniAudio";

export default {
  components: {
    miniAudio
  },
  data() {
    return {
      showTag: true,
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
          title: "介绍",
          info: {
            focus: false,
            title: "新月集 飞鸟集",
            icon: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
            author: "尼尔·盖曼",
            imgUrl:
              "https://media2.v.bookuu.com/activity/10/43/20180828104329956.jpg"
          }
        },
        {
          type: "list",
          title: "节目",
          list: [
            {
              free: true,
              desc: "宝宝睡前故事19",
              type: "audio",
              count: 123,
              time: "03:07",
              date: "2019.04.19",
              history: "已播6%"
            },
            {
              free: false,
              desc: "宝宝睡前故事19 宝宝睡前故事19宝宝睡前故事19",
              type: "video",
              count: 325,
              time: "06:07",
              date: "2019.05.19"
            },
            {
              free: true,
              desc: "宝宝睡前故事19",
              type: "audio",
              count: 123,
              time: "03:07",
              date: "2019.04.19"
            },
            {
              free: false,
              desc: "宝宝睡前故事19 宝宝睡前故事19宝宝睡前故事19",
              type: "video",
              count: 325,
              time: "06:07",
              date: "2019.05.19"
            },
            {
              free: true,
              desc: "宝宝睡前故事19",
              type: "audio",
              count: 123,
              time: "03:07",
              date: "2019.04.19"
            },
            {
              free: false,
              desc: "宝宝睡前故事19 宝宝睡前故事19宝宝睡前故事19",
              type: "video",
              count: 325,
              time: "06:07",
              date: "2019.05.19"
            }
          ]
        },
        {
          type: "simular",
          title: "相似",
          simular: [
            {
              pic:
                "https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75",
              title: "十六点就否定了就是雷锋精神劳动纠纷拉萨解放了觉得",
              collect: true,
              subTitle: "来解放拉萨解放螺丝钉解放了绝对是数量大幅减少了多久",
              type: "video",
              count: 325,
              time: "06:07",
              date: "2019.05.19"
            },
            {
              pic:
                "https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75",
              title: "十六点就否定了就是雷锋精神劳动纠纷拉萨解放了觉得",
              collect: false,
              subTitle: "来解放拉萨解放螺丝钉解放了绝对是数量大幅减少了多久",
              type: "audio",
              count: 325,
              time: "06:07",
              date: "2019.05.19"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.audioData.src = require("./../../assets/music.mp3");
  },
  methods: {
    addFocus() {
      this.focus = false;
    },
    cancelFocus() {
      this.focus = true;
    },
    onClose() {
      this.showTag = false;
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
    onClick(index, title) {
      this.$toast(title);
    },
    onClickMiniBtn() {
      this.$toast("点击图标");
    },
    onClickBigBtn() {
      this.$toast("点击按钮");
    },
    onRank() {}
  }
};
</script>

