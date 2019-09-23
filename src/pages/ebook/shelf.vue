<template>
  <div id="ebookshelfPage">
    <van-list
      v-model="commentLoading"
      :finished="commentFinished"
      finished-text="没有更多了"
      @load="commentLoad"
    >
      <div>
        <van-row gutter="20" type="flex" justify="space-between" class="booklist">
          <van-col span="8" v-for="(item,index) in shelfList" :key="index">
            <div class="ratiobox" @click="toDetail(item,index)">
              <div class="bookImg" v-lazy:background-image="item.pic"></div>
              <div class="tags" v-if="item.is_try == 1">试读</div>
              <div class="tags" v-if="item.schedule == 0 && item.is_try == 0">新加入</div>
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="schedule" v-if="item.schedule">{{ item.schedule }}%</div>
          </van-col>
        </van-row>
      </div>
    </van-list>
    <EazyNav type="brand"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/ebook/shelf.scss" scoped lang="scss"></style>

<script>
import { EBOOK_SHELF_GETS } from "../../apis/ebook.js";
export default {
  data() {
    return {
      page: 1,
      shelfList: [],
      // 分页
      commentLoading: false,
      commentFinished: false,
      loop: null,
    };
  },
  mounted() {
    // this.getList();
  },
  methods: {
    commentLoad() {
      this.getList();
    },
    async getList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_SHELF_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        // 异步更新数据
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.shelfList.push(result[i]);
          }
          // 加载状态结束
          this.commentLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.commentFinished = true;
            this.page = 1;
          }
        }, 600);
      } else {
        this.$toast(res.error_message);
      }
    },
    toDetail(item,index){
      this.$router.push({
        name:"ebookdetail",
        query:{
          goods_id:item.goods_id,
        }
      })
    }
  }
};
</script>
