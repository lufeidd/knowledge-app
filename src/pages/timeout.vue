<template>
  <div id="timeoutPage" @click="relink">
    <div class="nullBox">
      <img src="./../assets/null/net.png" width="100%">
      <div>网络不给力，点击屏幕重试~</div>
    </div>
    <EazyNav type="brand" :isShow="true"></EazyNav>
    
  </div>
</template>
<style>
#timeoutPage {
  min-height: 100%;
}
</style>

<script>
export default {
  methods: {
    relink() {
      this.$router.go(-1);
    }
  }
};
</script>
