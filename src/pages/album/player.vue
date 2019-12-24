<template>
  <div id="musicPage">
    <div class="ratioBox">
      <div class="box bg">
        <img :src="baseData.pic" />
      </div>
      <div class="box pic" :class="{rotateAction: !playStatus}">
        <img :src="baseData.pic" />
      </div>
    </div>

    <div class="descBox">
      <div class="title">{{ baseData.title }}</div>
      <router-link
        :to="{name: 'albumdetail', query: {pid: pid,goods_id: goods_id}}"
        class="subTitle"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-list-line" />
        </svg>
        <span>文稿</span>
      </router-link>
    </div>

    <!-- 音频播放器 -->
    <audio
      id="musicPlayer"
      :src="baseData.file_path"
      preload="load"
      @ended="onEnded"
      autoplay="autoplay"
    ></audio>

    <!-- 进度条 -->
    <div class="sliderBox">
      <van-slider
        v-model="sliderValue"
        @change="audioSliderChange"
        :min="0"
        :max="100"
        bar-height="2px"
        active-color="#f05654"
        inactive-color="#eee"
      ></van-slider>
      <div class="currentTime">{{ currentTime__ }}</div>
      <div class="duration">{{ baseData.duration_str }}</div>
    </div>

    <!-- 控制 -->
    <div class="controlBox">
      <!-- 当前节目属于专辑时展示 -->
      <div class="category" v-if="pid != 0">
        <svg class="icon" aria-hidden="true" @click="showList">
          <use xlink:href="#icon-category-line" />
        </svg>
      </div>
      <div class="prev">
        <svg class="icon" aria-hidden="true" @click="prevProgram">
          <use xlink:href="#icon-prev-block" />
        </svg>
      </div>
      <div class="play" v-if="playStatus">
        <svg class="icon" aria-hidden="true" @click="playAudio">
          <use xlink:href="#icon-play-line" />
        </svg>
      </div>
      <div class="pause" v-else>
        <svg class="icon" aria-hidden="true" @click="pauseAudio">
          <use xlink:href="#icon-pause-line" />
        </svg>
      </div>
      <div class="next">
        <svg class="icon" aria-hidden="true" @click="nextProgram">
          <use xlink:href="#icon-next-block" />
        </svg>
      </div>
    </div>

    <!-- 播放列表 -->
    <audioList
      :goodsId="pid"
      :goodsNo="activeGoodNo"
      :audioStatus="!playStatus"
      ref="control"
      @audioChange="audioAction"
    ></audioList>
    
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/album/player.scss" lang="scss"></style>

