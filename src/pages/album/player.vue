<template>
  <div id="musicPage">
    <div class="ratioBox">
      <div class="box bg">
        <img :src="audioData.pic">
      </div>
      <div class="box pic">
        <img :src="audioData.pic">
      </div>
    </div>

    <div class="descBox">
      <div class="title">{{ audioData.program }}</div>
      <div class="subTitle">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-list-line"></use>
        </svg>
        <span>文稿</span>
      </div>
    </div>

    <!-- 音频播放器 -->
    <audio id="musicPlayer" :src="audioData.src" preload="auto" @ended="onEnded"></audio>

    <!-- 进度条 -->
    <div class="sliderBox">
      <van-slider
        v-model="audioData.sliderValue"
        @change="audioSliderChange"
        :min="0"
        :max="100"
        bar-height="2px"
        active-color="#f05654"
        inactive-color="#eee"
      ></van-slider>
      <div class="currentTime">{{ currentTime__ }}</div>
      <div class="duration">{{ duration__ }}</div>
    </div>

    <!-- 控制 -->
    <div class="controlBox">
      <div class="category">
        <svg class="icon" aria-hidden="true" @click="showList">
          <use xlink:href="#icon-category-line"></use>
        </svg>
      </div>

      <div class="prev">
        <svg class="icon" aria-hidden="true" @click="prevProgram">
          <use xlink:href="#icon-prev-block"></use>
        </svg>
      </div>

      <div class="play" v-if="audioData.type">
        <svg class="icon" aria-hidden="true" @click="playAudio">
          <use xlink:href="#icon-play-line"></use>
        </svg>
      </div>
      <div class="pause" v-else>
        <svg class="icon" aria-hidden="true" @click="pauseAudio">
          <use xlink:href="#icon-pause-line"></use>
        </svg>
      </div>
      <div class="next">
        <svg class="icon" aria-hidden="true" @click="nextProgram">
          <use xlink:href="#icon-next-block"></use>
        </svg>
      </div>
    </div>

    <!-- 播放列表 -->
    <audioList
      :goodsId="programGoodsId"
      :albumInfo="baseData"
      :goodsNo="activeGoodNo"
      :audioStatus="!audioData.type"
      ref="control"
      @audioChange="audioAction"
    ></audioList>
  </div>
</template>

<style src="@/style/scss/pages/album/player.scss" lang="scss"></style>

