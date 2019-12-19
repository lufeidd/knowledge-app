<template>
  <div id="remainPage">
    <div class="content">
      <span>¥</span>
      <span class="money">{{money}}</span>
      <p class="currentRemain">当前余额</p>
      <van-row type="flex" justify="center" class="detail">
        <van-col span="7">
          <router-link to="/personal/remain/detail">账单明细</router-link>
        </van-col>
        <van-col span="7">|</van-col>
        <van-col span="7">
          <router-link to="/personal/remain/record">充值记录</router-link>
        </van-col>
      </van-row>
      <router-view></router-view>
    </div>
    <div class="recharge">
      <van-button slot="button" size="large" round type="danger" @click="recharge()">充值</van-button>
    </div>
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand" :isShow="true"></EazyNav>
    <CopyRight></CopyRight>
  </div>
</template>

<style scoped src="@/style/scss/pages/personal/remain/index.scss" lang="scss"></style>

<script>
import { USER_REMAIN_INFO } from "../../../apis/user.js";
// import easyNav from "./../../../components/easyNav";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      money: "",
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   // searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "order"
      // }
    };
  },
  mounted() {
    this.getRemainData();
  },
  methods: {
    recharge() {
      this.$router.push("/personal/remain/account");
    },
    //获取页面数据
    async getRemainData() {
      var data = {
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.money = res.response_data.balance;
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

