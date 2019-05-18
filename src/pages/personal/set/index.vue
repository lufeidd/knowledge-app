<template>
  <div id="setindexPage">

    <router-link to="/personal/set/info" class="listBox">
      <div class="left">
        <div class="ratioBox">
          <div class="box">
            <img :src="infoData.user_header">
          </div>
        </div>
      </div>
      <div class="center">
        <div class="title">{{ infoData.user_name }}</div>
      </div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </div>
    </router-link>

    <van-cell title="账号和安全" is-link to="/personal/set/safe"/>
    <van-cell title="我的收货地址" is-link to="/personal/set/list" style="margin-top: 5px;"/>
    <!-- <van-cell title="推送设置" is-link to="/personal/set/send"/> -->
    <!-- <van-cell title="关于" is-link to="/personal/set/about"/> -->

    <div style="margin-top: 5px;">
      <van-button size="large" @click="logoutAction">退出登录</van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
html {
    background-color: $greyLight;
}

#setindexPage {

  & .listBox {
    padding: 10px 15px;
    background-color: $white;
    border-bottom: 1px $greyLight solid;
    @include displayFlex (flex, flex-start, center);

    & .left {
      margin-right: 10px;
      @include flexBasis(28px);

      & .ratioBox {
        @include ratioBox (100%, 100%, 1px #e7e7e7 solid, contain, null, null);
        border-radius: 28px;
        overflow: hidden;
        position: relative;

        & .box {
          @include position (absolute, 'tl', 0, 0, 100%, 100%, null);
          @include displayFlex (flex, center, center);

          & img {
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }

    & .center {
      line-height: 1.8;
      flex-grow: 1;
      @include textOverflow;

      & .title {
        @include font(null, $fontSize + 1, #333);
        @include textOverflow;
      }
    }

    & .right {
      flex-shrink: 0;

      & .icon {
        width: 14px;
        height: 14px;
        color: #999;
      }
    }
  }

  & .listBox.active {
    margin-top: 5px;
  }
}

</style>

<script>
//  引入接口
import { USER_HOMEPAGE } from "../../../apis/user.js";
import { LOGOUT } from "../../../apis/passport.js";

export default {
  data() {
    return {
      // 信息
      infoData: {},
    };
  },
  mounted() {
    this.homeData();
  },
  methods: {
    async homeData() {
      let data = {
        version: "1.0"
      };
      let res = await USER_HOMEPAGE(data);
      console.log("123", res.response_data);
      if (res.hasOwnProperty("response_code")) {
        this.$set(this.infoData, "user_header", res.response_data.user_header);
        this.$set(this.infoData, "user_name", res.response_data.user_name);
        this.$set(this.infoData, "is_login", res.response_data.is_login);
        
        if (this.infoData.is_login == 1) {
          $(".ratioBox").css(
            "background-image",
            "url(" + res.response_data.user_header + ")"
          );
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 退出登录
    logoutAction () {
      this.logoutData();
    },
    async logoutData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
      };
      data.sign = this.$getSign(data);
      let res = await LOGOUT(data);
      console.log("123", res.response_data);
      if (res.hasOwnProperty("response_code")) {
        this.$router.push('/login/index');
      } else {
        this.$toast(res.error_message);
      }
    },
  }
};
</script>
