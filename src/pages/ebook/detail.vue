<template>
  <div id="ebookDetailPage">
    <div class="goodsInfo">
      <div class="info">
        <div class="ratiobox">
          <div class="bookImg" :style="{'background-image':'url('+baseInfo.pic[0]+')'}"></div>
        </div>
        <div class="right">
          <div class="title">{{baseInfo.title}}</div>
          <div>
            <p class="author">{{baseInfo.author}}</p>
            <p class="category">{{baseInfo.category_path}}</p>
          </div>
          <div class="price">￥{{baseInfo.price}}</div>
          <!-- <div class="price">免费阅读</div> -->
        </div>
      </div>
      <div class="descript" @click="showDetail">{{baseInfo.goods_desc}}</div>
      <div class="watchCatalog">
        <van-cell value is-link @click="showDetail">
          <template slot="title">
            <span class="custom-text">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-category-line" />
              </svg>
            </span>
            <span style="margin-left:10px;">查看目录 · 版权信息</span>
          </template>
        </van-cell>
        <van-cell value is-link @click="toDetail">
          <template slot="title">
            <span class="custom-text">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-paperbook-line" />
              </svg>
            </span>
            <span style="margin-left:10px;">纸书购买</span>
          </template>
        </van-cell>
      </div>
    </div>
    <!-- 公号信息 -->
    <div class="brand_info">
      <div class="left">
        <div class="ratiobox">
          <div class="bookImg" v-lazy:background-image="brandInfo.header_pic"></div>
        </div>
        <span class="name">{{brandInfo.name}}</span>
      </div>
      <div class="toMall" @click="focusAction" v-if="brandInfo.is_followed">已关注</div>
      <div class="toMall foucs" @click="focusAction" v-else>关注</div>
    </div>
    <!-- 推荐 -->
    <!-- 相关推荐模块 -->
    <div class="recommend" v-if="recommendList.length>0">
      <div class="text">推荐电子书</div>
      <swiper class="swiperTags" :options="swiperOption3" ref="mySwiper">
        <swiper-slide v-for="(item,index) in recommendList" :key="index">
          <div class="recommendInfo">
            <div class="ratiobox" @click="toEbook(item,index)">
              <a class="bookImg" v-lazy:background-image="item.pic"></a>
            </div>
            <div class="content">
              <div class="recommendName">{{item.goods_title}}</div>
              <div class="nickname">{{item.author}}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 评论 -->
    <div class="commentBox">
      <div class="commentWord">{{totalCount}}</div>
      <div class="foot">
        <div class="comment" @click="openAnswer('comment', null)">
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-edit-line" />
            </svg>
          </span>
          <span style="margin-left:10px;">爱发言的人运气不会差！</span>
        </div>
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
                <img :src="item.user_header" />
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
                    <use xlink:href="#icon-fold-line" />
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
    <div style="position:relative;height:90px;">
      <CopyRight></CopyRight>
    </div>
    <!-- 评论 -->
    <van-popup v-model="commentModel" position="bottom" style="max-height:70%;">
      <div class="audioList">
        <div class="title">
          <div class="action" @click="commentClose">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold-line" />
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
    <!-- 详细信息 -->
    <van-popup v-model="detailShow" position="bottom" style="min-height:70%;max-height:70%;">
      <div class="detailList">
        <div class="head">
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </div>
        <div class="content">
          <div class="word">简介</div>
          <div class="descript">{{baseInfo.goods_desc}}</div>
          <div class="word">出版信息</div>
          <div class="publish">
            <div>
              出版社
              <span style="margin-left:20px;">{{baseInfo.publisher}}</span>
            </div>
            <div>
              ISBN
              <span style="margin-left:30px;">{{baseInfo.isbn}}</span>
            </div>
          </div>
          <div class="word">目录</div>
          <!-- 章节目录 -->
          <div class="list">
            <ul>
              <li v-for="(item,index) in ebookList" :key="index" @click="read(item,index)">
                <div class="left">
                  <div>第{{index+1}}章</div>
                  <div class="title">{{item.chapter_name}}</div>
                </div>
                <span>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    v-if="item.chapter_free == 0 && item.chapter_try == 0"
                  >
                    <use xlink:href="#icon-lock-line" />
                  </svg>
                  <span v-if="item.chapter_free == 0 && item.chaprer_try == 1">试读</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-popup>
    <div class="bottom">
      <div class="isbuy" v-if="baseInfo.is_payed == 0 && baseInfo.is_free == 0">
        <div v-if="baseInfo.is_sbookshelf == 0" class="shelf" @click="shelfAction">加入书架</div>
        <div v-else class="shelf" @click="shelfAction">已加入书架</div>
        <div @click="buyNow">立即购买</div>
        <div class="read" @click="toreader">免费阅读</div>
      </div>
      <div class="nobuy" v-else>
        <div v-if="baseInfo.is_sbookshelf == 0" @click="shelfAction">加入书架</div>
        <div class="shelf" v-else @click="shelfAction">已加入书架</div>
        <div class="read" @click="toreader">免费阅读</div>
      </div>
    </div>
    <!-- 支付购买弹层 -->
    <ebookpay :goods_id="goods_id" ref="pay" :info="info" @rechargeBuy="payrecharge" @addshelf="shelfData"></ebookpay>
    <!-- 充值余额并支付 -->
    <ebookrecharge ref="recharge" :info="info" @return="returnUp"></ebookrecharge>
    <EazyNav type="brand"></EazyNav>

  </div>
