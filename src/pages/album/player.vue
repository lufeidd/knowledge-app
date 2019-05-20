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

      <!-- 当前节目属于专辑时展示 -->
      <div class="category" v-if="programGoodsId != 0">
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
        <svg class="icon" aria-hidden="true" @click="playAudio(null)">
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
      // pid
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
      autoPlay: true,
      // 存储是否新增
      isAdd: false,
    };
  },
  beforeDestroy() {
    // 播放结束后销毁倒计时
    this.clearClock();
  },
  mounted() {
    this.audioData.type = true;
    // 设置音频播放状态
    this.setPlayerAudio();
    // 延时600ms设置duration
    this.setDuration();
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
    setPlayerAudio() {
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      // 当前播放节目
      this.activeGoodNo = info[0];
      this.programGoodsId = info[1];
      this.audioData.pic = info[2];
      this.audioData.src = info[3];
      this.currentSecond = info[5];
      this.audioData.program = info[6];
      this.baseData.title = info[7];
      // 专辑
      this.baseData.pic = info[2];

      // 初始化音频
      this.audioData.src = info[3];
      this.audioData.currentTime = info[5];
      // 存储currentTime时间格式
      this.currentTime__ = this.todate(info[5]);
    },
    // 延时600ms设置duration
    setDuration () {
      var audio = document.getElementById("musicPlayer");
      var self = this;

      // if(audio.canPlayType('audio/mpeg') == "probably") {
      // }

      setTimeout(function() {
        self.audioData.duration = audio.duration;
        self.duration__ = self.todate(audio.duration);
        // 设置slider当前播放进度
        self.audioData.sliderValue = (self.audioData.currentTime / audio.duration) * 100;
        // slider和音频播放同步
        self.audioSliderChange();
      }, 600);
    },
    // 播放时间戳
    audioTimeChange(second, type) {
      // 暂停
      if (type) {
        this.clearClock();
        this.updateProgress();
        return false;
      }
      
      this.clock = window.setInterval(() => {
        // 修复倒计时中音频paused状态改变的问题
        if (document.getElementById("musicPlayer").paused) document.getElementById("musicPlayer").play();

        if (second >= document.getElementById("musicPlayer").duration) {
          clearInterval(this.clock);
          return false;
        } else {
          second++;
          console.log(second);
          this.currentTime__ = this.todate(second);
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
        console.log('每5s更新');
        this.updateProgress();
      }, 5000);
    },
    // 更新音频播放进度
    updateProgress() {
      // 音频当前播放时间
      var __currentTime = document.getElementById("musicPlayer").currentTime;
      // 存储到localStorage
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      // 存储到localStorage: audioProgress
      var result = JSON.parse(localStorage.getItem("audioProgress"));

      info[5] = __currentTime;

      // 判断是否需要新增进度
      this.progressAddOrUpdate(info, result);

      // 根据pid + goods_id来存储loacalStorage
      if (result.length == 0 || this.isAdd) {
        // 新增播放进度记录
        this.addProgressData(info, result, __currentTime);
      } else {
        // 更新播放进度记录
        this.updateProgressData(info, result, __currentTime);
      }

      // 设置迷你音频播放状态
      localStorage.setItem("miniAudio", JSON.stringify(info));
      // 关联播放列表当前播放状态
      this.activeGoodNo = info[0];
    },
    // 更新播放进度记录
    updateProgressData (info, result, __currentTime) {
      var pid = info[1];
      var goodsId = info[8];

      for(let i = 0; i < result.length; i++) {
        // 当记录已经存在则更新
        if(pid == result[i].pid && goodsId == result[i].goods_id) {
          result[i].progress = __currentTime;
          // 设置节目列表播放进度，只设置不显示
          this.audioProgressData(result);
          // console.log('更新音频播放进度', result);
        }
      }
    },
    // 将当前专辑节目列表播放进度信息存放到localStorage
    audioProgressData(result) {
      /*
       * __goodsId专辑id
       * __goodsNo节目编号
       * __progress节目当前播放进度
       * __duration节目时长，单位s
       * __pid专辑id，单个节目pid默认为0
       */

      // localStorage存储
      localStorage.setItem("audioProgress", JSON.stringify(result));
    },
    // 判断是否需要新增进度
    progressAddOrUpdate(info, result) {
      var pid = info[1];
      var goodsId = info[8];
      this.isAdd = true;
      for(let i = 0; i < result.length; i++) {
        // 当记录已经存在则更新
        if(pid == result[i].pid && goodsId == result[i].goods_id) {
          this.isAdd = false;
        }
      }
    },
    // 新增播放进度记录
    addProgressData (info, result, __currentTime) {
      // 当记录不存在则添加
      /*
      * __goodsId专辑id
      * __goodsNo节目编号
      * __progress节目当前播放进度
      * __duration节目时长，单位s
      * __pid专辑id，单个节目pid默认为0
      */

      var arr = JSON.parse(localStorage.getItem("audioProgress"));

      var obj = {};
      obj.goods_id = info[8];
      obj.goods_no = info[0];
      obj.progress = info[5];
      obj.duration = info[4];
      obj.pid = info[1];

      // 100条上限，多于100条从第一条覆盖以此类推
      if(arr.length <= 100) {
        arr.push(obj);
      } else {
        arr = arr.pop();
      }
      
      localStorage.setItem("audioProgress", JSON.stringify(arr));

      console.log("当记录不存在则添加", 'goods_id:', info[8], 'goods_no:', info[0], 'progress:', __currentTime, 'pid:', info[1], "result:", arr);

    },
    // 点击播放
    playAudio(__currentTime) {
      // 切换播放状态
      this.audioData.type = false;
      this.clearClock();
      var audio = document.getElementById("musicPlayer");
      var second = parseInt(audio.currentTime);
      // 设置当前播放时间,false == 0,null != 0
      if(__currentTime || __currentTime == 0) {
        audio.currentTime = __currentTime;
        second = __currentTime;
      } 
      // 播放
      audio.play();
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
      this.audioData.type = true;
      audio.currentTime = 0;

      // 重置
      this.currentTime__ = this.todate(0);
      this.audiobindtoslider(0);
      // 存储到localStorage
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      this.audioTimeChange(0, true);
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
      this.currentTime__ = this.todate(audio.currentTime);
      // 先暂停再播放
      this.pauseAudio();
      // 暂停后再次播放
      this.playAudio(audio.currentTime);
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
    // 点击上一个节目
    prevProgram() {
      this.allProgramData("prev");
    },
    // 点击下一个节目
    nextProgram() {
      this.allProgramData("next");
    },
    async allProgramData(actionType) {
      // 获取localStorage数据
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      // 当前节目不为单个商品
      if(info[1] != 0) {
        let data = {
          goods_id: info[1],
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
          var list = res.response_data.result;
          for (let i = 0; i < res.response_data.result.length; i++) {
            var type = list[i].goods_type;
            if (type == 1) type1 = 1;
            if (type == 2) type2 = 1;
            if (type == 6) type3 = 1;
            // 不包含文章类型
            if (list[i].goods_type != 6) {
              this.allProgramList.push(list[i]);
            }
            if (list[i].goods_no == info[0]) {
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
            // 更新localStorage:miniAudio数据
            this.updateLocalStorage(this.allProgramList[prev]);
            this.setPlayerAudio();
            // 音频切换时，设置下一音频duration显示时间
            this.setDuration();
            this.playAudio(0);
          } else if (actionType == "next" || this.autoPlay) {
            this.updateLocalStorage(this.allProgramList[next]);
            this.setPlayerAudio();
            // 音频切换时，设置下一音频duration显示时间
            this.setDuration();
            this.playAudio(0);
          } else {
            this.pauseAudio();
          }

          // console.log('prev:', prev, 'next:', next, 'count:', count, '节目列表总和：', this.allProgramList);

        } else {
          this.$toast(res.error_message);
        }
      }
    },
    // 更新localStorage:miniAudio数据
    updateLocalStorage(item) {
      // 获取localStorage数据
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      info[0] = item.goods_no;
      info[3] = item.file_path;
      info[4] = item.duration;
      // 获取当前节目播放进度
      // ??????????????????????
      info[5] = this.getAudioProgress(info, item);
      info[5] = 0;
      info[6] = item.title;
      localStorage.setItem("miniAudio", JSON.stringify(info));
    },
    // 获取当前节目播放进度
    getAudioProgress(info, item) {
      var pid = info[1];
      var goods_no = item.goods_no;
      var goods_id = item.goods_id;
      var result = JSON.parse(localStorage.getItem("audioProgress"));
      // 默认从0播放,如果localStorage有播放进度记录则从记录处播放
      var __currentTime = 0;

      // 遍历localStorage中记录进度的数组，获取当前节目当前进度
      for(let i = 0; i < result.length; i++) {
        if(goods_id == result[i].goods_id && pid == result[i].pid) {
          __currentTime = result[i].progress;
        }
      }

      // 如果当前节目有播放记录，跳到当前记录位置继续播放
      return __currentTime;
    },
    // 点击节目
    audioAction(item) {
      
      // 更新localStorage:miniAudio数据
      this.updateLocalStorage(item);
      this.setPlayerAudio();
      // 音频切换时，设置下一音频duration显示时间
      this.setDuration();

    },
  }
};
</script>