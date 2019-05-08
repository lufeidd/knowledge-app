<template>
  <div id="miniAudio">
    <!-- 播放器缩略 -->
    <van-row class="miniAudio" :class="{ iphx: this.isIphx }">
      <van-col span="16">
        <div class="ratioBox">
          <div class="box">
            <span @click="toPlayer">
              <img :src="audioData.pic">
            </span>
          </div>
        </div>

        <span class="info" @click="toPlayer">
          <div class="album">{{ audioData.album }}</div>
          <div class="program">
            <span class="duration">{{ audioData.duration }}</span>
            {{ audioData.program }}
          </div>
        </span>
      </van-col>
      <van-col span="8" class="action">
        <svg class="icon category" aria-hidden="true" @click="showList">
          <use xlink:href="#icon-category-line"></use>
        </svg>

        <div class="play" @click="playAudio" v-if="audioData.type">
          <van-icon name="play"/>
        </div>
        <div class="play" @click="pauseAudio" v-else>
          <van-icon name="pause"/>
        </div>
        <!-- 进度条 -->
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

    <!-- 播放器 -->
    <audio id="myMiniAudio" :src="audioData.src" preload="auto" @ended="ended"></audio>
  
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
    // opacity: 0;
    z-index: 1;
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
      overflow: hidden;
      position: absolute;
    }

    & .info {
      @include textOverflow;
      display: block;
      width: 100%;
      padding-left: 50px;
      box-sizing: border-box;

      & .album {
        color: $white;
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
export default {
  name: "music",
  props: ["audioData", "rank"],
  data() {
    return {
    };
  },
  // 解决子组件数据实时刷新问题
  watch: {
    audioData: {
      handler(newValue, oldValue) {
        // console.log(newValue)
      },
      deep: true
    }
  },
  beforeDestroy () {

    if(this.progressClock) {
      window.clearInterval(this.progressClock);
      this.progressClock = null;
    }
    if(this.clock) {
      window.clearInterval(this.clock);
      this.clock = null;
    }
    // console.log('组件销毁之前销毁定时器');
  },
  mounted() {
    setTimeout(() => {
      var audio = document.getElementById("myMiniAudio");
      this.audioData.duration = this.todate(audio.duration);
      this.audioData.currentTime = this.todate(0);
      // 全局变量存放时间
      this.audioDuration = parseInt(audio.duration);
    }, 600);
  },
  methods: {
    // 播放时间戳
    audioTimeChange(second, type) {
      if (type) {
        clearInterval(this.clock);
        // 音频暂停停止5s倒计时，同时更新音频播放进度
        clearInterval(this.progressClock);
        this.updateProgress();
        return false;
      }
      this.clock = window.setInterval(() => {
        // 修复倒计时中音频paused状态改变的问题
        if(document.getElementById('myMiniAudio').paused) document.getElementById('myMiniAudio').play();
        if (second >= this.audioDuration) {
          clearInterval(this.clock);
          return false;
        } else {
          second++;
          // console.log(second);
          // 日期格式转换
          this.audioData.currentTime = this.todate(second);
          // 绑定slider
          this.audiobindtoslider(second);
        }
      }, 1000);
      // 音频实时播放进度，每5s更新
      this.audioProgress();
    },
    // 音频实时播放进度，每5s更新
    audioProgress() {
      this.progressClock = window.setInterval(() => {
        // console.log('每5s更新');
        this.updateProgress();
      }, 5000);
    },
    // 更新音频播放进度
    updateProgress() {
      // 音频当前播放时间
      var __currentTime = document.getElementById("myMiniAudio").currentTime;
      // 存储到localStorage
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      info[1] = this.audioData.type;
      info[5] = __currentTime;
      this.$emit("setProgress", info);

      // console.log(
      //   "miniAudio------localStorage迷你音频信息:",
      //   info,
      //   "当前goodsNo:",
      //   info[0],
      //   "当前goodsId:",
      //   info[8],
      //   "当前currentTime：",
      //   info[5]
      // );
      // console.log('更新音频播放进度');
    },
    // 点击播放
    playAudio() {
      var audio = document.getElementById("myMiniAudio");
      // 播放
      audio.play();
      // 切换播放状态
      this.$emit("setType", false);
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, false);
      console.log("播放");
    },
    // 点击暂停
    pauseAudio() {
      var audio = document.getElementById("myMiniAudio");
      // 暂停
      audio.pause();
      // 切换播放状态
      this.$emit("setType", true);
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, true);
      console.log("暂停");
    },
    // 绑定slider
    audiobindtoslider(second) {
      var audio = document.getElementById("myMiniAudio");
      var percent = (second / audio.duration) * 100;
      // 设置slider进度
      this.audioData.sliderValue = percent;
    },
    // 拖动滑块
    audioSliderChange() {
      var audio = document.getElementById("myMiniAudio");
      // 设置当前时间
      audio.currentTime = (this.audioData.sliderValue / 100) * audio.duration;
      // 绑定slider
      this.audiobindtoslider(audio.currentTime);
      this.audioData.currentTime = this.todate(audio.currentTime);
      // 先暂停再播放
      this.pauseAudio();
      // setTimeout(() => {
      //   this.playAudio();
      // }, 600);
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
      var audio = document.getElementById("myMiniAudio");
      this.$emit("setType", false);
      audio.currentTime = 0;
      setTimeout(() => {
        this.audiobindtoslider(0);
        // 播放结束后销毁倒计时
        if(this.progressClock) {
          window.clearInterval(this.progressClock);
          this.progressClock = null;
        }
        if(this.clock) {
          window.clearInterval(this.clock);
          this.clock = null;
        }
      }, 600);
      // 存储到localStorage
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      info[1] = false;
      info[5] = 0;
      localStorage.setItem("miniAudio", JSON.stringify(info));
      // 调接口，获取所有节目
      this.$emit('getAllProgram', info);
      // this.getAllProgramData(info);
    },
    text() {
      return this.audioData.sliderValue.toFixed(0) + "%";
    },
    // 打开播放列表
    showList() {
      this.$emit("showAudioList", true);
    },
    // 链接到音乐播放器
    toPlayer() {
      // let queryData = this.audioData;
      // console.log(queryData);
      // this.$emit('linkToPlayer',  queryData);
      this.$emit("linkToPlayer", "");
    }
  }
};
</script>

