<template>
  <div class="movie">
    <p>currentTime:{{ movieData.currentTime }}</p>
    <p>duration:{{ movieData.duration }}</p>
    <video :id="movieData.id" :src="movieData.src" preload="auto" @ended="ended"></video>
    <div @click="playVideo" v-if="movieData.type === 'play'">播放</div>
    <div @click="pauseVideo" v-else>暂停</div>
    <div style="padding:40px 0;">
      <van-slider
        v-model="movieData.sliderValue"
        @change="movieSliderChange"
        :min="0"
        :max="100"
        bar-height="4px"
        active-color="#f44"
      />
    </div>
  </div>
</template>

<style lang="scss">
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
      this.movieData.currentTime = this.todate(0);
      // 全局变量存放时间
      this.videoDuration = parseInt(video.duration);
    }, 600);
  },
  methods: {
    // 播放时间戳
    videoTimeChange(second, type) {
      if (type === "play") {
        clearInterval(this.clock);
        return false;
      }
      this.clock = window.setInterval(() => {
        if (second >= this.videoDuration) {
          clearInterval(this.clock);
          return false;
        } else {
          second++;
          console.log(second);
          // 日期格式转换
          this.movieData.currentTime = this.todate(second);
          // 绑定slider
          this.videobindtoslider(second);
        }
      }, 1000);
    },
    // 点击播放
    playVideo() {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      // 播放
      video.play();
      // 切换播放状态
      this.movieData.type = "pause";
      var second = parseInt(video.currentTime);
      this.videoTimeChange(second, this.movieData.type);
    },
    // 点击暂停
    pauseVideo() {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      // 暂停
      video.pause();
      // 切换播放状态
      this.movieData.type = "play";
      var second = parseInt(video.currentTime);
      this.videoTimeChange(second, this.movieData.type);
    },
    // 绑定slider
    videobindtoslider(second) {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      var percent = (second / video.duration) * 100;
      // 设置slider进度
      this.movieData.sliderValue = percent;
    },
    // 拖动滑块
    movieSliderChange() {
      var id = this.movieData.id;
      var video = document.getElementById(id);
      // 设置当前时间
      video.currentTime = (this.movieData.sliderValue / 100) * video.duration;
      this.movieData.currentTime = this.todate(video.currentTime);
      // 先暂停再播放
      this.pauseVideo();
      setTimeout(() => {
        this.playVideo();
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
      var id = this.movieData.id;
      var video = document.getElementById(id);
      this.movieData.type = "play";
      video.currentTime = 0;
      // 重置
      setTimeout(() => {
        this.movieData.currentTime = this.todate(0);
        this.videobindtoslider(0);
      }, 1000);
    }
  }
};
</script>

