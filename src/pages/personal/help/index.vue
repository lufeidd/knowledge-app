<template>
  <div id="helpPage">
    <div style="padding-bottom:60px;">
      <van-cell :title="item.title" v-for="item,index in listData" value is-link arrow-direction="down" :key="index" @click="todetail(item)"/>
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
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        
        this.listData = res.response_data.result;
        // console.log(res.response_data);
      }else{
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          
        }
        this.$toast(res.error_message);
      }
    },
    todetail(item){
      this.$router.push({
        name:"helpdetail",
        query:{
          helper_id: item.helper_id,
          },
        });
    }
  }
}
</script>
