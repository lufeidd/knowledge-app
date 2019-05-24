<template>
  <div id="commentPage">
    <div class="nullBox" v-if="commentData.length == 0">
      <img src="../../../assets/null/list.png" width="100%">
      <div>您还没有评论过商品</div>
    </div>
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      v-else
    >
      <div class="content" v-for="item in commentData">
        <div class="info">
          <div class="head">
            <div class="titleFrom">
              <div class="box">
                <img v-lazy="item.user_header" class="icon">
                <span class="publish">{{item.nick_name}}</span>
              </div>
              <span class="date">{{item.create_time}}</span>
            </div>
          </div>
          <p class="comment">{{item.content}}</p>
          <div class="section">
            <div class="bookDetail">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="item.goods_image"></div>
              </div>
              <div class="detailContent">
                <p class="title">{{item.goods_name}}</p>
                <p class="title red">¥ {{item.goods_price}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/personal/comment/index.scss" lang="scss"></style>

<script>
//  引入接口
import { USER_COMMENT } from "../../../apis/user.js";
import easyNav from "./../../../components/easyNav";
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
        search: false,
        // searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type: "order"
      },
      commentData: [],
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    this.getUserComment();
  },
  methods: {
    programLoad() {
      this.getUserComment();
    },
    async getUserComment() {
      // let data = {
      //   version: "1.0"
      // };
      // let res = await USER_COMMENT(data);
      // if (res.hasOwnProperty("response_code")) {
      //   this.commentData = res.response_data.result;
      // } else {
      //   this.$toast(res.error_message);
      // }
      var tStamp = this.$getTimeStamp();
      var data = {
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };

      data.sign = this.$getSign(data);
      let res = await USER_COMMENT(data);
      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.commentData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.commentData.length >= res.response_data.total_count) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
