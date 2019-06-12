<template>
  <div id="miniAudio">
    <!-- 播放器缩略 -->
    <van-row class="miniAudio" :class="{ iphx: this.isIphx }">
      <van-col span="16">
        <div class="ratioBox" @click="toPlayer">
          <div class="box" :class="{rotateAction: !audioData.type}">
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
      <van-col span="8" class="action" :class="{active: isList}">
        <svg v-if="isList" class="icon category" aria-hidden="true" @click="showList">
          <use xlink:href="#icon-category-line"></use>
        </svg>

        <div class="play" @click="playAudio(null)" v-if="audioData.type || playType">
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
import { USER_PLAYED_RECORD } from "./../apis/user.js";
export default {
  name: "music",
  props: ["audioData", "rank", "loginStatus"],
  data() {
    return {
      playType: true,
      // 存储是否新增
      isAdd: false,
      // 是否显示播放列表入口
      isList: true,
      // 调用接口计数器防止重复
      count: 0, // 1表示可调用记录接口
    };
  },
  // 解决子组件数据实时刷新问题
  watch: {
    audioData: {
      handler(newValue, oldValue) {
        // console.log(newValue)
      },
      deep: true
    },
    loginStatus: {
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
    console.log(999, this.loginStatus)
    // 播放结束后销毁倒计时
    this.clearClock();
    // 判断是否显示节目列表入口
    this.hasList();
    // 非专辑节目goods_id，不存在播放列表，隐藏miniAudio.vue列表入口
    var info = JSON.parse(localStorage.getItem("miniAudio"));
    if (info != null && info[1] == null) {
      this.isList = false;
    } else {
      this.isList = true;
    }

    this.audioData.type = true;
    // // 设置音频播放状态
    this.setPlayerAudio();
    // 延时600ms设置duration
    this.setDuration();
    // 暂停音频
    setTimeout(() => {
      this.pauseAudio();
    }, 600);
  },
  methods: {
    // 设置音频播放状态
    setPlayerAudio() {
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      if (info != null && info.length != 0) {
        // 当前播放节目
        if (info[0] != null && info[0] != "") this.activeGoodNo = info[0];
        if (info[1] != null && info[1] != "") this.programGoodsId = info[1];
        if (info[2] != null && info[2] != "") this.audioData.pic = info[2];
        // 专辑
        // if(info[2] != null && info[2] != "") this.baseData.pic = info[2];
        if (info[3] != null && info[3] != "") {
          // 初始化音频
          this.audioData.src = info[3];
        }
        if (info[5] != null && info[5] != "") {
          this.currentSecond = info[5];
          this.audioData.currentTime = info[5];
          // 存储currentTime时间格式
          this.currentTime__ = this.todate(info[5]);
        }
        if (info[6] != null && info[6] != "") this.audioData.program = info[6];
        // if(info[7] != null && info[7] != "") this.baseData.title = info[7];
        // if(info[8] != null && info[8] != "") this.baseData.goods_id = info[8];
      }
    },
    // 延时600ms设置duration
    setDuration() {
      var audio = document.getElementById("myMiniAudio");
      var self = this;

      // if(audio.canPlayType('audio/mpeg') == "probably") {
      // }

      setTimeout(function() {
        self.audioData.duration = audio.duration;
        self.duration__ = self.todate(audio.duration);
        // 设置slider当前播放进度
        self.audioData.sliderValue =
          (self.audioData.currentTime / audio.duration) * 100;
        // slider和音频播放同步
        self.audioSliderChange();
      }, 600);
    },
    // 用户播放进度记录
    async currentTimeData(info) {
      // 已登录账号才存储到数据库
      if(this.loginStatus == 0) {
        return;
      }
      
      // 调用接口计数器防止重复
      // 如果是非专辑，则传入goods_id
      var _pid = info[1];
      var _goodsId = info[8];
      if(info[1] == null) {
        _pid = info[8];
        _goodsId = null;
      }
      var tStamp = this.$getTimeStamp();
      if (info != null && info.length > 0) {
        var data = {
          goods_id: _pid,
          sub_goods_id: _goodsId,
          duration: info[5],
          timestamp: tStamp,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await USER_PLAYED_RECORD(data);
        if (res.hasOwnProperty("response_code")) {
        } else {
          this.$toast(res.error_message);
        }
      }
    },
    // 判断是否显示节目列表入口
    hasList() {
      // 非专辑节目goods_id，不存在播放列表，隐藏miniAudio.vue列表入口
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      if (info != null && info.length > 0 && info[1] == null) {
        this.isList = false;
      } else {
        this.isList = true;
      }
    },
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
        if (document.getElementById("myMiniAudio").paused)
          document.getElementById("myMiniAudio").play();

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
    // 更新迷你音频播放进度
    updateProgress() {
      // 音频当前播放时间localStorage
      var __currentTime = document.getElementById("myMiniAudio").currentTime;

      // 存储到localStorage: miniAudio
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      // 存储到localStorage: audioProgress
      var result = JSON.parse(localStorage.getItem("audioProgress"));

      // 更新当前时间
      if (info != null && info.length > 0 && this.count == 1) {
        info[5] = __currentTime;
        // 用户播放进度记录
        this.currentTimeData(info);
      }

      // 判断是否需要新增进度
      this.progressAddOrUpdate(info, result);
      // console.log(result)
      // 根据pid + goods_id来存储loacalStorage
      if (result == null || this.isAdd) {
        // 新增播放进度记录
        this.addProgressData(info, result, __currentTime);
      } else {
        // 更新播放进度记录
        this.updateProgressData(info, result, __currentTime);
      }

      // 设置迷你音频播放状态
      this.$emit("setMiniAudio", info);
      
      console.log(123, "miniAudio:", "info:", info, "currentTime:", __currentTime, "result:", result, this.isAdd);
    },
    // 更新播放进度记录
    updateProgressData(info, result, __currentTime) {
      var pid = info[1];
      var goodsId = info[8];

      if (result != null && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          // 当记录已经存在则更新
          if (pid == result[i].pid && goodsId == result[i].goods_id) {
            result[i].progress = __currentTime;
            // 设置节目列表播放进度，只设置不显示
            this.$emit("setProgress", result);
            // console.log('更新音频播放进度', result);
          }
        }
      }
    },
    // 判断是否需要新增进度
    progressAddOrUpdate(info, result) {
      if (info != null && info.length > 0) {
        var pid = info[1];
        var goodsId = info[8];
        this.isAdd = true;

        if (result != null && result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            // 当记录已经存在则更新
            if (pid == result[i].pid && goodsId == result[i].goods_id) {
              this.isAdd = false;
            }
          }
        }
      }
    },
    // 新增播放进度记录
    addProgressData(info, result, __currentTime) {
      // 当记录不存在则添加
      /*
       * __goodsId专辑id
       * __goodsNo节目编号
       * __progress节目当前播放进度
       * __duration节目时长，单位s
       * __pid专辑id，单个节目pid默认为0
       */

      var arr = JSON.parse(localStorage.getItem("audioProgress"));
      if (info != null && info.length > 0) {
        var obj = {};
        obj.goods_id = info[8];
        obj.goods_no = info[0];
        obj.progress = info[5];
        obj.duration = info[4];
        obj.pid = info[1];

        // 100条上限，多于100条从第一条覆盖以此类推
        if (arr == null) arr = [];
        if (arr.length <= 100) {
          arr.push(obj);
        } else {
          arr = arr.pop();
        }
      }

      localStorage.setItem("audioProgress", JSON.stringify(arr));

      // console.log("当记录不存在则添加", 'goods_id:', info[8], 'goods_no:', info[0], 'progress:', __currentTime, 'pid:', info[1], "result:", arr);
    },
    // 点击播放
    playAudio(__currentTime) {
      this.count = 1;
      this.clearClock();
      // 非专辑节目goods_id，不存在播放列表，隐藏miniAudio.vue列表入口
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      // 用户播放进度记录
      if(info != null && info.length > 0) this.currentTimeData(info);

      if (info[1] == null) {
        this.isList = false;
      } else {
        this.isList = true;
      }
      // 切换播放状态
      this.playType = false;
      var audio = document.getElementById("myMiniAudio");
      var second = parseInt(audio.currentTime);
      // 设置当前播放时间null != 0，null为点击播放按钮，继续播放或者获取localstorage记录
      if (__currentTime == null) {
        // audio.currentTime = 0;
        // second = __currentTime;
      }
      // 播放
      audio.play();
      this.$emit("setType", false);
      this.audioTimeChange(second, false);
      console.log("播放");
    },
    // 点击暂停
    pauseAudio() {
      // 判断是否显示节目列表入口
      this.hasList();
      this.clearClock();
      var audio = document.getElementById("myMiniAudio");
      // 暂停
      if(audio) audio.pause();
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
      if (audio && this.audioData.sliderValue) audio.currentTime = (this.audioData.sliderValue / 100) * audio.duration;
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
      this.$emit("linkToPlayer", "");
    }
    // 每5s、点击play、点击pzause、ended更新localStorage中audioProgress数据
  }
};
</script>

