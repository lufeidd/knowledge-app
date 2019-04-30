<template>
  <div id="helpPage">
    <van-cell :title="item.title" value is-link arrow-direction="down" :key="index" v-for="item,index in listData" @click="todetail(index)"/>
    <!-- <van-cell title="购买" value is-link arrow-direction="down"/>
    <van-cell title="退款" value is-link arrow-direction="down"/>
    <van-cell title="阅读" value is-link arrow-direction="down"/>
    <van-cell title="优惠券" value is-link arrow-direction="down"/>
    <van-cell title="试听" value is-link arrow-direction="down"/>
    <van-cell title="设置" value is-link arrow-direction="down"/>
    <van-cell title="如何绑定手机号" value is-link arrow-direction="down"/>
    <van-cell title="如何解绑" value is-link arrow-direction="down"/> -->
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button type="danger" size="large" replace to="/personal/help/feedback">我要反馈</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
import { USER_HELPER_GETS } from "../../../apis/user.js";
export default {
  data () {
    return {
      listData:[],
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    async getData(){
      var data = {
        version:"1.0",
      };
      let res = await USER_HELPER_GETS(data);
      if(res.hasOwnProperty("response_code")){
        this.listData = res.response_data.result;
        // console.log(res.response_data);
      }else{
        this.$toast(res.error_message);
      }
    },
    todetail(index){
      this.$router.push({
        name:"helpdetail",
        params:{
          helper_id:index + 1,
          },
        });
      console.log(index);
    }
  }
}
</script>
