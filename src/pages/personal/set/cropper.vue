<template>
  <!-- 头像裁切 -->
  <div class="cropperBox">
    <!-- 异步组件，按需加载 -->
    <template v-if="cropperShow">
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
    </template>
    <div class="buttonBox">
      <div class="button" @click="cancel">取消</div>
      <div class="button" @click="save">保存</div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/cropper.scss" lang="scss"></style>

<script>
// import VueCropper from "./../../../plugin/vue-cropper/vue-cropper";

export default {
  components: {
    // 异步组件，按需加载
    VueCropper: () => import("./../../../plugin/vue-cropper/vue-cropper")
  },
  data() {
    return {
      cropperShow: false,
      // 头像裁切
      model: false,
      option: {
        img: null,
        size: 1,
        original: true,
        full: false,
        outputType: "jpg",
        canMove: true,
        fixedBox: true,
        canMoveBox: false,
        // 只有自动截图开启 宽度高度才生效
        autoCrop: true,
        autoCropWidth: $(window).width() * 0.72,
        autoCropHeight: $(window).width() * 0.72,
        centerBox: true,
        high: true,
      }
    };
  },
  mounted () {
    this.option.img = this.$route.query.data;
    this.cropperShow = true;

    // console.log('data:', this.$route.query.data);
  },
  methods: {
    // 头像裁切
    cancel() {
      this.$router.push("/personal/set/info");
    },
    save() {
      this.finish("blob");
    },
    finish(type) {
      // 输出
      if (type === "blob") {
        var self = this;
        this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data);

          self.$router.push({path: "/personal/set/info", query: {img: img}});
          console.log('img:', img);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          console.log('data:', data);
        });
      }
    }
  }
};
</script>

