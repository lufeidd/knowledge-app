<template>
  <div id="albumPage" class="page" :class="{ active: this.isIphx }">
    <!-- 基础信息 -->
    <div class="listBox">
      <div class="left">
        <div class="ratioBox">
          <div class="box">
            <img :src="baseData.pic[0]">
          </div>
        </div>
      </div>
      <div class="center">
        <div class="title">
          <div class="text">{{ baseData.title }}</div>
          <div class="action" @click="collectAction">
            <van-tag round color="#fff" text-color="#f05654">
              <svg class="icon" aria-hidden="true" v-if="baseData.collect_id > 0">
                <use xlink:href="#icon-collect-block"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-collect-line"></use>
              </svg>
              <span>
                <template v-if="baseData.collect_id > 0">已</template>收藏
              </span>
            </van-tag>
          </div>
        </div>
        <div class="subTitle">{{ baseData.sub_title }}</div>
        <div class="info">
          <div class="name">
            <van-tag round color="rgba(0,0,0,.12)" text-color="#fff">
              <img :src="brandInfoData.header_pic" width="15" height="15">
              {{ brandInfoData.name }}
            </van-tag>
          </div>
          <div class="count">
            <van-tag round color="rgba(0,0,0,.12)" text-color="#fff">{{ baseData.collection_num }}收藏</van-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 介绍 - 节目 - 相似 -->
    <van-tabs v-model="tabModel" animated @click="tabChange">
      <van-tab v-for="(item, key) in tabData" :title="item.title" :key="key">
        <template v-if="key == 0">
          <div class="infoContent">
            <!-- 关注公众号 -->
            <div class="publish">
              <div class="from">
                <img v-lazy="brandInfoData.header_pic" class="icon">
                <div class="publishInfo">
                  <p class="publishName">{{ brandInfoData.name }}</p>
                  <p class="focusNumber">已有{{ brandInfoData.fans }}人关注</p>
                </div>
              </div>
              <span class="focus add" v-if="brandInfoData.is_followed == 0" @click="focusAction">+关注</span>
              <span class="focus" v-else @click="focusAction">已关注</span>
            </div>
            <!-- 评论 -->
            <div class="commentBox">
              <van-cell title="评论 25" is-link value="我要评论" @click="openAnswer"/>

              <van-list
                v-model="commentLoading"
                :finished="commentFinished"
                finished-text="没有更多了"
                @load="commentLoad"
              >
                <div class="listBox" v-for="(item, key) in discussData" :key="key">
                  <div class="left">
                    <div class="ratioBox">
                      <div class="box">
                        <img :src="item.user_header">
                      </div>
                    </div>
                  </div>
                  <div class="center">
                    <div class="title">
                      <div class="text">{{ item.nick_name }}</div>
                    </div>
                    <div class="subTitle">{{ item.content }}</div>

                    <div class="messageBox" v-if="answerData[key].length > 0">
                      <!-- 回复 -->

                      <!-- <div
                        class="message active"
                        v-for="(replyItem, key) in item.reply_list"
                        :key="key"
                      >
                        <span class="name">{{ replyItem.nick_name }}</span>
                        <span class="dialog">{{ replyItem.content }}</span>
                      </div> -->
                      
                      <div
                        class="message active"
                        v-for="(replyItem, key) in answerData[key]"
                        :key="key"
                      >
                        <span class="name">{{ replyItem.nick_name }}</span>
                        <span class="dialog">{{ replyItem.content }}</span>
                      </div>





                      <div class="message active" v-if="item.reply_num > 2">
                      

                        <!-- <van-pagination v-model="item.reply_current_page" :page-count="item.reply_total_page" mode="simple" @change="pageChange(item.comment_id, key)" /> -->
                        
                        <span class="name" @click="pageChange(item.comment_id, key)">
                          共{{ item.reply_num }}条回复

                          {{ item.comment_id }} - {{ key }}
                          <svg
                            class="icon"
                            aria-hidden="true"
                          >
                            <use xlink:href="#icon-fold-line"></use>
                          </svg>
                          <!-- <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-unfold-line"></use>
                          </svg> -->
                        </span>
                    </div>



                    </div>




                    

                    <!-- 回复 -->
                    <div class="answerBox">
                      <span class="date">{{ item.create_time }}</span>
                      <span class="action" @click="openAnswer">回复</span>
                    </div>
                  </div>
                </div>
              </van-list>
            </div>
          </div>
        </template>
        <template v-if="key == 1">
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
              <van-row class="list">
                <van-col span="2" class="rank">1</van-col>
                <van-col span="16">
                  <router-link to="./detail" class="desc">
                    <span class="tag">免费</span>
                    lsjfdjf
                  </router-link>
                  <div class="info">
                    <template>
                      <van-tag color="#c8c8c8" text-color="#fff">音频</van-tag>
                      <span class="count">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-audio-line"></use>
                        </svg>
                        111
                      </span>
                    </template>
                    <template>
                      <van-tag color="#c8c8c8" text-color="#fff">视频</van-tag>
                      <span class="count">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-video-line"></use>
                        </svg>
                        222
                      </span>
                    </template>
                    <span class="time">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-time-line"></use>
                      </svg>
                      333
                    </span>
                    <span class="history">打发士大夫</span>
                  </div>
                </van-col>
                <van-col span="6" style="text-align:right;align-self:flex-start;">
                  <div class="date">似懂非懂</div>
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
        <template v-if="key == 2">
          <div class="simularContent">
            <div class="listBox">
              <div class="left">
                <div class="ratioBox">
                  <div class="box">
                    <img src>
                  </div>
                </div>
              </div>
              <div class="center">
                <div class="title">
                  <router-link to="./detail" class="text">lsdjf</router-link>
                  <div class="action" @click="scollectAction(key)">
                    <van-tag plain round color="#fff" text-color="#f05654" type="danger">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-collect-block"></use>
                      </svg>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-collect-line"></use>
                      </svg>
                      <span>
                        <template>已</template>收藏
                      </span>
                    </van-tag>
                  </div>
                </div>
                <div class="subTitle">fsldf十六点九分零四</div>
                <div class="info">
                  <template>
                    <van-tag color="#c8c8c8" text-color="#fff">音频</van-tag>
                    <span class="count">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-audio-line"></use>
                      </svg>
                      111
                    </span>
                  </template>
                  <template>
                    <van-tag color="#c8c8c8" text-color="#fff">视频</van-tag>
                    <span class="count">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-video-line"></use>
                      </svg>
                      222
                    </span>
                  </template>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line"></use>
                    </svg>
                    2014
                  </span>
                  <span class="history">十分士大夫</span>
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
      <van-goods-action-big-btn primary :text="'¥ '+baseData.price + ' 购买'" @click="onClickBigBtn"/>
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
          <div class="punish" @click="punishComment">发布</div>
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

