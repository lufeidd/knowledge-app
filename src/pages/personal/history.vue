<template>
  <div id="historyPage">
    <div class="nullBox" v-if="historyFinished && historyList.length == 0">
      <img src="./../../assets/null/list.png" width="100%">
      <div>还没有历史的内容，快去看看吧~</div>
    </div>
    <van-list
      v-else
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
        <router-link v-if="historyStatus[key].id != null" to="/" class="listBox">
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.data.pic">
                <!-- <div class="tip">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-sound-line"></use>
                  </svg>
                  {{ item.focus }}
                </div>-->
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">{{ item.data.title }}</div>
            <div class="subTitle">{{ item.data.subTitle }}</div>
            <div class="info">
              <span class="type" v-if="item.type == 'artical'">文章</span>
              <span class="type" v-if="item.type == 'audio'">音频</span>
              <span class="type" v-if="item.type == 'video'">视频</span>
              <span class="count">
                <svg class="icon" aria-hidden="true" v-if="item.type == 'artical'">
                  <use xlink:href="#icon-eye-line"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="item.type == 'audio'">
                  <use xlink:href="#icon-audio-line"></use>
                </svg>
                <svg class="icon" aria-hidden="true" v-if="item.type == 'video'">
                  <use xlink:href="#icon-video-line"></use>
                </svg>
                {{ item.data.play_num }}
              </span>
              <span class="time">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-time-line"></use>
                </svg>
                {{ item.data.create_time }}
              </span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <span
          v-if="historyStatus[key].id != null"
          slot="right"
          @click="historyCancel(item.data.target, key)"
        >
          <div>取消历史</div>
        </span>
      </van-swipe-cell>
    </van-list>
    <!-- 快速导航 -->
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/history.scss" scoped lang="scss"></style>

<script>
import easyNav from "./../../components/easyNav";
//  引入接口
import { USER_HISTORY, USER_HISTORY_CANCEL } from "../../apis/user.js";

export default {
  components: {
    easyNav
  },
  data() {
    return {
      // 快速导航
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: false,
        personal: true,
        personalLink: "/personal/index"
      },
      historyList: [],
      // 临时存放关注数据
      historyStatus: [],
      historyLoading: false,
      historyFinished: false,
      historyPage: 1
    };
  },
  mounted() {
    this.historyData("history", null, null);
  },
  methods: {
    historyLoad() {
      this.historyData("history", null, null);
    },
    // 获取历史接口信息
    async historyData(__type, brandId, key) {
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
          if (res.hasOwnProperty("response_code")) {
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
              if (this.historyList.length >= res.response_data.total_count) {
                this.historyFinished = true;
              }
              console.log("历史列表：", result);
            }, 500);
          } else {
            this.$toast(res.error_message);
          }
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: brandId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await USER_HISTORY_CANCEL(data);

          if (res.hasOwnProperty("response_code")) {
            this.historyStatus[key].id = null;
            if (this.historyStatus.length == 1) {
              this.historyList = [];
            }
            this.$toast("已取消历史~");
          } else {
            this.$toast(res.error_message);
          }
          break;
      }
    },
    // 取消历史
    historyCancel(brandId, key) {
      this.historyData("cancel", brandId, key);
    },
    historyClose(clickPosition, instance) {
      instance.close();
    }
  }
};
</script>
