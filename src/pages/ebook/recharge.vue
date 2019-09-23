<template>
  <div id="ebookrechargePage">
    <van-popup v-model="rechargeShow" position="bottom" :close-on-click-overlay="false">
      <div class="recharge">
        <div class="head">
          <div class="left">
            <van-icon size="18px" name="arrow-left" @click="returngo" />
            <span class="title">余额充值</span>
          </div>
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </div>
        <div style="margin-top:10px;padding-left:3px;">
          还需充值
          <span class="price">￥{{Math.abs(wallet.balance-info.price)}}</span>
        </div>
        <div class="account">
          <ul class="choose">
            <li
              v-for="(item,index) in rechargeAmount"
              :class="activeClass == index ? 'active':''"
              @click="getActive(index)"
              :key="index"
            >{{item}}元</li>
          </ul>
          <p class="explain" style="padding: 10px 0;">充值说明:</p>
          <div>
            <div class="explain" v-html="rechargeExplain">{{rechargeExplain}}</div>
          </div>
        </div>
        <div style="margin-top:30px;">
          <van-button round type="danger" style="width:100%;font-size:18px;" @click="rechargeBuy">购买</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss">
#ebookrechargePage {
  .recharge {
    padding: 10px 15px;
    .head {
      @include displayFlex(flex, space-between, center);
      font-size: $fontSize + 1;
      .title {
        color: $cl9;
        margin-left: 5px;
      }
      .left {
        @include displayFlex(flex, null, center);
      }
    }
    .price {
      color: $redDark;
    }
    .account {
      font-size: $fontSize + 1;
      .choose {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: -10px;
        margin-bottom: 15px;
        li {
          box-sizing: border-box;
          font-size: $fontSize;
          color: $redDark;
          line-height: 40px;
          border: 1px solid #cecece;
          border-radius: 6px;
          width: 22%;
          text-align: center;
          margin-top: 25px;
        }
        .active {
          background-color: #ffeded;
          border: 1px solid $redDark;
        }
      }
      .explain {
        font-size: $fontSize - 2;
        color: $cl9;
      }
    }
  }
}
</style>

<script>
import {
  USER_WALLET_RECHARGE_INFO,
  USER_WALLET_RECHARGE_ADD
} from "../../apis/user.js";
import {CASHIER_PAY_ADD} from "../../apis/public.js";
export default {
  name: "recharge",
  props: ["info"],
  data() {
    return {
      rechargeShow: false,
      rechargeAmount: [],
      activeClass: 0,
      rechargeExplain: "",
      wallet:{},
    };
  },
  mounted() {
    this.getRemainData();
  },
  methods: {
    //获取余额充值信息
    async getRemainData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_WALLET_RECHARGE_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);

        this.rechargeAmount = res.response_data.prices;
        this.wallet = res.response_data.wallet_info;
        this.rechargeExplain = res.response_data.desc.replace(/\n/g, "<br>");
        // console.log(res);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          localStorage.setItem("loginState", 100);
        }
        this.$toast(res.error_message);
      }
    },
    closePopup() {
      this.rechargeShow = false;
    },
    // 余额充值选择
    rechargeBuy() {
      if (this.activeClass >= 0) {
        // console.log("money:", this.rechargeAmount[this.activeClass]);
        // 用户余额充值申请创建
        this.rechargeAddData(this.rechargeAmount[this.activeClass]);
      }
    },
    // 用户余额充值申请创建
    async rechargeAddData(_money) {
      var tStamp = this.$getTimeStamp();
      let data = {
        money: _money,
        type: "NORMAL",
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_WALLET_RECHARGE_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log( res.response_data);
        // 交易支付请求发起
        this.cashierPayData(res.response_data.pay_id);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 交易支付请求发起
    async cashierPayData(_payId) {
      var tStamp = this.$getTimeStamp();
      let data = {
        pay_id: _payId,
        openid: localStorage.getItem("openid"),
        type: "WXJS",
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CASHIER_PAY_ADD(data);

      console.log(999, res.response_data);

      if (res.hasOwnProperty("response_code")) {
        // var _package = "prepay_id=" + res.response_data.pay_arr.prepayid;
        console.log(
          res.response_data.pay_arr.timeStamp,
          res.response_data.pay_arr.nonceStr,
          res.response_data.pay_arr.sign
        );
        this.$onBridgeReady(
          res.response_data.pay_arr.timeStamp,
          res.response_data.pay_arr.nonceStr,
          res.response_data.pay_arr.package,
          res.response_data.pay_arr.sign,
          "",
          ""
        );
      } else {
        this.$toast(res.error_message);
      }
    },
    getActive(index) {
      this.activeClass = index;
    },
    returngo() {
      this.$emit("return");
    }
  }
};
</script>
