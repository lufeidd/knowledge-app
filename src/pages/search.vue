<template>
  <div id="searchPage">
    <van-search placeholder="请输入搜索关键词"  shape="round" show-action v-model="searchContent" @search="onSearch">
      <div slot="action" @click="onSearch" >搜索</div>
      <!-- <div slot="action" @click="onCancel" v-else>取消</div> -->
      <div slot="left-icon" >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-search-line"></use>
          </svg>
      </div>
    </van-search>
    <div class="searchRecommend">
      <p class="recommend">搜索推荐</p>
      <van-row type="flex" justify="space-between">
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">待支付</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">待发货</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">已发货</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">已完成</van-tag></van-col>
      </van-row>
    </div>
    <div class="searchHistory" v-show="type == 'brand'">
      <p class="title">
        <span class="history">热门搜索</span>
        <span class="clear" @click="clear">清除</span>
      </p>

      <ul>
        <li  v-for="item,index in hotSearch" :key="index">{{item}}</li>
      </ul>

    </div>
  </div>
</template>

<style src="@/style/scss/pages/search.scss" lang="scss"></style>

<script>
import{SEARCH_HOTKEY_GETS} from "../apis/public.js"
export default {
  data () {
    return {
      type:'',
      searchContent:'',
      hotSearch:null,
      state:0,
    }
  },
  mounted(){
    this.type = this.$route.query.type;
    console.log(this.type);
    this.getHotKey();
  },
  methods:{
    clear(){
      this.hotSearch=[];
    },
    // 搜索按钮
    searchTo(_type){
      switch(_type){
        case "order" :
        this.$router.push({
          name:'orderresult',
          params:{
            type:'search',
            searchContent:this.searchContent,
            state:this.state,
          }
        })
        case "brand" :
        this.$router.push({
          name:'brandresult',
          params:{
            type:'brand',
            searchContent:this.searchContent,
          }
        })
      }
    },
    onSearch(){
      if(this.type == 'order'){
        this.searchTo('order');
      }
      if(this.type == 'brand'){
        this.searchTo('brand');
      }
    },
    //获取热搜词
    async getHotKey(){
      var data={
        version:"1.0",
      };
      data.sign = this.$getSign(data);
      let res = await SEARCH_HOTKEY_GETS(data);
      if(res.hasOwnProperty("response_code")){
        this.hotSearch = res.response_data;
        console.log(res);
      }else{
        this.$toast(res.error_message);
      }
    }
  }
}
</script>
