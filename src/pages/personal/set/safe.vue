<template>
  <div id="safePage">
    <van-cell title="账号绑定" is-link to="/personal/set/bind"/>
    <van-cell title="修改密码" is-link to="/personal/set/password"/>
    <!-- <van-cell title="注销账户" is-link to="/personal/set/cancel"/> -->
  </div>
</template>

<style lang="scss">
#safePage {
  background-color: $greyLight;
  min-height: 100%;
}
</style>


<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