<script>
import audioList from "./../../pages/album/list";
//  引入接口
import { ALBUM_DETAIL } from "../../apis/album.js";
import { setTimeout } from "timers";
export default {
  components: {
    audioList
  },
  data() {
    return {
      // 获取localStorage音频播放状态
      audioData: {
        pic: null,
        program: null,
        src: null,
        currentTime: null,
        duration: null,
        type: null,
        sliderValue: null
      },
      currentSecond: null,
      // 节目列表
      programGoodsId: null,
      activeGoodNo: null,
      // 专辑
      baseData: {
        pic: null,
        title: null
      },
      activeGoodsNo: null,
      // duration时间格式
      duration__: null,
      currentTime__: null,
      // 存放所有节目
      allProgramList: [],
      // 当前播放项的上一项
      prevData: [],
      // 当前播放项的下一项
      prevData: [],
      // 存放是否自动播放
      autoPlay: true
    };
  },
  beforeDestroy() {
    // 播放结束后销毁倒计时
    this.clearClock();
  },
  mounted() {
    // localStorage传递参数
    var info = JSON.parse(localStorage.getItem("miniAudio"));
    this.audioData.pic = info[2];
    this.audioData.program = info[6];
    this.audioData.src = info[3];
    this.audioData.type = !info[1];
    this.currentSecond = info[5];
    this.programGoodsId = info[8];
    // 专辑
    this.baseData.pic = info[2];
    this.baseData.title = info[7];
    // 当前播放节目
    this.activeGoodNo = info[0];

    setTimeout(() => {
      this.setPlayerAudio(info);
      // this.playAudio();
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
    // 设置音频播放状态
    setPlayerAudio(info) {
      this.audioData.src = info[3];
      var audio = document.getElementById("musicPlayer");
      this.audioData.duration = audio.duration;
      this.audioData.currentTime = info[5];
      // 音频切换时，设置下一音频duration显示时间
      setTimeout(() => {
        this.duration__ = this.todate(audio.duration);
      }, 600);
      this.currentTime__ = this.todate(info[5]);
      this.audioData.program = info[6];
      // 设置当前播放进度
      this.audioData.sliderValue = (info[5] / audio.duration) * 100;
      this.audioSliderChange();
    },
    // 播放时间戳
    audioTimeChange(second, type) {
      if (type) {
        this.clearClock();
        this.updateProgress();
        return false;
      }
      // console.log(document.getElementById('musicPlayer').paused);
      this.clock = window.setInterval(() => {
        // 修复倒计时中音频paused状态改变的问题
        if (document.getElementById("musicPlayer").paused)
          document.getElementById("musicPlayer").play();
        // console.log('456', document.getElementById('musicPlayer').paused);
        if (second >= document.getElementById("musicPlayer").duration) {
          clearInterval(this.clock);
          return false;
        } else {
          second++;
          // 日期格式转换
          // this.audioData.currentTime = this.todate(second);
          this.currentTime__ = this.todate(second);
          // console.log('秒：', second, 'currentTime：', document.getElementById("musicPlayer").currentTime, 'status: ', document.getElementById("musicPlayer").paused);
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
      var __currentTime = document.getElementById("musicPlayer").currentTime;
      // 存储到localStorage
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      info[1] = this.audioData.type;
      info[5] = __currentTime;
      localStorage.setItem("miniAudio", JSON.stringify(info));
      // 关联播放列表当前播放状态
      this.activeGoodNo = info[0];

      // 存储到localStorage: audioProgress
      var result = JSON.parse(localStorage.getItem("audioProgress"));

      // 判断当前播放专辑和迷你缩略播放器/音乐播放器的统一性，根据goods_id来存储loacalStorage
      var goods_id = result[0].goods_id;
      for (let i = 0; i < result.length; i++) {
        if (goods_id == info[8]) {
          // 当记录已经存在则更新
          var goods_no = result[i].goods_no;
          if (goods_no == info[0]) {
            result[i].progress = __currentTime;
            // console.log('goods_no:', goods_no,  '当记录已经存在则更新');
          }
        } else {
          // 当记录不存在则添加
          console.log("当记录不存在则添加");
        }
      }

      // console.log(
      //   "player------localStorage迷你音频信息:",
      //   info,
      //   "当前goodsNo:",
      //   info[0],
      //   "当前goodsId:",
      //   info[8],
      //   "当前currentTime：",
      //   __currentTime
      // );

      // console.log(
      //   "player------audioProgress信息:",
      //   result,
      //   "当前goodsNo:",
      //   result[1],
      //   "当前goodsId:",
      //   result[0],
      //   "当前progress：",
      //   result[2],
      // );

      // console.log('更新音频播放进度');
    },
    // 点击播放
    playAudio() {
      this.clearClock();
      var audio = document.getElementById("musicPlayer");
      // 播放
      audio.play();
      // 切换播放状态
      this.audioData.type = false;
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, false);
      console.log("播放");
    },
    // 点击暂停
    pauseAudio() {
      this.clearClock();
      var audio = document.getElementById("musicPlayer");
      // 暂停
      audio.pause();
      // 切换播放状态
      this.audioData.type = true;
      var second = parseInt(audio.currentTime);
      this.audioTimeChange(second, true);
      console.log("暂停");
    },
    // 播放结束
    onEnded() {
      this.clearClock();
      var audio = document.getElementById("musicPlayer");
      this.audioData.type = false;
      audio.currentTime = 0;

      // 重置
      this.currentTime__ = this.todate(0);
      this.audiobindtoslider(0);
      // 存储到localStorage
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      this.audioTimeChange(0, true);
      this.audioData.type = true;
      console.log("当前音频播放结束");
    },
    // 绑定slider
    audiobindtoslider(second) {
      var audio = document.getElementById("musicPlayer");
      var percent = (second / audio.duration) * 100;
      // 设置slider进度
      this.audioData.sliderValue = percent;
    },
    // 拖动滑块
    audioSliderChange() {
      var audio = document.getElementById("musicPlayer");
      // 设置当前时间
      audio.currentTime = (this.audioData.sliderValue / 100) * audio.duration;
      // 绑定slider
      this.audiobindtoslider(audio.currentTime);
      this.audioData.currentTime = this.todate(audio.currentTime);
      this.currentTime__ = this.todate(audio.currentTime);
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
    // 打开播放列表
    showList() {
      this.$refs.control.popupModel = true;
      // 关联播放列表
      this.$refs.control.goodsNo = this.activeGoodNo;
    },
    // 切换音频
    onPlay(activeGoodsNo) {
      // console.log(activeGoodsNo);
    },
    // 点击节目
    audioAction(item) {
      // console.log("点击获取当前选项信息：", item);
      // 将goodsNo以及标题存储到localStorage

      // 更新localStorage数据
      this.updateLocalStorage(item);

      var audio = document.getElementById("musicPlayer");
      this.activeGoodNo = item.goods_no;
      this.audioData.src = item.file_path;
      this.audioData.program = item.title;
      this.audioData.type = false;
      setTimeout(() => {
        this.currentTime__ = "00:00";
        // this.pauseAudio();
        this.playAudio(0);
      }, 600);
      // console.log(item);
    },
    // 点击上一个节目
    prevProgram() {
      // 更新localStorage数据
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      this.allProgramData(info, "prev");
    },
    // 点击下一个节目
    nextProgram() {
      // 更新localStorage数据
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      this.allProgramData(info, "next");
    },
    async allProgramData(info, actionType) {
      let data = {
        goods_id: info[8],
        goods_no: 1, // 默认倒序
        page_size: 1000000000000000,
        version: "1.0"
      };
      let res = await ALBUM_DETAIL(data);
      // 存储当前节目的prev和next
      var prev;
      var next;

      if (res.hasOwnProperty("response_code")) {
        var type1 = 0;
        var type2 = 0;
        var type3 = 0;
        this.allProgramList = [];
        var result = res.response_data.result;
        for (let i = 0; i < res.response_data.result.length; i++) {
          var type = result[i].goods_type;
          // console.log('type:', type);
          if (type == 1) type1 = 1;
          if (type == 2) type2 = 1;
          if (type == 6) type3 = 1;
          // 不包含文章类型
          if (result[i].goods_type != 6) {
            this.allProgramList.push(result[i]);
          }
          if (result[i].goods_no == info[0]) {
            prev = i - 1;
            next = i + 1;
          }
        }
        // 判断专辑是否自动播放
        if (eval(type1 + type2 + type3) > 1) {
          this.autoPlay = false;
        } else {
          this.autoPlay = true;
        }

        var count = this.allProgramList.length;
        prev = prev < 0 ? count - 1 : prev;
        next = next > count - 1 ? 0 : next;

        // 判断是prev还是next，或者是自动播放完毕
        if (actionType == "prev") {
          // 更新localStorage数据
          // console.log('类型', type, "节目：", this.allProgramList[index]);
          this.updateLocalStorage(this.allProgramList[prev]);
        } else if (actionType == "next" || this.autoPlay) {
          this.updateLocalStorage(this.allProgramList[next]);
        } else {
          this.pauseAudio();
        }

        // console.log('prev:', prev, 'next:', next, 'count:', count, '节目列表总和：', this.allProgramList);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 更新localStorage数据
    updateLocalStorage(item) {
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      info[0] = item.goods_no;
      info[3] = item.file_path;
      info[4] = item.duration;
      info[5] = 0;
      info[6] = item.title;
      info[8] = 35;
      localStorage.setItem("miniAudio", JSON.stringify(info));

      // 更新播放器当前播放音频
      // this.pauseAudio();
      setTimeout(() => {
        this.setPlayerAudio(info);
        this.playAudio(0);
      }, 600);
    }
  }
};
</script>



