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
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
import upload from "../../../components/upload";
import easyNav from "./../../../components/easyNav";
import { USER_FEEDBACK_ADD } from "../../../apis/user.js";
import { COMMON_UPLOAD } from "../../../apis/public.js";
import { setTimeout } from 'timers';
export default {
  components: {
    upload,
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
      var iphone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var qqNumber = /[1-9][0-9]{5,13}/;
      var email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      // var uploadFile =$('.contetn.set').length;
      if ((iphone.test(input) || qqNumber.test(input) || email.test(input)) && textarea.length > 0 ) {
        this.submit = false;
        // console.log(this.submit);
      } else {
        this.submit = true;
      }
    },
    question() {
      this.change();
    },
    //获取上传图片路径
    async submitFeedback(){
      this.feedbackImgs = $('.content.set').eq(0).attr('data-src')+'||'+$('.content.set').eq(1).attr('data-src')+'||'+$('.content.set').eq(2).attr('data-src');
      this.feedbackImgs = this.feedbackImgs.split('||').filter(item => item!=="undefined").join('||');
// console.log(this.feedbackImgs)

      var tStamp = this.$getTimeStamp();
      var data = {
        version:"1.0",
        timestamp:tStamp,
        file:this.feedbackImgs,
        opt_type:'feedback',
        file_type:'Base64',
        source:1,
      }

      data.sign = this.$getSign(data);
      let res = await COMMON_UPLOAD(data);
      if(res.hasOwnProperty("response_code")){
        console.log(res);
        var arr=[];
        for(let i=0;i<res.response_data.length;i++){
          arr.push(res.response_data[i].url);
        }
        this.url = arr.join('|');
        // console.log(this.url)
        //调用反馈接口

        this.content = $('input').val().trim();
        this.contact = $("textarea").val().trim();
        // console.log(this.content,this.contact)
        var tStamp = this.$getTimeStamp();
        var data = {
          version:"1.0",
          timestamp:tStamp,
          url:this.url,
          content:this.content,
          contact:this.contact,
        }

        data.sign = this.$getSign(data);
        let res1 = await USER_FEEDBACK_ADD(data);
          if(res1.hasOwnProperty("response_code")){

              this.$toast('提交成功!');
              // setTimeout( location.reload() , 1000);
              // location.reload();
              this.$router.push('/personal/help/index');
        }else{
          this.$toast(res1.error_message);
        }

      }else{
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
