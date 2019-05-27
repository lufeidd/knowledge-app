<template>
  <div id="editPage">
    <div class="company">
      <span class="text">物流公司:</span>
      <search-hint :searchHintData="searchHintData"></search-hint>
    </div>
    <div class="freight">
      <span class="freightText">运费：</span>
      <input type="text" placeholder="请输入金额,例如5.00">元
    </div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button type="danger" size="large">提交</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" lang="scss"></style>

<script>
import searchHint from "../../../components/searchHint";
export default {
  components: {
    searchHint
  },
  data() {
    return {
      searchResult: [],
      searchHintData: {
        search: "",
        list: [
          { msg: "中通快递" },
          { msg: "申通快递" },
          { msg: "天天快递" },
          { msg: "顺丰快递" },
          { msg: "圆通快递" },
          { msg: "韵达快递" }
        ]
      }
      // search:'',
      // list:[
      //     {msg:'中通快递'},
      //     {msg:'申通快递'},
      //     {msg:'天天快递'},
      //     {msg:'顺丰快递'},
      //     {msg:'圆通快递'},
      //     {msg:'韵达快递'},
      //   ]
    };
  },
  computed: {
    // //过滤方法
    // items: function() {
    //     var _search = this.search;
    //     if (_search) {
    //         //不区分大小写处理
    //         var reg = new RegExp(_search, 'ig')
    //         //es6 filter过滤匹配，有则返回当前，无则返回所有
    //         return this.list.filter(function(e) {
    //             //匹配所有字段
    //             return Object.keys(e).some(function(key) {
    //                 return e[key].match(reg);
    //             })
    //         })
    //     };
    //     return this.list;
    //     // console.log(this.list)
    // }
  },
  methods: {
    // select(item,index){
    //   // console.log(item,index)
    //   // var a=item.msg;
    //   // $('input').val(a);
    //   this.search=item.msg;
    //   $('ul').css({'display':'none'});
    // },
    // showList(){
    //   if($('input').val().length>0){
    //     $('ul').css({'display':'block'});
    //     $('.clearIcon').css({'display':'block'});
    //   }else {
    //     $('ul').css({'display':'none'});
    //     $('.clearIcon').css({'display':'none'});
    //   }
    // },
    // clear(){
    //   $('input').val('');
    //   if($('input').val().length>0){
    //       $('ul').css({'display':'block'})
    //   }else {
    //     $('ul').css({'display':'none'});
    //     $('.clearIcon').css({'display':'none'});
    //   }
    // },
  }
};
</script>
