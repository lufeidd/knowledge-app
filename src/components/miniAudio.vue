<template>
  <div id="miniAudio">
    <!-- 播放器缩略 -->
    <van-row class="miniAudio" :class="{ iphx: this.isIphx }">
      <van-col span="16">
        <div class="ratioBox">
          <div class="box">
            <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
          </div>
        </div>

        <div class="info">
          <div class="album">{{ audioData.album }}</div>
          <div class="program">
            <span class="duration">{{ audioData.duration }}</span>
            {{ audioData.program }}
          </div>
        </div>
      </van-col>
      <van-col span="8" class="action">
        <svg class="icon category" aria-hidden="true" @click="showPopup">
          <use xlink:href="#icon-category-line"></use>
        </svg>

        <div class="play" @click="playAudio" v-if="audioData.type === 'play'">
          <van-icon name="play"/>
        </div>
        <div class="play" @click="pauseAudio" v-else>
          <van-icon name="pause"/>
        </div>
        <div class="circle">
          <van-circle
            v-model="audioData.sliderValue"
            color="#f05654"
            fill="transparent"
            size="30px"
            layer-color="#e6e6e6"
            @text="text"
            :rate="0"
            :speed="600"
            :clockwise="false"
            :stroke-width="60"
          />
        </div>
      </van-col>
    </van-row>

    <audio :id="audioData.id" :src="audioData.src" preload="auto" @ended="ended"></audio>

    <van-popup v-model="audioData.popupModel" position="bottom" @open="onOpen">
      <div class="audioList">
        <div class="title">
          <div class="action" @click="onClose">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold-line"></use>
            </svg>
          </div>
          <div>播放列表</div>
        </div>
        <!-- 音频列表 -->
        <audioList :audioListData="audioListData"></audioList>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss">
