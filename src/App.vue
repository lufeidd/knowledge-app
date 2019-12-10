<template>
  <div id="app">
    <Download></Download>
    <!-- 页面缓存, $route.meta.keepAlive默认false -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<style lang="scss" src="@/style/scss/app.scss">
</style>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0 !important;
  /* padding-top: env(safe-area-inset-top);  */
  /* 为导航栏+状态栏的高度 88px */
  /* padding-left: env(safe-area-inset-left);  */
  /* 如果未竖屏时为0 */
  /* padding-right: env(safe-area-inset-right);  */
  /* 如果未竖屏时为0 */
  /* padding-bottom: env(safe-area-inset-bottom);  */
  /* 为底下圆弧的高度 34px */
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
::-ms-scrollbar {
  width: 0;
  height: 0;
}
::scrollbar[orient="vertical"] {
  min-width: 0 !important;
}
/* 滚动条的滑轨背景颜色 */
::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.05);
}
/* 滑块颜色 */
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
}
/* 滑轨两头的监听按钮颜色 */
::-webkit-scrollbar-button {
  height: 0;
  background-color: rgba(0, 0, 0, 0.05);
}
/* 横向滚动条和纵向滚动条相交处尖角的颜色 */
::-webkit-scrollbar-corner {
  background-color: black;
}

/*设置input placeholder颜色*/
::-webkit-input-placeholder,
::-webkit-textarea-placeholder {
  font-size: 13px;
  color: #999;
}

:-moz-placeholder {
  font-size: 13px;
  color: #999;
}

:-ms-input-placeholder,
:-ms-textarea-placeholder {
  font-size: 13px;
  color: #999;
}
</style>

<script>
import axios from "axios";

// 下载app
// import download from './components/index';
// 微信分享，引入sdk
import wx from "weixin-js-sdk";
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
    this.getLoginData();
  },
  methods: {
    getLoginData() {
      // this.$router.push({name:"couponreceive"});
      sessionStorage.setItem("gotoLogin", "no");
      // 微信
      sessionStorage.setItem("isWxLogin", "no");
      // ios
      sessionStorage.setItem("isIosLogin", "no");
      // android
      sessionStorage.setItem("isAndroidLogin", "no");
      // console.log(111,Number(localStorage.getItem("get_count")))

      var u = navigator.userAgent,
        app = navigator.appVersion;
      var _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var _wx =
        window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
        "micromessenger";

      console.log(u, app, _ios, _android);
      if (_ios) {
        // ios
        sessionStorage.setItem("isIosLogin", "yes");
      } else if (_android) {
        // android
        sessionStorage.setItem("isAndroidLogin", "yes");
      } else if (_wx) {
        // 微信
        // 未授权时微信端访问授权页面
        sessionStorage.setItem("isWxLogin", "yes");
        if (
          localStorage.getItem("openid") == "undefined" ||
          localStorage.getItem("openid") == undefined ||
          localStorage.getItem("openid") == "null" ||
          localStorage.getItem("openid") == null ||
          localStorage.getItem("nickname") == "null" ||
          localStorage.getItem("nickname") == null ||
          localStorage.getItem("unionid") == "null" ||
          localStorage.getItem("unionid") == null ||
          localStorage.getItem("headimg") == "null" ||
          localStorage.getItem("headimg") == null
          //  ||
          // this.$route.name == "pay" ||
          // this.$route.name == "payaccount" ||
          // this.$route.name == "account"
        ) {
          // 微信登录 code
          this.$getWxCode();
          // 微信授权

          if (this.wxCodeStr == "") {
            var this_count = Number(localStorage.getItem("get_count"));
            if (this_count < 2) {
              this_count++;
              localStorage.setItem("get_count", this_count);
              this.$wxLogin();
            } else {
              localStorage.setItem("get_count", 0);
            }
          }
          if (this.wxCodeStr.length > 6) {
            let url =
              window.location.protocol +
              "//" +
              window.location.hostname +
              "/callback/weixin/Userinfo?code=" +
              this.wxCodeStr;
            // 获取 openid，nickname
            var self = this;
            axios
              .get(url)
              .then(function(response) {
                console.log(666, response);
                if (
                  response.data.hasOwnProperty("code") &&
                  response.data.code == "1000"
                ) {
                  console.log(response.data.msg);
                } else {
                  localStorage.setItem("openid", response.data.openid);
                  localStorage.setItem("nickname", response.data.nickname);
                  localStorage.setItem("unionid", response.data.unionid);
                  localStorage.setItem("headimg", response.data.headimgurl);
                  self.wxCodeStr = "";
                  window.location.href =
                    window.location.protocol +
                    "//" +
                    window.location.hostname +
                    "/#" +
                    window.location.href.split("#")[1];
                }
              })
              .catch(function(error) {
                self.fetchError = error;
                console.log("error:", error);
              });
          } else {
            this.$toast("未获取到code");
          }
        }
        console.log(
          "openid:",
          localStorage.getItem("openid"),
          "unionid:",
          localStorage.getItem("unionid"),
          "nickname:",
          localStorage.getItem("nickname")
        );
      }
    }
  }
};
</script>
