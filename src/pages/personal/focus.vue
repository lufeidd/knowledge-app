<template>
  <div id="focusPage">
    <!-- <div class="msgBox">已有23家自媒体更新了内容</div> -->

    <div class="nullBox" v-if="focusList.length == 0">
      <img src="./../../assets/null/list.png" width="100%">
      <div>还没有关注的内容，快去看看吧~</div>
    </div>

    <van-list
      v-else
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
        <div class="listBox" v-if="focusStatus[key].brand_id != null">
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.header_pic">
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">{{ item.brand_name }}</div>
            <div class="subTitle">已被{{ item.fans_num }}人关注</div>
            <div class="new">
              <span class="text">更新</span>
              <span class="count">+{{ item.update_num }}</span>
            </div>
          </div>
        </div>
        <span v-if="focusStatus[key].brand_id != null" slot="right" @click="focusCancel(item.brand_id, key)">
          <div>取消关注</div>
        </span>
      </van-swipe-cell>
    </van-list>
  </div>
</template>

<style src="@/style/scss/pages/personal/focus.scss" scoped lang="scss"></style>

<script>
//  引入接口
import { FOCUS, FOCUS_CANCEL } from "../../apis/public.js";

export default {
  data() {
    return {
      focusList: [],
      // 临时存放关注数据
      focusStatus: [],
      focusLoading: false,
      focusFinished: false,
      focusPage: 1
    };
  },
  mounted() {
    this.focusData("focus", null, null);
  },
  methods: {
    focusLoad() {
      this.focusData("focus", null, null);
    },
    // 获取关注接口信息
    async focusData(__type, brandId, key) {
      var data = {};
      var res;
      switch (__type) {
        case "focus":
          data = {
            page: this.focusPage,
            page_size: 4,
            version: "1.0"
          };
          res = await FOCUS(data);

          // 出错提示
          if (res.hasOwnProperty("response_code")) {
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
              if (this.focusList.length >= res.response_data.total_count) {
                this.focusFinished = true;
              }
              console.log("关注列表：", result);
            }, 500);
          } else {
            this.$toast(res.error_message);
          }
          break;
        case "cancel":
          data = {
            brand_id: brandId,
            version: "1.0"
          };
          res = await FOCUS_CANCEL(data);// 出错提示
          if (res.hasOwnProperty("response_code")) {
            this.focusStatus[key].brand_id = null;
            if(this.focusStatus.length == 1) {
              this.focusList = [];
            }
            this.$toast("已取消关注~");
          }else{

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
