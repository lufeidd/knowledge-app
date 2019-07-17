<template>
  <div id="commentPage">
    <div class="nullBox" v-if="programFinished && commentData.length == 0">
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
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand"></EazyNav>
    
  </div>
</template>

<style scoped src="@/style/scss/pages/personal/comment/index.scss" lang="scss"></style>

<script>
//  引入接口
import { USER_COMMENT } from "../../../apis/user.js";
// import easyNav from "./../../../components/easyNav";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   // searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "order"
      // },
      commentData: [],
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10
    };
  },
  mounted() {
    // this.getUserComment();
  },
  // 进入当前页面
  beforeRouteEnter(to, from, next) {
    // console.log(to, from ,next);

    // 外链进入
    // if(from.name != null) {
    // }
    console.log("进入当前页面");
    next();
  },
  // 离开当前页面
  beforeRouteLeave(to, from, next) {
    // console.log(to, from ,next);

    // 外链进入
    // if(from.name != null) {
    // }
    console.log("离开当前页面");
    next();
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
      if (
        res.hasOwnProperty("response_code") &&
        res.response_data.hasOwnProperty("result")
      ) {
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.commentData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);

        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);
        
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          localStorage.setItem("loginState", 100);
          
        }
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
