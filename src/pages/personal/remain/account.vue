<template>
  <div id="accountPage">
    <div class="content">
      <span>¥</span>
      <span class="money">{{money ? money : 0}}</span>

      <p class="currentRemain">当前余额</p>
    </div>
    <div class="account">
      <p>请选择充值金额</p>
      <ul class="choose">
        <li
          v-for="item,index in rechargeAmount"
          :class="activeClass == index ? 'active':''"
          @click="getActive(index)"
        >{{item}}元</li>
      </ul>
      <p class="explain">充值说明:</p>
    </div>
    <div class="recharge">
      <van-button slot="button" size="large" round type="danger" @click="account()">充值</van-button>
    </div>
    <easyNav :navData="navData"></easyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/remain/index.scss" scoped lang="scss"></style>

<script>
import { USER_REMAIN_INFO } from "../../../apis/user.js";
import easyNav from "./../../../components/easyNav";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: false,
        // searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type:'order',
      },
      money: null,
      rechargeAmount: [5, 20, 50, 100, 150, 200, 280, 320],
      activeClass: 0,
    };
  },
  mounted() {
    this.getRemainData();
  },
  methods: {
    getActive(index) {
      this.activeClass = index;
    },
    account() {
      if(this.activeClass>=0){
        console.log(this.activeClass);
      }
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
        console.log(res.response_data.balance);
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

