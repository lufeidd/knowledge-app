<template>
  <div class="music">
    <p>currentTime:{{ musicData.currentTime }}</p>
    <p>duration:{{ musicData.duration }}</p>
    <audio :id="musicData.id" :src="musicData.src" preload="auto" @ended="ended"></audio>
    <div @click="playAudio" v-if="musicData.type === 'play'">播放</div>
    <div @click="pauseAudio" v-else>暂停</div>
    <div style="padding:40px 0;">
      <van-slider
        v-model="musicData.sliderValue"
        @change="sliderChange"
        :min="0"
        :max="100"
        bar-height="4px"
        active-color="#f44"
      />
    </div>
  </div>
</template>

<style lang="scss">
.music {
  padding: 50px;
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
      this.musicData.currentTime = this.todate(this.musicData.currentSecond);
    }, 601);
  },
  methods: {
    // 倒计时
    timeCountDown(second, type) {
      if (type === "reset") {
        clearInterval(this.clock);
        return false;
      }
      this.clock = window.setInterval(() => {
        if (second == 0) {
          clearInterval(this.clock);
          return false;
        } else {
          second--;
          console.log(second);
          // 日期格式转换
          this.musicData.duration = this.todate(second);
          // 绑定slider
          this.bindtoslider(second);
        }
      }, 1000);
    },
    // 点击播放
    playAudio() {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      var totalSecond = audio.duration;
      var currentSecond = audio.currentTime;
      var second = parseInt(totalSecond - currentSecond);
      // 切换播放状态
      this.musicData.type = "pause";
      var type = "start";
      audio.play();
      this.timeCountDown(second, type);
    },
    // 点击暂停
    pauseAudio() {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      var second = parseInt(audio.duration - audio.currentTime);
      // 切换播放状态
      this.musicData.type = "play";
      var type = "reset";
      audio.pause();
      this.timeCountDown(second, type);
    },
    // 绑定slider
    bindtoslider(second) {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      var totalSecond = parseInt(audio.duration);
      var currentSecond = totalSecond - second;
      var percent = (currentSecond / totalSecond) * 100;
      this.musicData.sliderValue = percent;
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
    // 拖动滑块
    sliderChange() {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      var percent = 100 - this.musicData.sliderValue;
      var totalSecond = (audio.duration * percent) / 100;
      // 设置剩余时间
      this.musicData.duration = this.todate(totalSecond);
      // 设置当前时间
      audio.currentTime = (this.musicData.sliderValue / 100) * audio.duration;
      // 当正在播放时，先暂停再播放
      if (this.musicData.type === "pause") {
        this.pauseAudio();
      }
      setTimeout(() => {
        this.playAudio();
      }, 300);
      console.log(audio.currentTime);
    },
    // 播放结束
    ended() {
      var id = this.musicData.id;
      var audio = document.getElementById(id);
      this.musicData.type = "play";
      audio.currentTime = 0;
      var time = parseInt(audio.duration);
      this.musicData.duration = this.todate(time);
      // 绑定slider
      this.bindtoslider(audio.duration);
    }
  }
};
</script>

