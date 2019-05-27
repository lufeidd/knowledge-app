<template>
  <div id="articlePage">
    <div class="article">
      <div class="title">{{baseData.title}}</div>
      <div class="from">
        <div class="articleInfo">
          <img v-lazy="articleInfo.header_pic" class="icon">
          <div class="detail">
            <p>{{articleInfo.name}}</p>
            <p class="number">{{articleInfo.fans}}人关注</p>
          </div>
        </div>
        <span class="foucsButton" v-if="articleInfo.is_followed == 0" @click="focusAction">+关注</span>
        <span class="foucsButton cancel" v-else @click="focusAction">已关注</span>
      </div>
      <div class="contentData"></div>
      <div class="message">
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-eye-line"></use>
          </svg>
          {{baseData.play_num}}
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-good-line"></use>
          </svg>
          {{baseData.praise_num}}
        </span>
        <span>{{baseData.create_time}}</span>
      </div>
    </div>
    <!-- 轮播部分 -->
    <div class="showContent" v-if="recommendState">
      <!-- <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="item,index in recommendData" :key="index">
          <div class="foot">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="item.main_pic"></a>
            </div>
            <div class="content">
              <p class="title">{{item.title}}</p>
              <p class="name">{{item.brand_name}}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>-->
      <van-row gutter="20" class="booklist">
        <van-col span="8" v-for="item,index in recommendData" :key="index">
          <div class="ratioBox" @click="gotoLink(item)">
            <div class="box">
              <img :src="item.pic">
            </div>
          </div>
          <div class="title">{{ item.title }}</div>
        </van-col>
      </van-row>
      <!-- <van-row gutter="20" class="booklist">
        <van-col span="8" >
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
          <div class="title">call me call my name</div>
        </van-col>
        <van-col span="8" >
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
          <div class="title">call me call my name</div>
        </van-col>
        <van-col span="8" >
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
          <div class="title">call me call my name</div>
        </van-col>
        <van-col span="8" >
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
          <div class="title">call me call my name</div>
        </van-col>
        <van-col span="8" >
          <div class="ratioBox">
            <div class="box">
              <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            </div>
          </div>
          <div class="title">call me call my name</div>
        </van-col>
      </van-row>-->
    </div>
    <!-- 评论 -->
    <div class="commentBox">
      <van-cell :title="totalCount" is-link value="我要评论" @click="openAnswer('comment', null)"/>

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

              <div class="message active" v-for="(replyItem, key) in answerData[key]" :key="key">
                <span class="name">{{ replyItem.nick_name }}</span>
                <span class="dialog">{{ replyItem.content }}</span>
              </div>

              <div
                class="message active"
                v-if="item.reply_num > 2 && replyPage[key] <= item.reply_total_page"
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
    
    <div style="height: 60px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <!-- 快来写评论吧 -->
    <div class="pinglun" :class="{iphx:this.isIphx}">
      <div class="write" @click="openAnswer('comment', null)">快来写评论吧!</div>
      <div class="nice">
        <svg
          class="icon add"
          aria-hidden="true"
          v-if="baseData.collect_id > 0"
          @click="collectAction"
        >
          <use xlink:href="#icon-collect-block"></use>
        </svg>
        <svg class="icon" aria-hidden="true" v-else @click="collectAction">
          <use xlink:href="#icon-collect-line"></use>
        </svg> &nbsp;|&nbsp;
        <svg
          class="icon"
          aria-hidden="true"
          v-if="baseData.is_praised == 0"
          @click="praiseAction"
        >
          <use xlink:href="#icon-good-line"></use>
        </svg>
        <svg class="icon add" aria-hidden="true" v-else @click="praiseAction">
          <use xlink:href="#icon-good-block"></use>
        </svg>
      </div>
    </div>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/brand/detail/article.scss" scoped lang="scss"></style>

