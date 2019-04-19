<template>
  <div id="sendPage">
    <van-cell title="接受新消息通知" is-link to="/" style="margin-top: 5px;" value="已关闭"/>
    <div class="tip">如果您要关闭或开启得到新的消息通知，请在设置中的“通知”功能中找到应用设置</div>
    <div class="title">运营类消息</div>
    <van-cell-group>
      <van-switch-cell v-model="checked" title="推送消息"/>
    </van-cell-group>
    <div class="msg">开启中将收到精选的内容及活动通知</div>
  </div>
</template>

<style lang="sass">
html {
    background-color: $greyLight;
}
#sendPage {
    & .tip {
        font-size: $fontSize - 2;
        color: #999;
        padding: 5px 15px;
        background-color: $white;
    }
    & .title {
        font-size: $fontSize - 1;
        color: #666;
        padding: 5px 15px;
        margin-top: 5px;
    }
    & .msg {
        font-size: $fontSize - 2;
        color: #333;
        padding: 10px 15px;
        background-color: $white;
    }
}
</style>

<script>
export default {
  data() {
    return {
      checked: true
    };
  }
};
</script>
