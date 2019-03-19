<template>
  <div class="movie">
    <p>currentTime:{{ movieData.currentTime }}</p>
    <p>duration:{{ movieData.duration }}</p>
    <video :id="movieData.id" :src="movieData.src" @ended="ended"></video>
    <div @click="playVideo" v-if="movieData.type === 'play'">播放</div>
    <div @click="pauseVideo" v-else>暂停</div>
    <div style="padding:40px 0;">
      <van-slider
        v-model="movieData.sliderValue"
        @change="sliderChange"
        :min="0"
        :max="100"
        bar-height="4px"
        active-color="#f44"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.movie {
  padding: 50px;
}
video {
    width: 100%;
}
</style>

<script>
export default {
  name: "movie",
  props: ["movieData"],
  mounted() {
    setTimeout(() => {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      this.movieData.duration = this.todate(video.duration);
      this.movieData.currentTime = this.todate(this.movieData.currentSecond);
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
          this.movieData.duration = this.todate(second);
          // 绑定slider
          this.bindtoslider(second);
        }
      }, 1000);
    },
    // 点击播放
    playVideo() {
      var id = this.movieData.id;
      var video = document.getElementById(id);
        var totalSecond = video.duration;
        var currentSecond = video.currentTime;
        var second = parseInt(totalSecond - currentSecond);
      // 切换播放状态
      this.movieData.type = "pause";
        var type = "start";
      video.play();
        this.timeCountDown(second, type);
    },
    // 点击暂停
    pauseVideo() {
      var id = this.movieData.id;
      var video = document.getElementById(id);
        var second = parseInt(video.duration - video.currentTime);
      // 切换播放状态
      this.movieData.type = "play";
        var type = "reset";
      video.pause();
        this.timeCountDown(second, type);
    },
    // 播放结束
    ended() {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      this.movieData.type = "play";
      video.currentTime = 0;
        var time = parseInt(video.duration);
        this.movieData.duration = this.todate(time);
        // 绑定slider
        this.bindtoslider(video.duration);
    },
    // 绑定slider
    bindtoslider(second) {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      var totalSecond = parseInt(video.duration);
      var currentSecond = totalSecond - second;
      var percent = (currentSecond / totalSecond) * 100;
      this.movieData.sliderValue = percent;
    },
    // 拖动滑块
    sliderChange() {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      var percent = 100 - this.movieData.sliderValue;
      var totalSecond = (video.duration * percent) / 100;
      // 设置剩余时间
      this.movieData.duration = this.todate(totalSecond);
      // 设置当前时间
      video.currentTime = (this.movieData.sliderValue / 100) * video.duration;
      // 当正在播放时，先暂停再播放
      if (this.movieData.type === "pause") {
        this.pauseVideo();
      }
      setTimeout(() => {
        this.playVideo();
      }, 300);
      console.log(video.currentTime);
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
    }
  }
};
</script>

