<template>
  <div id="historyPage">
    <div class="nullBox" v-if="historyList.length == 0">
      <img src="./../../assets/null/list.png" width="100%">
      <div>还没有历史的内容，快去看看吧~</div>
    </div>
    <van-list
      v-else
      v-model="historyLoading"
      :finished="historyFinished"
      finished-text="没有更多了"
      @load="historyLoad"
      v-for="(item, key) in historyList"
      :key="key"
    >
      <van-swipe-cell :right-width="65" :left-width="0" :on-close="historyClose">
        <router-link to="/" class="listBox">
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.imgSrc">
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
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.subTitle }}</div>
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
                {{ item.count }}
              </span>
              <span class="time">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-time-line"></use>
                </svg>
                {{ item.time }}
              </span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <span slot="right">
          <div>取消历史</div>
        </span>
      </van-swipe-cell>
    </van-list>
  </div>
</template>

<style src="@/style/scss/pages/personal/history.scss" lang="scss"></style>

<script>
//  引入接口
import { USER_HISTORY, USER_HISTORY_CANCEL } from "../../apis/user.js";

export default {
  data() {
    return {
      historyList: [],
      historyLoading: false,
      historyFinished: false,
      historyPage: 1
    };
  },
  mounted() {
    this.historyData("history", null);
  },
  methods: {
    historyLoad() {
      this.historyData("history", null);
    },
    // 获取历史接口信息
    async historyData(__type, brandId) {
      var data = {};
      var res;
      switch (__type) {
        case "history":
          data = {
            page: this.historyPage,
            page_size: 4,
            version: "1.0"
          };
          res = await USER_HISTORY(data);
          setTimeout(() => {
            var result = res.response_data.result;
            for (let i = 0; i < result.length; i++) {
              this.historyList.push(result[i]);
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
          break;
        case "cancel":
          data = {
            brand_id: brandId,
            version: "1.0"
          };
          res = await USER_HISTORY_CANCEL(data);
          this.$toast("已取消历史~");
          break;
      }

      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    // 取消历史
    historyCancel(brandId) {
      this.historyData("cancel", brandId);
    },
    historyClose(clickPosition, instance) {
      instance.close();
    }
  }
};
</script>
