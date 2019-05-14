<template>
  <div id="bindPage">
    <van-cell title="手机绑定" is-link :value="mobile" :to="{name: 'setphone', params: {phone: mobile, pageType: 'old'}}" style="margin-top:5px;"/>
    <van-cell title="微信绑定" is-link value="" @click="showAction('bind')"/>

    <van-actionsheet
      v-model="bindModel"
      :actions="bindActions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="bindModel=false"
    />
  </div>
</template>

<style lang="scss" scoped>
 html {
   background-color: $greyLight;
 }
</style>

<script>
//  引入接口
import { USER_INFO, USER_INFO_EDIT } from "../../../apis/user.js";
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
      ]
    };
  },
  mounted() {
    this.getInfoData();
  },
  methods: {
    // 获取账号接口信息
    async getInfoData() {
      let data = {
        version: "1.0"
      };
      let res = await USER_INFO(data);
      // console.log("123", res.response_data);
      if (res.hasOwnProperty("response_code")) {
        this.mobile = res.response_data.mobile;
      } else {
        this.$toast(res.error_message);
      }
    },
    showAction(type) {
      if (type) {
        switch (type) {
          // 性别
          case "bind":
            this.bindModel = true;
            break;
        }
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
