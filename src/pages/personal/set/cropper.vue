<template>
  <!-- 头像裁切 -->
  <div class="cropperBox">
    <vueCropper
      ref="cropper"
      :img="option.img"
      :outputSize="option.size"
      :outputType="option.outputType"
      :info="true"
      :full="option.full"
      :canMove="option.canMove"
      :canMoveBox="option.canMoveBox"
      :fixedBox="option.fixedBox"
      :original="option.original"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :centerBox="option.centerBox"
      :high="option.high"
      :infoTrue="option.infoTrue"
      :maxImgSize="option.maxImageSize"
      :enlarge="option.enlarge"
      :mode="option.mode"
    ></vueCropper>
    <div class="buttonBox">
      <div class="button" @click="cancel">取消</div>
      <div class="button" @click="save">保存</div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/cropper.scss" lang="scss"></style>

<script>
import VueCropper from "./../../../plugin/vue-cropper/vue-cropper";

export default {
  components: {
    VueCropper
  },
  data() {
    return {
      // 头像裁切
      model: false,
      option: {
        img: "https://qn-qn-kibey-static-cdn.app-echo.com/goodboy-weixin.PNG",
        size: 1,
        full: false,
        outputType: "jpg",
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: $(window).width() * 0.72,
        autoCropHeight: $(window).width() * 0.72,
        centerBox: true,
        high: true
      }
    };
  },
  methods: {
    // 头像裁切
    cancel() {
    },
    save() {
      this.finish("blob");
    },
    finish(type) {
      // 输出
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data);
          this.listData[0].imgSrc = img;
          console.log(data);
          console.log(img);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          console.log(data);
        });
      }
    }
    }
};
</script>

