<template>
  <div id="searchHint">
    <div class="logistics">
      <!-- <span class="text">物流公司:</span> -->
      <input type="text" v-model="searchHintData.search" @input="showList" @focus="inputText" @blur="lose">
      <van-icon name="clear" size="16" color="#ccc" class="clearIcon" @click="clear"/>
    </div>
    <ul>
      <li v-for="(item,index) in items" :key="index" @click="select(item,index)">{{item.msg}}</li>
    </ul>
  </div>
</template>

<style lang="scss">
  #searchHint{
    position: relative;
    .logistics{
    //  padding: 0px 15px;
     position: relative;
    .text{
      font-size: $fontSize + 2;
    }
    input{
      border: none;
      padding-left: 5px;
    }
    .clearIcon{
      position: absolute;
      right: 15px;
      top: 50%;
      margin-top: -7px;
      display: none;
    }
   }
   ul{
    margin-top: 5px;
    display: none;
    @include position(absolute,tl,100%,0,100%,null,null);
    z-index: 99;
    li{
      background-color: $greyLight;
      padding: 5px 5px;
    }
  }
 }
</style>

<script>
export default {
  name:"search-hint",
  props:['searchHintData'],
  computed:{
        //过滤方法
    items: function() {
        var _search = this.searchHintData.search;
        if (_search) {
            //不区分大小写处理
            var reg = new RegExp(_search, 'ig')
            //es6 filter过滤匹配，有则返回当前，无则返回所有
            return this.searchHintData.list.filter(function(e) {
                //匹配所有字段
                return Object.keys(e).some(function(key) {
                    return e[key].match(reg);
                })
            })
        };
        return this.searchHintData.list;
        // console.log(this.list)
    }
  },
  methods:{
    select(item,index){
      this.searchHintData.search=item.msg;
      $('ul').css({'display':'none'});
    },
    showList(){
      this.searchData();
    },
    clear(){
      $('input').val('');
      this.searchData();
    },
    inputText(){
      this.searchData();
    },
    lose(){
      $('ul').css({'display':'none'});
    },
    searchData(){
      if($('input').val().length>0){
        $('ul').css({'display':'block'});
        $('.clearIcon').css({'display':'block'});
      }else {
        $('ul').css({'display':'none'});
        $('.clearIcon').css({'display':'none'});
      }
    }
  },
}
</script>
