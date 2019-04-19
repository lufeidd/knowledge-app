<template>
  <div id="safePage">
    <van-cell title="账号绑定" is-link to="/personal/set/bind" style="margin-top: 5px;"/>
    <van-cell title="修改密码" is-link to="/"/>
    <van-cell title="注销账户" is-link to="/personal/set/cancel"/>
  </div>
</template>

<style lang="sass">
 html {
   background-color: $greyLight;
 }
</style>


<script>
export default {
  components: {},
  data() {
    return {
    }
  },
  created() {},
  mounted() {
  },
  methods: {}
};
</script>

