<template>
  <div id="helpPage">
    <div style="padding-bottom:60px;">
      <van-cell :title="item.title" v-for="item,index in listData" value is-link arrow-direction="down" :key="index" @click="todetail(index)"/>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button type="danger" size="large" replace to="/personal/help/feedback">我要反馈</van-button>
    </div>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
import { USER_HELPER_GETS } from "../../../apis/user.js";
import easyNav from "./../../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data () {
    return {
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
