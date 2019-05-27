<template>
  <div id="detailPage" class="page" :class="{ active: this.isIphx }">
    <div class="ratioBox banner">
      <div class="box" v-if="baseData.goods_type != 2">
        <img v-if="baseData.pic" :src="baseData.pic[0]">
      </div>
      <!-- goodsType区分商品类型，音频1/视频2/专辑9/文章6/图书 -->
      <div @click="gotoPlayer('external')" class="box layer" v-if="baseData.goods_type == 1">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-audio-circle"></use>
        </svg>
      </div>
      <div class="box layer" v-if="baseData.goods_type == 2">
      <video :src="baseData.file_path" controls width="100%" height="100%"></video>
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-videoPause-line"></use>
        </svg> -->
      </div>

      <!-- 不属于专辑的商品显示收藏当前商品 -->
      <van-row class="action" v-if="!pid">
        <van-col class="title" span="18">{{ baseData.title }}</van-col>
        <van-col span="6">
          <div @click="collectAction(baseData.collect_id, baseData.goods_id)" style="text-align:right;">
            <svg class="icon" aria-hidden="true" v-if="baseData.collect_id > 0">
              <use xlink:href="#icon-collect-block"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-collect-line"></use>
            </svg>
            <span>
              <template v-if="baseData.collect_id > 0">已</template>收藏
            </span>
          </div>
        </van-col>
      </van-row>

    </div>

    <!-- 属于专辑的节目显示是否收藏专辑 -->
    <div class="albumBox" v-if="pid">
      <div class="ratioBox">
        <div class="box">
          <img :src="baseData.pic[0]">
        </div>
      </div>
      <div class="issue">
        <div class="title">{{ baseData.title }}</div>

        <div class="info">{{ baseData.sub_title }}</div>
      </div>
      <div class="action" style="text-align:right;" @click="collectAction(baseData.collect_id, baseData.goods_id)">
        <van-tag plain type="danger" text-color="#f05654">
          <svg class="icon" aria-hidden="true" v-if="baseData.collect_id > 0">
            <use xlink:href="#icon-collect-block"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-collect-line"></use>
          </svg>
          <span>
            <template v-if="baseData.collect_id > 0">已</template>收藏
          </span>
        </van-tag>
      </div>
    </div>
    <!-- 不属于专辑的商品显示关注公号 -->
    <div class="publish" v-else>
      <div class="from">
        <img v-lazy="brandInfoData.header_pic" class="icon">
        <div class="publishInfo">
          <p class="publishName">{{ brandInfoData.name }}</p>
          <p class="focusNumber">已有{{ brandInfoData.fans }}人关注</p>
        </div>
      </div>
      <span class="focus add" v-if="brandInfoData.is_followed == 0" @click="focusAction">+关注</span>
      <span class="focus" v-else @click="focusAction">已关注</span>
    </div>

    <!-- 介绍 - 评论 -->
    <van-tabs v-model="tabModel" sticky @click="tabChange">
      <van-tab v-for="(item, key) in tabData" :title="item.title" :key="key">
        <template v-if="item.type == 'info'"></template>
        <template v-if="item.type == 'list'"></template>
      </van-tab>
    </van-tabs>

    <!-- 推荐 -->
    <!-- 商品类型, 1=> 音频, 2=> 视频, 3=> 纸书, 4=> 电子书, 5=> 文创用品, 6=> 图文, 9=> 专辑 -->
    <template v-if="recommendList.length > 0">
      <van-cell title="听了本节目的也在听" value/>
      <van-row gutter="20" class="booklist">
        <van-col span="8" v-for="(item, key) in recommendList" :key="key">
          <div class="ratioBox" @click="gotoLink(item)">
            <div class="box">
              <img :src="item.pic[0]">
            </div>
          </div>
          <div class="title" style="height: 40px;">{{ item.title }}</div>
        </van-col>
      </van-row>
    </template>

    <!-- 评论 -->
    <div id="comment" class="commentBox">
      <div id="commentTitle">
        <van-cell
          :title="totalCount"
          is-link
          value="我要评论"
          @click="openAnswer('comment', null)"
        />
      </div>

      <van-list
        v-model="commentLoading"
        :finished="commentFinished"
        finished-text="没有更多了"
        @load="commentLoad"
      >
        <div class="listBox" v-for="(item, key) in discussData" :key="key">
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.user_header">
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">
              <div class="text">{{ item.nick_name }}</div>
            </div>
            <div class="subTitle">{{ item.content }}</div>

            <div class="messageBox" v-if="answerData[key].length > 0">
              <!-- 回复 -->

              <!-- <div
                class="message active"
                v-for="(replyItem, key) in item.reply_list"
                :key="key"
              >
                <span class="name">{{ replyItem.nick_name }}</span>
                <span class="dialog">{{ replyItem.content }}</span>
              </div>-->

              <div
                class="message active"
                v-for="(replyItem, key) in answerData[key]"
                :key="key"
              >
                <span class="name">{{ replyItem.nick_name }}</span>
                <span class="dialog">{{ replyItem.content }}</span>
              </div>

              <div
                class="message active"
                v-if="item.reply_num > 2 && replyPage[key] - 1 < item.reply_total_page"
              >
                <!-- <van-pagination v-model="item.reply_current_page" :page-count="item.reply_total_page" mode="simple" @change="pageChange(item.comment_id, key)" /> -->

                <span class="name" @click="pageChange(item.comment_id, key)">
                  共{{ item.reply_num }}条回复
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fold-line"></use>
                  </svg>
                  <!-- <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-unfold-line"></use>
                  </svg>-->
                </span>
              </div>
            </div>

            <!-- 回复 -->
            <div class="answerBox">
              <span class="date">{{ item.create_time }}</span>
              <span class="action" @click="openAnswer('reply', item.comment_id)">回复</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <div v-if="baseData.is_free == 0 || baseData.is_payed == 0" style="height: 60px;"></div>
    <div v-if="myAudioData.src" style="height: 60px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>

    <!-- 试听 - 购买 -->
    <van-goods-action
      :class="{ iphx: this.isIphx }"
      v-if="baseData.is_free == 0 || baseData.is_payed == 0"
    >
      <van-goods-action-mini-btn
        icon="play-circle-o"
        text="试听"
        @click="preListenAction"
        v-if="baseData.has_free && preListen"
      />
      <van-goods-action-big-btn primary :text="'¥ '+baseData.price + ' 购买'" @click="buyAction(goodsId)"/>
    </van-goods-action>

    <!-- 音频缩略 -->
    <miniAudio
      :class="{isShow: myAudioData.src}"
      :audioData="myAudioData"
      :rank="rankType"
      ref="control"
      @setType="typeAction"
      @setMiniAudio="miniAudioData"
      @setProgress="audioProgressData"
      @showAudioList="audioListShow"
      @linkToPlayer="gotoPlayer"
      @getAllProgram="getAllProgramData"
    ></miniAudio>

    <!-- 播放列表 -->
    <audioList
      :goodsId="goodsId"
      :albumInfo="baseData"
      :goodsNo="activeGoodNo"
      :audioStatus="audioPlaying"
      @audioChange="audioAction"
      ref="controlList"
    ></audioList>

    <!-- 评论 -->
    <van-popup v-model="commentModel" position="bottom">
      <div class="audioList">
        <div class="title">
          <div class="action" @click="commentClose">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold-line"></use>
            </svg>
          </div>
          <div>发表评论</div>
          <div class="punish" @click="punishComment">发布</div>
        </div>
        <!-- 音频列表 -->
        <div class="content">
          <textarea v-model="contentModel" placeholder="快来写评论吧!" @input="inputChange"></textarea>
          <div class="count">
            <span :class="{ active: contentLength > contentTotal }">{{ contentLength }}</span>
            /{{ contentTotal }}
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/album/detail.scss" lang="scss"></style>
<style scoped>

