<template>
  <div id="indexPage" class="comment">
    <div class="list" v-for="item,index in listData.detail">
      <div class="bookDetail">
        <div class="ratiobox">
          <a class="bookImg" v-lazy:background-image="item.pic"></a>
        </div>
        <div class="info">
          <span class="title">{{item.goods_name}}</span>
          <div class="commentLine">
            <span class="number">
              <span class="money">¥ {{item.real_price}}</span> x{{item.buy_count}}
            </span>

          </div>
        </div>
      </div>
      <span class="button" v-if="item.if_comment == 0" @click="comment(item)">评价</span>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/comment.scss" scoped lang="scss"></style>

<script>
import{USER_ORDER_DETAIL_GET} from "../../../../apis/user.js"
export default {
  data() {
    return {
      order_id:null,
      listData:{},
    };
  },
  mounted(){
    this.order_id = this.$route.query.order_id;
    this.getData();
  },
  methods:{
    async getData(){
      var tStamp = this.$getTimeStamp();
      var data={
        order_id: this.order_id,
        version:"1.0",
        timestamp:tStamp,
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);
      if(res.hasOwnProperty("response_code")){
        this.listData = res.response_data;
        // console.log(res);
      }else{
        this.$toast(res.error_message);
      }
    },
    //评价
    comment(item){
      console.log(item);
      this.$router.push({
        name:'commentpunish',
        query:{
          pic:item.pic,
          order_id:this.order_id,
          detail_id:item.id,
        }
      })
    }
  },
};
</script>
