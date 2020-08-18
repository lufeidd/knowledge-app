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
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="buttonBox" :class="{ iphx: this.isIphx }">
      <div class="button" @click="cancel">取消</div>
      <div class="button" @click="save">保存</div>
    </div>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/cropper.scss" scoped lang="scss"></style>

<script>
//  引入接口
import { COMMON_UPLOAD } from "../../../apis/public.js";

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
        high: true
      }
    };
  },
  mounted() {
    this.option.img = localStorage.getItem('headPic');
    this.cropperShow = true;

    // console.log(this.option.img);

    if (this.option.img == null) {
      this.$router.replace("/personal/index");
    }
  },
  beforeRouterLeave(to, from, next) {
    // 设置下一个路由的 meta
    // to.meta.keepAlive = false; // 跳转到 /personal/set/info false刷新,true缓存
    // next();
  },
  // 进入当前页面
  beforeRouteEnter(to, from, next) {
    // 当前页刷新
    if (from.name == null) {
    }
    next();
  },
  methods: {
    // 头像裁切
    cancel() {
      this.$router.replace("/personal/set/info");
    },
    save() {
      this.finish("");
    },
    finish(type) {
      // 输出
      if (type === "blob") {
        var self = this;
        this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data);
          // console.log(img);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.uploadData(data);
        });
      }
    },
    // 上传图片接口
    async uploadData(img) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        file: img,
        opt_type: "head_pic",
        file_type: "Base64",
        source: 1,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMON_UPLOAD(data);
      // console.log(res.response_data[0].acc_url);
      if (res.hasOwnProperty("response_code")) {
        this.$router.replace({
          name: "info",
          query: { img: res.response_data[0].acc_url }
        });
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