.van-button {
  border-radius: 0;
}
</style>


<script>
import miniAudio from "./../../components/miniAudio";
import audioList from "./../../pages/album/list";
import { ALBUM, ALBUM_DETAIL } from "../../apis/album.js";
import {
  COLLECT_ADD,
  COLLECT_CANCEL,
  FOCUS_ADD,
  FOCUS_CANCEL,
  COMMENT,
  COMMENT_ADD,
  RECOMMEND
} from "../../apis/public.js";

export default {
  components: {
    miniAudio,
    audioList
  },
  data() {
    return {
      /*
       * ----------------------------------节目----------------------------------
       */
      showHistory: true,
      programList: [],
      programPage: 1,
      // 分页
      programLoading: false,
      programFinished: false,
      // 节目总数
      programTotalCount: 0,
      // 迷你音频当前节目信息
      myAudioData: {},
      // 存放当前播放音频key值
      activeGoodNo: null,
      // 存放当前播放器播放状态
      audioPlaying: false,
      // 排序
      rankType: 0, // 默认0倒序, 1正序
      // 记录节目播放进度
      progressList: [],
      /*
       * ----------------------------------介绍----------------------------------
       */
      // 专辑id
      pid: null,
      // 商品id
      goodsId: null,
      // 账号信息，是否登录
      userInfo: false,
      // 专辑基础信息
      albumInfo: {},
      // 基础信息
      baseData: {
        title: "",
        sub_title: "",
        pic: [],
        goods_type: null,
        collection_num: 0,
        collect_id: null
      },
      // 所属媒体信息
      brandInfoData: {
        header_pic: "",
        name: "",
        fans: 0,
        is_followed: null
      },
      // 选项卡
      tabData: [
        {
          title: "介绍"
        },
        {
          title: "评论"
        },
      ],
      tabModel: 2,
      // 评论
      discussData: [],
      commentPage: 1,
      totalCount: 0,
      // 发布评论
      commentModel: false,
      contentModel: "",
      contentTotal: 30,
      contentLength: 0,
      // 分页
      commentLoading: false,
      commentFinished: false,
      // 回复
      replyPage: [],
      answerData: [],
      // 存放回复评论comment_id
      commentId: null,
      // 存放发布按钮类型，comment为发布评论，reply为发布回复
      punishType: "comment",
      // 推荐
      recommendList: [],
    };
  },
  beforeDestroy(){
    $(window).off('scroll');
  },
  //离开当前页面
  // beforeRouteLeave(to, from, next) {
  //   if(to.name == 'album' ) {
  //     localStorage.setItem('globalPid', this.$route.params.pid ? this.$route.params.pid: parseInt(localStorage.getItem('globalPid')));
  //   }
  //   if(to.name == 'article') {
  //   }
  //   next();
  // },
  mounted() {

    // 跳转评论锚点
    $(window).on('scroll', function(){
      if($(window).scrollTop() >= $('#comment').offset().top) {
        $('#commentTitle').css({'position': 'fixed', 'border-bottom-width': '1px'});
      }else {
        $('#commentTitle').css({'position': 'relative', 'border-bottom-width': 0});
      }
    })
    // globalAlbum 存放专辑页当前 pid

    // globalProgramPId 存放节目页当前 pid, 
    // globalProgramGoodsId 存放节目页当前 goods_id, 
    // globalProgramGoodsNo 存放节目页当前 activeGoodNo

    // GlobalArtical 存放文章页当前 goods_id
    // 1、路由进入，
    // 2、当前页刷新（读取localStorage），
    // 3、当前页推荐商品进入当前页（点击事件修改localStorage），
    // 4、回退进入（上一个页面回退时修改localStorage），专辑、文章、节目三个页面回退情况
    
    // 当路由进入当前页面，参数读取路由并更新localstorage，当不是路由进入从localStorage读取参数
    if(this.$route.params.goods_id) {
      this.pid = this.$route.params.pid;
      localStorage.setItem('globalProgramPId', this.$route.params.pid);
    } else {
      this.pid = parseInt(localStorage.getItem('globalProgramPId'))
    }
    if(this.$route.params.goods_id) {
      this.goodsId = this.$route.params.goods_id;
      localStorage.setItem('globalProgramGoodsId', this.$route.params.goods_id);
    } else {
      this.goodsId = parseInt(localStorage.getItem('globalProgramGoodsId'))
    }
    if(this.$route.params.goods_no) {
      this.activeGoodNo = this.$route.params.goods_no;
      localStorage.setItem('globalProgramGoodsNo', this.$route.params.goods_no);
    } else {
      this.activeGoodNo = parseInt(localStorage.getItem('globalProgramGoodsNo'))
    }

    // 基础信息
    this.albumData();
    // 推荐
    this.recommendData();
  },
  methods: {
    // --------------------------------迷你缩略音频----------------------------------
    // 点击播放，子组件关联父页面 - 切换miniAudio组件播放状态
    typeAction(__type) {
      /*
       * __type == true; 播放
       * __type == false; 暂停
       */
      // 关联节目列表播放状态
      this.myAudioData.type = __type;
      this.audioPlaying = !__type;
      // console.log('节目列表:',this.programList);
    },
    // 播放/暂停音频
    audioAction(item) {
      var goods_no = item.goods_no;

      let __goodsNo = item.goods_no;
      let __pid = this.baseData.goods_id ? this.baseData.goods_id : 0;;
      let __pic = this.baseData.pic[0];
      let __src = this.baseData.file_path;
      // let __src = require('./../../assets/music.mp3');
      let __duration = this.baseData.duration;
      // 获取当前节目播放进度
      let __currentTime = 0;
      // let __currentTime = this.getAudioProgress(item);
      let __program = this.baseData.title;
      let __album = this.albumInfo.title;
      let __goodsId = this.goodsId;

      // 存放当前音频信息
      for (let i = 0; i < this.programList.length; i++) {
        if (this.programList[i].goods_no == goods_no) {
          __goodsNo = this.programList[i].goods_no;
          __src = this.programList[i].file_path;
          __program = this.programList[i].title;
          __duration = this.programList[i].duration;
        }
      }

      // 判断是否点击当前或者第一次点击
      if (this.activeGoodNo == goods_no || this.activeGoodNo == null) {
        this.audioPlaying = !this.audioPlaying;
      } else {
        this.audioPlaying = true;
      }

      // 父页面关联子组件
      setTimeout(() => {
        if (this.audioPlaying) {
          // this.$refs.control.pauseAudio();
          this.$refs.control.playAudio(__currentTime);
        } else {
          this.$refs.control.pauseAudio();
        }
      }, 600);

      // 管理子组件播放状态
      this.activeGoodNo = goods_no;

      var info = [__goodsNo, __pid, __pic, __src, __duration, __currentTime, __program, __album, __goodsId];
      this.miniAudioData(info);

      // 解决子组件数据实时刷新问题
      this.$refs.control.audioData.type = !this.audioPlaying;
      // console.log(info)
    },
    // 获取当前节目播放进度
    getAudioProgress(item) {
      var pid = this.baseData.goods_id;
      var goods_no = item.goods_no;
      var goods_id = item.goods_id;
      var result = JSON.parse(localStorage.getItem("audioProgress"));
      // 默认从0播放,如果localStorage有播放进度记录则从记录处播放
      var __currentTime = 0;

      if(result != null && result.length > 0) {

        // 遍历localStorage中记录进度的数组，获取当前节目当前进度
        for(let i = 0; i < result.length; i++) {
          if(goods_id == result[i].goods_id && pid == result[i].pid) {
            __currentTime = result[i].progress;
          }
        }
      }

      // 如果当前节目有播放记录，跳到当前记录位置继续播放
      return __currentTime;
    },
    // 将当前音频播放信息存放到localStorage: miniAudio
    miniAudioData(info) {
      /*
       * __goodsNo节目编号
       * __type:true,默认暂停
       * __pic专辑封面
       * __src音频地址
       * __duration音频时长，单位s
       * __currentTime音频当前播放位置，单位s
       * __program节目标题
       * __album专辑标题
       * __goodsId专辑id
       */
      if(info != null && info.length != 0) {
        let __goodsNo = info[0];
        let __type = info[1];
        let __pic = info[2];
        let __src = info[3];
        let __duration = info[4];
        let __currentTime = info[5];
        let __program = info[6];
        let __album = info[7];
        let __goodsId = info[8];
        let __albumPic = info[9];

        // 设置音频信息
        this.$set(this.myAudioData, "goodsNo", __goodsNo);
        this.$set(this.myAudioData, "type", __type);
        this.$set(this.myAudioData, "pic", __pic);
        this.$set(this.myAudioData, "src", __src);
        this.$set(this.myAudioData, "duration", __duration);
        this.$set(this.myAudioData, "currentTime", __currentTime);
        this.$set(this.myAudioData, "program", __program);
        this.$set(this.myAudioData, "album", __album);
        this.$set(this.myAudioData, "goodsId", __goodsId);

        // localStorage存储
        // info = JSON.parse(localStorage.getItem('miniAudio'));
        localStorage.setItem("miniAudio", JSON.stringify(info));

        // 当前专辑与localStorage一致时,关联播放列表当前播放状态
        if (info[8] == this.goodsId) this.activeGoodNo = info[0];

        // console.log('存储迷你音频信息:', info);

        // 解决父页面子组件实时刷新问题
        setTimeout(() => {
          this.$refs.control.audioData.pic = __pic;
          this.$refs.control.audioData.src = __src;
          this.$refs.control.audioData.currentTime = __currentTime;
          this.$refs.control.audioData.duration = __duration;
          this.$refs.control.audioData.program = __program;
          this.$refs.control.audioData.album = __album;

          // this.$refs.control.audiobindtoslider(info[5]);
          // 设置当前播放进度
          // this.$refs.control.audioData.sliderValue = (info[5] / audio.duration) * 100;
          // this.$refs.control.audioSliderChange();
        }, 600);

        if (!__src) {
          $("#miniAudio").css("display", "none");
        } else {
          $("#miniAudio").css("display", "block");
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
       */

      // localStorage存储
      localStorage.setItem("audioProgress", JSON.stringify(result));

      // console.log('result:', this.progressList);
    },  
    audioListShow(__type) {
      this.$refs.controlList.popupModel = true;
      // 关联list.vue播放列表
      this.$refs.controlList.goodsNo = this.activeGoodNo;
      this.$refs.controlList.goodsId = this.goodsId;
    },
    // 跳转到音乐播放器
    gotoPlayer(__type) {
      if(__type == 'external') {
        // console.log(this.baseData)
        // this.audioAction(this.baseData);

        var info = JSON.parse(localStorage.getItem('miniAudio'));

        if(info == null) {
          info = [];
        }
        // 新增迷你缩放音频播放信息
        info[0] = parseInt(localStorage.getItem('globalGoodsNo'));
        info[1] = parseInt(localStorage.getItem('globalPid'));
        info[2] = this.baseData.pic[0];
        info[3] = this.baseData.file_path;
        info[4] = this.baseData.duration;
        info[5] = 0;
        info[6] = this.baseData.title;
        info[7] = this.albumInfo.title;
        info[8] = parseInt(localStorage.getItem('globalGoodsId'));
        info[9] = this.albumInfo.pic;

        // localStorage存储
        localStorage.setItem("miniAudio", JSON.stringify(info));

      }
      // 外链至音乐播放器，设置info
      this.$router.push({name: "player", params: {}});
    },
    // 当前节目播放结束，获取当前播放节目的专辑下所有节目（不分页）
    getAllProgramData(info) {
      this.allProgramData(info, "end");
    },
    async allProgramData(info, actionType) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: info[8],
        goods_no: this.rankType,
        page_size: 1000000000000000,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM_DETAIL(data);
      // 存储当前节目的下一项
      var next;

      if (res.hasOwnProperty("response_code")) {
        var type1 = 0;
        var type2 = 0;
        var type3 = 0;
        // 异步更新数据
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
            next = i + 1;
          }
        }

        // 专辑is_payed:0未支付；1已支付，未支付不能自动播放
        if (eval(type1 + type2 + type3) > 1 || this.baseData.is_payed == 0) {
          this.autoPlay = false;
        } else {
          this.autoPlay = true;
        }

        if(this.allProgramList && this.allProgramList.length > 0) {
          var count = this.allProgramList.length;
          next = next > count - 1 ? 0 : next;
        }else {
          next = 0;
        }

        // 当点击全部播放，从第一条开始播放
        if (actionType == "all") next = 0;
      } else {
        this.$toast(res.error_message);
      }

      if (this.autoPlay) {
        // 单一类型，自动播放
        this.updateLocalStorage(this.allProgramList[next]);
        // console.log("当前播放的下一项：", this.allProgramList[next]);
        // console.log("单一类型，自动播放");
      } else {
        // 含多种类型，不自动播放
        this.$toast("含多种类型或者专辑未支付，不自动播放");
        this.$refs.control.pauseAudio();
      }
    },
    // 读取localStorage：miniAudio音频缩略播放器数据
    getMiniAudioData() {
      // 设置迷你音频信息
      var info = JSON.parse(localStorage.getItem("miniAudio"));

      if(info != null && info.length > 0) {

        // if (info[0] != "") this.activeGoodNo = info[0];
        // 将当前音频播放信息存放到localStorage: miniAudio
        this.miniAudioData(info);

        // 解决子组件数据实时刷新问题
        this.$refs.control.audioData.type = !this.audioPlaying;
        // 设置当前播放进度
        setTimeout(() => {
          var audio = document.getElementById("myMiniAudio");
          // currentTime关联slider进度
          if(info[5] != null && info[5] != '')  this.$refs.control.audioData.sliderValue =
            (info[5] / audio.duration) * 100;
          // 当无播放记录的时候
          if (info[4] != null && info[4] != "") this.$refs.control.audioSliderChange();
        }, 600);
        
      }

    },
    // ----------------------------------介绍------------------------------------
    // 获取专辑/商品接口信息
    async albumData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timeStamp: tStamp,
        pid: this.pid ? this.pid : null,
        goods_id: this.goodsId,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);
      // console.log(res.response_data)

      if (res.hasOwnProperty("response_code")) {

        //专辑基础信息
        this.albumInfo = res.response_data.album_info;
        // 当前商品基础信息
        this.baseData = res.response_data.base;
        // 公号信息
        this.brandInfoData = res.response_data.brand_info;
        // 账号信息，是否登录
        this.userInfo = res.response_data.user_info;

        // 所属媒体信息
        // this.brandInfoData = res.response_data.brand_info;
      } else {
        this.$toast(res.error_message);
      }

      // console.log("商品基础信息:", res.response_data.base);

      // 读取localStorage音频缩略播放器数据
      this.getMiniAudioData();
    },
    // 获取收藏接口信息
    collectAction(__collectId, __goodsId) {

      if (__collectId > 0) {
        this.collectData("cancel", __goodsId);
      } else {
        this.collectData("collect", __goodsId);
      }
    },
    async collectData(__status, __goodsId) {
      var data = {};
      var tStamp = this.$getTimeStamp();
      var res;
      // 出错提示
      switch (__status) {
        case "collect":
          data = {
            timestamp: tStamp,
            type: this.baseData.goods_type,
            target: __goodsId,
            version: "1.0",
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_ADD(data);
          if (res.hasOwnProperty("response_code")) {
            this.baseData.collect_id = 1;
          } else {
            this.$toast(res.error_message);
          }
          // this.$toast("已收藏~");
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            goods_id: __goodsId,
            version: "1.0",
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_CANCEL(data);
          if (res.hasOwnProperty("response_code")) {
            this.baseData.collect_id = 0;
            this.$toast("已取消收藏~");
          } else {
            this.$toast(res.error_message);
          }
          break;
      }
    },
    // 获取关注接口信息
    async focusData(__type) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      var res;
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_ADD(data);
          this.brandInfoData.is_followed = 1;
          this.brandInfoData.fans++;
          // this.$toast('已关注~');
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.baseData.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          this.brandInfoData.is_followed = 0;
          this.brandInfoData.fans--;
          this.$toast("已取消关注~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    focusAction() {
      if (this.brandInfoData.is_followed > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("focus");
      }
    },
    // ----------------------------------评论------------------------------------
    commentLoad() {
      this.commentData();
    },
    async commentData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        page: this.commentPage,
        page_size: 5,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.discussData.push(result[i]);
            this.answerData.push(result[i].reply_list);
            this.replyPage.push(1);
            // console.log('评论：', result[i]);
          }
          // 加载状态结束
          this.commentLoading = false;
          this.commentPage++;

          // 数据全部加载完成
          if (this.discussData.length >= res.response_data.total_count) {
            this.commentFinished = true;
            this.commentPage = 1;
          }
        }, 600);

        // 设置总评论数
        this.totalCount = "评论 " + res.response_data.total_count;
        // console.log("当前页数组：", this.replyPage);
        // console.log("评论列表：", result);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 回复
    async replyData(comment_id, key) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        comment_pid: comment_id,
        page: this.replyPage[key],
        page_size: 5,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        for (let i = 0; i < result.length; i++) {
          this.answerData[key].push(result[i]);
        }
        if(this.replyPage[key] >= res.response_data.total_page) {
          this.replyPage[key] = res.response_data.total_page + 1;
        } else {
          this.replyPage[key]++;
        }

      } else {
        this.$toast(res.error_message);
      }
    },
    // 回复展开更多
    pageChange(comment_id, key) {

      this.replyData(comment_id, key);
      // console.log("当前页数组：", this.replyPage, 'key:', key);
    },
    // 关闭评论弹窗
    commentClose() {
      this.commentModel = false;
    },
    /*
     * __type = 'comment'; 新增评论
     * __type = 'reply';   新增回复
     */
    async addComment(__type) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      switch (__type) {
        case "comment":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.goods_id,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        case "reply":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.goods_id,
            comment_pid: this.commentId,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        default:
          break;
      }
      data.sign = this.$getSign(data);
      let res = await COMMENT_ADD(data);
      if (res.hasOwnProperty("response_code")) {

        this.commentPage = 1;
        // 本地存储最新的数据，展示
        this.answerData = [];
        this.discussData = [];
        this.replyPage = [];
        this.commentData();

      } else {
        this.$toast(res.error_message);
      }
    },
    punishComment() {
      if (this.contentLength > this.contentTotal) {
        this.$toast("你发布的字数超出，请修改后再发布!");
        return;
      }
      if (this.contentLength == 0) {
        this.$toast("请输入你要发布的内容!");
        return;
      }
      this.commentModel = false;
      // this.discussData = [];
      this.addComment(this.punishType);
    },
    /*
     * __type: 'comment'; 评论，comment_id: null;
     * __type: 'reply'; 回复评论，comment_id: 必填;
     */
    openAnswer(__type, comment_id) {
      this.punishType = __type;
      if (__type == "reply") this.commentId = comment_id;
      this.commentModel = true;
    },
    // 编辑评论触发
    inputChange() {
      this.contentLength = this.contentModel.length;
    },
    // 评论锚点
    tabChange(index, title) {
      // this.$toast(index);
      if (index == 1 && $("#comment").length == 1) $(window).scrollTop($("#comment").offset().top);
    },
    // 购买
    buyAction(goodsId) {
      this.$router.push({name: 'payaccount', params: {goods_id: goodsId}});
    },
    // --------------------------------相似----------------------------------
    // 推荐
    async recommendData () {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goodsId,
        page: 1,
        page_size: 6,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await RECOMMEND(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        
        for (let i = 0; i < res.response_data.result.length; i++) {
          this.recommendList.push(result[i]);
        }

        // console.log(this.recommendList)
    
      } else {
        this.$toast(res.error_message);
      }

    },
    // 点击相似推荐
    gotoLink (item) {
      var goodsType = item.goods_type;
      if(goodsType == 1 || goodsType == 2) { // 音频/视频，当前页更新
        // globalAlbum 存放专辑页当前 pid

        // globalProgramPId 存放节目页当前 pid, 
        // globalProgramGoodsId 存放节目页当前 goods_id, 
        // globalProgramGoodsNo 存放节目页当前 activeGoodNo

        // GlobalArtical 存放文章页当前 goods_id
        // 1、路由进入，不更新localStorage，
        // 2、当前页刷新（更新localStorage），
        // 3、当前页推荐商品进入当前页（点击事件修改localStorage），
        // 4、回退进入（上一个页面回退时修改localStorage），专辑、文章、节目三个页面回退情况
        localStorage.setItem('globalProgramGoodsId', item.goods_id);
        this.pid = null;
        this.activeGoodNo = null;
        location.reload();
      } else if(goodsType == 6) {// 文章
      
        this.goodsId = parseInt(item.goods_id);
        this.$router.push({name: 'article', params: {goods_id: this.goodsId}});
      } else if(goodsType == 9) { // 专辑
        this.$router.push({name: 'album', params: {goods_id: this.goodsId}});
      } else {

      }
    }
  }
};
</script>

