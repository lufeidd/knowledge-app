<template>
  <div id="pageBottom">
    <p>未注册的手机号验证后将自动创建火把账号</p>
  </div>
</template>

<script>
  export default {
    name: "bottom"
  }
</script>

<style lang="scss" scoped>
  #pageBottom {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0 auto;
    width: 100%;
    p {
      margin: 0;
      height: 23px;
      text-align: center;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #999999;
      line-height: 18px;
    }
  }
</style>
