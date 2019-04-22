<template>
  <div id="searchPage">
    <van-search placeholder="请输入搜索关键词"  shape="round" show-action >
      <div slot="left-icon" >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-search-line"></use>
          </svg>
      </div>
    </van-search>
    <div class="searchRecommend">
      <p class="recommend">搜索推荐</p>
      <van-row type="flex" justify="space-between">
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">待付款</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">待发货</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">已发货</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">已完成</van-tag></van-col>
      </van-row>
    </div>
    <div class="searchHistory">
      <p class="title">
        <span class="history">搜索历史</span>
        <span class="clear" @click="clear">清除</span>
      </p>
      
      <ul>
        <li v-for="item,index in searchHistory" :key="index">{{item}}</li>
      </ul>

    </div>
  </div>
</template>

<style src="@/style/scss/pages/search.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {
      searchHistory:['恐龙','儿童科学','任明书籍','任明书籍','恐龙','儿童科学','任明书籍'],
    }
  },
  methods:{
    clear(){
      this.searchHistory=[];
    }
  }
}
</script>
