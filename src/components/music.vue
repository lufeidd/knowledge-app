<template>
  <div id="musicPage">
    <div class="ratioBox">
      <div class="box bg">
        <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
      </div>
      <div class="box pic">
        <img src="https://media2.v.bookuu.com/activity/10/00/20190422100004136.png">
      </div>
    </div>

    <div class="descBox">
      <div class="title">1.智能AI的发展前景值得关注 智能AI的发展前景值得关注智能AI的发展前景值得关注智能AI的发展前景值得关注</div>
      <div class="subTitle">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-list-line"></use>
        </svg>
        <span>文稿</span>
      </div>
    </div>

    <audio :id="musicData.id" :src="musicData.src" preload="auto" @ended="ended"></audio>

    <div class="sliderBox">
      <van-slider
        v-model="musicData.sliderValue"
        @change="audioSliderChange"
        :min="0"
        :max="100"
        bar-height="2px"
        active-color="#f05654"
        inactive-color="#eee"
      ></van-slider>
      <div class="currentTime">{{ musicData.currentTime }}</div>
      <div class="duration">{{ musicData.duration }}</div>
    </div>

    <div class="controlBox">

      <div>
        
        <svg class="icon" aria-hidden="true" @click="showPopup">
          <use xlink:href="#icon-category-line"></use>
        </svg>
      </div>

      <div class="prev">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-prev-block"></use>
        </svg>
      </div>

      <div class="play" @click="playAudio" v-if="musicData.type === 'play'">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-play-block"></use>
        </svg>
      </div>
      <div class="pause" @click="pauseAudio" v-else>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pause-block"></use>
        </svg>
      </div>
      <div class="next">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-block"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#musicPage {
  width: 100%;
  position: absolute;
  top: 0;
  & .ratioBox {
    box-shadow: none;
    & .box.bg {
      -webkit-filter: blur(9px);
      filter: blur(9px);
      overflow: hidden;
    }
    & .box.pic {
      width: 50%;
      height: 50%;
      left: 25%;
      top: 25%;
      border-radius: 100%;
      background-color: $greyLight;
      box-shadow: 4px 13px 32px rgba(0, 0, 0, 0.43);
      overflow: hidden;
    }
  }

  & .descBox {
    @include textOverflow;
    text-align: center;
    padding: 10px 20px;
    background-color: $white;
    position: relative;
    z-index: 1;
    padding-top: 3vh;
    & .title {
      @include textOverflow;
      @include font("PingFangBold", $fontSize + 2, #333);
    }

    & .subTitle {
      @include textOverflow;
      @include font(null, $fontSize + 1, #999);
      padding: 10px;
      & .icon {
        margin-right: 4px;
      }
    }
  }

  & .sliderBox {
    position: relative;
    margin: 3vh 20px;
    @include font(null, $fontSize, #999);
    & .currentTime {
      @include position(absolute, "bl", -30px, 0, null, null, null);
    }
    & .duration {
      @include position(absolute, "br", -30px, 0, null, null, null);
    }
  }

  & .controlBox {
    @include displayFlex(flex, center, center);
    margin-top: 10vh;
    color: $redDark;
    & .play .icon,
    & .pause .icon {
      width: 50px;
      height: 50px;
      padding: 0 35px;
    }
    & .prev .icon,
    & .next .icon {
      width: 28px;
      height: 28px;
    }
  }
}
</style>

<script>
export default {
  name: "music",
  props: ["musicData"],
  mounted() {
    setTimeout(() => {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      this.musicData.duration = this.todate(audio.duration);
      this.musicData.currentTime = this.todate(0);
      // 全局变量存放时间
      this.audioDuration = parseInt(audio.duration);
    }, 600);
  },
  methods: {
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
          this.musicData.currentTime = this.todate(second);
          // 绑定slider
          this.audiobindtoslider(second);
        }
      }, 1000);
    },
    // 点击播放
    playAudio() {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      // 播放
      audio.play();
      // 切换播放状态
      this.musicData.type = "pause";
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, this.musicData.type);
    },
    // 点击暂停
    pauseAudio() {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      // 暂停
      audio.pause();
      // 切换播放状态
      this.musicData.type = "play";
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, this.musicData.type);
    },
    // 绑定slider
    audiobindtoslider(second) {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      var percent = (second / audio.duration) * 100;
      // 设置slider进度
      this.musicData.sliderValue = percent;
    },
    // 拖动滑块
    audioSliderChange() {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      // 设置当前时间
      audio.currentTime = (this.musicData.sliderValue / 100) * audio.duration;
      this.musicData.currentTime = this.todate(audio.currentTime);
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
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      this.musicData.type = "play";
      audio.currentTime = 0;
      // 重置
      setTimeout(() => {
        this.musicData.currentTime = this.todate(0);
        this.audiobindtoslider(0);
      }, 1000);
    }
  }
};
</script>