<style src="@/style/scss/pages/album/index.scss" lang="scss"></style>

<script>
import miniAudio from "./../../components/miniAudio";
//  引入接口
import { ALBUM } from "../../apis/album.js";
import {
  COLLECT,
  COLLECT_CANCEL,
  FOCUS,
  FOCUS_CANCEL,
  COMMENT,
  COMMENT_ADD,
  ALBUM_DETAIL
} from "../../apis/public.js";

export default {
  components: {
    miniAudio
  },
  data() {
    return {
      // 基础信息
      baseData: {
        title: "",
        sub_title: "",
        pic: [],
        goods_type: null,
        collection_num: 0,
        collect_id: null
      },
      // 所属媒体信息
      brandInfoData: {
        header_pic: "",
        name: "",
        fans: 0,
        is_followed: null
      },
      // 选项卡
      tabData: [
        {
          title: "介绍"
        },
        {
          title: "节目"
        },
        {
          title: "相似"
        }
      ],
      tabModel: 0,
      // 评论
      discussData: [],
      commentPage: 1,
      // 发布评论
      commentModel: false,
      contentModel: "",
      contentTotal: 30,
      contentLength: 0,
      // 节目列表
      commentLoading: false,
      commentFinished: false,
      // 回复
      replyPage: [],
      answerData: [],

      ////////////////////////////////////////////////////////////////////////////


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
    };
  },
  mounted() {
    // 上个页面携带必要信息
    this.baseData.goods_id = 16;
    // 当前页接口信息
    this.albumData();
    // this.commentData();

    //////////////////////////////////////////////////////////////////////////////

    this.audioData.src = require("./../../assets/music.mp3");
  },
  methods: {
    // 获取专辑接口信息
    async albumData() {
      // var tStamp = this.$getTimeStamp();
      let data = {
        // timeStamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      let res = await ALBUM(data);
      if (res.hasOwnProperty("response_code")) {
        //专辑基础信息
        this.baseData = res.response_data.base;
        // 所属媒体信息
        this.brandInfoData = res.response_data.brand_info;
        // console.log(this.baseData);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取收藏接口信息
    async collectData(__type) {
      var data = {};
      var res;
      switch (__type) {
        case "collect":
          data = {
            type: this.baseData.goods_type,
            target: this.baseData.goods_id,
            version: "1.0"
          };
          res = await COLLECT(data);
          this.baseData.collect_id = 1;
          // this.$toast("已收藏~");
          break;
        case "cancel":
          data = {
            goods_id: this.baseData.goods_id,
            version: "1.0"
          };
          res = await COLLECT_CANCEL(data);
          this.baseData.collect_id = 0;
          this.$toast("已取消收藏~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    },
    collectAction() {
      if (this.baseData.collect_id > 0) {
        this.collectData("cancel");
      } else {
        this.collectData("collect");
      }
    },
    // 获取关注接口信息
    async focusData(__type) {
      var data = {};
      var res;
      switch (__type) {
        case "collect":
          data = {
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          res = await FOCUS(data);
          this.brandInfoData.is_followed = 1;
          // this.$toast('已关注~');
          break;
        case "cancel":
          data = {
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          res = await FOCUS_CANCEL(data);
          this.brandInfoData.is_followed = 0;
          this.$toast("已取消关注~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    },
    focusAction() {
      if (this.brandInfoData.is_followed > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("collect");
      }
    },
    // tab切换
    tabChange(index, title) {
      var __height = "auto";

      switch (index) {
        case 0:
          __height = $(".infoContent").height();
          break;
        case 1:
          __height = $(".listContent").height();
          break;
        case 2:
          __height = $(".simularContent").height();
          break;
      }

      $(".van-tabs__track").css("height", __height);
      $(".van-tabs__track .van-tab__pane")
        .eq(index)
        .css("height", __height);
    },
    // 评论
    async commentData() {
      
      let data = {
        page: this.commentPage,
        page_size: 4,
        version: "1.0"
      };
      let res = await COMMENT(data);
      
      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.discussData.push(result[i]);
            this.answerData.push(result[i].reply_list);
            this.replyPage.push(1);
            
          }
          // 加载状态结束
          this.commentLoading = false;
          this.commentPage++;

          // 数据全部加载完成
          if (this.discussData.length >= res.response_data.total_count) {
            this.commentFinished = true;
          }
        }, 500);

        console.log("res：", res);
        // console.log("replyPage：", this.replyPage);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 回复
    async replyData(comment_id, key) {
      let data = {
        comment_pid: comment_id,
        page: this.replyPage[key],
        version: "1.0"
      };
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {

        // 异步更新数据
        var result = res.response_data.result;
        // this.answerData.push(result);
        for(let i = 0; i < result.length; i++) {

          this.answerData[key].push(result[i]);
        }
        this.replyPage[key]++;

        // console.log("answerData:", this.answerData[key]);
      } else {
        this.$toast(res.error_message);
      }
    },
    pageChange(comment_id, key){
      this.replyData(comment_id, key);
    },
    async addComment() {
      let data = {
        goods_id: this.baseData.goods_id,
        content: this.contentModel,
        version: "1.0"
      };
      let res = await COMMENT_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log("新增评论：", res);
      } else {
        this.$toast(res.error_message);
      }
    },
    punishComment() {
      if (this.contentLength > this.contentTotal) {
        this.$toast("你发布的字数超出，请修改后再发布!");
        return;
      }
      this.commentModel = false;
      this.addComment();
      this.commentData();
    },

////////////////////////////////////

    // 节目列表
    async listData() {
      let data = {
        version: "1.0"
      };
      let res = await COMMENT(data);
      if (res.hasOwnProperty("response_code")) {
        // this.discussData = res;
        for (let i = 0; i < res.response_data.result.length; i++) {
          var result = res.response_data.result;
          this.discussData.push(result[i]);
        }
        // console.log("评论：", res.response_data.result);
      } else {
        this.$toast(res.error_message);
      }
    },
    commentLoad() {
      this.commentData();
    },

    /////////////////////////////////////////////////////////////////

    inputChange(self) {
      this.contentLength = this.contentModel.length;
    },
    openAnswer() {
      this.commentModel = true;
    },
    commentClose() {
      this.commentModel = false;
    },
    onClose() {
      this.showTag = false;
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

