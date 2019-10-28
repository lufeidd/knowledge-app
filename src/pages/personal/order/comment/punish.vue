<template>
  <div id="punishPage">
    <div class="commodity">
      <div class="line">
        <div class="ratiobox">
          <a class="bookImg" :style="{backgroundImage:'url(' + pic + ')'}"></a>
        </div>
        <div class="stars">
          <span class="text">商品评价</span>
          <van-rate
            v-model="value1"
            :size="18"
            color="#f05654"
            void-icon="star"
            void-color="#f5f5f5"
            @change="check"
          />
        </div>
      </div>
      <textarea v-model="content" placeholder="说说你对产品的了解吧!（不得少于8个字）" @input="check"></textarea>
      <!-- 字数限制 -->
      <div class="count">
        {{ contentLength }}/{{ contentTotal }}
      </div>
      <upload :uploadData="uploadData"></upload>
    </div>
    <div class="service">
      <div class="serviceLine">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shop-line"></use>
        </svg>
        <span>服务评价</span>
      </div>
      <div class="serviceStars">
        <div class="descrip">
          <span class="serviceText">描述相符</span>
          <van-rate
            v-model="value2"
            :size="18"
            color="#f05654"
            void-icon="star"
            void-color="#f5f5f5"
            @change="check"
          />
        </div>
        <div class="descrip">
          <span class="serviceText">服务态度</span>
          <van-rate
            v-model="value3"
            :size="18"
            color="#f05654"
            void-icon="star"
            void-color="#f5f5f5"
            @change="check"
          />
        </div>
      </div>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-if="submit">
      <van-button disabled type="danger" size="large" replace>发布</van-button>
    </div>

    <div class="bottomBox" :class="{iphx:this.isIphx}" v-else>
      <van-button type="danger" size="large" replace @click="submitComment">发布</van-button>
    </div>
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand"></EazyNav>

  </div>
</template>

<style src="@/style/scss/pages/personal/order/comment.scss" scoped lang="scss"></style>

<script>
import upload from "../../../../components/upload";
import { COMMON_UPLOAD } from "../../../../apis/public.js";
import { USER_ORDER_ORDER_COMMENT_ADD } from "../../../../apis/user.js";
// import easyNav from "./../../../../components/easyNav";
export default {
  components: {
    upload,
    // easyNav
  },
  data() {
    return {
      pic:"",
      order_id:null,
      detail_id:null,
      value1: 0,
      value2: 0,
      value3: 0,
      url:"",
      content:"",
      commentImg:"",
      submit:true,
      uploadData: {
        maxlength: 3,
        text: "上传图片(最多三张)"
      },
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   // searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type:'order',
      // },
      contentLength:0,
      contentTotal:200,
    };
  },
  mounted(){
    this.pic = this.$route.query.pic;
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    console.log(this.detail_id)
  },
  methods: {
    async getImgUrl() {
      this.commentImg =
        $(".content.set")
          .eq(0)
          .attr("data-src") +
        "||" +
        $(".content.set")
          .eq(1)
          .attr("data-src") +
        "||" +
        $(".content.set")
          .eq(2)
          .attr("data-src");
      this.commentImg = this.commentImg
        .split("||")
        .filter(item => item !== "undefined")
        .join("||");
      // console.log(this.feedbackImgs)

      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        file: this.commentImg,
        opt_type: "order_comment",
        file_type: "Base64",
        source: 1
      };

      data.sign = this.$getSign(data);
      let res = await COMMON_UPLOAD(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        var arr = [];
        for (let i = 0; i < res.response_data.length; i++) {
          arr.push(res.response_data[i].url);
        }
        this.url = arr.join("|");
        console.log(this.url)
      } else {
        this.$toast(res.error_message);
      }
    },
    async submitComment(){
      if ($(".flex-box").length > 1) {
        this.getImgUrl();
      }

      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        desc_pic: this.url,
        contents: this.content,
        order_id:this.order_id,
        detail_id:this.detail_id,
        score:this.value1,
        service_score:this.value3,
        dispatching_score:this.value2,
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_ORDER_COMMENT_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.$toast("发布成功!");
        this.$router.replace("/personal/order/comment/success");
      } else {
        this.$toast(res.error_message);
      }
    },
    check(){
      // console.log(this.value1,this.value2,this.value3)
      this.content= $("textarea").val().trim();
      this.contentLength = this.content.length;
      if(this.contentLength >= this.contentTotal ){
        this.content = this.content.substring(0,this.contentTotal);
        this.contentLength = this.contentTotal;
      };
      if(this.value1 > 0 && this.value2 > 0 && this.value3 > 0 && this.content.length > 7){
        this.submit = false;
      }else{
        this.submit = true;
      }
    }
  }
};
</script>