<script>
import { ALBUM, ALBUM_DETAIL } from "../../../apis/album.js";
import easyNav from "./../../../components/easyNav";
import {
  COLLECT_ADD,
  COLLECT_CANCEL,
  FOCUS_ADD,
  FOCUS_CANCEL,
  COMMENT,
  COMMENT_ADD,
  GOODS_PRAISE_ADD,
  GOODS_PRAISE_DELETE,
  RECOMMEND
} from "../../../apis/public.js";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: true,
        searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type: "brand"
      },
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
      //页面基本信息
      baseData: {},
      // 文章相关信息
      articleInfo: {},
      swiperOption: {
        slidesPerView: 1.2
      },
      // 推荐列表信息
      recommendData: [],
      recommendState: false,
      goodsId: 46
    };
  },
  //离开当前页面
  beforeRouteLeave(to, from, next) {
    //   if(to.name == 'albumdetail' ) {
    //     localStorage.setItem('globalGoodsId', this.$route.params.goodsId ? this.$route.params.pid: parseInt(localStorage.getItem('globalGoodsId')));
    //   }
    next();
  },
  mounted() {
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
    if (this.$route.params.goods_id) {
      this.goodsId = this.$route.params.goods_id;
      localStorage.setItem("GlobalArtical", this.$route.params.goods_id);
    } else {
      this.goodsId = parseInt(localStorage.getItem("GlobalArtical"));
    }
    this.getData();
    this.getRecommendData();
    // console.log("ID:", this.recommendData);
  },
  methods: {
    // 获取关注接口信息
    async focusData(__type) {
      var data = {};
      var res;
      var tStamp = this.$getTimeStamp();
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            brand_id: this.articleInfo.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_ADD(data);

          this.articleInfo.is_followed = 1;
          this.articleInfo.fans += 1;
          // this.$toast('已关注~');
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.articleInfo.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          this.articleInfo.is_followed = 0;
          this.$toast("已取消关注~");
          this.articleInfo.fans -= 1;
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    focusAction() {
      if (this.articleInfo.is_followed > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("focus");
      }
    },
    // foldAction() {},
    // onPunish() {
    //   if (this.contentLength > this.contentTotal) {
    //     this.$toast("你发布的字数超出，请修改后再发布!");
    //     return;
    //   }
    //   this.commentModel = false;
    // },
    // inputChange(self) {
    //   this.contentLength = this.contentModel.length;
    // },
    // openAnswer() {
    //   this.commentModel = true;
    // },
    // commentClose() {
    //   this.commentModel = false;
    // },
    // 获取收藏接口信息
    async collectData(__type) {
      var data = {};
      var res;
      var tStamp = this.$getTimeStamp();
      switch (__type) {
        case "collect":
          data = {
            timestamp: tStamp,
            type: this.baseData.goods_type,
            target: this.goodsId,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_ADD(data);
          this.baseData.collect_id = 1;
          // this.$toast("已收藏~");
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.article_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await COLLECT_CANCEL(data);
          this.baseData.collect_id = 0;
          this.$toast("已取消收藏~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    collectAction() {
      if (this.baseData.collect_id > 0) {
        this.collectData("cancel");
      } else {
        this.collectData("collect");
      }
    },
    // 获取点赞接口信息
    async praiseData(__type) {
      var data = {};
      var res;
      var tStamp = this.$getTimeStamp();
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.article_id,
            type: this.baseData.goods_type,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await GOODS_PRAISE_ADD(data);
          this.baseData.is_praised = 1;
          // this.$toast('已关注~');
          this.baseData.praise_num += 1;
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.article_id,
            type: this.baseData.goods_type,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await GOODS_PRAISE_DELETE(data);
          this.baseData.is_praised = 0;
          this.$toast("已取消点赞~");
          this.baseData.praise_num -= 1;
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    praiseAction() {
      if (this.baseData.is_praised > 0) {
        this.praiseData("cancel");
      } else {
        this.praiseData("focus");
      }
    },
    //获取页面基本信息
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        timestamp: tStamp,
        // goods_id: this.goodsId,
        goods_id: this.goodsId,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);
      if (res.hasOwnProperty("response_code")) {
        this.baseData = res.response_data.base;
        this.articleInfo = res.response_data.brand_info;
        $(".contentData").append(this.baseData.desc);
        if (this.baseData.desc.length <= 0) {
          $(".contentData").remove();
          console.log(this.baseData.desc);
        }

        // console.log(this.baseData);
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取商品推荐部分信息
    async getRecommendData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        timestamp: tStamp,
        // goods_id: this.goodsId,
        goods_id: this.goodsId,
        page: 1,
        page_size: 6,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await RECOMMEND(data);
      if (res.hasOwnProperty("response_code")) {
        this.recommendData = res.response_data.result;
        if (this.recommendData.length > 0) {
          this.recommendState = true;
        }
        // console.log('recommendData',this.recommendData);
      } else {
        this.$toast(res.error_message);
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
        goods_id: this.goodsId,
        page_size: 10,
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
        page_size: 10,
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
        if (this.replyPage[key] >= res.response_data.total_page) {
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
            goods_id: this.baseData.article_id,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        case "reply":
          data = {
            timestamp: tStamp,
            goods_id: this.baseData.article_id,
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
    // 点击相似推荐
    gotoLink(item) {
      if (item.goods_type == 1 || item.goods_type == 2) {
        this.$router.push({
          name: "albumdetail",
          params: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      if (item.goods_type == 6) {
        // globalAlbum 存放专辑页当前 pid

        // globalProgramPId 存放节目页当前 pid,
        // globalProgramGoodsId 存放节目页当前 goods_id,
        // globalProgramGoodsNo 存放节目页当前 activeGoodNo

        // GlobalArtical 存放文章页当前 goods_id
        // 1、路由进入，不更新localStorage，
        // 2、当前页刷新（更新localStorage），
        // 3、当前页推荐商品进入当前页（点击事件修改localStorage），
        // 4、回退进入（上一个页面回退时修改localStorage），专辑、文章、节目三个页面回退情况
        localStorage.setItem("GlobalArtical", item.goods_id);
        this.pid = null;

        location.reload();
      }
      if (item.goods_type == 9) {
        this.$router.push({
          name: "albumlist",
          params: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
    }
  }
};
</script>
