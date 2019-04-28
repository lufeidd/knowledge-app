<template>
  <div class="refund" id="threePage">
    <div class="cell">
      <span>退款类型:</span>
      <span class="onlyRefund">退货退款</span>
    </div>
    <div class="cell reason" @click="choose()">
      <div>
        <span>退款原因:</span>
        <span class="typeRefund"></span>
      </div>
      <span class="choose">
        请选择退款原因
        <svg class="icon arrow" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </span>
    </div>
    <div class="cell">
      <div class="reason">
        <div>
          <span>退款金额:</span>
          <span class="most">
            最多
            <span class="money">15.8元</span>
          </span>
        </div>
        <span class="choose">（包含运费：5元）</span>
      </div>
      <input type="text" placeholder="请输入退款金额,例如5.00">元
    </div>
    <div class="cell explain">
      <span>退款说明:</span>
      <textarea @input="inputChange" v-model="contentModel" placeholder="字数不得超过500"></textarea>
    </div>
    <div class="upload">
      <span>上传凭证</span>
      <upload :uploadData="uploadData"></upload>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button type="danger" size="large">提交申请</van-button>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="title">
        <span>请选择退款原因</span>
        <span class="complete">完成</span>
      </div>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
            :title="item.title"
            clickable
            @click="radio = '1'"
            v-for="item in reasonList"
            :key="radio"
          >
            <van-radio :name="item.number" checked-color="#ff504e"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" lang="scss"></style>

<script>
import upload from "../../../../components/upload";
export default {
  components: {
    upload
  },
  data() {
    return {
      uploadData: {
        maxlength: 6,
        text: "上传凭证(最多六张)"
      },
      // contentTotal: 30,
      contentModel: "",
      contentLength: 0,
      show: false,
      radio: "0",
      reasonList: [
        { title: "七天无理由退货", number: 1 },
        { title: "大小/尺寸不符合要求", number: 2 },
        { title: "颜色/图案/款式不符合要求", number: 3 },
        { title: "质量问题", number: 4 },
        { title: "不喜欢", number: 5 },
        { title: "漏件/破损", number: 6 },
        { title: "其他", number: 7 }
      ]
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
    },
    choose() {
      this.show = true;
    },
    inputChange() {
      this.contentLength = this.contentModel.length;
      if (this.contentLength > 500) {
        this.$toast("退款说明字数已超出，请修改!");
        return;
      }
    }
  }
};
</script>
