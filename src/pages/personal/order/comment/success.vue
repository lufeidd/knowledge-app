<template>
  <div id="successPage" class="comment">
    <div class="thanks">
      <svg class="icon order" aria-hidden="true">
        <use xlink:href="#icon-order-comment"></use>
      </svg>
      <span>感谢您的评价！</span>
    </div>
    <div class="continue">向下继续评价吧~</div>
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
    >
    <div class="list" v-for="item in listData">
      <div class="bookDetail">
        <div class="ratiobox">
          <a class="bookImg" v-lazy:background-image="item.pic"></a>
        </div>
        <div class="info">
          <span class="title">{{item.goods_name}}</span>
          <div class="commentLine">
            <span class="number">
              <span class="money">¥ {{item.price}}</span> x{{item.buy_count}}
            </span>
          </div>
        </div>
      </div>
       <span class="button" @click="toComment(item)">评价</span>
    </div>
    </van-list>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/comment.scss" scoped lang="scss"></style>

<script>
import { USER_ORDER_COMMENT_UNDO_GETS } from "../../../../apis/user.js";
import easyNav from "./../../../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      listData:[],
      page:1,
      page_size:5,
      programLoading: false,
      programFinished: false,
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: false,
        // searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type:'order',
      },
    };
  },
  mounted(){

  },
  methods:{
    programLoad() {
      this.getData();
    },
    async getData(){
      var tStamp = this.$getTimeStamp();
      var data = {
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_COMMENT_UNDO_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.listData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
      }
    },
    toComment(item){
      console.log(item);
      this.$router.push({
        name:'commentpunish',
        query:{
          pic:item.pic,
          order_id:item.order_id,
          detail_id:item.detail_id,
        }
      })
    }
  }
};
</script>
