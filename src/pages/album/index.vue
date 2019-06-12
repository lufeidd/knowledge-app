
<template>
  <div id="albumPage" class="page">
    <div class="nullBox" v-if="onsale == 0">
      <img src="./../../assets/null/product.png" width="100%">
      <div>该商品已下架~</div>
    </div>

    <div v-if="onsale == 1">
      <!-- 基础信息 -->
      <div class="listBox">
        <div class="left">
          <div class="ratioBox">
            <div class="box">
              <img :src="baseData.pic[0]">
            </div>
          </div>
        </div>
        <div class="center" style="display: block;">
          <div class="title">
            <div class="text">{{ baseData.title }}</div>
            <div
              class="action"
              @click="collectAction('base', baseData.collect_id, baseData.goods_id)"
            >
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
          <div class="subTitle" style="height: auto;">{{ baseData.sub_title }}</div>
          <div class="info">
            <div class="name">
              <van-tag round color="rgba(0,0,0,.12)" text-color="#fff">
                <img :src="brandInfoData.header_pic" width="15" height="15">
                {{ brandInfoData.name }}
              </van-tag>
            </div>
            <div class="count">
              <van-tag
                round
                color="rgba(0,0,0,.12)"
                text-color="#fff"
              >{{ baseData.collection_num }}收藏</van-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 介绍 - 节目 - 相似 -->
      <van-tabs v-model="tabModel" sticky animated @click="tabChange">
        <van-tab v-for="(item, key) in tabData" :title="item.title" :key="key">
          <template v-if="activeKey == key">
            <!-- 介绍 -->
            <div class="infoContent" v-if="key == 0">
              <!-- 关注公众号 -->
              <div class="publish">
                <router-link
                  :to="{name: 'brand', query: {brand_id: brandInfoData.brand_id}}"
                  class="from"
                >
                  <img v-lazy="brandInfoData.header_pic" class="icon">
                  <div class="publishInfo">
                    <p class="publishName">{{ brandInfoData.name }}</p>
                    <p class="focusNumber">已有{{ brandInfoData.fans }}人关注</p>
                  </div>
                </router-link>
                <span
                  class="focus add"
                  v-if="brandInfoData.is_followed == 0"
                  @click="focusAction"
                >+关注</span>
                <span class="focus" v-else @click="focusAction">已关注</span>
              </div>
              <!-- 评论 -->
              <div class="commentBox">
                <van-cell
                  :title="totalCount"
                  is-link
                  value="我要评论"
                  @click="openAnswer('comment', null)"
                />

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
                      <div class="subTitle" style="height: auto;">{{ item.content }}</div>

                      <div class="messageBox" v-if="answerData[key].length > 0">
                        <!-- 回复 -->

                        <!-- <div
                          class="message active"
                          v-for="(replyItem, key) in item.reply_list"
                          :key="key"
                        >
                          <span class="name">{{ replyItem.nick_name }}</span>
                          <span class="dialog">{{ replyItem.content }}</span>
                        </div>-->

                        <div
                          class="message active"
                          v-for="(replyItem, key) in answerData[key]"
                          :key="key"
                        >
                          <span class="name">{{ replyItem.nick_name }}</span>
                          <span class="dialog">{{ replyItem.content }}</span>
                        </div>

                        <div
                          class="message active"
                          v-if="item.reply_num > 2 && replyPage[key] <= item.reply_total_page"
                        >
                          <!-- <van-pagination v-model="item.reply_current_page" :page-count="item.reply_total_page" mode="simple" @change="pageChange(item.comment_id, key)" /> -->

                          <span class="name" @click="pageChange(item.comment_id, key)">
                            共{{ item.reply_num }}条回复
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-fold-line"></use>
                            </svg>
                            <!-- <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-unfold-line"></use>
                            </svg>-->
                          </span>
                        </div>
                      </div>

                      <!-- 回复 -->
                      <div class="answerBox">
                        <span class="date">{{ item.create_time }}</span>
                        <span class="action" @click="openAnswer('reply', item.comment_id)">回复</span>
                      </div>
                    </div>
                  </div>
                </van-list>
              </div>
            </div>
            <!-- 节目 -->
            <van-list
              v-if="key == 1"
              v-model="programLoading"
              :finished="programFinished"
              finished-text="没有更多了"
              @load="programLoad"
            >
              <div class="listContent">
                <van-row class="title">
                  <van-col span="12">
                    <span class="play">
                      <van-tag
                        v-if="allPlayStatus == 'play'"
                        color="#f5f5f5"
                        text-color="#666"
                        @click="allAction"
                      >
                        <van-icon name="play"/>全部播放
                      </van-tag>
                      <van-tag
                        v-if="allPlayStatus == 'pause'"
                        color="#f5f5f5"
                        text-color="#666"
                        @click="allAction"
                      >
                        <van-icon name="pause"/>暂停播放
                      </van-tag>
                      <van-tag
                        v-if="allPlayStatus == 'continue'"
                        color="#f5f5f5"
                        text-color="#666"
                        @click="allAction"
                      >
                        <van-icon name="play"/>继续播放
                      </van-tag>

                      <span class="tag" v-if="showHistory && myAudioData.src">
                        <span class="text">{{ myAudioData.program }}</span>
                        <svg class="icon" aria-hidden="true" @click="historyAction">
                          <use xlink:href="#icon-close-line"></use>
                        </svg>
                      </span>
                    </span>
                    <span class="total">共{{ programTotalCount }}集</span>
                  </van-col>
                  <van-col span="12" style="text-align:right;">
                    <svg class="icon" aria-hidden="true" v-if="rankType == 0" @click="rankAction">
                      <use xlink:href="#icon-reverse-line"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-if="rankType == 1" @click="rankAction">
                      <use xlink:href="#icon-upright-line"></use>
                    </svg>
                  </van-col>
                </van-row>

                <div class="content" v-for="(item, key) in programList" :key="key">
                  <van-row class="list">
                    <van-col span="2" class="rank">{{ item.goods_no }}</van-col>
                    <van-col span="16">
                      <router-link
                        :to="{ name: 'albumdetail', query: { pid: baseData.goods_id, goods_id: item.goods_id, goods_no: item.goods_no}}"
                        class="desc"
                      >
                        <template v-if="item.goods_type != 6">
                          <span class="tag" v-if="item.is_free == 1">免费</span>
                          <span class="tag" v-if="item.is_payed == 1">已购</span>
                        </template>
                        {{ item.title }}
                      </router-link>
                      <div class="info">
                        <template v-if="item.goods_type == 1">
                          <van-tag color="#c8c8c8" text-color="#fff">音频</van-tag>
                          <span class="count">
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-audio-line"></use>
                            </svg>
                            {{ item.play_num }}
                          </span>
                        </template>
                        <template v-if="item.goods_type == 2">
                          <van-tag color="#c8c8c8" text-color="#fff">视频</van-tag>
                          <span class="count">
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-video-line"></use>
                            </svg>
                            {{ item.play_num }}
                          </span>
                        </template>
                        <template v-if="item.goods_type == 6">
                          <van-tag color="#c8c8c8" text-color="#fff">文章</van-tag>
                          <span class="count">
                            <svg class="icon" aria-hidden="true">
                              <use xlink:href="#icon-list-line"></use>
                            </svg>
                            {{ item.play_num }}
                          </span>
                        </template>

                        <span class="time" v-if="item.goods_type != 6">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-time-line"></use>
                          </svg>
                          {{ item.duration }}
                        </span>

                        <template v-if="progressList.length > 0">
                          <span
                            class="history"
                            v-if="item.goods_type != 6 && progressList[key].progressHistory"
                          >已播{{ (progressList[key].progressHistory / progressList[key].ori_duration * 100).toFixed(2) }}%</span>
                        </template>
                      </div>
                    </van-col>
                    <van-col span="6" style="text-align:right;align-self:flex-start;">
                      <div class="date">{{ item.create_time }}</div>
                      <div class="status" v-if="item.goods_type != 6" @click="audioAction(item)">
                        <svg
                          class="icon"
                          aria-hidden="true"
                          v-if="item.goods_no == activeGoodNo && audioPlaying"
                        >
                          <use xlink:href="#icon-pause-line"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true" v-else>
                          <use xlink:href="#icon-play-line"></use>
                        </svg>
                      </div>
                    </van-col>
                  </van-row>
                </div>
              </div>
            </van-list>
            <!-- 相似 -->
            <van-list
              v-if="key == 2"
              v-model="recommendLoading"
              :finished="recommendFinished"
              finished-text="没有更多了"
              @load="recommendLoad"
            >
              <div class="simularContent">
                <div class="listBox" v-for="(item, key) in recommendList" :key="key">
                  <div class="left">
                    <div class="ratioBox">
                      <div class="box">
                        <img :src="item.pic[0]">
                      </div>
                    </div>
                  </div>
                  <div class="center">
                    <div class="title">
                      <!-- 专辑推荐的一定是专辑，goods_type: 9 -->
                      <div @click="gotoLink(item.goods_id)" class="text">{{ item.title }}</div>

                      <div
                        class="action"
                        @click="collectAction(key, simularStatus[key].is_collect, item.goods_id)"
                      >
                        <van-tag
                          style="position: relative; top: -5px;"
                          plain
                          round
                          color="#fff"
                          text-color="#f05654"
                          type="danger"
                        >
                          <svg
                            class="icon"
                            aria-hidden="true"
                            v-if="simularStatus[key].is_collect == 1"
                          >
                            <use xlink:href="#icon-collect-block"></use>
                          </svg>
                          <svg
                            class="icon"
                            aria-hidden="true"
                            v-if="simularStatus[key].is_collect == 0"
                          >
                            <use xlink:href="#icon-collect-line"></use>
                          </svg>
                          <span>
                            <template v-if="simularStatus[key].is_collect == 1">已</template>收藏
                          </span>
                        </van-tag>
                      </div>
                    </div>
                    <div class="subTitle">{{ item.sub_title }}</div>
                    <div class="info">
                      <template v-if="item.goods_type == 1">
                        <van-tag color="#c8c8c8" text-color="#fff">音频</van-tag>
                        <span class="count">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-audio-line"></use>
                          </svg>
                          {{ item.play_num }}
                        </span>
                      </template>
                      <template v-if="item.goods_type == 2">
                        <van-tag color="#c8c8c8" text-color="#fff">视频</van-tag>
                        <span class="count">
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-video-line"></use>
                          </svg>
                          {{ item.play_num }}
                        </span>
                      </template>
                      <span class="time">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-time-line"></use>
                        </svg>
                        <!-- {{ item.create_time }} -->
                        <!-- {{ item.goods_type }} -->
                        {{ item.item_count }}
                      </span>
                      <!-- <span class="history"></span> -->
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </template>
        </van-tab>
      </van-tabs>

      <div
        style="height: 60px;"
        v-if="baseData.is_free == 0 && baseData.is_payed == 0 && baseData.sale_style == 1"
      ></div>
      <div v-if=" myAudioData.src" style="height: 60px;"></div>
      <div v-if="this.isIphx" style="height: 34px;"></div>

      <!-- 试听 - 购买 -->

      <van-goods-action
        :class="{ iphx: this.isIphx }"
        v-if="baseData.is_free == 0 && baseData.is_payed == 0 && baseData.sale_style == 1"
      >
        <van-goods-action-mini-btn
          icon="play-circle-o"
          text="试听"
          @click="preListenAction"
          v-if="baseData.has_free && preListen"
        />
        <van-goods-action-big-btn
          primary
          :text="'¥ '+baseData.price + ' 购买'"
          @click="buyAction(baseData.goods_id)"
        />
      </van-goods-action>

      <!-- 音频缩略 -->
      <miniAudio
        :class="{isShow: myAudioData.src}"
        :audioData="myAudioData"
        :rank="rankType"
        :loginStatus="isLogin"
        ref="control"
        @setType="typeAction"
        @setMiniAudio="miniAudioData"
        @setProgress="audioProgressData"
        @showAudioList="audioListShow"
        @linkToPlayer="gotoPlayer"
        @getAllProgram="getAllProgramData"
      ></miniAudio>

      <!-- 播放列表 -->
      <audioList
        :goodsId="baseData.goods_id"
        :albumInfo="baseData"
        :goodsNo="activeGoodNo"
        :audioStatus="audioPlaying"
        @audioChange="audioAction"
        ref="controlList"
      ></audioList>

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

      <!-- 快速导航 -->
      <!-- <easyNav :navData="navData"></easyNav> -->
    </div>
  </div>
