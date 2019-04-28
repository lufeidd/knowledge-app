<template>
  <div id="feedbackPage">
    <textarea cols="30" rows="10" placeholder="请输入问题并留下联系方式，我们会尽快联系您" @input="question"></textarea>
    <input type="text" placeholder="您的手机号、QQ或邮箱（三选一）" @input="question">
    <upload :uploadData="uploadData"></upload>
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-if="submit">
      <van-button disabled type="danger" size="large" replace to="/personal/help/feedback">提交</van-button>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-else>
      <van-button type="danger" size="large" replace to="/personal/help/feedback">提交</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
import upload from "../../../components/upload";
export default {
  components: {
    upload
  },
  data() {
    return {
      submit: true,
      uploadData: {
        maxlength: 3
      }
    };
  },
  mounted() {
    var input = $("input").val();
    console.log(input.length);
  },
  methods: {
    change() {
      var input = $("input").val().length;
      var textarea = $("textarea").val().length;
      if (input > 0 && textarea > 0) {
        this.submit = false;
        console.log(this.submit);
      } else {
        this.submit = true;
      }
    },
    question() {
      this.change();
    },
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