</template>

<style src="@/style/scss/pages/ebook/detail.scss" scoped lang="scss"></style>
<style lang="scss">
#ebookDetailPage {
  .van-cell {
    padding: 10px 0;
  }
}
</style>
<script>
import ebookpay from "../ebook/pay";
import ebookrecharge from "../ebook/recharge";
import { ALBUM } from "../../apis/album.js";
import {
  EBOOK_RECOMMEND,
  EBOOK_CATALOG,
  EBOOK_INFO,
  EBOOK_SHELF_ADD,
  EBOOK_SHELF_CANCEL
} from "../../apis/ebook.js";
import {
  FOCUS_ADD,
  FOCUS_CANCEL,
  COMMENT,
  COMMENT_ADD,
  RECOMMEND,
  WX_SHARE
} from "../../apis/public.js";
export default {
  components: { ebookpay, ebookrecharge },
  data() {
    return {
      onsale: null,
      isLogin: null,
      goods_id: null,
      brandInfo: {},
      baseInfo: {},
      info: {},
      bookshelf_id: null,
      swiperOption3: {
        slidesPerView: 3.5
      },
      // 评论
      discussData: [],
      commentPage: 1,
      totalCount: "评论 (" + 0 + ")",
      // 发布评论
      commentModel: false,
      contentModel: "",
      contentTotal: 500,
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
      recommendList: [],
      detailShow: false,
      ebookList: [],
      minChapter: null,
      currenChapterTitle:"",
    };
  },
  mounted() {
    this.goods_id = this.$route.query.goods_id;
    this.getData();
    this.getRecommendData();
    this.getList();
    this.getebookInfo();
  },
  methods: {
    closePopup() {
      this.detailShow = false;
    },
    toDetail() {
      this.$router.push({
        name: "detail",
        query: { goods_id: this.goods_id }
      });
    },
    //获取电子书基本信息
    async getebookInfo() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.info = res.response_data;
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取页面基本信息
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        goods_id: this.goods_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);
      if (res.hasOwnProperty("response_code")) {
        this.baseInfo = res.response_data.base;
        this.brandInfo = res.response_data.brand_info;
        this.isLogin = res.response_data.user_info.is_login;
        this.bookshelf_id = res.response_data.base.is_sbookshelf;
        document.title = "电子书详情-" + res.response_data.base.title;

        // 获取页面分享信息
        // if(this.isWxLogin) this.wxShareData();
        // var _pageName = "ebook/detail";
        // var _params = JSON.stringify({
        //   goods_id: this.$route.query.goods_id
        //   // album_id: this.$route.query.pid
        // });
        // if (this.isWxLogin) this.$getWxShareData(_pageName, _params);

        // $(".contentData").append(this.baseData.desc);
        // if (this.baseData.desc.length <= 0) {
        //   $(".contentData").remove();
        //   console.log(this.baseData.desc);
        // }

        // console.log(this.baseData);

        this.onsale = 1;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
        }
        this.$toast(res.error_message);
      }
    },
    // 获取电子书相关推荐
    async getRecommendData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        goods_id: this.goods_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_RECOMMEND(data);
      if (res.hasOwnProperty("response_code")) {
        this.recommendList = res.response_data;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 电子书相关推荐跳转
    toEbook(item, index) {
      console.log(item);
      this.$router.push({
        name: "ebookdetail",
        query: { goods_id: item.goods_id }
      });
      $(window).scrollTop(0);
      location.reload();
    },
    // 获取电子书章节
    async getList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_CATALOG(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        // this.ebookList = res.response_data;
        for(var i=0;i<res.response_data.length;i++){
          if(res.response_data[i].chapter_hidden == 0){
            this.ebookList.push(res.response_data[i])
          }
        }
        this.minChapter = this.ebookList[0].chapter_id;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 关注公众号
    focusAction() {
      // 未登录跳转至登录页
      if (this.isLogin == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
        return;
      }
      if (this.brandInfo.is_followed > 0) {
        this.focusData("cancel");
      } else {
        this.focusData("focus");
      }
    },
    // 加入书架
    shelfAction() {
      // 未登录跳转至登录页
      if (this.isLogin == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
        return;
      }
      if (this.baseInfo.is_sbookshelf > 0) {
        this.shelfData("cancel");
      } else {
        this.shelfData("add");
      }
    },
    // 获取加入或移出书架
    async shelfData(__type) {
      var data = {};
      var res;
      var tStamp = this.$getTimeStamp();
      switch (__type) {
        case "add":
          data = {
            timestamp: tStamp,
            goods_id: this.goods_id,
            schedule: 0.0,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await EBOOK_SHELF_ADD(data);

          this.baseInfo.is_sbookshelf = 1;
          this.$toast("已加入书架~");
          this.bookshelf_id = res.response_data.bookshelf_id;
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            bookshelf_id: this.bookshelf_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await EBOOK_SHELF_CANCEL(data);
          this.baseInfo.is_sbookshelf = 0;
          this.$toast("已移出书架~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取关注接口信息
    async focusData(__type) {
      var data = {};
      var res;
      var tStamp = this.$getTimeStamp();
      switch (__type) {
        case "focus":
          data = {
            timestamp: tStamp,
            brand_id: this.brandInfo.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_ADD(data);

          this.brandInfo.is_followed = 1;
          this.$toast("已关注~");
          break;
        case "cancel":
          data = {
            timestamp: tStamp,
            brand_id: this.brandInfo.brand_id,
            version: "1.0"
          };
          data.sign = this.$getSign(data);
          res = await FOCUS_CANCEL(data);
          this.brandInfo.is_followed = 0;
          this.$toast("已取消关注~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
    },
    showDetail() {
      this.detailShow = true;
      // this.getList();
    },
    read(item, index) {
      console.log(item);
      this.currenChapterTitle = '第'+(index+1)+'章';
      this.$router.push({
        name: "ebookreader",
        query: {
          goods_id: this.goods_id,
          chapter_id: item.chapter_id,
          currenChapterTitle:this.currenChapterTitle,
        }
      });
    },
    // 支付
    buyNow() {
      if (this.isLogin) {
        this.$refs.pay.buyShow = true;
      } else {
        this.$router.push({ name: "login" });
      }
    },
    payrecharge() {
      this.$refs.pay.buyShow = false;
      this.$refs.recharge.rechargeShow = true;
    },
    returnUp() {
      this.$refs.recharge.rechargeShow = false;
      this.$refs.pay.buyShow = true;
    },
    // 免费阅读
    toreader() {
      this.$router.push({
        name: "ebookreader",
        query: {
          goods_id: this.goods_id,
          chapter_id: this.minChapter
        }
      });
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
        goods_id: this.goods_id,
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
          if (this.commentPage > res.response_data.total_page) {
            this.commentFinished = true;
            this.commentPage = 1;
          }
        }, 600);

        // 设置总评论数
        this.totalCount = "评论 (" + res.response_data.total_count + ")";
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
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        // 异步更新数据
        var result = res.response_data.result;
        for (let i = 0; i < result.length; i++) {
          this.answerData[key].push(result[i]);
        }
        if (this.replyPage[key] > res.response_data.total_page) {
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
            goods_id: this.goods_id,
            content: this.contentModel,
            version: "1.0"
          };
          break;
        case "reply":
          data = {
            timestamp: tStamp,
            goods_id: this.goods_id,
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
        this.contentModel = "";
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
      // 未登录跳转至登录页
      if (this.isLogin == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
        return;
      }
      this.punishType = __type;
      if (__type == "reply") this.commentId = comment_id;
      this.commentModel = true;
    },
    // 编辑评论触发
    inputChange() {
      this.contentLength = this.contentModel.length;
    }
  }
};
</script>
