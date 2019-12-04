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
          <p class="code">GH86 J23S</p>
          <p class="validity">有效期：2019.11.11 —— 2019.12.13</p>
        </div>
      </div>
      <div class="button_wrapper">
        <van-button type="primary" color="#F05654" @click="copyCode">复制兑换码</van-button>
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
      <p class="outdated_remind"><span>3</span>秒后回到火把号首页</p>
    </van-popup>
  </div>
</template>

<script>
  import CopyRight from '@/components/copyRight';
  export default {
    name: "code-index",
    data() {
      return {
        isOutdated: false
      };
    },
    methods: {
      copyCode() {
        this.$toast('已复制到剪贴板');
      },
      toRedeem() {
        // 活动是否结束
        if (false) {
          this.isOutdated = true;
        } else {

          // this.$router.push('./codeInput');
        }
      }
    },
    components: {
      CopyRight
    }
  }
</script>

<style src="@/style/scss/pages/redeem/codeIndex.scss" lang="scss">
</style>
