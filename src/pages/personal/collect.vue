<template>
  <div id="collectPage">
    <div class="nullBox" v-if="collectList.length == 0">
      <img src="./../../assets/null/list.png" width="100%">
      <div>还没有收藏的内容，快去看看吧~</div>
    </div>
    <van-list
      v-else
      v-model="collectLoading"
      :finished="collectFinished"
      finished-text="没有更多了"
      @load="collectLoad"
      v-for="(item, key) in collectList"
      :key="key"
    >
      <van-swipe-cell :right-width="65" :left-width="0" :on-close="collectClose">
        <router-link to="/" class="listBox">
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
        <span slot="right">
          <div>取消收藏</div>
        </span>
      </van-swipe-cell>
    </van-list>
  </div>
</template>

<style src="@/style/scss/pages/personal/collect.scss" lang="scss"></style>

<script>
//  引入接口
import { COLLECT, COLLECT_ADD } from "../../apis/public.js";
export default {
  data() {
    return {
      collectList: [],
      collectLoading: false,
      collectFinished: false,
      collectPage: 1,
    };
  },
  mounted() {
    this.collectData("collect", null);
  },
  methods: {
    collectLoad() {
      this.collectData("collect", null);
    },
    // 获取收藏接口信息
    async collectData(__type, brandId) {
      var data = {};
      var res;
      switch (__type) {
        case "collect":
          data = {
            page: this.collectPage,
            page_size: 4,
            version: "1.0"
          };
          res = await COLLECT(data);
          setTimeout(() => {
            var result = res.response_data.result;
            for (let i = 0; i < result.length; i++) {
              this.collectList.push(result[i]);
            }
            // 加载状态结束
            this.collectLoading = false;
            this.collectPage++;
            // 数据全部加载完成
            if (this.collectList.length >= res.response_data.total_count) {
              this.collectFinished = true;
            }
            console.log("收藏列表：", result);
          }, 500);
          break;
        case "cancel":
          data = {
            brand_id: brandId,
            version: "1.0"
          };
          res = await COLLECT_CANCEL(data);
          this.$toast("已取消收藏~");
          break;
      }

      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    // 取消收藏
    collectCancel(brandId) {
      this.collectData("cancel", brandId);
    },
    collectClose(clickPosition, instance) {
      instance.close();
    }
  }
};
</script>
