<template>


    <van-popup v-model="popupModel" position="bottom">
      <div class="audioList">
        <div class="title">
          <div class="action" @click="closeAudioList">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold-line"></use>
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
                  <img :src="albumInfo.pic">
                </div>
              </div>
              <div class="issue">{{ albumInfo.title }}</div>
            </div>

            <div v-for="(item, key) in programList" :key="key">
              <div
                v-if="item.goods_type != 6"
                @click="onPlay(item)"
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
                  >
                  <svg class="icon" aria-hidden="true" v-else>
                    <use xlink:href="#icon-videoPause-line"></use>
                  </svg>
                </div>

                <div class="info">
                  <div class="album">{{ item.title }}</div>
                  <div class="program">
                    <span class="duration">时长{{ item.duration }}</span>
                    <span>已播{{ (item.progress / item.ori_duration).toFixed(0) }}%</span>
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
.audioListBox {
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
</style>

<script>
//  引入接口
import { ALBUM_DETAIL } from "../../apis/album.js";
export default {
  name: "music",
  props: ["albumInfo", "goodsNo", "audioStatus", "goodsId"],
  data() {
    return {
      programList: [],
      programPage: 1,
      // 分页
      programLoading: false,
      programFinished: false,
      popupModel: false,
    };
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
      let data = {
        goods_id: this.goodsId,
        goods_no: 1,  // 默认倒序
        page: this.programPage,
        page_size: 4,
        version: "1.0"
      };
      let res = await ALBUM_DETAIL(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.programList.push(result[i]);
          }
          // 加载状态结束
          this.programLoading = false;
          this.programPage++;

          // console.log('page：', this.programPage);

          // 数据全部加载完成
          if (this.programList.length >= res.response_data.total_count) {
            this.programFinished = true;
          }
        }, 600);

        // 设置总节目数
        this.programTotalCount = res.response_data.total_count;
        // console.log('节目列表：', result);
      } else {
        this.$toast(res.error_message);
      }
    },
    onPlay(item) {
      // console.log(item);
      this.$emit("audioChange", item);
    },
  }
};
</script>

