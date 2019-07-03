<template>
  <div id="payaccountPage">
    <!-- 商品信息 -->
    <div class="listBox">
      <div class="left" style="margin-right: 10px;">
        <div style="display: flex;justify-content: center;align-items: center;">
          <!-- <router-link to="/detail" class="box"> -->
          <img :src="goodsInfo.pic[0]">
          <!-- </router-link> -->
        </div>
      </div>
      <div class="center">
        <div class="title">
          <router-link to="/detail" class="text">{{ goodsInfo.title }}</router-link>
        </div>
        <!-- <div class="subTitle">{{ goodsInfo.sub_title }}</div> -->
        <div class="info">
          <span class="history">¥{{ goodsInfo.price }}</span>
        </div>
      </div>
    </div>

    <!-- 选择支付方式 -->
    <van-row class="editBox">
      <van-col span="24">
        <span class="title">选择支付方式：</span>
      </van-col>
    </van-row>

    <div v-for="(item, key) in payBank" :key="key">
      <div
        class="listBox"
        :class="{disable: user_balance < goodsInfo.price && item.bank_type == 'balance' || item.state == 0}"
        style="padding: 8px 15px;"
        v-if="item.bank_type == 'balance' || (isWxLogin && item.bank_type == 'wxpay')"
      >
        <div class="list" style="display:flex;flex-grow: 1;" @click="payType(key, item)">
          <div class="check">
            <svg class="icon active" aria-hidden="true" v-if="activeIndex == key">
              <use xlink:href="#icon-checked-right"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-uncheck-line"></use>
            </svg>
          </div>
          <!-- 余额支付 -->
          <div
            class="wallet"
            v-if="item.bank_type == 'balance' && item.platform.indexOf('WX') > -1"
          >
            <div class="text">
              <svg class="icon active" aria-hidden="true">
                <use xlink:href="#icon-wallet-block"></use>
              </svg>
            </div>
          </div>
          <!-- 微信支付 -->
          <div class="weixin" v-if="item.bank_type == 'wxpay' && item.platform.indexOf('WX') > -1">
            <div class="text">
              <svg class="icon active" aria-hidden="true">
                <use xlink:href="#icon-weixin-block"></use>
              </svg>
            </div>
          </div>
          <!-- 支付宝支付 -->

          <div class="center">
            <div class="title" style="height: auto;">
              {{ item.bank_name }}
              <template v-if="item.bank_type == 'balance'">{{ user_balance }}</template>
            </div>
          </div>
        </div>

        <div class="left two" v-if="item.bank_type == 'balance' && user_balance < goodsInfo.price">
          <router-link to="../personal/remain/account">
            <van-button round type="danger">充值</van-button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- tip -->
    <div class="tip" v-if="descInfo">
      <div v-for="(item, key) in descInfo" :key="key">{{ item.content }}</div>
      <br>
    </div>

    <!-- 支付 -->
    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <!-- <van-button
        size="large"
        type="danger"
        disabled
        v-if="activeIndex != 1 && user_balance < goodsInfo.price"
      >支付</van-button>
      <van-button size="large" type="danger" @click="payAction" v-else>支付</van-button>-->

      <van-button size="large" type="danger" @click="payAction">支付</van-button>
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
            <van-col span="12" style="text-align:left;">手机号:{{ pay_mobilephone }}</van-col>
            <van-col span="12" style="text-align: right;">
              <template v-if="codeData.disabled">
                <van-button size="small" round disabled type="danger">{{ codeData.timeMsg }}</van-button>
              </template>
              <template v-else>
                <van-button size="small" round type="danger" @click="getCode">{{ codeData.timeMsg }}</van-button>
              </template>
            </van-col>
          </van-row>
        </div>
        <!-- 密码输入框 -->
        <van-password-input :value="value" :mask="false" @focus="keyboardShow"/>
      </div>
    </van-dialog>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" scoped lang="scss"></style>

<style lang="scss">
@import url("./../../style/scss/components/button.scss");
#payaccountPage {
  .van-button {
    // border-radius: 50px;
  }

  .van-dialog__confirm,
  .van-dialog__confirm:active,
  .van-button::before {
    display: none;
  }
}
</style>


