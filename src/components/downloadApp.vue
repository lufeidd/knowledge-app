<template>
  <div v-if="bannerShow">
    <div id="downloadApp">
      <div class="articleInfo">
        <div class="ratiobox">
          <img src="./../assets/logo.png" width="100%" />
        </div>
        <div class="detail">火把知识</div>
      </div>
      <span class="foucsButton" @click="download">打开</span>
      <div class="open-in-browser" v-if="isInWx">
        <div class="text"><div>点击右上角，选择在浏</div>览器中打开~</div>
        <img src="./../assets/tips.png" class="pic">
      </div>
    </div>
    <div style="height:58px;"></div>

  </div>
</template>

<style lang="scss">
#downloadApp {
  background-color: $white;
  padding: 10px;
  box-shadow: 0px 0 12px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 1;
  position: fixed;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 9999;
  max-width: 640px;

  @include displayFlex(flex, space-between, center);
  @include textOverflow;

  .articleInfo {
    @include displayFlex(flex, flex-start, null);
    @include textOverflow;
    flex-grow: 1;

    .detail {
      margin-left: 10px;
      flex-direction: column;
      @include displayFlex(flex, center, flex-start);
      @include textOverflow;
      .number {
        font-size: $fontSize - 2;
        color: $cl9;
      }
    }

    .ratiobox {
      width: 38px;
      height: 0;
      padding-bottom: 38px;
      flex-shrink: 0;
    }
  }

  .foucsButton {
    display: inline-block;
    width: 50px;
    line-height: 20px;
    background-color: $redDark;
    color: $white;
    text-align: center;
    border-radius: 10px;
    font-size: $fontSize - 2;
    flex-shrink: 0;
  }

  .open-in-browser {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.5);
    .text {
      position: absolute;
      top: 100px;
      right: 120px;
      z-index: 10;
    }
    .pic {
      position: absolute;
      top: 10px;
      right: 26px;
      width: 280px;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      device: "ANDROID",
      bannerShow: false,
      isInWx: false
    };
  },
  mounted() {
    // banner显示逻辑
    this.device = this.$route.query.device;
    var u = navigator.userAgent;
    var _wx = u.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    if (_wx) {
      if (this.device == 'ANDROID' || this.device == 'IOS' || this.device == 'WX') {
        this.bannerShow = true;
      }
    } else if (
      localStorage.getItem("isHuobaIosLogin") == "yes" ||
      localStorage.getItem("isHuobaAndroidLogin") == "yes"
    ) {// app内webview不需要显示下载按钮
      this.device = "WEBVIEW";
      this.bannerShow = false;
    } else {
      this.bannerShow = true;
    }

  },
  methods: {
    download() {
      // this.$linkToApp();
      console.log(window.location.hash.split('#')[1].split('?')[0]);
      var params = window.location.hash.split('#')[1].split('?')[0];

      var u = navigator.userAgent;
      var _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var _wx = u.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
      if (_android && _wx) {
        this.pop_one_show = false;
        this.isInWx = true;
        window.document.body.style.overflow = 'hidden';
      } else {
        let  _linkData = this.$getAppParams(params);
        this.$openAppPage(_linkData);
      }
    }
  }
};
</script>

