<template>
  <div id="helpPage">
    <van-cell title="账号及登录"  value="" is-link arrow-direction="down" />
    <van-cell title="购买"  value="" is-link arrow-direction="down" />
    <van-cell title="退款"  value="" is-link arrow-direction="down" />
    <van-cell title="阅读"  value="" is-link arrow-direction="down" />
    <van-cell title="优惠券"  value="" is-link arrow-direction="down" />
    <van-cell title="试听"  value="" is-link arrow-direction="down" />
    <van-cell title="设置"  value="" is-link arrow-direction="down" />
    <van-cell title="如何绑定手机号"  value="" is-link arrow-direction="down" />
    <van-cell title="如何解绑"  value="" is-link arrow-direction="down" />
    <div class="bottomBox" :class="{iphx:this.iphx}">
      <van-button type="danger" size="large" replace to="/personal/help/feedback">我要反馈</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/help/index.scss" lang="scss"></style>
