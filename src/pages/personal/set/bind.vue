<template>
  <div id="bindPage">
    <van-cell
      title="手机绑定"
      is-link
      :value="mobile"
      :to="{name: 'setphone', query: {phone: mobile, pageType: 'old'}}"
    />

    <div v-if="isWxLogin">
      <van-cell title="微信绑定" :value="wxBind" is-link @click="showAction"/>
    </div>

    <van-actionsheet
      v-model="bindModel"
      :actions="bindActions"
      cancel-text="取消"
      @select="unbind"
      @cancel="bindModel=false"
    />
  </div>
</template>

<style lang="scss">
#bindPage {
  background-color: $greyLight;
  min-height: 100%;
}
</style>

<script>
//  引入接口
import { USER_INFO, USER_INFO_EDIT } from "../../../apis/user.js";
import { LOGIN_BIND_DELETE, LOGIN_BIND_LIST } from "../../../apis/passport.js";
export default {
  data() {
    return {
      mobile: "",
      // 性别
      bindModel: false,
      bindActions: [
        {
          name: "解绑"
        }
      ],
      wxBind: ""
    };
  },
  mounted() {
    this.getLoginParterner();

    // 获取第三方微信登录code
    this.$getWxCode();
    if (this.wxCodeStr.length > 6) this.$getWxLoginData();
  },
  methods: {
    showAction() {
      if (this.wxBind == "去绑定") {
        this.$wxLogin();

        return;
      }
      this.bindModel = true;
    },
    // 第三方用户登录接口
    async getLoginParterner() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await LOGIN_BIND_LIST(data);

      // 出错提示
      if (res.hasOwnProperty("response_code")) {
        // 1:未绑定；2:已绑定
        console.log("list:", res.response_data);
        if (res.response_data.wxtype == 1) {
          this.wxBind = "去绑定";
        }
        if (res.response_data.wxtype == 2) {
          this.wxBind = res.response_data.wxname;
        }
        this.mobile = res.response_data.mobile;
      } else {
        this.$toast(res.error_message);
      }
    },
    unbind(item, index) {
      // console.log("unbind:", item, index);
      var _type;
      if (index == 0) _type = 2;
      this.unbindData(_type);
    },
    async unbindData(_type) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        type: _type,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await LOGIN_BIND_DELETE(data);

      if (res.hasOwnProperty("response_code")) {
        // window.location.reload();
        this.getLoginParterner();
        this.bindModel = false;
      } else {
        this.$toast(res.error_message);
      }
    },
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.bindModel = false;
      //   this.$toast(item.name);
    }
  }
};
</script>
