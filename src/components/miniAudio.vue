<template>
  <div class="music">
    <p>currentTime:{{ audioData.currentTime }}</p>
    <p>duration:{{ audioData.duration }}</p>
    <audio :id="audioData.id" :src="audioData.src" preload="auto" @ended="ended"></audio>
    <div @click="playAudio" v-if="audioData.type === 'play'">播放</div>
    <div @click="pauseAudio" v-else>暂停</div>
    <!-- <div style="padding:40px 0;">
      <van-slider
        v-model="audioData.sliderValue"
        @change="audioSliderChange"
        :min="0"
        :max="100"
        bar-height="4px"
        active-color="#f44"
      />
    </div> -->

    <van-circle
      v-model="audioData.sliderValue"
      color="#07c160"
      fill="#fff"
      size="50px"
      layer-color="#ebedf0"
      @text="text"
      :rate="0"
      :speed="600"
      :clockwise="false"
      :stroke-width="60"
    />
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
  props: ["audioData"],
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

