<template>
  <div id="aboutPage">
    <div class="ratioBox">
      <div class="box"></div>
    </div>
    <van-cell value="当前版本1.0"/>
    <van-cell title="联系我们" is-link to="/"/>
    <van-cell title="服务使用协议" is-link to="/" style="margin-top: 5px;"/>
  </div>
</template>

<style lang="sass">
html {
    background-color: $greyLight;
}

#aboutPage {
    & .ratioBox {
        background-color: $white;
        padding: 15px 0;
        & .box {
            @include ratioBox (60px, 60px, null, contain, $greyLight, "https://media2.v.bookuu.com/activity/10/11/20190418101130169.jpg@!q75");
            border-radius: 60px;
            margin: 0 auto;
        }
    }
}

</style>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
