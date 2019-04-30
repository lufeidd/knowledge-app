<template>
  <div id="feedbackPage">
    <textarea cols="30" rows="10" placeholder="请输入问题并留下联系方式，我们会尽快联系您" @input="question"></textarea>
    <input type="text" placeholder="您的手机号、QQ或邮箱（三选一）" @input="question">
    <upload :uploadData="uploadData"></upload>
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-if="submit">
      <van-button disabled type="danger" size="large" replace >提交</van-button>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-else>
      <van-button type="danger" size="large" replace @click="submitFeedback">提交</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
import upload from "../../../components/upload";
import { USER_FEEDBACK_ADD } from "../../../apis/user.js";
import { COMMON_UPLOAD } from "../../../apis/user.js";
export default {
  components: {
    upload
  },
  data() {
    return {
      submit: true,
      uploadData: {
        maxlength: 3
      },
      feedbackData:{},
      feedbackImgs:'',
      content:'',
      contact:'',
      url:'',
    };
  },
  mounted() {
    var input = $("input").val();
    // console.log(input.length);
  },
  methods: {
    change() {
      var input = $("input").val().trim();
      var textarea = $("textarea").val().trim();
      // var uploadFile =$('.contetn.set').length;
      if (input.length > 0 && textarea.length > 0 ) {
        this.submit = false;
        // console.log(this.submit);
      } else {
        this.submit = true;
      }
    },
    question() {
      this.change();
    },
    async submitFeedback(){
      this.feedbackImgs = $('.content.set').eq(0).attr('data-src')+'|'+$('.content.set').eq(1).attr('data-src')+'|'+$('.content.set').eq(2).attr('data-src');
      this.feedbackImgs = this.feedbackImgs.split('|').filter(item => item!=="undefined").join('|');
console.log(this.feedbackImgs)

      var tStamp = this.$getTimeStamp();
      var data = {
        version:"1.0",
        timestamp:tStamp,
        file:this.feedbackImgs,
        opt_type:'feedback',
        file_type:'base64',
      }

      data.sign = this.$getSign(data);
      let res = await COMMON_UPLOAD(data);
      if(res.hasOwnProperty("response_code")){
        console.log(res);
        this.url = res.response_data.url;
        
      }else{
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
