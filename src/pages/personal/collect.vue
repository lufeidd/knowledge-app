<template>
  <div id="collectPage">
    <div
      class="nullBox"
      v-if="collectFinished && collectList.length == 0 || collectStatus.length == 1 && collectStatus[0].id == null"
    >
      <img src="./../../assets/null/list.png" width="100%">
      <div>还没有收藏的内容，快去看看吧~</div>
    </div>
    <van-list
      v-else
      v-model="collectLoading"
      :finished="collectFinished"
      finished-text="没有更多了"
      @load="collectLoad"
    >
      <van-swipe-cell
        v-for="(item, key) in collectList"
        :key="key"
        :right-width="65"
        :left-width="0"
        :on-close="collectClose"
      >
        <!-- 音频 -->
        <router-link
          v-if="collectStatus[key].id != null && item.type == 1"
          :to="{name: 'albumdetail', params: {goods_id: item.target}}"
          class="listBox"
        >
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.pic">
                <!-- <div class="tip">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-sound-line"></use>
                  </svg>
                  {{ item.collect }}
                </div>-->
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.sub_title }}</div>
            <div class="info">
              <span class="time">{{ item.update_time }}更新</span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <!-- 视频 -->
        <router-link
          v-if="collectStatus[key].id != null && item.type == 2"
          :to="{name: 'albumdetail', params: {goods_id: item.target}}"
          class="listBox"
        >
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.pic">
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.sub_title }}</div>
            <div class="info">
              <span class="time">{{ item.update_time }}更新</span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <!-- 专辑 -->
        <router-link
          v-if="collectStatus[key].id != null && item.type == 9"
          :to="{name: 'album', params: {goods_id: item.target}}"
          class="listBox"
        >
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.pic">
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.sub_title }}</div>
            <div class="info">
              <span class="time">{{ item.update_time }}更新</span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <!-- 文章 -->
        <router-link
          v-if="collectStatus[key].id != null && item.type == 6"
          :to="{name: 'article', params: {goods_id: item.target}}"
          class="listBox"
        >
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.pic">
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.sub_title }}</div>
            <div class="info">
              <span class="time">{{ item.update_time }}更新</span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>

        <span
          v-if="collectStatus[key].id != null"
          slot="right"
          @click="collectCancel(item.target, key)"
        >
          <div>取消收藏</div>
        </span>
      </van-swipe-cell>
    </van-list>
    <!-- 快速导航 -->
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/collect.scss" scoped lang="scss"></style>

<script>
import easyNav from "./../../components/easyNav";
//  引入接口
import { COLLECT, COLLECT_ADD, COLLECT_CANCEL } from "../../apis/public.js";
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
      collectList: [],
      // 临时存放收藏数据
      collectStatus: [],
      collectLoading: false,
      collectFinished: false,
      collectPage: 1
    };
  },
  mounted() {
    this.collectData("collect", null, null);
  },
  methods: {
    collectLoad() {
      this.collectData("collect", null, null);
    },
    // 获取收藏接口信息
    async collectData(__type, goodsId, key) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      switch (__type) {
        case "collect":
          data = {
            timestamp: tStamp,
            page: this.collectPage,
            page_size: 10,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT(data);

          // 出错提示
          if (res.hasOwnProperty("response_code")) {
            setTimeout(() => {
              var result = res.response_data.result;
              for (let i = 0; i < result.length; i++) {
                this.collectList.push(result[i]);
                this.collectStatus.push(result[i]);
              }
              // 加载状态结束
              this.collectLoading = false;
              this.collectPage++;
              // 数据全部加载完成
              if (this.collectList.length >= res.response_data.total_count) {
                this.collectFinished = true;
                this.collectPage = 1;
              }
              // console.log("收藏列表：", result);
            }, 500);
          } else {
            this.$toast(res.error_message);
          }
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            goods_id: goodsId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_CANCEL(data);

          // 出错提示
          if (res.hasOwnProperty("response_code")) {
            this.collectStatus[key].id = null;
            if (this.collectStatus.length == 1) {
              this.collectList = [];
            }
            this.$toast("已取消收藏~");
          } else {
            this.$toast(res.error_message);
          }
          break;
      }
    },
    // 取消收藏
    collectCancel(goodsId, key) {
      this.collectData("cancel", goodsId, key);
    },
    collectClose(clickPosition, instance) {
      instance.close();
    }
  }
};
</script>
