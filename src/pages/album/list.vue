<template>
  <van-popup v-model="popupModel" position="bottom">
    <div id="audioList" class="audioList">
      <div class="title">
        <div class="action" @click="closeAudioList">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-fold-line" />
          </svg>
        </div>
        <div>播放列表</div>
      </div>

      <div class="audioListBox">
        <van-list
          v-model="programLoading"
          :finished="programFinished"
          finished-text="没有更多了"
          @load="programLoad"
        >
          <div class="list">
            <div class="ratioBox">
              <div class="box">
                <!-- <img :src="albumInfo.pic"> -->
                <img :src="albumPic__" />
              </div>
            </div>
            <!-- <div class="issue">{{ albumInfo.title }}</div> -->
            <div class="issue">{{ title__ }}</div>
          </div>

          <div v-for="(item, key) in programList" :key="key">
            <div
              v-if="item.goods_type != 6"
              @click="chooseAction(item)"
              class="list"
              :class="{ active: goodsNo == item.goods_no && audioStatus }"
            >
              <div class="img">
                <img
                  src="./../../assets/audio.svg"
                  width="22"
                  height="22"
                  alt
                  v-if="goodsNo == item.goods_no && audioStatus"
                />
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-videoPause-line" />
                </svg>
              </div>

              <div class="info">
                <div class="album">{{ item.title }}</div>
                <div class="program">
                  <span class="duration">时长{{ item.duration }}</span>

                  <template v-if="progressList.length > 0">
                    <span
                      class="history"
                      v-if="item.goods_type != 6 && progressList[key].progressHistory"
                    >已播{{ (progressList[key].progressHistory / progressList[key].ori_duration * 100).toFixed(2) }}%</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss">
#audioList {
  & .audioListBox {
    @include position(absolute, "tl", 44px, 0, 100%, null, null);
    @include textOverflow;
    bottom: 0;
    overflow-y: scroll;
    & .list {
      @include textOverflow;
      @include displayFlex(flex, flex-start, center);
      padding: 10px;
      border-bottom: 1px #eee solid;
      position: relative;

      & .ratioBox {
        width: 65px;
        padding-bottom: 65px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      & .issue {
        @include font("PingFangBold", $fontSize + 2, #333);
        @include textOverflow;
        margin-left: 10px;
      }

      & .img {
        & .icon {
          width: 22px;
          height: 22px;
          color: #e3e3e3;
        }
      }

      & .info {
        @include textOverflow;
        width: 100%;
        padding-left: 8px;
        box-sizing: border-box;

        & .album {
          @include textOverflow;
          @include font(null, $fontSize + 1, #666);
        }

        & .program {
          @include textOverflow;
          font-size: $fontSize - 1;
          color: #999;

          & .duration {
            margin-right: 10px;
          }
        }

        & .list {
          @include textOverflow;
        }
      }
    }
    & .list.active {
      & .info {
        & .album {
          @include font(null, $fontSize + 1, $redDark);
        }

        & .program {
          color: #333;
        }
      }
    }
  }
}
</style>

<script>
//  引入接口
import { ALBUM_DETAIL } from "../../apis/album.js";
export default {
  name: "list",
  props: ["albumInfo", "goodsNo", "audioStatus", "goodsId"],
  data() {
    return {
      programList: [],
      programPage: 1,
      // 分页
      programLoading: false,
      programFinished: false,
      popupModel: false,
      // 记录节目播放进度
      progressList: [],
      // 专辑标题
      title__: "",
      // 专辑头像
      albumPic__: ""
    };
  },
  mounted() {
  },
  methods: {
    // 打开播放列表
    closeAudioList() {
      this.popupModel = false;
    },
    programLoad() {
      // console.log('load');
      this.programData();
    },
    // 获取节目列表
    async programData() {
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      var __goodsId = null;

      if (info != null && info.length > 0) {
        if (info[1] != null) {
          // 专辑pid
          __goodsId = parseInt(info[1]);
        }
        this.title__ = info[7];
        this.albumPic__ = info[9];
      }

      // console.log(info);
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        // 判断是否还有pid
        goods_id: __goodsId,
        // goods_id: this.goodsId,
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
          for (let i = 0; i < res.response_data.result.length; i++) {
            result[i].sale_style = res.response_data.sale_style;
            this.programList.push(result[i]);
          }

          // 非文章节目根据good_id创建数组，并存放至localStorage
          this.progressListData();

          // 加载状态结束
          this.programLoading = false;
          this.programPage++;

          // 获取支付方式
          // this.programList.sale_style

          // 数据全部加载完成
          if (this.programPage > res.response_data.total_page) {
            this.programFinished = true;
            this.programPage = 1;
          }
        }, 600);

        // 设置总节目数
        this.programTotalCount = res.response_data.total_count;
      } else {
        this.$toast(res.error_message);
      }
    },
    // localStorage存放节目播放进度
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
      if (result != null && result.length > 0) {
        for (let i = 0; i < this.programList.length; i++) {
          this.progressList.push(this.programList[i]);
          // console.log(this.programList[i])

          for (let j = 0; j < result.length; j++) {
            // 当节目播放进度存在localStorage时,显示已播放进度
            if (
              result[j].pid == this.goodsId &&
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
    chooseAction(item) {
      // console.log(item);
      this.$emit("audioChange", item);
    }
  }
};
</script>

