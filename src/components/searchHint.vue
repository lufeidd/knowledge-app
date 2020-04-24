<template>
  <div id="searchHint">
    <div class="logistics">
      <!-- <span class="text">物流公司:</span> -->
      <input
        maxlength="50"
        type="text"
        v-model="searchHintData.search"
        @input="showList"
        @focus="inputText"
        data-type="searchHintData.type"
        :placeholder="searchHintData.placeholderText"
      />
      <van-icon name="clear" size="16" color="#ccc" class="clearIcon" @click="clearText" />
    </div>
    <ul>
      <li
        v-for="(item,index) in searchHintData.list"
        :key="index"
        @click="select(item,index)"
      >{{item}}</li>
    </ul>
  </div>
</template>

<style lang="scss">
#searchHint {
  position: relative;
  .logistics {
    //  padding: 0px 15px;
    position: relative;

    .text {
      font-size: $fontSize + 2;
    }
    input {
      border: none;
      padding-left: 25px;
      background-color: #f5f5f5;
      width: 90%;
      box-sizing: border-box;
    }
    .clearIcon {
      position: absolute;
      right: 8px;
      top: 50%;
      margin-top: -7px;
      display: none;
    }
  }
  ul {
    margin-top: 5px;
    display: none;
    @include position(absolute, tl, 100%, 0, 100%, null, null);
    z-index: 99;
    li {
      background-color: $greyLight;
      padding: 5px 5px;
    }
  }
}
</style>

<script>
import { SEARCH_SUGGEST } from "../apis/public";
import { setTimeout } from 'timers';
export default {
  name: "search-hint",
  props: ["searchHintData"],
  data(){
    return{

    }
  },
  mounted(){

  },
  computed: {
    //过滤方法
    // items: function() {
    //   var _search = this.searchHintData.search;
    //   if (_search) {
    //     //不区分大小写处理
    //     var reg = new RegExp(_search, "ig");
    //     //es6 filter过滤匹配，有则返回当前，无则返回所有
    //     return this.searchHintData.list.filter(function(e) {
    //       //匹配所有字段
    //       return Object.keys(e).some(function(key) {
    //         return e[key].match(reg);
    //       });
    //     });
    //   }
    //   return this.searchHintData.list;
    //   // console.log(this.list)
    // }
  },
  methods: {
    select(item, index) {
      console.log(item);
      this.searchHintData.search = item;
      $("#searchHint ul").css({ display: "none" });
    },
    async showList() {
      if (this.searchHintData.search.trim() == "") {
        this.searchData();
        return;
      }
      console.log(this.searchHintData.search.trim() == "");

      // setTimeout(()=> {

        var tStamp = this.$getTimeStamp();
        var data = {
          k: this.searchHintData.search,
          brand_id:this.$route.query.brand_id,
          supplier_id:this.$route.query.supplier_id,
          version: "1.0",
          timestamp: tStamp
        };
        data.sign = this.$getSign(data);
        let res = await SEARCH_SUGGEST(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log(res)
          this.searchHintData.list = res.response_data;
          this.searchData();
        } else {
          this.$toast(res.error_message);
        }

      // }, 600)
    },
    clearText() {
      $("#searchHint input").val("");
      this.searchData();
    },
    inputText() {
      this.searchData();
    },
    searchData() {
      if ($("#searchHint input").val().length > 0) {
        $("#searchHint ul").css({ display: "block" });
        $(".clearIcon").css({ display: "block" });
      } else {
        $("#searchHint ul").css({ display: "none" });
        $(".clearIcon").css({ display: "none" });
      }
    }
  }
};
</script>