#miniAudio {
  & .audioList {
    position: relative;
    height: 94vh;
    overflow: hidden;
    & .title {
      height: 44px;
      line-height: 44px;
      border-bottom: 1px #eee solid;
      text-align: center;
      position: relative;
      @include displayFlex(flex, center, center);
      @include font(null, $fontSize + 2, #999);

      & .action {
        @include position(absolute, "tl", 0, 0, 44px, 44px, null);
        & .icon {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  & .miniAudio {
    @include bgDecorate(rgba(0, 0, 0, 0.6), $white, 50px, 0, none);
    @include position(fixed, "bl", 60px, 6%, 88%, 50px, 50px);
    @include textOverflow;
    @include displayFlex(flex, flex-start, center);

    & .ratioBox {
      width: 40px;
      padding-bottom: 40px;
      border-radius: 40px;
      margin-left: 4px;
      margin-top: 5px;
      position: absolute;
    }

    & .info {
      @include textOverflow;
      width: 100%;
      padding-left: 50px;
      box-sizing: border-box;

      & .album {
        @include textOverflow;
      }

      & .program {
        @include textOverflow;
        font-size: $fontSize - 2;
        color: #e6e6e6;

        & .duration {
          margin-right: 10px;
        }
      }

      & .list {
        @include textOverflow;
      }
    }

    & .action {
      @include displayFlex(flex, flex-end, center);
      position: relative;
      color: #e6e6e6;

      & .category {
        width: 20px;
        height: 20px;
        margin-right: 15px;
      }

      & .play {
        font-size: 15px;
        width: 30px;
        height: 30px;
        margin-right: 12px;
        margin-left: 10px;
        text-align: center;
        line-height: 34px;
        z-index: 1;
      }

      & .circle {
        @include position(absolute, "br", 0, 12px, 30px, 30px, 0);
        z-index: 0;
      }
    }

    & .action::before {
      content: "";
      position: absolute;
      width: 1px;
      height: 30px;
      top: 0;
      right: 55px;
      background-color: #e6e6e6;
    }
  }

  .miniAudio.iphx {
    bottom: 90px;
  }
}
</style>

<script>
import audioList from "./../pages/album/list";
export default {
  name: "music",
  props: ["audioData"],
  components: {
    audioList
  },
  data() {
    return {
      audioListData: 
        {
          issue: {
            pic:
              "https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75",
            text:
              "宝宝巴士在线讲故事 宝宝巴士在线讲故事宝宝巴士在线讲故事宝宝巴士在线讲故事宝宝巴士在线讲故事"
          },
          albums: [
            {
              album:
                "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
              duration: "16：00",
              percent: "1%"
            },
            {
              album:
                "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
              duration: "16：00",
              percent: "1%"
            },
            {
              album:
                "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
              duration: "16：00",
              percent: "1%"
            },
          ]
        }
    };
  },
  mounted() {
    setTimeout(() => {
      var id = this.audioData.id;
      var audio = document.getElementById(id);
      this.audioData.duration = this.todate(audio.duration);
      this.audioData.currentTime = this.todate(0);
      // 全局变量存放时间
      this.audioDuration = parseInt(audio.duration);
    }, 600);
  },
  methods: {
    onClose() {
      this.audioData.popupModel = false;
    },
    onPlay(key) {
      console.log(key);
      this.activeIndex = key;
    },
    onOpen() {
      // alert(999);
    },
    showPopup() {
      this.audioData.popupModel = true;
    },
    text() {
      return this.audioData.sliderValue.toFixed(0) + "%";
    },
    // 播放时间戳
    audioTimeChange(second, type) {
      if (type === "play") {
        clearInterval(this.clock);
        return false;
      }
      this.clock = window.setInterval(() => {
        if (second >= this.audioDuration) {
          clearInterval(this.clock);
          return false;
        } else {
          second++;
          console.log(second);
          // 日期格式转换
          this.audioData.currentTime = this.todate(second);
          // 绑定slider
          this.audiobindtoslider(second);
        }
      }, 1000);
    },
    // 点击播放
    playAudio() {
      var id = this.audioData.id;
      var audio = document.getElementById(id);
      // 播放
      audio.play();
      // 切换播放状态
      this.audioData.type = "pause";
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, this.audioData.type);
    },
    // 点击暂停
    pauseAudio() {
      var id = this.audioData.id;
      var audio = document.getElementById(id);
      // 暂停
      audio.pause();
      // 切换播放状态
      this.audioData.type = "play";
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, this.audioData.type);
    },
    // 绑定slider
    audiobindtoslider(second) {
      var id = this.audioData.id;
      var audio = document.getElementById(id);
      var percent = (second / audio.duration) * 100;
      // 设置slider进度
      this.audioData.sliderValue = percent;
    },
    // 拖动滑块
    audioSliderChange() {
      var id = this.audioData.id;
      var audio = document.getElementById(id);
      // 设置当前时间
      audio.currentTime = (this.audioData.sliderValue / 100) * audio.duration;
      this.audioData.currentTime = this.todate(audio.currentTime);
      // 先暂停再播放
      this.pauseAudio();
      setTimeout(() => {
        this.playAudio();
      }, 300);
    },
    // 日期格式转换
    todate(second) {
      // 转换为时间格式
      var date = "00:00";
      // var h = Math.floor(second / 60 / 60);
      var m = Math.floor(second / 60);
      var s = Math.floor(second - m * 60);
      // if (h < 10) h = "0" + h;
      if (m < 10) m = "0" + m;
      if (s < 10) s = "0" + s;
      // var date = h + ":" + m + ":" + s;
      var date = m + ":" + s;
      return date;
    },
    // 播放结束
    ended() {
      var id = this.audioData.id;
      var audio = document.getElementById(id);
      this.audioData.type = "play";
      audio.currentTime = 0;
      // 重置
      setTimeout(() => {
        this.audioData.currentTime = this.todate(0);
        this.audiobindtoslider(0);
      }, 1000);
    }
  }
};
</script>

