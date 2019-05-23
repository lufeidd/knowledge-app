<template>
  <div id="searchPage">
    <!-- <van-search placeholder="请输入搜索关键词"  shape="round" show-action v-model="searchContent" @search="onSearch">
      <div slot="action" @click="onSearch" >搜索</div>
      <div slot="left-icon" >
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-search-line"></use>
          </svg>
      </div>
    </van-search> -->
    <div class="searchHint">
      <span>
          <svg class="icon searchIcon" aria-hidden="true">
            <use xlink:href="#icon-search-line"></use>
          </svg>
      </span>
      <search-hint :searchHintData="searchHintData"></search-hint>
      <span  @click="onSearch" class="text">搜索</span>
    </div>
    <!-- <div class="searchRecommend">
      <p class="recommend">搜索推荐</p>
      <van-row type="flex" justify="space-between">
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">待支付</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">待发货</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">已发货</van-tag></van-col>
        <van-col span="6"><van-tag round text-color="#666" size="large" color="#f5f5f5">已完成</van-tag></van-col>
      </van-row>
    </div> -->
    <div class="searchHistory" v-if="type == 'order'">
      <p class="title">
        <span class="history">搜索推荐</span>
        <!-- <span class="clear" @click="clear">清除</span> -->
      </p>

      <ul>
        <!-- <li  v-for="item,index in hotSearch" :key="index">{{item}}</li> -->
        <li v-for="item,index in state" @click="toResult(item)">{{item.order_desc}}</li>
      </ul>

    </div>
    <div class="searchHistory" v-if="type == 'brand'">
      <p class="title">
        <span class="history">热门搜索</span>
        <span class="clear" @click="clear">清除</span>
      </p>

      <ul>
        <li  v-for="item,index in hotSearch" :key="index" @click="hotSearchItem(item)">{{item}}</li>
      </ul>

    </div>
    <div class="searchHistory">
      <p class="title">
        <span class="history">搜索历史</span>
        <span class="clear" @click="clear">清除</span>
      </p>

      <ul>
        <li  v-for="item,index in list" :key="index" @click="searchItem(item)">{{item.content}}</li>
      </ul>

    </div>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped  src="@/style/scss/pages/search.scss"  lang="scss"></style>

<script>
import{SEARCH_HOTKEY_GETS} from "../apis/public.js"
import searchHint from "../components/searchHint"
import easyNav from "./../components/easyNav";
export default {
  components: {
    searchHint,
    easyNav
  },
  data () {
    return {
      searchHintData: {
        search: null,
        placeholderText:'请输入商品名称',
        list: [],
        type:'',
      },
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
      type:'',
      hotSearch:null,
      state:[
        {order_state:0,order_desc:'待付款'},
        {order_state:1,order_desc:'待发货'},
        {order_state:2,order_desc:'已发货'},
        {order_state:4,order_desc:'已完成'},
      ],
      list:[],
    }
  },
  mounted(){
    this.type = this.$route.query.type;
    this.searchHintData.type = this.$route.query.type;

    // console.log(this.type);
    this.getHotKey();
    this.getLocalItem();
    // console.log(123, history.length);
    // let len = history.length;
    // history.go(-(len-1));
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
            type:'order',
            searchContent:this.searchHintData.search,
            // state:this.state,
          }
        })
        this.saveItem();
        break;
        case "brand" :
        this.$router.push({
          name:'brandresult',
          params:{
            type:'brand',
            searchContent:this.searchHintData.search,
          }
        })
        this.saveItem();
        break;
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
        // console.log(res);
      }else{
        this.$toast(res.error_message);
      }
    },
    //将搜索内容存储到本地
    saveItem(){
      var content = {content:this.searchHintData.search};
      var list = JSON.parse(localStorage.getItem("cmts") || '[]');
      if(list.length>10){
        list = list.slice(0,9);
      }
      list.unshift(content);
      localStorage.setItem('cmts',JSON.stringify(list));
      this.content = '';
      this.$emit('func');
    },
    //读取本地历史记录
    getLocalItem(){
        var list = JSON.parse(localStorage.getItem("cmts") || '[]');
        this.list = list ;
    },
    toResult(item){
      console.log(item)
        this.$router.push({
          name:'orderresult',
          params:{
            type:'order',
            searchContent:this.searchHintData.search,
            state:this.state.order_state,
          }
        })
    },
    hotSearchItem(item){
      console.log(item)
        this.$router.push({
          name:'brandresult',
          params:{
            type:'brand',
            searchContent:item,
          }
        })
    },
    searchItem(item){
      console.log(item)
      if(this.type == 'order'){
        this.$router.push({
          name:'orderresult',
          params:{
            type:'order',
            searchContent:item.content,
          }
        })
      }
      if(this.type == 'brand'){
        this.$router.push({
          name:'brandresult',
          params:{
            type:'brand',
            searchContent:item.content,
          }
        })
      }
    },
  }
}
</script>
