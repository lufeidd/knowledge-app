<template>
  <van-popup
    v-model="commentPopup"
    :close-on-click-overlay="false"
    position="bottom"
    style="min-height:100%;max-height:100%;"
  >
    <div id="ebookComment" class>
      <div class="head">
        <span class="catalogWord">{{totalCount}}</span>
        <span>
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </span>
      </div>
      <div class="content">
        <!-- 评论 -->
        <div class="commentBox">
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
      </div>
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
      <!-- 评论 -->
      <van-popup v-model="commentModel" position="bottom" style="min-height:50%;max-height:50%;">
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
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
#ebookComment {
  .head {
    background-color: #f5f5f5;
    padding: 0 15px;
    height: 40px;
    // position: fixed;
    // top: 0;
    // width: 100%;
    // box-sizing: border-box;
    @include displayFlex(flex, space-between, center);
    .catalogWord {
      font-size: $fontSize + 1;
    }
  }
  .content {
    padding: 15px;
    position: absolute;
    top: 40px;
    bottom: 50px;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    // 评论
    & .commentBox {
      background-color: $white;
      margin-top: 5px;

      & .listBox {
        @include displayFlex(flex, null, flex-start);
        background-color: $white;
        // border-bottom: 1px solid $greyLight;
        margin-bottom: 5px;

        & .left {
          @include flexBasis(35px);
          margin-right: 10px;
          margin-top: 5px;

          & .ratioBox {
            border-radius: 35px;
          }
        }

        & .center {
          display: block;
          text-indent: 0 !important;
          text-align: left !important;
          & .title {
            @include font("PingFangBold", $fontSize - 1, #666);
            @include textOverflow;
            display: block;

            & .text {
              @include textOverflow;
              display: block;
              padding-right: 0;
            }
          }

          & .subTitle {
            @include font("PingFangBold", $fontSize, #333);
            margin-top: 5px;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;
            overflow: visible;
            -webkit-line-clamp: 1000;
          }

          & .messageBox {
            background-color: #f7f7f7;
            padding: 5px;
            margin-top: 5px;
            font-size: $fontSize - 1;

            & .message {
              display: none;
              margin-top: 2px;

              & .name {
                color: $orangeLight;
              }

              & .dialog {
                color: #666;
              }
            }

            & .message.active {
              display: block;
            }
          }

          // 回复
          & .answerBox {
            margin-top: 15px;

            & .date {
              @include font(null, $fontSize - 1, #999);
              margin-right: 15px;
            }

            & .action {
              @include font(null, $fontSize - 1, #333);
              margin-right: 15px;
            }
          }
        }
      }
    }

  }
  .foot {
    height: 50px;
    box-sizing: border-box;
    border-top: 1px solid #f5f5f5;
    padding: 6px 15px;
    position: absolute;
    bottom: 0;
    width: 100%;
    .comment {
      padding: 0 15px;
      background-color: #f5f5f5;
      border-radius: 16px;
      height: 37px;
      line-height: 37px;
      color: $cl6;
    }
  }
  & .audioList {
      position: relative;
      height: 94vh;
      overflow: hidden;

      & .title {
        height: 44px;
        line-height: 44px;
        border-bottom: 1px #eee solid;
        text-align: center;
        position: relative;
        @include displayFlex(flex, center, center);
        @include font(null, $fontSize + 2, #999);

        & .action {
          @include position(absolute, "tl", 0, 0, 44px, 44px, null);

          & .icon {
            width: 20px;
            height: 20px;
          }
        }

        & .punish {
          @include position(absolute, "tr", 0, 0, 60px, 44px, null);
          color: $redDark;
        }
      }

      & .content {
        padding: 10px;

        & textarea {
          width: 100%;
          border: 1px #ccc solid;
          border-radius: 5px;
          padding: 5px;
          box-sizing: border-box;
          min-height: 100px;
        }

        & .count {
          font-size: $fontSize - 2;
          color: #999;
          text-align: right;

          & .active {
            color: $redDark;
          }
        }
      }
    }
}
</style>

<script>
import { COMMENT, COMMENT_ADD } from "../../apis/public.js";
export default {
  name: "comment",
  props: ["goods_id", "isLogin"],
  data() {
    return {
      commentPopup: false,
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
      commentNumber: null,
      timer: null
    };
  },
  mounted() {},
  methods: {
    closePopup() {
      this.commentPopup = false;
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
      var _this = this;
      if (this.timer) {
        // console.log(111,this.timer);
        this.timer = 0;
      } else {
        this.timer = setTimeout(function() {
          // console.log(222,_this.timer)
          _this.replyData(comment_id, key);
        }, 200);
      }
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
