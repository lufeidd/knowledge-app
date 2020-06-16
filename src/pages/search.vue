<template>
  <div id="searchPage">
    <!-- <div class="searchHint">
      <span>
        <svg class="icon searchIcon" aria-hidden="true">
          <use xlink:href="#icon-search-line" />
        </svg>
      </span>
      <search-hint :searchHintData="searchHintData"></search-hint>
      <span @click="onSearch" class="text">搜索</span>
    </div>-->
    <div class="huoba-search">
      <van-search
        v-model="searchHintData.search"
        :placeholder="searchHintData.placeholderText"
        show-action
        shape="round"
        @search="onSearch"
        @input="showList"
        @cancel="onCancel"
      >
        <div slot="action" @click="onSearch">搜索</div>
        <div slot="left-icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-littleSearch-line" />
          </svg>
        </div>
      </van-search>
      <search-hint :searchHintData="searchHintData" ref="searchHint"></search-hint>
    </div>
    <!-- 最近搜索 -->
    <div class="searchRecommend searchHistory" v-if="(list.length>0&&type!=='order') ||(type=='order'&&order_list.length>0)">
      <p class="recommend title">
        <span class="history">最近搜索</span>
        <span class="clear" @click="clear" v-if="list.length>0||order_list.length>0">清空</span>
      </p>
      <div style="margin-top:17px;">
        <span
          class="tag"
          v-for="(item,index) in order_list"
          :key="index"
          @click="searchItem(item)"
          v-if="type == 'order'"
        >{{item.content}}</span>
        <span
          class="tag"
          v-for="(item,index) in list"
          :key="index"
          @click="searchItem(item)"
          v-else
        >{{item.content}}</span>
      </div>
    </div>
    <!-- 热门搜索 -->
    <div
      class="searchRecommend"
      v-if="(type == 'brand' || type == 'mall') && hotSearch.length > 0 && home_id == 'all'"
    >
      <p class="recommend">热门搜索</p>
      <van-row type="flex" gutter="15">
        <van-col span="12" v-for="(item,index) in hotSearch" :key="index">
          <!-- <span class="tag" @click="hotSearchItem(item)">{{item}}</span> -->
          <div class="hotContent" @click="hotSearchItem(item)">
            <span class="hotSort first" v-if="index == 0">{{index+1}}</span>
            <span class="hotSort second" v-if="index == 1">{{index+1}}</span>
            <span class="hotSort third" v-if="index == 2">{{index+1}}</span>
            <span class="hotSort" v-if="index > 2">{{index+1}}</span>
            <span class="hotDesc">{{item}}</span>
          </div>
        </van-col>
      </van-row>
    </div>
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style scoped  src="@/style/scss/pages/search.scss"  lang="scss"></style>

