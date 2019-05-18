<template>
  <div id="payaccountPage">
    <!-- 商品信息 -->
    <div class="listBox">
      <div class="left">
        <div class="ratioBox">
          <router-link to="/detail" class="box">
            <img :src="baseData.pic[0]">
          </router-link>
        </div>
      </div>
      <div class="center">
        <div class="title">
          <router-link to="/detail" class="text">{{ baseData.title }}</router-link>
        </div>
        <!-- <div class="subTitle">{{ baseData.sub_title }}</div> -->
        <div class="info">
          <span class="history">¥{{ baseData.price }}</span>
        </div>
      </div>
    </div>

    <!-- 选择支付方式 -->
    <van-row class="editBox">
      <van-col span="24">
        <span class="title">选择支付方式：</span>
      </van-col>
    </van-row>

    <!-- 余额支付 -->
    <div class="listBox yue" :class="{disable: remainList.balance < baseData.price}" style="padding: 8px 15px;">
      <div class="check" @click="payType(0)">
        <svg class="icon" aria-hidden="true" v-if="activeIndex == 1">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true" v-else>
          <use xlink:href="#icon-checked-right"></use>
        </svg>
      </div>
      <div class="wallet" @click="payType(0)">
        <div class="text">
          <svg class="icon active" aria-hidden="true">
            <use xlink:href="#icon-wallet-block"></use>
          </svg>
        </div>
      </div>

      <div class="center" @click="payType(0)">
        <div class="title" style="height: auto;">余额 {{ remainList.balance }}</div>
      </div>
      <div class="left two" v-if="remainList.balance < baseData.price">
        <router-link to="../personal/remain/index">
          <van-button round type="danger">充值</van-button>
        </router-link>
      </div>
    </div>
    <!-- 微信支付 -->
    <div class="listBox weixin disable" @click="payType(1)" style="padding: 8px 15px;">
      <div class="check">
        <svg class="icon" aria-hidden="true" v-if="activeIndex == 0">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true" v-else>
          <use xlink:href="#icon-checked-right"></use>
        </svg>
      </div>
      <div class="weixin">
        <div class="text">
          <svg class="icon active" aria-hidden="true">
            <use xlink:href="#icon-weixin-block"></use>
          </svg>
        </div>
      </div>
      <div class="center">
        <div class="title" style="height: auto;">微信支付
        </div>
      </div>
    </div>

    <div class="tip">
      <div>1.您奖购买的内容为虚拟内容服务，购买之后不退订转让退换请斟酌后购买</div>
      <br>
      <div>2.购买后再我的购买中使用和查看。</div>
    </div>

    <!-- 支付 -->
    <div class="bottomBox" :class="{ iphx: this.isIphx }">
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
          ¥<span class="money">{{ pay_money }}</span>
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

<style src="@/style/scss/pages/pay.scss" lang="scss"></style>

<script>
//  引入接口
import { ALBUM } from "../../apis/album.js";
import { USER_REMAIN_INFO } from "../../apis/user.js";
import { ORDER_VIRTUAL_ADD, ORDER_VIRTUAL_ADD_SENDCODE, ORDER_VIRTUAL_ADD_PAY } from "../../apis/shopping.js";

export default {
  data() {
    return {
      // 当前账号余额
      remainList: {
        balance: null
      },
      // 当前支付方式
      activeIndex: 1,
      // 基础信息
      baseData: {
        title: "",
        sub_title: "",
        pic: [],
        goods_type: null,
        collection_num: 0,
        collect_id: null,
        price: null,
      },
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
      mobile: '',
      code: '',
      pay_mobilephone: '',
      pay_money: '',
      // 订单号
      order_id: '',
    };
  },
  mounted() {
    // 上个页面携带必要信息
    this.baseData.goods_id = this.$route.params.goods_id;
    // 商品接口信息
    this.albumData();
    // 余额接口信息
    this.remainData();
  },
  methods: {
    // 选择支付方式
    payType (key) {
      if(key == 0 && this.remainList.balance < this.baseData.price) {
        this.$toast('余额不足以支付~');
        return
      }
      if(key == 1) {
        return
      }
      this.activeIndex = key;
    },
    // 余额
    async remainData () {
      // var tStamp = this.$getTimeStamp();
      let data = {
        // timeStamp: tStamp,
        version: "1.0"
      };
      let res = await USER_REMAIN_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.$set(this.remainList, 'balance', res.response_data.balance);
        if(this.remainList.balance > this.baseData.price) {
          this.activeIndex = 0;
        } else {
          this.activeIndex = 1;
        }

      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取商品接口信息
    async albumData() {
      // var tStamp = this.$getTimeStamp();
      let data = {
        // timeStamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      let res = await ALBUM(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res)
        //专辑基础信息
        this.baseData = res.response_data.base;
        if(this.baseData.price == null ){
          // 余额接口信息
          this.remainData();
        }
        
        // 所属媒体信息
        this.brandInfoData = res.response_data.brand_info;
      } else {
        this.$toast(res.error_message);
      }

      // console.log("专辑基础信息:", res.response_data.base);
    },
    // 订单余额支付手机验证码发送
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    async sms() {
      let data = {
        order_id: this.order_id,
        version: "1.0"
      };
      let res = await ORDER_VIRTUAL_ADD_SENDCODE(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(123, res)
      } else {
        this.$toast(res.error_message);
      }
    },
    keyboardShow() {
      this.showKeyboard = true;
      $(".van-number-keyboard").css("z-index", 10000);
    },
    // 支付
    payAction() {
      // 余额支付
      if(this.activeIndex == 0) {
        this.addOrderData();
        this.value = '';
        this.showDialog = true;
        // 重置倒计时
        clearInterval(this.clock);
        this.clock = null;
        this.codeData.disabled = false;
        this.codeData.timeMsg = '获取验证码';
      }
      // 微信支付
      // if(this.activeIndex == 1) {
      //   this.$router.push({name: 'pay', params: {goodsId: this.baseData.goods_id, money: this.baseData.price}});
      // }
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if(this.value.length == 6) {
        this.payData(this.value);
      }
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    // 新增虚拟订单
    async addOrderData () {
      // var tStamp = this.$getTimeStamp();
      let data = {
        // timeStamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      let res = await ORDER_VIRTUAL_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.pay_mobilephone = res.response_data.pay_mobilephone;
        this.pay_money = res.response_data.pay_money.toFixed(2);
        this.order_id = res.response_data.order_id;
        // console.log(res.response_data)
      } else {
        this.$toast(res.error_message);
      }

    },
    // 输完验证码获取支付接口
    async payData (__code) {
      // var tStamp = this.$getTimeStamp();
      let data = {
        // timeStamp: tStamp,
        order_id: this.order_id,
        pay_money: this.pay_money,
        code: __code,
        version: "1.0"
      };
      let res = await ORDER_VIRTUAL_ADD_PAY(data);
      if (res.hasOwnProperty("response_code") && res.response_data.success == 1) {
        this.showDialog = false;
        this.showKeyboard = false;
        clearInterval(this.clock);
        this.clock = null;
        this.codeData.disabled = false;
        this.codeData.timeMsg = '获取验证码';
        
        this.$router.push({name: 'paysuccess', params: {order_id: res.response_data.order_id, pay_money: res.response_data.pay_money}});

      } else {
        this.$toast(res.error_message);
      }
    },
  }
};
</script>