</template>

<style src="@/style/scss/pages/album/index.scss" lang="scss"></style>
<style lang="scss">
#albumPage {
  .van-button {
    border-radius: 0;
  }
}
</style>

<script>
import miniAudio from "./../../components/miniAudio";
import audioList from "./../../pages/album/list";
// import easyNav from "./../../components/easyNav";
//  引入接口
import { ALBUM, ALBUM_DETAIL } from "../../apis/album.js";
import {
  COLLECT_ADD,
  COLLECT_CANCEL,
  FOCUS_ADD,
  FOCUS_CANCEL,
  COMMENT,
  COMMENT_ADD,
  RECOMMEND
} from "../../apis/public.js";
import { setTimeout } from "timers";
import { truncate } from "fs";

export default {
  components: {
    miniAudio,
    audioList
  },
  data() {
    return {
      isLogin: null,
      onsale: null,
      // 快速导航
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   personal: true,
      //   personalLink: "/personal/index",
      // },
      /*
       * ----------------------------------介绍----------------------------------
       */
      // 基础信息
      baseData: {
        title: "",
        sub_title: "",
        pic: [],
        goods_type: null,
        collection_num: 0,
        collect_id: null,
        goods_id: null
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
      tabModel: 1,
      activeKey: 1,
      // 评论
      discussData: [],
      commentPage: 1,
      totalCount: "评论 (" + 0 + ")",
      // 发布评论
      commentModel: false,
      contentModel: "",
      contentTotal: 30,
      contentLength: 0,
      // 分页
      commentLoading: false,
      commentFinished: false,
      // 回复
      replyPage: [],
      answerData: [],
      // 存放回复评论comment_id
      commentId: null,
      // 存放发布按钮类型，comment为发布评论，reply为发布回复
      punishType: "comment",
      /*
       * ----------------------------------节目----------------------------------
       */
      showHistory: true,
      programList: [],
      programPage: 1,
      // 分页
      programLoading: false,
      programFinished: false,
      // 节目总数
      programTotalCount: 0,
      // 迷你音频当前节目信息
      myAudioData: {},
      // 存放当前播放音频key值
      activeGoodNo: null,
      // 存放当前播放器播放状态
      audioPlaying: false,
      // 排序
      rankType: 0, // 默认0倒序, 1正序
      // 记录节目播放进度
      progressList: [],
      /*
       * --------------------------------播放列表--------------------------------
       */
      // popupModel: false,
      // 试听数据，存放goods_no为1的数据
      preListen: [],
      // 存放全部音频
      allAudioData: [],
      // 存放不包含文章类型全部播放所有节目
      allProgramList: [],
      // 判断是否需要自动播放
      autoPlay: true,
      // 全部播放状态
      allPlayStatus: "play",
      /*
       * --------------------------------相似--------------------------------
       */
      recommendList: [],
      recommendPage: 1,
      // 分页
      recommendLoading: false,
      recommendFinished: false,
      // 存放相似状态
      simularStatus: []
    };
  },
  destroyed() {},
  mounted() {
    this.baseData.goods_id = parseInt(this.$route.query.goods_id);

    // 当前页接口信息
    this.albumData();
  },
  methods: {
    // --------------------------------专辑信息----------------------------------
    // 获取专辑接口信息
    async albumData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timeStamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);

      // console.log(res.response_data);

      if (res.hasOwnProperty("response_code")) {
        //专辑基础信息
        this.baseData = res.response_data.base;
        // 所属媒体信息
        this.brandInfoData = res.response_data.brand_info;
        // 登录状态
        this.isLogin = res.response_data.user_info.is_login;

        this.onsale = 1;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
        }
        this.$toast(res.error_message);
      }

      // console.log('专辑基础信息:', res.response_data);

      // 读取localStorage音频缩略播放器数据
      this.getMiniAudioData();
    },
    // 获取收藏接口信息
    collectAction(__type, __collectId, __goodsId) {
      if (__collectId > 0) {
        this.collectData(__type, "cancel", __goodsId);
      } else {
        this.collectData(__type, "collect", __goodsId);
      }
    },
    async collectData(__type, __status, __goodsId) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      // 出错提示
      switch (__status) {
        case "collect":
          data = {
            timestamp: tStamp,
            type: this.baseData.goods_type,
            target: __goodsId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_ADD(data);
          if (res.hasOwnProperty("response_code")) {
            if (__type == "base") {
              this.baseData.collect_id = 1;
            } else {
              this.simularStatus[__type].is_collect = 1;
            }
          } else {
            this.$toast(res.error_message);
          }
          this.baseData.collection_num++;
          // this.$toast("已收藏~");
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            goods_id: __goodsId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_CANCEL(data);
          if (res.hasOwnProperty("response_code")) {
            if (__type == "base") {
              this.baseData.collect_id = 0;
            } else {
              this.simularStatus[__type].is_collect = 0;
            }
            this.$toast("已取消收藏~");
          } else {
            this.$toast(res.error_message);
          }
          this.baseData.collection_num--;
          break;
      }
    },
    // 获取关注接口信息
    async focusData(__type) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_ADD(data);
          this.brandInfoData.is_followed = 1;
          this.brandInfoData.fans++;
          // this.$toast('已关注~');
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          this.brandInfoData.is_followed = 0;
          this.brandInfoData.fans--;
          this.$toast("已取消关注~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    focusAction() {
      if (this.brandInfoData.is_followed > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("focus");
      }
    },
    // tab切换
    tabChange(index, title) {
      this.activeKey = index;
    },
    // ----------------------------------评论------------------------------------
    commentLoad() {
      this.commentData();
    },
    async commentData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        page: this.commentPage,
        goods_id: parseInt(this.$route.query.goods_id),
        page_size: 10,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.discussData.push(result[i]);
            this.answerData.push(result[i].reply_list);
            this.replyPage.push(1);
            // console.log('评论：', result[i]);
          }
          // 加载状态结束
          this.commentLoading = false;
          this.commentPage++;

          // 数据全部加载完成
          if (this.commentPage > res.response_data.total_page) {
            this.commentFinished = true;
            this.commentPage = 1;
          }
        }, 600);

        // 设置总评论数
        this.totalCount = "评论 (" + res.response_data.total_count + ")";
        // console.log("当前页数组：", this.replyPage);
        // console.log("评论列表：", result);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 回复
    async replyData(comment_id, key) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        comment_pid: comment_id,
        page: this.replyPage[key],
        page_size: 10,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        for (let i = 0; i < result.length; i++) {
          this.answerData[key].push(result[i]);
        }
        if (this.replyPage[key] > res.response_data.total_page) {
          this.replyPage[key] = res.response_data.total_page + 1;
        } else {
          this.replyPage[key]++;
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 回复展开更多
    pageChange(comment_id, key) {
      this.replyData(comment_id, key);
      // console.log("当前页数组：", this.replyPage, 'key:', key);
    },
    // 关闭评论弹窗
    commentClose() {
      this.commentModel = false;
    },
    /*
     * __type = 'comment'; 新增评论
     * __type = 'reply';   新增回复
     */
    async addComment(__type) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      switch (__type) {
        case "comment":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.goods_id,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        case "reply":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.goods_id,
            comment_pid: this.commentId,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        default:
          break;
      }
      data.sign = this.$getSign(data);
      let res = await COMMENT_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.commentPage = 1;
        // 本地存储最新的数据，展示
        this.answerData = [];
        this.discussData = [];
        this.replyPage = [];
        this.commentData();
      } else {
        this.$toast(res.error_message);
      }
    },
    punishComment() {
      if (this.contentLength > this.contentTotal) {
        this.$toast("你发布的字数超出，请修改后再发布!");
        return;
      }
      if (this.contentLength == 0) {
        this.$toast("请输入你要发布的内容!");
        return;
      }
      this.commentModel = false;
      // this.discussData = [];
      this.addComment(this.punishType);
    },
    /*
     * __type: 'comment'; 评论，comment_id: null;
     * __type: 'reply'; 回复评论，comment_id: 必填;
     */
    openAnswer(__type, comment_id) {
      this.punishType = __type;
      if (__type == "reply") this.commentId = comment_id;
      this.commentModel = true;
    },
    // 编辑评论触发
    inputChange() {
      this.contentLength = this.contentModel.length;
    },
    // ----------------------------------节目------------------------------------
    // load
    programLoad() {
      // console.log("load");
      this.programData();
    },
    // 获取节目列表
    async programData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        goods_no: this.rankType,
        page: this.programPage,
        page_size: 10,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM_DETAIL(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;

        setTimeout(() => {
          // this.programList = [];
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.programList.push(result[i]);
            // 存放试听数据,只取第一条
            if (
              result[i].is_free &&
              result[i].goods_type != 6 &&
              this.preListen.length == 0
            ) {
              this.preListen = [];
              this.preListen.push(result[i]);
            }
          }

          // localStorage:audioProgress存放节目播放进度,根据pid创建数组，并存放至localStorage
          this.progressListData();

          // 设置迷你缩略音频播放信息
          this.getMiniAudioData();

          // 加载状态结束
          this.programLoading = false;
          this.programPage++;

          // 数据全部加载完成
          if (this.programPage > res.response_data.total_page) {
            this.programFinished = true;
            // this.programPage = 1;
          }
        }, 600);

        // 设置总节目数
        this.programTotalCount = res.response_data.total_count;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 读取localStorage：miniAudio音频缩略播放器数据
    getMiniAudioData() {
      // 设置迷你音频信息
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      // 解决子组件数据实时刷新问题
      if (this.$refs.control)
        this.$refs.control.audioData.type = !this.audioPlaying;

      if (info != null && info.length != 0) {
        // 当前goods_id与localStorage一致时,关联播放列表当前播放状态
        for (let i = 0; i < this.programList.length; i++) {
          var list = this.programList[i];
          if (list.goods_id == info[8]) {
            this.activeGoodNo = info[0];
          }
        }

        // 将当前音频播放信息存放到localStorage: miniAudio
        this.miniAudioData(info);
      }

      // 设置缩放音频当前播放进度
      setTimeout(() => {
        var audio = document.getElementById("myMiniAudio");

        // currentTime关联slider进度
        if (info != null && info[5] != null && info[5] != "") {
          if(this.$refs.control) this.$refs.control.audioData.sliderValue =
            (info[5] / audio.duration) * 100;
        }
        if (info != null && info[4] != null && info[4] != "") {
          if(this.$refs.control) this.$refs.control.audioSliderChange();
        }
      }, 600);

      // console.log("localStorage迷你音频信息:", info, "当前goodsNo:", this.activeGoodNo, "当前pid:", this.baseData.goods_id, "当前goodsId:", this.myAudioData.goodsId, "当前currentTime：", this.myAudioData.currentTime);
    },
    // 将当前音频播放信息存放到localStorage: miniAudio
    miniAudioData(info) {
      /*
       * __goodsNo节目编号
       * __pid当前节目对应专辑id，单个节目时pid为0
       * __pic专辑封面
       * __src音频地址
       * __duration音频时长，单位s
       * __currentTime音频当前播放位置，单位s
       * __program节目标题
       * __album专辑标题
       * __goodsId商品id
       * __albumPic专辑图片，无专辑为null
       */
      if (info != null && info.length > 0) {
        let __goodsNo = info[0];
        let __pid = info[1];
        let __pic = info[2];
        let __src = info[3];
        let __duration = info[4];
        let __currentTime = info[5];
        let __program = info[6];
        let __album = info[7];
        let __goodsId = info[8];
        let __albumPic = info[9];

        // 设置音频信息
        this.$set(this.myAudioData, "goodsNo", __goodsNo);
        this.$set(this.myAudioData, "pid", __pid);
        this.$set(this.myAudioData, "pic", __pic);
        this.$set(this.myAudioData, "src", __src);
        this.$set(this.myAudioData, "duration", __duration);
        this.$set(this.myAudioData, "currentTime", __currentTime);
        this.$set(this.myAudioData, "program", __program);
        this.$set(this.myAudioData, "album", __album);
        this.$set(this.myAudioData, "goodsId", __goodsId);
        this.$set(this.myAudioData, "albumPic", __albumPic);
        // console.logthis.myAudioData)

        // localStorage存储
        localStorage.setItem("miniAudio", JSON.stringify(info));

        // 解决父页面子组件实时刷新问题
        setTimeout(() => {
          if (this.$refs.control) {
            this.$refs.control.audioData.pic = __pic;
            this.$refs.control.audioData.src = __src;
            this.$refs.control.audioData.currentTime = __currentTime;
            this.$refs.control.audioData.duration = __duration;
            this.$refs.control.audioData.program = __program;
            this.$refs.control.audioData.album = __album;
            this.$refs.control.audioData.albumPic = __albumPic;
          }
        }, 600);

        if (info[3] == null) {
          $("#miniAudio").css("display", "none");
        } else {
          $("#miniAudio").css("display", "block");
        }
      }
    },
    // localStorage:audioProgress存放节目播放进度
    progressListData() {
      /*
       * __goodsId节目id
       * __goodsNo节目编号
       * __progress节目当前播放进度
       * __duration节目时长，单位s
       * __pid专辑id，单个节目pid默认为0
       */

      var result = JSON.parse(localStorage.getItem("audioProgress"));

      // 临时存放节目进度
      this.progressList = [];

      for (let i = 0; i < this.programList.length; i++) {
        this.progressList.push(this.programList[i]);
        // console.log(this.programList[i])
        if (result != null && result.length > 0) {
          for (let j = 0; j < result.length; j++) {
            // 当节目播放进度存在localStorage时,显示已播放进度
            if (
              result[j].pid == this.baseData.goods_id &&
              result[j].goods_id == this.programList[i].goods_id
            ) {
              this.$set(
                this.progressList[i],
                "progressHistory",
                result[j].progress
              );
            }
          }
        }
      }
    },
    // 将当前专辑节目列表播放进度信息存放到localStorage
    audioProgressData(result) {
      /*
       * __goodsId专辑id
       * __goodsNo节目编号
       * __progress节目当前播放进度
       * __duration节目时长，单位s
       * __pid专辑id，单个节目pid默认为0
       */

      // localStorage存储
      localStorage.setItem("audioProgress", JSON.stringify(result));

      // console.log('进度记录:', result);
    },
    // 播放记录
    historyAction() {
      this.showHistory = false;
    },
    // 排序
    rankAction() {
      this.rankType = this.rankType == 1 ? 0 : 1;
      // 实时刷新先置空
      this.programList = [];
      // 分页状态重置
      this.programPage = 1;
      this.programFinished = false;
    },
    // 节目列表播放/暂停音频
    audioAction(item) {
      // console.log(item);
      // 未支付
      if (item.goods_id != null && item.is_payed == 0 && item.is_free == 0) {
        var _goodsId = null;
        if (this.baseData.sale_style == 1) {
          _goodsId = this.baseData.goods_id;
        } else {
          _goodsId = item.goods_id;
        }
        this.$router.push({
          name: "payaccount",
          query: { goods_id: _goodsId }
        });
        return;
      }

      let __goodsNo = item.goods_no;
      let __pid = this.baseData.goods_id ? this.baseData.goods_id : 0;
      let __pic = item.pic;
      let __src = item.file_path;
      let __duration = item.duration;
      // 获取当前节目播放进度
      // ??????????????????????
      let __currentTime = this.getAudioProgress(item);
      let __program = item.title;
      let __album = this.baseData.title;
      let __goodsId = item.goods_id;
      let __albumPic = this.baseData.pic[0];

      // console.log( this.baseData)

      // 判断是否点击当前或者第一次点击
      if (this.activeGoodNo == __goodsNo || this.activeGoodNo == null) {
        this.audioPlaying = !this.audioPlaying;
      } else {
        this.audioPlaying = true;
      }

      // 父页面关联子组件
      setTimeout(() => {
        if (this.audioPlaying) {
          this.$refs.control.playAudio(__currentTime);
          // 设置全部播放状态
          this.allPlayStatus = "pause";
        } else {
          this.$refs.control.pauseAudio();
          this.allPlayStatus = "continue";
        }
      }, 600);

      // console.log(__currentTime)

      // 管理子组件播放状态
      this.activeGoodNo = __goodsNo;
      // 解决子组件数据实时刷新问题
      this.$refs.control.audioData.type = !this.audioPlaying;

      // 将当前音频播放信息存放到localStorage: miniAudio
      var info = [
        __goodsNo,
        __pid,
        __pic,
        __src,
        __duration,
        __currentTime,
        __program,
        __album,
        __goodsId,
        __albumPic
      ];
      this.miniAudioData(info);
    },
    // 获取当前节目播放进度
    getAudioProgress(item) {
      var pid = this.baseData.goods_id;
      var goods_no = item.goods_no;
      var goods_id = item.goods_id;
      var result = JSON.parse(localStorage.getItem("audioProgress"));
      // 默认从0播放,如果localStorage有播放进度记录则从记录处播放
      var __currentTime = 0;

      if (result != null && result.length > 0) {
        // 遍历localStorage中记录进度的数组，获取当前节目当前进度
        for (let i = 0; i < result.length; i++) {
          if (goods_id == result[i].goods_id && pid == result[i].pid) {
            __currentTime = result[i].progress;
          }
        }
      }

      // 如果当前节目有播放记录，跳到当前记录位置继续播放
      return __currentTime;
    },
    // 点击播放，子组件关联父页面 - 切换miniAudio组件播放状态
    typeAction(__type) {
      /*
       * __type == true; 播放
       * __type == false; 暂停
       */
      // 关联节目列表播放状态
      this.myAudioData.type = __type;
      this.audioPlaying = !__type;
    },
    // --------------------------------播放列表----------------------------------
    audioListShow(__type) {
      this.$refs.controlList.popupModel = true;
      // 关联播放列表
      this.$refs.controlList.goodsNo = this.activeGoodNo;
    },
    gotoPlayer(queryData) {
      this.$router.push({name: "player", query: {isLogin: this.isLogin}});
    },
    // 点击试听
    preListenAction() {
      if (this.preListen != null && this.preListen.length > 0) {
        this.$router.push({
          name: "albumdetail",
          query: {
            pid: this.baseData.goods_id,
            goods_id: this.preListen[0].goods_id,
            goods_no: this.preListen[0].goods_no
          }
        });
      } else {
        this.$toast("无试听节目~");
      }
    },
    // 当前节目播放结束，获取当前播放节目的专辑下所有节目（不分页）
    getAllProgramData(info) {
      this.allProgramData(info, "end");
    },
    async allProgramData(info, actionType) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        goods_no: this.rankType,
        page_size: 1000000000000000,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM_DETAIL(data);

      // 存储当前节目的下一项
      var next;
      this.allProgramList = [];

      if (res.hasOwnProperty("response_code")) {
        var type1 = 0;
        var type2 = 0;
        var type3 = 0;
        // 异步更新数据
        var result = res.response_data.result;

        for (let i = 0; i < res.response_data.result.length; i++) {
          var type = result[i].goods_type;
          if (type == 1) type1 = 1;
          if (type == 2) type2 = 1;
          if (type == 6) type3 = 1;
          // 不包含文章类型
          if (result[i].goods_type != 6) {
            this.allProgramList.push(result[i]);
          }
          if (
            info != null &&
            info.length > 0 &&
            result[i].goods_no == info[0]
          ) {
            next = i + 1;
          }
        }

        // 专辑is_payed:0未支付；1已支付，is_freeL:0不免费，1免费，未支付不能自动播放
        if (
          eval(type1 + type2 + type3) > 1 ||
          (this.baseData.is_free == 0 &&
            this.baseData.is_payed == 0 &&
            this.baseData.sale_style == 1)
        ) {
          this.autoPlay = false;
        } else {
          this.autoPlay = true;
        }

        var count = this.allProgramList.length;
        next = next > count - 1 ? 0 : next;

        // 当点击全部播放，从第一条开始播放
        if (actionType == "all") next = 0;
      } else {
        this.$toast(res.error_message);
      }

      if (this.autoPlay) {
        // 单一类型，自动播放
        this.updateLocalStorage(this.allProgramList[next]);
        // console.log("当前播放的下一项：", this.allProgramList[next]);
        // console.log("单一类型，自动播放");
      } else {
        this.$refs.control.pauseAudio();
        this.allPlayStatus = "pause";
        // 含多种类型，不自动播放
        this.$toast("含多种类型或者专辑未支付，不自动播放");
      }
    },
    // 更新localStorage数据
    updateLocalStorage(item) {
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      if (info == null) info = [];
      info[0] = item.goods_no;
      info[3] = item.file_path;
      info[4] = item.duration;
      info[5] = 0;
      info[6] = item.title;
      info[8] = item.goods_id;
      this.activeGoodNo = info[0];

      localStorage.setItem("miniAudio", JSON.stringify(info));

      // 更新播放器当前播放音频
      this.miniAudioData(info);
      setTimeout(() => {
        this.$refs.control.playAudio(0);
      }, 600);
    },
    // 全部播放
    allAction() {
      if (this.baseData.is_free == 0 && this.baseData.is_payed == 0) {
        this.$toast("专辑收费~");
        return;
      }
      // 全部播放
      if (this.allPlayStatus == "play") {
        this.allPlayStatus = "pause";
        var info = JSON.parse(localStorage.getItem("miniAudio"));
        // 从第一条开始播放，是否自动播放规则同上
        this.allProgramData(info, "all");
      }
      // 暂停播放
      else if (this.allPlayStatus == "pause") {
        this.allPlayStatus = "continue";
        this.$refs.control.pauseAudio();
      }
      // 继续播放
      else {
        this.allPlayStatus = "pause";
        this.$refs.control.playAudio(null);
      }
    },
    // 购买
    buyAction(goodsId) {
      if (goodsId != null)
        this.$router.push({
          name: "payaccount",
          query: { goods_id: goodsId }
        });
    },
    // --------------------------------相似----------------------------------
    // load
    recommendLoad() {
      this.recommendData();
      console.log(999, this.activeKey);
    },
    async recommendData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        page: this.recommendPage,
        page_size: 10,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await RECOMMEND(data);
      console.log(666, res);
      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.recommendList.push(result[i]);
            // 存放相似收藏状态/临时数据
            this.simularStatus.push(result[i]);
          }

          // 加载状态结束
          this.recommendLoading = false;
          this.recommendPage++;

          // 数据全部加载完成
          if (this.recommendPage > res.response_data.total_page) {
            this.recommendFinished = true;
            this.recommendPage = 1;
          }
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 相似
    gotoLink(goodsId) {
      this.$router.replace({
        name: "album",
        query: { goods_id: goodsId }
      });
      window.location.reload();
    }
  }
};
</script>