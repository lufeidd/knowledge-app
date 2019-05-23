<template>
  <div id="detailPage">
    <p class="delet">{{contentData.title}}</p>
    <div class="content">
      <!-- <p>{{contentData.content}}</p> -->
    </div>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
import { USER_HELPER_DETAIL } from "../../../apis/user.js";
import easyNav from "./../../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data() {
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
      contentData:{ },
    };
  },
  mounted(){
    this.getData();
  },
  methods:{
    async getData(){
      var helper_id = this.$route.params.helper_id;
      var tStamp = this.$getTimeStamp();
      console.log(helper_id,111)
      var data={
        version:"1.0",
        helper_id:helper_id,
        timestamp:tStamp,
      };

      data.sign = this.$getSign(data);

      let res = await USER_HELPER_DETAIL(data);
      if(res.hasOwnProperty("response_code")){
        this.contentData = res.response_data;
        // console.log(res.response_data);
        $('.content').append(this.contentData.content);
      }else{
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
