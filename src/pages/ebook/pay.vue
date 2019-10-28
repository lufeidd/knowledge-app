<template>
  <div id="ebookpayPage">
    <van-popup v-model="buyShow" position="bottom" >
      <div class="buy">
        <div class="head">
          <span class="title">整书购买</span>
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </div>
        <div class="info">
          <div class="ratiobox">
            <div class="bookImg" :style="{'background-image':'url('+info.pic+')'}"></div>
          </div>
          <div class="right">
            <div class="title">{{info.goods_title}}</div>
            <div class="price">
              <span class="all">共计</span>
              ￥{{info.price}}
            </div>
          </div>
        </div>
        <p class="remain">
          当前余额￥{{wallet.balance}}
          <span v-if="wallet.balance<info.price">
            ，还需充值
            <span>￥{{(Math.abs(wallet.balance-info.price)).toFixed(2)}}</span>
          </span>
        </p>
        <div>
          <van-button
            round
            type="danger"
            style="width:100%;font-size:18px;"
            @click="rechargeBuy"
            v-if="wallet.balance<info.price"
          >充值并购买</van-button>
          <van-button
            round
            type="danger"
            style="width:100%;font-size:18px;"
            @click="paymoney"
            v-else
          >购买</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss">
#ebookpayPage {
  .buy {
    padding: 15px;
    .head {
      @include displayFlex(flex, space-between, center);
      font-size: $fontSize + 1;
      .title {
        color: $cl9;
      }
    }
    .info {
      @include displayFlex(flex, null, null);
      margin-top: 10px;
      .ratiobox {
        min-width: 75px;
        .bookImg {
          box-sizing: border-box;
          display: block;
          @include ratioBox(
            100%,
            133.33%,
            1px solid $greyLight,
            contain,
            $white,
            null
          );
          border-radius: 3px;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        }
      }
      .right {
        flex-grow: 1;
        width: 76%;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        align-content: space-between;
        justify-content: space-between;
        padding: 10px 0;
        .title {
          font-size: $fontSize + 2;
          @include textOverflow;
        }
        .price {
          color: $redDark;
          .all {
            color: $cl9;
          }
        }
      }
    }
    .remain {
      text-align: center;
      color: $cl9;
      margin-top: 50px;
      font-size: $fontSize - 1;
    }
  }

}
</style>

<script>
//  引入接口
import { USER_REMAIN_INFO } from "../../apis/user.js";
export default {
  name: "pay",
  props: ["goods_id", "info","isSuccessPay"],
  data() {
    return {
      buyShow: false,
      wallet: {},
    };
  },
  mounted() {
    this.getRemainData();
    if(this.isSuccessPay == 'false'){
      this.buyShow = true;
    }
  },
  methods: {
    closePopup() {
      this.buyShow = false;
    },
    //获取余额充值信息
    async getRemainData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);
        this.wallet = res.response_data;
        if(this.isSuccessPay == 'false'){
      this.buyShow = true;
    }
        // console.log(res);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          localStorage.setItem("loginState", 100);
        }
        // this.$toast(res.error_message);
      }
    },
    paymoney() {
      this.buyShow = false;
      this.$emit("payMoney");
    },
    rechargeBuy(){
      this.$emit("rechargeBuy");
    }
  }
};
</script>