<script>
import { SEARCH_HOTKEY_GETS } from "../apis/public.js";
import searchHint from "../components/searchHint";
// import easyNav from "./../components/easyNav";
export default {
  components: {
    searchHint
    // easyNav
  },
  data() {
    return {
      searchHintData: {
        search: "",
        placeholderText: "请输入商品名称",
        list: [],
        type: "",
        state:0
      },
      type: "",
      home_id: "",
      hotSearch: [],
      list: [],
      order_list:[],
    };
  },
  mounted() {
    this.type = this.$route.query.type;
    this.searchHintData.type = this.$route.query.type;
    if (this.type == "order") {
      this.searchHintData.placeholderText = "搜索商品名称/订单编号";
    }
    this.home_id = localStorage.getItem("home_id");
    this.getHotKey();
    this.getLocalItem();
  },
  methods: {
    clear() {
      this.$dialog
        .confirm({
          title: "确认清空历史记录？",
          cancelButtonText: "取消",
          confirmButtonText: "清空"
        })
        .then(() => {
          if(this.type == 'order'){
            this.order_list = [];
            localStorage.removeItem("orderCmts");
          }else{
            this.list = [];
            localStorage.removeItem("cmts");
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    onCancel(){

    },
    showList (){
      this.$refs.searchHint.showList();
    },
    // 搜索按钮
    searchTo(_type) {
      switch (_type) {
        case "order":
          this.$router.push({
            name: "orderresult",
            query: {
              type: "order",
              searchContent: this.searchHintData.search
              // state:this.state,
            }
          });
          this.saveItem();
          break;
        case "brand":
          this.$router.push({
            name: "brandresult",
            query: {
              type: "brand",
              searchContent: this.searchHintData.search
            }
          });
          this.saveItem();
          break;
        case "mall":
          var _query = {};
          _query.type = "mall";
          _query.searchContent = this.searchHintData.search;
          if (this.$route.query.supplier_id != "undefined") {
            _query.supplier_id = this.$route.query.supplier_id;
          }
          this.$router.push({
            name: "brandresult",
            query: _query
          });
          this.saveItem();
          break;
        case "index":
          this.$router.push({
            name: "brandresult",
            query: {
              type: "index",
              searchContent: this.searchHintData.search
            }
          });
          this.saveItem();
          break;
        case "coupon":
          this.$router.push({
            name: "couponresult",
            query: {
              type: "coupon",
              ticket_id: this.$route.query.ticket_id,
              searchContent: this.searchHintData.search
            }
          });
          this.saveItem();
          break;
        case "multi":
          this.$router.push({
            name: "multiresult",
            query: {
              type: "multi",
              multi_id: this.$route.query.multi_id,
              searchContent: this.searchHintData.search
            }
          });
          this.saveItem();
          break;
      }
    },
    onSearch() {
      if (
        this.searchHintData.search.trim() == "" ||
        this.searchHintData.search.length == 0
      ) {
        this.$toast("请输入您要搜索的内容！");
        return;
      }

      if (this.type == "order") {
        this.searchTo("order");
      } else if (this.type == "brand") {
        this.searchTo("brand");
      } else if (this.type == "mall") {
        this.searchTo("mall");
      } else if (this.type == "index") {
        this.searchTo("index");
      } else if (this.type == "coupon") {
        this.searchTo("coupon");
      } else if (this.type == "multi") {
        this.searchTo("multi");
      } else {
        this.$toast("请输入您要搜索的内容！");
      }
    },
    //获取热搜词
    async getHotKey() {
      var data = {
        brand_id: this.$route.query.brand_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await SEARCH_HOTKEY_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        this.hotSearch = res.response_data;
      } else {
        this.$toast(res.error_message);
      }
    },
    //将搜索内容存储到本地
    saveItem() {
      var content = { content: this.searchHintData.search };
      var list;
      if(this.type == 'order'){
        list = JSON.parse(localStorage.getItem("orderCmts") || "[]");
      }else{
        list = JSON.parse(localStorage.getItem("cmts") || "[]");
      }
      if (list == null) list = [];
      if (list.length > 10) {
        list = list.slice(0, 9);
      }
      list.unshift(content);
      const age = "content";
      list = list.reduce(
        (all, next) =>
          all.some(atom => atom[age] == next[age]) ? all : [...all, next],
        []
      );
      if(this.type == 'order'){
        localStorage.setItem("orderCmts", JSON.stringify(list));
      }else{
        localStorage.setItem("cmts", JSON.stringify(list));
      }
      this.content = "";
      this.$emit("func");
    },
    //读取本地历史记录
    getLocalItem() {
      if(this.type == 'order'){
        var list = JSON.parse(localStorage.getItem("orderCmts") || "[]");
        if (list) this.order_list = list;
      }else{
        var list = JSON.parse(localStorage.getItem("cmts") || "[]");
        if (list) this.list = list;
      }
    },
    toResult(item) {
      // return;
      this.$router.push({
        name: "orderresult",
        query: {
          type: "order",
          searchContent: this.searchHintData.search
          // state: item.order_state
        }
      });
    },
    hotSearchItem(item) {
      var data = {};
      var q = {};

      if (this.type == "order") {
        data.name = "orderresult";
        q.type = "order";
        q.searchContent = item;
      }
      if (this.type == "brand") {
        data.name = "brandresult";
        q.type = "brand";
        q.searchContent = item;
      }
      if (this.type == "mall") {
        data.name = "brandresult";
        q.type = "mall";
        q.searchContent = item;
        if (this.$route.query.supplier_id != "undefined")
          q.supplier_id = this.$route.query.supplier_id;
      }
      if (this.type == "coupon") {
        data.name = "couponresult";
        q.type = "coupon";
        q.ticket_id = this.$route.query.ticket_id;
        q.searchContent = item;
      }
      if (this.type == "multi") {
        data.name = "multiresult";
        q.type = "multi";
        q.multi_id = this.$route.query.multi_id;
        q.searchContent = item;
      }

      data.query = q;

      this.$router.push(data);
    },
    searchItem(item) {
      var data = {};
      var q = {};

      if (this.type == "order") {
        data.name = "orderresult";
        q.type = "order";
        q.searchContent = item.content;
      }
      if (this.type == "brand") {
        data.name = "brandresult";
        q.type = "brand";
        q.searchContent = item.content;
      }
      if (this.type == "mall") {
        data.name = "brandresult";
        q.type = "mall";
        q.searchContent = item.content;
        if (this.$route.query.supplier_id != "undefined")
          q.supplier_id = this.$route.query.supplier_id;
      }
      if (this.type == "coupon") {
        data.name = "couponresult";
        q.type = "coupon";
        q.ticket_id = this.$route.query.ticket_id;
        q.searchContent = item.content;
      }
      if (this.type == "multi") {
        data.name = "multiresult";
        q.type = "multi";
        q.multi_id = this.$route.query.multi_id;
        q.searchContent = item.content;
      }

      data.query = q;

      this.$router.push(data);
    }
  }
};
</script>