<script>
//  引入接口
import {
  ORDER_VIRTUAL_ADD,
  ORDER_VIRTUAL_ADD_SENDCODE,
  ORDER_VIRTUAL_ADD_PAY,
  ORDER_VIRTUAL_ADDINFO
} from "../../apis/shopping.js";
import { CASHIER_PAY_ADD } from "../../apis/public.js";

export default {
  data() {
    return {
      // 商品id
      goods_id: null,
      // 当前账号余额
      user_balance: null,
      // 当前支付方式
      activeIndex: 0,
      goodsInfo: {
        title: "",
        pic: [],
        goods_type: null,
        price: null
      },
      // 支付方式
      payBank: [],
      // tip
      descInfo: [],
      // 验证码
      codeData: {
        disabled: false,
        timeMsg: "获取验证码",
        time: 120
      },
      showDialog: false,
      // 密码输入框
      value: "",
      showKeyboard: false,
      mobile: "",
      code: "",
      pay_mobilephone: "",
      pay_money: "",
      // 订单号
      order_id: "",
      pay_id: ""
    };
  },
  mounted() {
    // 上个页面携带必要信息
    this.goods_id = this.$route.query.goods_id;
    // 获取下单信息
    this.infoData();
  },
  methods: {
    // 获取下单信息
    async infoData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timeStamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADDINFO(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);

        this.goodsInfo = res.response_data.goods_info;
        this.payBank = res.response_data.pay_bank;
        this.descInfo = res.response_data.desc;
        this.user_balance = res.response_data.user_balance;

        this.activeIndex = this.user_balance >= this.goodsInfo.price ? 0 : 1;

        // console.log(res);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
        }
        this.$toast(res.error_message);
      }
    },
    // 选择支付方式
    payType(key, item) {
      if (
        item.bank_type == "balance" &&
        this.user_balance < this.goodsInfo.price
      ) {
        this.$toast("余额不足以支付~");
        return;
      }
      if (item.state == 0) {
        this.$toast("暂不支持~");
        return;
      }
      if (item.wxpay == "wxpay") {
      }
      this.activeIndex = key;
    },
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
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length == 6) {
        this.payData(this.value);
      }
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    // 支付
    payAction() {
      // 余额支付
      if (this.activeIndex == 0) {
        this.value = "";
        this.showDialog = true;
        // 重置倒计时
        clearInterval(this.clock);
        this.clock = null;
        this.codeData.disabled = false;
        this.codeData.timeMsg = "获取验证码";
      }
      // 微信支付
      if (this.activeIndex == 1) {
      }
      this.addOrderData(this.activeIndex);
    },
    // 交易支付请求发起
    async cashierPayData(_payId) {
      var tStamp = this.$getTimeStamp();
      let data = {
        pay_id: _payId,
        openid: localStorage.getItem("openid"),
        type: "WXJS",
        timeStamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CASHIER_PAY_ADD(data);

      console.log(999, res.response_data);

      if (res.hasOwnProperty("response_code")) {
        // var _package = "prepay_id=" + res.response_data.pay_arr.prepayid;
        console.log(
          888,
          res.response_data.pay_arr.timeStamp,
          res.response_data.pay_arr.nonceStr,
          res.response_data.pay_arr.sign
        );
        this.$onBridgeReady(
          res.response_data.pay_arr.timeStamp,
          res.response_data.pay_arr.nonceStr,
          res.response_data.pay_arr.package,
          res.response_data.pay_arr.sign,
          this.order_id,
          this.pay_money
        );
      } else {
        this.$toast(res.error_message);
      }
    },
    // 新增虚拟订单
    async addOrderData(_index) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timeStamp: tStamp,
        goods_id: this.goodsInfo.goods_id,
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
        if (_index == 1) this.cashierPayData(this.pay_id);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 输完验证码获取支付接口
    async payData(__code) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timeStamp: tStamp,
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

        this.$router.replace({
          name: "paysuccess",
          query: {
            order_id: res.response_data.order_id,
            pay_money: res.response_data.pay_money
          }
        });
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

