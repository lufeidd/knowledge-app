<template>
  <div id="collectPage">
    <div class="nullBox" v-if="collectFinished && collectList.length == 0">
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
        <template v-if="collectStatus[key].target != null">
          <!-- 音频/视频 -->
          <router-link
            v-if="item.type == 1 || item.type == 2"
            :to="{name: 'albumdetail', query: {goods_id: item.target}}"
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
            v-if="item.type == 9"
            :to="{name: 'album', query: {goods_id: item.target}}"
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
            v-if="item.type == 6"
            :to="{name: 'article', query: {goods_id: item.target}}"
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
        </template>

        <span slot="right" @click="collectCancel(item.target, key)">
          <div>取消收藏</div>
        </span>
      </van-swipe-cell>
    </van-list>
    <!-- 快速导航 -->
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand"></EazyNav>
    
  </div>
</template>

<style src="@/style/scss/pages/personal/collect.scss" scoped lang="scss"></style>

<script>
// import easyNav from "./../../components/easyNav";
//  引入接口
import { COLLECT, COLLECT_ADD, COLLECT_CANCEL } from "../../apis/public.js";
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
      collectList: [],
      // 临时存放收藏数据
      collectStatus: [],
      collectLoading: false,
      collectFinished: false,
      collectPage: 1
    };
  },
  mounted() {},
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
          if (
            res.hasOwnProperty("response_code") &&
            res.response_data.hasOwnProperty("result")
          ) {
            // store 设置登录状态
            this.$store.commit("changeLoginState", 1);
            localStorage.setItem("loginState", 1);
            
            setTimeout(() => {
              var result = res.response_data.result;

              for (let i = 0; i < result.length; i++) {
                this.collectList.push(result[i]);
                this.collectStatus.push(result[i]);
              }

              // console.log(this.collectList)
              // 加载状态结束
              this.collectLoading = false;
              this.collectPage++;
              // 数据全部加载完成

              if (this.collectPage > res.response_data.total_page) {
                this.collectFinished = true;
              }
            }, 500);
          } else {
            if (res.hasOwnProperty("error_code") && res.error_code == 100) {
              // store 设置登录状态
              this.$store.commit("changeLoginState", 100);
              localStorage.setItem("loginState", 100);
              
            }
            this.collectFinished = true;
            // this.$toast(res.error_message);
          }
          break;

        // console.log("收藏列表：", this.collectList);
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
            this.collectStatus[key].target = null;
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
