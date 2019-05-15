<template>
  <div id="miniAudio">
    <!-- 播放器缩略 -->
    <van-row class="miniAudio" :class="{ iphx: this.isIphx }">
      <van-col span="16">
        <div class="ratioBox" @click="toPlayer">
          <div class="box">
            <span>
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
        
        <div class="play" @click="playAudio(false)" v-if="audioData.type || playType">
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
    <audio id="myMiniAudio" :src="audioData.src" preload="auto" @ended="onEnded"></audio>
  </div>
</template>


<style src="@/style/scss/components/miniAudio.scss" lang="scss"></style>

<script>
export default {
  name: "music",
  props: ["audioData", "rank"],
  data() {
    return {
      playType: true,
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
  beforeDestroy() {
    // 播放结束后销毁倒计时
    this.clearClock();
  },
  mounted() {
    setTimeout(() => {
      var audio = document.getElementById("myMiniAudio");
      if (this.audioData.currentTime) {
        audio.currentTime = this.audioData.currentTime;
      }
      this.audioData.duration = this.todate(audio.duration);
    }, 600);
  },
  methods: {
    // 清除倒计时
    clearClock() {
      // 播放结束后销毁倒计时
      if (this.progressClock) {
        window.clearInterval(this.progressClock);
        this.progressClock = null;
      }
      if (this.clock) {
        window.clearInterval(this.clock);
        this.clock = null;
      }
    },
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
        if (document.getElementById("myMiniAudio").paused) document.getElementById("myMiniAudio").play();

        if (second >= document.getElementById("myMiniAudio").duration) {
          clearInterval(this.clock);
          return false;
        } else {
          second++;
          console.log(second);
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
      // 音频当前播放时间localStorage
      var __currentTime = document.getElementById("myMiniAudio").currentTime;
      
      // 存储到localStorage: miniAudio
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      info[5] = __currentTime;

      // 存储到localStorage: audioProgress
      var result = JSON.parse(localStorage.getItem("audioProgress"));

      // 判断当前播放节目和迷你缩略播放器/音乐播放器的统一性，根据goods_id来存储loacalStorage
      var isAdd = false;

      if (result.length == 0) {
        // 新增播放进度记录
        this.addProgressData(info, __currentTime);
      } else {
        var goods_id = result[0].goods_id;
        for (let i = 0; i < result.length; i++) {
          if (goods_id == info[8]) {
            // 当记录已经存在则更新
            var goods_no = result[i].goods_no;
            if (goods_no == info[0]) {
              result[i].progress = __currentTime;
              isAdd = false;
              // 设置节目列表播放进度，只设置不显示
              this.$emit("setProgress", result);
              // console.log('goods_no:', goods_no,  '当记录已经存在则更新');
            }
          } else {
            isAdd = true;
          }
        }
      }
      if (isAdd) {
        // 新增播放进度记录
        this.addProgressData(info, __currentTime);
      }

      // 设置迷你音频播放状态
      this.$emit("setMiniAudio", info);

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
      console.log('更新音频播放进度');
    },
    // 新增播放进度记录
    addProgressData (info, __currentTime) {
      // 当记录不存在则添加
      /*
      * __goodsId专辑id
      * __goodsNo节目编号
      * __progress节目当前播放进度
      * __duration节目时长，单位s
      */
      var arr = [];
      var obj = {};
      obj.goods_id = info[8];
      obj.goods_no = info[0];
      obj.progress = info[2];
      obj.duration = info[4];
      
      arr.push(obj);
      localStorage.setItem("audioProgress", JSON.stringify(arr));

      console.log("当记录不存在则添加", 'goods_id:', info[8], 'goods_no:', info[0], 'progress:', __currentTime, "result:", arr);

    },
    // 点击播放
    playAudio(time) {
      this.clearClock();
      var audio = document.getElementById("myMiniAudio");
      if (time) {
        audio.currentTime = time;
      }

      // 播放
      audio.play();
      // 切换播放状态
      this.$emit("setType", false);
      this.playType = false;
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, false);
      console.log("播放");
    },
    // 点击暂停
    pauseAudio() {
      this.clearClock();
      var audio = document.getElementById("myMiniAudio");
      // 暂停
      audio.pause();
      // 切换播放状态
      this.$emit("setType", true);
      this.playType = true;
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, true);
      console.log("暂停");
    },
    // 播放结束
    onEnded() {
      this.clearClock();
      this.clearClock();
      var audio = document.getElementById("myMiniAudio");
      this.$emit("setType", false);
      audio.currentTime = 0;
      setTimeout(() => {
        this.audiobindtoslider(0);
      }, 600);
      // miniAudio播放数据存储到localStorage
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      this.audioTimeChange(0, true);
      // 调接口，获取所有节目，判断是否自动播放
      this.$emit("getAllProgram", info);
      // this.getAllProgramData(info);
      console.log("当前音频播放结束");
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
      // this.audioData.currentTime = this.todate(audio.currentTime);
      // 先暂停再播放
      this.pauseAudio();
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
    // 每5s、点击play、点击pzause、ended更新localStorage中audioProgress数据
  }
};
</script>

