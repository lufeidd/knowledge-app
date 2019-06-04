<template>
  <div id="punishPage">
    <div class="commodity">
      <div class="line">
        <div class="ratiobox">
          <a class="bookImg" v-lazy:background-image="imgUrl"></a>
        </div>
        <div class="stars">
          <span class="text">商品评价</span>
          <van-rate
            v-model="value1"
            :size="18"
            color="#f05654"
            void-icon="star"
            void-color="#f5f5f5"
          />
        </div>
      </div>
      <textarea placeholder="说说你对产品的了解吧!"></textarea>
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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/comment.scss" scoped lang="scss"></style>

<script>
import upload from "../../../../components/upload";
export default {
  components: {
    upload
  },
  data() {
    return {
      imgUrl:
        "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85",
      value1: 0,
      value2: 0,
      value2: 0,
      uploadData: {
        maxlength: 3,
        text: "上传图片(最多三张)"
      }
    };
  },
  methods: {
    uploadImg(e, num) {
      //上传图片
      // this.option.img
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    }
  }
};
</script>
