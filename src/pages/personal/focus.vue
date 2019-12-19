<template>
  <div id="focusPage">
    <!-- <div class="msgBox">已有23家自媒体更新了内容</div> -->

    <div class="nullBox" v-if="focusFinished && focusList.length == 0">
      <img src="./../../assets/null/list.png" width="100%" />
      <div>还没有关注的内容，快去看看吧~</div>
    </div>
    <div v-else>
      <van-list
        v-model="focusLoading"
        :finished="focusFinished"
        finished-text="没有更多了"
        @load="focusLoad"
      >
        <van-swipe-cell
          :right-width="65"
          :left-width="0"
          :on-close="focusClose"
          v-for="(item, key) in focusList"
          :key="key"
        >
          <div
            @click="gotoBrand(item.brand_id, item.brand_name)"
            class="listBox"
            v-if="focusStatus[key].brand_id != null"
          >
            <div class="left">
              <div class="ratioBox">
                <div class="box">
                  <img :src="item.header_pic" />
                </div>
              </div>
            </div>
            <div class="right">
              <div class="title">{{ item.brand_name }}</div>
              <div class="subTitle">已被{{ item.fans_num }}人关注</div>
              <!-- <div class="new">
              <span class="text">更新</span>
              <span class="count">+{{ item.update_num }}</span>
              </div>-->
            </div>
            <div class="left" style="flex-basis: 0;margin-right: 10px;">
              <svg class="icon" aria-hidden="true" style="width: 14px;height: 14px;color: #ccc;">
                <use xlink:href="#icon-next-line" />
              </svg>
            </div>
          </div>
          <span slot="right" @click="focusCancel(item.brand_id, key)">
            <div>取消关注</div>
          </span>
        </van-swipe-cell>
      </van-list>
    </div>

    <CopyRight></CopyRight>
    <!-- 快速导航 -->
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/focus.scss" scoped lang="scss"></style>

<script>
// import easyNav from "./../../components/easyNav";
//  引入接口
import { FOCUS, FOCUS_CANCEL } from "../../apis/public.js";
import { truncate } from "fs";

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
      focusList: [],
      // 临时存放关注数据
      focusStatus: [],
      focusLoading: false,
      focusFinished: false,
      focusPage: 1
    };
  },
  methods: {
    focusLoad() {
      this.focusData("focus", null, null);
    },
    gotoBrand(brandId, brandName) {
      this.$router.push({ name: "brand", query: { brand_id: brandId } });
    },
    // 获取关注接口信息
    async focusData(__type, brandId, key) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            page: this.focusPage,
            page_size: 10,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS(data);
          console.log("关注列表：", res.response_data);

          // 出错提示
          if (
            res.hasOwnProperty("response_code") &&
            res.response_data.hasOwnProperty("result")
          ) {
            setTimeout(() => {
              var result = res.response_data.result;
              for (let i = 0; i < result.length; i++) {
                this.focusList.push(result[i]);
                this.focusStatus.push(result[i]);
              }
              // 加载状态结束
              this.focusLoading = false;
              this.focusPage++;
              // 数据全部加载完成
              if (this.focusPage > res.response_data.total_page) {
                this.focusFinished = true;
              }
            }, 500);
          } else {
            this.focusFinished = true;
            // this.$toast(res.error_message);
          }
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: brandId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data); // 出错提示
          if (res.hasOwnProperty("response_code")) {
            this.focusStatus[key].brand_id = null;
            if (this.focusStatus.length == 1) {
              this.focusList = [];
            }
            this.$toast("已取消关注~");
          } else {
            this.$toast(res.error_message);
          }
          break;
      }
    },
    // 取消关注
    focusCancel(brandId, key) {
      this.focusData("cancel", brandId, key);
    },
    focusClose(clickPosition, instance) {
      instance.close();
    }
  }
};
</script>