<script>
import audioList from "./../../pages/album/list";
//  引入接口
import { ALBUM, ALBUM_DETAIL } from "../../apis/album.js";
import { USER_PLAYED_RECORD } from "../../apis/user.js";
// vue无刷新修改url参数
import merge from "webpack-merge";
export default {
  components: {
    audioList
  },
  data() {
    return {
      // 存储是否新增
      isAdd: false,
      // 专辑信息
      album_info: {},
      // 存放是否自动播放
      autoPlay: true,
      // 存放所有节目
      allProgramList: [],
      sliderValue: null,
      playStatus: true,
      activeGoodNo: null,
      currentTime__: "00:00",
      isLogin: 0,
      goods_id: null,
      pid: null,
      baseData: {}
    };
  },
  beforeDestroy() {
    // 播放结束后销毁倒计时
    this.clearClock();
  },
  mounted() {
    this.activeGoodNo = this.$route.query.goods_no;
    this.pid =
      this.$route.query.pid == "NaN" || this.$route.query.pid == null
        ? 0
        : this.$route.query.pid;
    this.goods_id = this.$route.query.goods_id;
    this.albumData(this.pid, this.goods_id);
  },
  methods: {
    // 更新localStorage:miniAudio数据
    updateMiniAudio(item) {
      // 获取localStorage数据
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      if (info == null) info = [];
      info[0] = this.$route.query.goods_no;
      info[1] = this.$route.query.pid;
      info[2] = item.pic[0];
      info[3] = item.file_path;
      info[4] = item.duration;
      info[5] = item.progress;
      info[6] = item.title;
      // 专辑标题
      info[7] = this.album_info.title;
      // 商品id
      info[8] = this.$route.query.goods_id;
      // 专辑图片
      info[9] = this.album_info.pic;
      localStorage.setItem("miniAudio", JSON.stringify(info));
    },
    // 获取专辑/商品接口信息
    async albumData(pid, goods_id) {
      var tStamp = this.$getTimeStamp();
      var data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        timestamp: tStamp,
        pid: this.$route.query.pid ? this.$route.query.pid : null,
        goods_id: this.$route.query.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);
      if (res.hasOwnProperty("response_code")) {
        // 存放专辑信息
        this.album_info = res.response_data.album_info;
        // 设置音频播放信息
        this.setBaseData("base", res.response_data.base);
        // 账号信息，是否登录
        this.isLogin = res.response_data.user_info.is_login;
        this.playAudio();
      } else {
        this.$toast(res.error_message);
      }
    },
    // 打开播放列表
    showList() {
      // 关联播放列表
      this.listData(this.activeGoodNo, true);
    },
    // 清除倒计时
    clearClock() {
      // 播放结束后销毁倒计时
      if (this.progressClock != null) {
        window.clearInterval(this.progressClock);
        this.progressClock = null;
      }
      if (this.clock != null) {
        window.clearInterval(this.clock);
        this.clock = null;
      }
    },
    // 播放
    playAudio() {
      this.audioStatus(false);
    },
    // 暂停
    pauseAudio() {
      this.audioStatus(true);
    },
    audioStatus(_status) {
      var audio = document.getElementById("musicPlayer");
      // if (audio.canPlayType("audio/mpeg") == "probably") {
        this.playStatus = _status;
        if (_status) {
          audio.pause();
        } else {
          audio.play();
        }
        var second = parseInt(audio.currentTime);
        console.log("当前播放时间：", second);
        this.audioTimeChange(second, _status);
      // } else {
      //   this.$toast("音频加载中...");
      // }
    },
    // 播放中倒计时
    audioTimeChange(second, type) {
      var audio = document.getElementById("musicPlayer");
      // 暂停
      if (type) {
        this.clearClock();
        return false;
      }
      this.clock = window.setInterval(() => {
        // 修复倒计时中音频paused状态改变的问题
        if (audio.paused) audio.play();
        if (second >= this.baseData.duration) {
          clearInterval(this.clock);
        } else {
          second++;
          audio.currentTime = second;
          this.currentTime__ = this.todate(second);
          // 绑定slider
          this.audiobindtoslider(second);
          console.log("倒计时：", second);
        }
      }, 1000);
      // 音频实时播放进度，每5s更新
      this.audioProgress();
    },

    // 音频实时播放进度，每5s更新
    audioProgress() {
      this.progressClock = window.setInterval(() => {
        this.updateProgress();
        this.$refs.control.progressListData();
        // console.log("每5s更新");
      }, 5000);
    },
    // 更新音频当前播放进度
    updateAudioProgress() {
      var audio = document.getElementById("musicPlayer");
      var __currentTime = audio.currentTime;
      // 获取localStorage数据
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      if (info != null && info.length > 0) info[5] = __currentTime;
      localStorage.setItem("miniAudio", JSON.stringify(info));
      // 用户播放进度记录
      this.currentTimeData(__currentTime);
    },
    // 更新音频播放进度
    updateProgress() {
      // 更新音频当前播放进度
      this.updateAudioProgress();
      // 判断是否需要新增进度
      this.progressAddOrUpdate();
      // 根据pid + goods_id来存储loacalStorage
      var result = JSON.parse(localStorage.getItem("audioProgress"));
      if (result == null || this.isAdd) {
        // 新增播放进度记录
        this.addProgressData();
      } else {
        // 更新播放进度记录
        this.updateProgressData();
      }
    },
    // 用户播放进度记录
    async currentTimeData(__currentTime) {
      // 已登录账号才存储到数据库
      if (this.isLogin == 0) return;

      // 如果是非专辑，则传入goods_id
      var _pid = this.$route.query.pid;
      var _goodsId = this.$route.query.goods_id;
      if (_pid == null || _pid == "NaN") {
        _pid = this.$route.query.goods_id;
        _goodsId = null;
      }
      var tStamp = this.$getTimeStamp();
      var data = {
        goods_id: _pid,
        sub_goods_id: _goodsId,
        duration: __currentTime,
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_PLAYED_RECORD(data);
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    // 判断是否需要新增进度
    progressAddOrUpdate() {
      var result = JSON.parse(localStorage.getItem("audioProgress"));
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      var pid;
      var goodsId;
      if (info != null && info.length > 0) {
        pid = info[1];
        goodsId = info[8];
      }
      this.isAdd = true;
      if (result != null && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          // 当记录已经存在则更新
          if (pid == result[i].pid && goodsId == result[i].goods_id) {
            this.isAdd = false;
          }
        }
      }
    },
    // 新增播放进度记录
    addProgressData() {
      // 当记录不存在则添加
      /*
       * __goodsId专辑id
       * __goodsNo节目编号
       * __progress节目当前播放进度
       * __duration节目时长，单位s
       * __pid专辑id，单个节目pid默认为0
       */

      var info = JSON.parse(localStorage.getItem("miniAudio"));
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
    },
    // 更新播放进度记录
    updateProgressData() {
      var info = JSON.parse(localStorage.getItem("miniAudio"));
      var result = JSON.parse(localStorage.getItem("audioProgress"));
      var audio = document.getElementById("musicPlayer");
      var __currentTime = audio.currentTime;
      var pid = info[1];
      var goodsId = info[8];

      if (result != null && result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          // 当记录已经存在则更新
          if (pid == result[i].pid && goodsId == result[i].goods_id) {
            result[i].progress = __currentTime;
            // 设置节目列表播放进度，只设置不显示
            localStorage.setItem("audioProgress", JSON.stringify(result));
          }
        }
      }
    },

    // 播放结束
    onEnded() {
      // this.$toast("end");
      this.clearClock();
      var audio = document.getElementById("musicPlayer");
      // 重置
      audio.currentTime = 0;
      this.currentTime__ = this.todate(0);
      // 绑定slider
      this.audiobindtoslider(0);
      // 节目上下切换
      this.allProgramData("next");
    },
    // 滑动进度条
    audioSliderChange() {
      this.clearClock();
      var audio = document.getElementById("musicPlayer");
      var c;
      if (this.sliderValue) {
        // 设置音频当前时间
        audio.currentTime = (this.sliderValue / 100) * this.baseData.duration;
        // 滑动到最后
        if (this.sliderValue > 100) {
          // 重置
          c = 0;
        } else {
          c = audio.currentTime;
        }
        // 设置当前播放时间
        this.currentTime__ = this.todate(c);
        // 绑定slider
        this.audiobindtoslider(c);
      }
      this.pauseAudio();
      this.playAudio();
    },
    // 点击上一个节目
    prevProgram() {
      this.allProgramData("prev");
    },
    // 点击下一个节目
    nextProgram() {
      this.allProgramData("next");
    },
    // 节目上下切换
    async allProgramData(actionType) {
      // 当前节目不为单个商品
      if (this.pid != 0) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.pid,
          page_size: 1000000000000000,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
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
            if (list[i].goods_no == this.$route.query.goods_no) {
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

          if (this.allProgramList && this.allProgramList.length > 0) {
            // 当前列表只有一条
            if (this.allProgramList.length == 1) {
              this.$toast("当前列表只有一条");
              return;
            }
            var count = this.allProgramList.length;
            prev = prev < 0 ? count - 1 : prev;
            next = next > count - 1 ? 0 : next;
          } else {
            prev = 0;
            next = 0;
          }

          var item;
          // 判断是prev还是next，或者是自动播放完毕
          if (actionType == "prev") {
            // 节目已支付
            if (
              this.allProgramList[prev].is_payed == 0 &&
              this.allProgramList[prev].is_free == 0
            ) {
              this.pauseAudio();
              this.$toast("上一个节目收费");
              return;
            } else {
              item = this.allProgramList[prev];
            }
          } else if (actionType == "next" || this.autoPlay) {
            // 节目已支付
            if (
              this.allProgramList[next].is_payed == 0 &&
              this.allProgramList[next].is_free == 0
            ) {
              this.pauseAudio();
              this.$toast("下一个节目收费");
              return;
            } else {
              item = this.allProgramList[next];
            }
          }

          // 重置音频播放信息以及当前slider进度
          this.resetAudioSliderInfo();
          // 设置音频播放信息
          this.setBaseData("item", item);
        } else {
          this.$toast(res.error_message);
        }
      } else {
        this.$toast("当前为单个节目");
      }
    },
    // 点击节目
    audioAction(item) {
      // 未支付
      if (item.goods_id != null && item.is_payed == 0 && item.is_free == 0) {
        var _goodsId = null;
        if (item.sale_style == 1) {
          _goodsId = this.pid;
        } else {
          _goodsId = item.goods_id;
        }
        this.$router.push({
          name: "payaccount",
          query: { goods_id: _goodsId }
        });
        return;
      }
      // 切换节目设置当前播放器播放信息
      this.setAudioInfo(item);
    },
    // 切换节目设置当前播放器播放信息
    setAudioInfo(item) {
      // 关联播放列表
      this.listData(item.goods_no, false);

      // 设置音频播放信息
      this.setBaseData("item", item);
      this.$router.replace({
        query: merge(this.$route.query, {
          goods_id: item.goods_id,
          goods_no: item.goods_no
        })
      });

      // 重置音频播放信息以及当前slider进度
      this.resetAudioSliderInfo();
    },
    // 重置音频播放信息以及当前slider进度
    resetAudioSliderInfo() {
      this.clearClock();
      var audio = document.getElementById("musicPlayer");
      audio.currentTime = 0;
      // 设置当前播放时间
      this.currentTime__ = this.todate(0);
      // 绑定slider
      this.audiobindtoslider(0);
      this.pauseAudio();
      this.playAudio();
    },
    // 设置音频播放信息
    setBaseData(_type, item) {
      if (_type == "base") {
        this.baseData.duration_str = item.duration_str;
        this.baseData.duration = item.duration;
        // this.sliderValue = (item.progress / item.duration) * 100;
        this.sliderValue = 0;
      }
      if (_type == "item") {
        this.baseData.duration_str = item.duration;
        this.baseData.duration = item.ori_duration;
        this.activeGoodNo = item.goods_no;
        this.$router.replace({
          query: merge(this.$route.query, {
            goods_id: item.goods_id,
            goods_no: item.goods_no
          })
        });
      }
      this.baseData.title = item.title;
      this.baseData.pic = item.pic;
      this.baseData.file_path = item.file_path;
      document.title = "正在播放-" + item.title;
      // 更新localStorage:miniAudio数据
      this.updateMiniAudio(item);
    },
    // 关联播放列表
    listData(goods_no, _bool) {
      this.activeGoodNo = goods_no;
      if (_bool) this.$refs.control.goodsNo = goods_no;
      this.$refs.control.popupModel = _bool;
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
    // 绑定slider
    audiobindtoslider(second) {
      var percent = (second / this.baseData.duration) * 100;
      // 设置slider进度
      this.sliderValue = percent;
    }
  }
};
</script>
