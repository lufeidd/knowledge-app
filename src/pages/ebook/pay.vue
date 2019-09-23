<template>
  <div id="ebookpayPage">
    <van-popup v-model="buyShow" position="bottom" :close-on-click-overlay="false">
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
            <span>￥{{Math.abs(wallet.balance-info.price)}}</span>
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
      <!-- 数字键盘 -->
      <van-number-keyboard
        :show="showKeyboard"
        @input="onInput"
        @delete="onDelete"
        @blur="showKeyboard = false"
      />
      <van-dialog v-model="showDialog" title="请输入手机验证码" show-cancel-button cancelButtonText="放弃支付">
        <div class="codeBox">
          <div class="price">
            ¥
            <span class="money">{{ pay_money }}</span>
          </div>
          <div class="code">
            <van-row>
              <van-col span="14" style="text-align:left;">手机号:{{ pay_mobilephone }}</van-col>
              <van-col span="10" style="text-align: right;">
                <template v-if="codeData.disabled">
                  <van-button size="small" round disabled type="danger">{{ codeData.timeMsg }}</van-button>
                </template>
                <template v-else>
                  <van-button
                    size="small"
                    round
                    type="danger"
                    @click="getCode"
                  >{{ codeData.timeMsg }}</van-button>
                </template>
              </van-col>
            </van-row>
          </div>
          <!-- 密码输入框 -->
          <van-password-input :value="passvalue" :mask="false" @focus="keyboardShow" />
        </div>
      </van-dialog>
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
  .van-dialog {
    & .codeBox {
      text-align: center;
      padding: 20px;

      & .price {
        @include font("PingFangBold", $fontSize + 1, $redDark);
        line-height: 2;

        & .money {
          font-size: $fontSize + 4;
        }
      }

      & .code {
        @include font(null, $fontSize - 1, #999);
        padding: 10px 0;
        line-height: 30px;
      }
    }
    .van-dialog__confirm{
      display: none;
    }
  }
}
</style>

<script>
//  引入接口
import {
  ORDER_VIRTUAL_ADD,
  ORDER_VIRTUAL_ADD_SENDCODE,
  ORDER_VIRTUAL_ADD_PAY
} from "../../apis/shopping.js";
import { USER_REMAIN_INFO } from "../../apis/user.js";
import { CASHIER_PAY_ADD } from "../../apis/public.js";
export default {
  name: "pay",
  props: ["goods_id", "info"],
  data() {
    return {
      buyShow: false,
      wallet: {},
      showDialog: false,
      // 密码输入框
      passvalue: "",
      showKeyboard: false,
      mobile: "",
      code: "",
      pay_mobilephone: "",
      pay_money: "",
      // 订单号
      order_id: "",
      pay_id: "",
      // 验证码
      codeData: {
        disabled: false,
        timeMsg: "获取验证码",
        time: 120
      },
      // 订单号
      order_id: "",
      pay_id: ""
    };
  },
  mounted() {
    this.getRemainData();
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
    paymoney() {
      this.passvalue = "";
      this.showDialog = true;
      // 重置倒计时
      clearInterval(this.clock);
      this.clock = null;
      this.codeData.disabled = false;
      this.codeData.timeMsg = "获取验证码";
      this.addOrderData(this.activeIndex);
    },
    // 新增虚拟订单
    async addOrderData(_index) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.pay_mobilephone = res.response_data.pay_mobilephone;
        this.pay_money = res.response_data.pay_money;
        this.order_id = res.response_data.order_id;
        this.pay_id = res.response_data.pay_id;

        // 交易支付请求发起
        // this.cashierPayData(this.pay_id);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 交易支付请求发起
    // async cashierPayData(_payId) {
    //   var tStamp = this.$getTimeStamp();
    //   let data = {
    //     pay_id: _payId,
    //     openid: localStorage.getItem("openid"),
    //     type: "WXJS",
    //     timestamp: tStamp,
    //     version: "1.0"
    //   };
    //   data.sign = this.$getSign(data);
    //   let res = await CASHIER_PAY_ADD(data);

    //   console.log(999, res.response_data);

    //   if (res.hasOwnProperty("response_code")) {
    //     // var _package = "prepay_id=" + res.response_data.pay_arr.prepayid;
    //     console.log(
    //       res.response_data.pay_arr.timeStamp,
    //       res.response_data.pay_arr.nonceStr,
    //       res.response_data.pay_arr.sign
    //     );
    //     this.$onBridgeReady(
    //       res.response_data.pay_arr.timeStamp,
    //       res.response_data.pay_arr.nonceStr,
    //       res.response_data.pay_arr.package,
    //       res.response_data.pay_arr.sign,
    //       this.order_id,
    //       this.pay_money
    //     );
    //   } else {
    //     this.$toast(res.error_message);
    //   }
    // },
    // 订单余额支付手机验证码发送
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    async sms() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        order_id: this.order_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD_SENDCODE(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(123, res);
      } else {
        this.$toast(res.error_message);
      }
    },
    keyboardShow() {
      this.showKeyboard = true;
      $(".van-number-keyboard").css("z-index", 10000);
    },
    onInput(key) {
      this.passvalue = (this.passvalue + key).slice(0, 6);
      if (this.passvalue.length == 6) {
        this.payData(this.passvalue);
      }
    },
    onDelete() {
      this.passvalue = this.passvalue.slice(0, this.passvalue.length - 1);
    },
    // 输完验证码获取支付接口
    async payData(__code) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        pay_id: this.pay_id,
        type: "NORMAL",
        code: __code,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD_PAY(data);
      if (res.hasOwnProperty("response_code")) {
        this.showDialog = false;
        this.showKeyboard = false;
        clearInterval(this.clock);
        this.clock = null;
        this.codeData.disabled = false;
        this.codeData.timeMsg = "获取验证码";
        this.$emit("addshelf",add);
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    },
    rechargeBuy(){
      this.$emit("rechargeBuy");
    }
  }
};
</script>
