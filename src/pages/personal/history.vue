<template>
  <div id="historyPage">
    <div class="nullBox" v-if="historyFinished && historyList.length == 0">
      <img src="./../../assets/null/list.png" width="100%" />
      <div>还没有历史的内容，快去看看吧~</div>
    </div>
    <div v-else>
      <van-list
        v-model="historyLoading"
        :finished="historyFinished"
        finished-text="没有更多了"
        @load="historyLoad"
      >
        <van-swipe-cell
          v-for="(item, key) in historyList"
          :key="key"
          :right-width="65"
          :left-width="0"
          :on-close="historyClose"
        >
          <template v-if="historyStatus[key].id != null">
            <!-- 音频/视频 -->
            <router-link
              v-if="item.type == 1 || item.type == 2"
              :to="{name: 'albumdetail', query: {goods_id: item.target}}"
              class="listBox"
            >
              <div class="left">
                <!-- <div class="ratioBox">
                <div class="box">
                  <img :src="item.data.pic[0]">
                </div>
                </div>-->
                <div class="ratiobox">
                  <div class="boxImg" v-lazy:background-image="item.data.pic[0]"></div>
                </div>
              </div>
              <div class="center">
                <div class="title">{{ item.data.title }}</div>
                <div class="subTitle">{{ item.data.subTitle }}</div>
                <div class="info">
                  <span class="type" v-if="item.type == 1">音频</span>
                  <span class="type" v-if="item.type == 2">视频</span>
                  <span class="count">
                    <svg class="icon" aria-hidden="true" v-if="item.type == 1">
                      <use xlink:href="#icon-audio-line" />
                    </svg>
                    <svg class="icon" aria-hidden="true" v-if="item.type == 2">
                      <use xlink:href="#icon-video-line" />
                    </svg>
                    {{ item.data.play_num }}
                  </span>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line" />
                    </svg>
                    {{ item.data.update_time }}
                  </span>
                </div>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </div>
            </router-link>
            <!-- 专辑 -->
            <router-link
              v-if="item.type == 9"
              :to="{name: 'album', query: {goods_id: item.target}}"
              class="listBox"
            >
              <div class="left">
                <div class="ratiobook">
                  <div class="bookImg" v-lazy:background-image="item.data.pic[0]"></div>
                </div>
              </div>
              <div class="center">
                <div class="title">{{ item.data.title }}</div>
                <div class="subTitle">{{ item.data.subTitle }}</div>
                <div class="info">
                  <span class="type">专辑</span>
                  <span class="count">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-eye-line" />
                    </svg>
                    {{ item.data.play_num }}
                  </span>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line" />
                    </svg>
                    {{ item.data.update_time }}
                  </span>
                </div>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </div>
            </router-link>
            <!-- 文章 -->
            <router-link
              v-if="item.type == 6"
              :to="{name: 'article', query: {goods_id: item.target}}"
              class="listBox"
            >
              <div class="left">
                <div class="ratiobox">
                  <div class="boxImg" v-lazy:background-image="item.data.pic[0]"></div>
                </div>
              </div>
              <div class="center">
                <div class="title">{{ item.data.title }}</div>
                <div class="subTitle">{{ item.data.subTitle }}</div>
                <div class="info">
                  <span class="type" v-if="item.type == 6">文章</span>
                  <span class="count">
                    <svg class="icon" aria-hidden="true" v-if="item.type == 6">
                      <use xlink:href="#icon-eye-line" />
                    </svg>
                    {{ item.data.play_num }}
                  </span>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line" />
                    </svg>
                    {{ item.data.update_time }}
                  </span>
                </div>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </div>
            </router-link>
            <!-- 纸质书 -->
            <router-link
              v-if="item.type == 3"
              :to="{name: 'detail', query: {goods_id: item.target}}"
              class="listBox"
            >
              <div class="left">
                <div class="ratiobook">
                  <div class="bookImg" v-lazy:background-image="item.data.pic[0]"></div>
                </div>
              </div>
              <div class="center">
                <div class="title">{{ item.data.title }}</div>
                <div class="subTitle">{{ item.data.subTitle }}</div>
                <div class="info">
                  <span class="type" v-if="item.type == 3">图书</span>
                  <!-- <span class="count">
                  <svg class="icon" aria-hidden="true" v-if="item.type == 3">
                    <use xlink:href="#icon-eye-line"></use>
                  </svg>
                  {{ item.data.play_num }}
                  </span>-->
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line" />
                    </svg>
                    {{ item.data.update_time }}
                  </span>
                </div>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </div>
            </router-link>
            <!-- 电子书 -->
            <router-link
              v-if="item.type == 4"
              :to="{name: 'ebookdetail', query: {goods_id: item.target}}"
              class="listBox"
            >
              <div class="left">
                <div class="ratioebook">
                  <div class="ebookImg" v-lazy:background-image="item.data.pic[0]"></div>
                </div>
              </div>
              <div class="center">
                <div class="title">{{ item.data.title }}</div>
                <div class="subTitle">{{ item.data.subTitle }}</div>
                <div class="info">
                  <span class="type" v-if="item.type == 4">电子书</span>
                  <span class="count">
                    <svg class="icon" aria-hidden="true" v-if="item.type == 4">
                      <use xlink:href="#icon-eye-line" />
                    </svg>
                    {{ item.data.read_num }}
                  </span>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line" />
                    </svg>
                    {{ item.data.update_time }}
                  </span>
                </div>
              </div>
              <div class="right">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-next-line" />
                </svg>
              </div>
            </router-link>
          </template>

          <span slot="right" @click="historyCancel(item.id, key)">
            <div>删除历史</div>
          </span>
        </van-swipe-cell>
      </van-list>
    </div>
    <CopyRight></CopyRight>
    <!-- 快速导航 -->
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/personal/history.scss" scoped lang="scss"></style>

