<template>
  <div id="codePage">
    <header>
      <div class="top_bg">
        <div class="inner_bg"></div>
      </div>
    </header>
    <main class="main_wrapper">
      <div class="code_wrapper">
        <div class="code_detail">
          <h4 class="code_title">您的兑换码</h4>
          <p class="code">{{redeemDetail.code}}</p>
          <p class="validity">有效期：{{redeemDetail.begin_time}} — {{redeemDetail.end_time}}</p>
        </div>
      </div>
      <div class="button_wrapper">
        <van-button type="primary" style="background:#F05654;border: 1px solid #F05654;" v-clipboard:copy="redeemDetail.code" v-clipboard:success="copyCode">复制兑换码</van-button>
        <van-button type="default" @click="toRedeem">前往兑换</van-button>
      </div>
      <p class="notes_one">
        请在兑换码有效期内完成兑换,过期自动失效;您可打开<span class="title">“火把知识App-我的-兑换码”</span>进行兑换。
      </p>
      <p class="notes_two">
        具体兑换结果以页面显示为准。
      </p>
    </main>
    <CopyRight></CopyRight>
    <van-popup class="outdated_info" v-model="isOutdated">
      <h4 class="outdated_title">活动已结束</h4>
      <div class="outdated_img"></div>
      <p class="outdated_remind"><span>{{time}}</span>秒后回到个人中心</p>
    </van-popup>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<script>
  import CopyRight from '@/components/copyRight';
  import { REDEEM_CODE_GET } from '@/apis/redeem.js';
  export default {
    name: "code-index",
    data() {
      return {
        encryptedCode: '',
        isOutdated: false,
        redeemDetail: {},
        time: 3
      };
    },
    methods: {
      copyCode() {
        this.$toast('已复制到剪贴板');
      },
      download() {
        // window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
        let u = navigator.userAgent,
          app = navigator.appVersion;
        let _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        let _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        console.log(u, app, _ios, _android);
        if (_ios) {
          window.location.href =
            "https://apps.apple.com/cn/app/%E7%81%AB%E6%8A%8A%E7%9F%A5%E8%AF%86/id1473766311";
        } else if (_android) {
          window.location.href =
            "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
        }
      },
      toRedeem() {
        this.download();
      },
      // 兑换码详情
      async codeDetail() {
        // console.log(this.encryptedCode);
        let data = {
          code: this.encryptedCode,
          version: "1.0"
        };
        let res = await REDEEM_CODE_GET(data);
        // console.log('res',res);
        if (res.hasOwnProperty("response_code")) {
          this.redeemDetail = res.response_data;
        } else if (res.error_code == 0) { // 活动结束
          this.isOutdated = true;
          const timer = setInterval(() => {
            this.time--;
            if (this.time == 0) {
              this.isOutdated = false;
              clearInterval(timer);
              this.$router.push({name: 'personalIndex'});
            }
          }, 1000);
        }
      }
    },
    mounted() {
      this.encryptedCode = this.$route.query.code;
      this.codeDetail();
    },
    components: {
      CopyRight
    }
  }
</script>

<style src="@/style/scss/pages/redeem/codeIndex.scss" lang="scss">
</style>
