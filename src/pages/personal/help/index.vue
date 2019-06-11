<template>
  <div id="helpPage">

    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
    >
      <van-cell :title="item.title" v-for="item,index in listData" value is-link arrow-direction="down" :key="index" @click="todetail(index)"/>
    </van-list>


    <div style="height: 60px;"></div>

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
      programLoading: false,
      programFinished: false,
      page:1,
      page_size:10,
    }
  },
  mounted(){
    // this.getData();
  },
  methods:{
    programLoad(){
      this.getData();
    },
    async getData(){
      var data = {
        version:"1.0",
        page:this.page,
        page_size:this.page_size,
      };
      data.sign = this.$getSign(data);
      let res = await USER_HELPER_GETS(data);
      if(res.hasOwnProperty("response_code")){
        // this.listData = res.response_data.result;
        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.listData.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);
      }else{
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