<script>
// import easyNav from "./../../components/easyNav";
//  引入接口
import { USER_HISTORY, USER_HISTORY_CANCEL } from "../../apis/user.js";

export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // 快速导航
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   personal: true,
      //   personalLink: "/personal/index"
      // },
      historyList: [],
      // 临时存放关注数据
      historyStatus: [],
      historyLoading: false,
      historyFinished: false,
      historyPage: 1
    };
  },
  mounted() {
    // this.historyData("history", null, null);
  },
  methods: {
    historyLoad() {
      this.historyData("history", null, null);
    },
    // 获取历史接口信息
    async historyData(__type, historyId, key) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      switch (__type) {
        case "history":
          data = {
            timestamp: tStamp,
            page: this.historyPage,
            page_size: 10,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await USER_HISTORY(data);

          // 出错提示
          if (
            res.hasOwnProperty("response_code") &&
            res.response_data.hasOwnProperty("result")
          ) {
            setTimeout(() => {
              var result = res.response_data.result;

              for (let i = 0; i < result.length; i++) {
                this.historyList.push(result[i]);
                this.historyStatus.push(result[i]);
              }
              // 加载状态结束
              this.historyLoading = false;
              this.historyPage++;
              // 数据全部加载完成
              if (this.historyPage > res.response_data.total_page) {
                this.historyFinished = true;
              }
              console.log("历史列表：", result);
            }, 500);
          } else {
            this.historyFinished = true;
            // this.$toast(res.error_message);
          }
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            history_id: historyId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await USER_HISTORY_CANCEL(data);

          if (res.hasOwnProperty("response_code")) {
            this.historyStatus[key].id = null;
            if (this.historyStatus.length == 1) {
              this.historyList = [];
            }
            this.$toast("已删除历史~");
          } else {
            this.$toast(res.error_message);
          }
          break;
      }
    },
    // 删除历史
    historyCancel(historyId, key) {
      this.historyData("cancel", historyId, key);
    },
    historyClose(clickPosition, instance) {
      instance.close();
    }
  }
};
</script>
