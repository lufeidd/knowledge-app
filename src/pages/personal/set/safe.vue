<template>
  <div id="safePage">
    <van-cell title="账号绑定" is-link to="/personal/set/bind" />
    <!--<van-cell-->
      <!--v-if="exist == 0"-->
      <!--title="设置密码"-->
      <!--is-link-->
      <!--:to="{name: 'setpassword', query: {type: 'add'}}"-->
    <!--/>-->
    <!--<van-cell-->
      <!--v-if="exist == 1"-->
      <!--title="修改密码"-->
      <!--is-link-->
      <!--:to="{name: 'setpassword', query: {type: 'edit'}}"-->
    <!--/>-->
    <van-cell
      v-if="exist == 0"
      title="设置密码"
      is-link
      :to="{name: 'authentication', query: {phone: phone, pageType: 'password'}}"
    />
    <van-cell
      v-if="exist == 1"
      title="修改密码"
      is-link
      :to="{name: 'authentication', query: {phone: phone, pageType: 'password'}}"
    />
    <!-- <van-cell title="注销账户" is-link to="/personal/set/cancel"/> -->
    <CopyRight></CopyRight>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style lang="scss">
#safePage {
  background-color: $greyLight;
  min-height: 100%;
}
</style>

<script>
import { ACCOUNTS } from "../../../apis/passport.js";
export default {
  components: {},
  data() {
    return {
      exist: '',
      phone: ''
    };
  },
  created() {},
  mounted() {
    this.accountsData();
  },
  methods: {
    // 用户账号和安全列表接口
    async accountsData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ACCOUNTS(data);

      console.log(res.response_data);

      if (res.hasOwnProperty("response_code")) {
        this.exist = res.response_data.exist;
        this.phone = res.response_data.mobile;
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

