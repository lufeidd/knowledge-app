<template>
  <div id="payaccountPage">
    <!-- 商品信息 -->
    <div class="listBox">
      <div class="left" style="margin-right: 10px;">
        <div style="display: flex;justify-content: center;align-items: center;">
          <!-- <router-link to="/detail" class="box"> -->
          <img :src="goodsInfo.pic[0]" />
          <!-- </router-link> -->
        </div>
      </div>
      <div class="center">
        <div class="title">
          <router-link to="/detail" class="text">{{ goodsInfo.title }}</router-link>
        </div>
        <!-- <div class="subTitle">{{ goodsInfo.sub_title }}</div> -->
        <div class="info">
          <span class="history" v-if="this.single_activity_id">促销价：¥{{ goodsInfo.price.toFixed(2) }} <del class="promotion">原价￥{{goodsInfo.sale_price}}</del></span>
          <span class="history" v-else>¥{{ goodsInfo.price.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <!-- 优惠券 -->
    <van-cell
      title
      is-link
      :value="'优惠￥'+discount_price.toFixed(2)"
      @click="showCoupon"
      style="margin:5px 0;"
      v-if="ticket_lists.canuse.length>0"
      class="couponCell"
    >
      <template slot="title">
        <span style="margin-right:10px;">优惠券</span>
        <span class="toMall" v-if="discount_price == ticket_price && ticket_price > 0">已选最大优惠</span>
        <span class="toMall" v-if="ticket_num">已选{{ticket_num}}张</span>
      </template>
    </van-cell>
    <van-cell title is-link value="拼团商品不可用券" style="margin:5px 0;" v-if="ticket_lists.canuse.length == 0 && (groupbuy_id || groupbuy_open_id)">
      <template slot="title">
        <span style="margin-right:10px;">优惠券</span>
      </template>
    </van-cell>
    <van-cell title is-link value="无可用券" style="margin:5px 0;" v-else>
      <template slot="title">
        <span style="margin-right:10px;">优惠券</span>
      </template>
    </van-cell>

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
              <use xlink:href="#icon-checked-right" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-uncheck-line" />
            </svg>
          </div>
          <!-- 余额支付 -->
          <div
            class="wallet"
            v-if="item.bank_type == 'balance' && item.platform.indexOf('WX') > -1"
          >
            <div class="text">
              <svg class="icon active" aria-hidden="true">
                <use xlink:href="#icon-wallet-block" />
              </svg>
            </div>
          </div>
          <!-- 微信支付 -->
          <div class="weixin" v-if="item.bank_type == 'wxpay' && item.platform.indexOf('WX') > -1">
            <div class="text">
              <svg class="icon active" aria-hidden="true">
                <use xlink:href="#icon-weixin-block" />
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
          <!-- <router-link to="../personal/remain/account"> -->
          <van-button round type="danger" @click="recharge">充值</van-button>
          <!-- </router-link> -->
        </div>
      </div>
    </div>

    <!-- tip -->
    <div class="tip" v-if="descInfo">
      <div v-for="(item, key) in descInfo" :key="key">{{ item.content }}</div>
      <br />
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
    <van-dialog
      v-model="showDialog"
      title="请输入手机验证码"
      show-cancel-button
      cancelButtonText="放弃支付"
      @cancel="reflesh"
    >
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
        <van-password-input :value="value" :mask="false" @focus="keyboardShow" />
      </div>
    </van-dialog>
    <!-- 领取优惠券 -->
    <van-popup v-model="couponModel" position="bottom" style="max-height:80%;min-height:80%;">
      <div class="header">
        <div class="catalogWord">优惠券</div>
        <span>
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </span>
      </div>
      <van-tabs v-model="active" title-active-color="#f05654" title-inactive-color="#999">
        <van-tab :title="useCoupon">
          <!-- <div class="checkedText"> -->
          <!-- <span>已选中优惠券{{ticket_num}}张，共优惠{{discount_price}}元</span> -->
          <!-- <span class="toMall">选择最大优惠</span> -->
          <!-- </div> -->
          <div class="content canuse">
            <div
              style="margin-top:10px;overflow:hidden;border-radius:0 6px 6px 0;box-shadow:0 0 10px rgba(0,0,0,0.06);"
              v-for="(item,index) in ticket_lists.canuse"
              :key="index"
            >
              <!-- 可选状态 -->
              <div class="toUse" @click="chooseTicket(item,index)" v-if="item.state">
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">{{item.money}}</span>
                  </div>
                  <div class="condition">{{item.use_money_desc}}</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu">店铺券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <div
                    class="time"
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
                  <span class="used" v-if="item.selected == 1">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-checked-line" />
                    </svg>
                  </span>
                  <span class="used" v-else>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-check-line" />
                    </svg>
                  </span>
                </div>
              </div>
              <!-- 不可选状态 -->
              <div class="toUse overdue" v-else @click="noChooseTicket">
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">{{item.money}}</span>
                  </div>
                  <div class="condition">{{item.use_money_desc}}</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu">店铺券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <span class="used">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-check-line" />
                    </svg>
                  </span>
                  <div
                    class="time"
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="sure" @click="sureTicket">确定</div>
        </van-tab>
        <van-tab :title="nouseCoupon">
          <div class="content">
            <div
              v-for="(item,index) in ticket_lists.nouse"
              :key="index"
            >
            <div style="margin-top:10px;overflow:hidden;border-radius:0 6px 6px 0;box-shadow:0 0 10px rgba(0,0,0,0.06);">
              <div class="toUse overdue">
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">{{item.money}}</span>
                  </div>
                  <div class="condition">{{item.use_money_desc}}</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu">店铺券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <!-- <span class="used">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-received-line" />
                    </svg>
                  </span>-->
                  <div
                    class="time"
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
                </div>
              </div>
              </div>
              <div class="whyNoUse">{{item.cart_money>0?'还差'+item.cart_money+'元可使用该券':'所结算商品中没有符合条件的商品'}}</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" scoped lang="scss"></style>

<style lang="scss">
// @import url("./../../style/scss/components/button.scss");
#payaccountPage {
  .van-button {
    border-radius: 50px;
  }

  .bottomBox {
    .van-button {
      border-radius: 0;
    }
  }

  .van-button::before {
    display: none;
  }

  .van-button--plain.van-button--danger {
    background-color: #fff;
  }

  .van-button--danger {
    background-color: #f05654;
    border-color: #f05654;
  }

  .van-button--danger.van-button--disabled {
    background-color: #d6d6d6;
    border-color: #d6d6d6;
    opacity: 1;
  }

  .van-button--small {
    min-width: 80px;
  }

  .van-button--large {
    height: 50px;
    line-height: 50px;
  }

  .van-button--default {
    color: #333;
  }

  .van-dialog__confirm,
  .van-dialog__confirm:active,
  .van-button::before {
    display: none;
  }
  .couponCell {
    .van-cell__title,
    .van-cell__value {
      @include textOverflow;
      flex: auto;
      -webkit-box-flex: 0;
    }
    .van-cell__value {
      flex-shrink: 0;
      color: $redLight !important;
    }
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
      pay_id: "",
      pay_price: 0,
      // 优惠券信息
      couponInfo: null,
      couponList: [],
      couponModel: false,
      active: 0,
      nouseCoupon: "",
      useCoupon: "",
      ticket_price: null,
      ticket_lists: null,
      ticket_num: 0,
      discount_price: 0,
      total_money: 0,
      order_ticket_ids: "",
      single_activity_id:null,
      groupbuy_id:null,
      groupbuy_open_id:null,
    };
  },
  mounted() {
    // 上个页面携带必要信息
    this.goods_id = this.$route.query.goods_id;
    this.groupbuy_id = this.$route.query.groupbuy_id;
    this.groupbuy_open_id = this.$route.query.groupbuy_open_id;
    // 获取下单信息
    this.infoData();
  },
  methods: {
    // 获取下单信息
    async infoData() {
      var tStamp = this.$getTimeStamp();
      var data = {};
      data.timestamp = tStamp;
      data.version = "1.0";
      data.goods_id = this.goods_id;
      if(this.$route.query.groupbuy_id) data.groupbuy_id = this.$route.query.groupbuy_id;
      if(this.$route.query.groupbuy_open_id) data.groupbuy_open_id = this.$route.query.groupbuy_open_id;
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADDINFO(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);

        this.goodsInfo = res.response_data.goods_info;
        this.payBank = res.response_data.pay_bank;
        this.descInfo = res.response_data.desc;
        this.user_balance = res.response_data.user_balance;

        this.activeIndex = this.user_balance >= this.goodsInfo.price ? 0 : 1;
        // 优惠券
        this.total_money = res.response_data.goods_info.price;
        this.ticket_price = res.response_data.ticket_price;
        this.discount_price = res.response_data.ticket_price;
        this.ticket_lists = res.response_data.ticket_lists;
        this.single_activity_id = res.response_data.single_activity_id;
        // this.pay_price = this.total_money - this.discount_price;
        for (var i = 0; i < this.ticket_lists.canuse.length; i++) {
          if (this.ticket_lists.canuse[i].selected == 0) {
            this.ticket_lists.canuse[i].state = 0;
          } else {
            this.ticket_num++;
            if (this.order_ticket_ids) {
              this.order_ticket_ids += "," + this.ticket_lists.canuse[i].id;
            } else {
              this.order_ticket_ids += this.ticket_lists.canuse[i].id;
            }
          }
        }
        this.nouseCoupon =
          "不可用优惠券（" + this.ticket_lists.nouse.length + "）";
        this.useCoupon =
          "可用优惠券（" + this.ticket_lists.canuse.length + "）";
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
      var data = {};
      data.timestamp = tStamp;
      data.version = "1.0";
      data.goods_id = this.goodsInfo.goods_id;
      if(this.order_ticket_ids) data.ticket_id = this.order_ticket_ids;
      if(this.groupbuy_id) data.groupbuy_id = this.groupbuy_id;
      if(this.groupbuy_open_id) data.groupbuy_open_id = this.groupbuy_open_id;
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
    },
    // 充值
    recharge() {
      // localStorage.setItem('routerLink','/personal/remain/account');
      this.$router.push({
        name: "account",
        query: { goods_id: this.goods_id, endAccountTo: "return" }
      });
    },
    // 优惠券
    showCoupon() {
      this.couponModel = true;
    },
    closePopup() {
      this.couponModel = false;
    },
    chooseTicket(item, index) {
      this.ticket_lists.canuse = this.ticket_lists.canuse.map((value, key) => {
        if (index == key) value.selected = value.selected == 1 ? 0 : 1;
        return value;
      });
      if (item.selected == 1) {
        this.judge(item, index, 0);
      } else {
        this.judge(item, index, 1);
      }
    },
    judge(item, index, _state) {
      // var _goods = item.goods_ids;
      var _goods = [];
      var _count = 0;
      // if(_state == 1){
      // _goods = [];
      for (var a = 0; a < this.ticket_lists.canuse.length; a++) {
        if (this.ticket_lists.canuse[a].selected == 1) {
          // _goods.push(this.ticket_lists.canuse[a].goods_ids.join(','))
          _goods = _goods.concat(this.ticket_lists.canuse[a].goods_ids);
          _count++;
        }
      }
      if (_count > 0) {
        this.chooseMax = false;
      } else {
        this.chooseMax = true;
      }
      // }else{
      //   this.chooseMax = false;
      // }
      // console.log(111,_goods)
      // var tempArray1 = [];
      var tempArray1 = _goods;
      var _arr = this.ticket_lists.canuse;
      // var _arr = this.ticket_lists.canuse.filter(function(x, y) {
      //   return x.selected == 0 && index !== y;
      // });
      // console.log(_arr);
      // for (var i = 0; i < _goods.length; i++) {
      //   tempArray1[_goods[i]] = true;
      // }
      // console.log('jiance1',tempArray1)
      for (var j = 0; j < _arr.length; j++) {
        if (_arr[j].selected == 0 && j !== index) {
          var check_goods = _arr[j].goods_ids;
          var tempArray2 = [];
          var _length;
          if (check_goods.length > tempArray1.length) {
            _length = check_goods.length;
          } else {
            _length = tempArray1.length;
          }
          // console.log(999,_length)
          for (var k = 0; k < _length; k++) {
            // if (tempArray1[check_goods[k]]) {
            //   tempArray2.push(check_goods[k]);
            // }
            if (check_goods.includes(tempArray1[k])) {
              tempArray2.push(check_goods[k]);
            }
          }
          // console.log('jiance2',tempArray2)

          if (tempArray2.length > 0) {
            this.ticket_lists.canuse = this.ticket_lists.canuse.map(
              (value, key) => {
                if (index !== key && j == key) value.state = 0;
                return value;
              }
            );
          } else {
            this.ticket_lists.canuse = this.ticket_lists.canuse.map(
              (value, key) => {
                if (index !== key && j == key) value.state = 1;
                return value;
              }
            );
          }
        }
      }

      this.discount_price = 0;
      this.ticket_num = 0;
      this.order_ticket_ids = "";
      for (var i = 0; i < this.ticket_lists.canuse.length; i++) {
        if (this.ticket_lists.canuse[i].selected == 1) {
          this.ticket_num++;
          this.discount_price =
            this.ticket_lists.canuse[i].money + this.discount_price;
          if (this.order_ticket_ids) {
            this.order_ticket_ids += "," + this.ticket_lists.canuse[i].id;
          } else {
            this.order_ticket_ids += this.ticket_lists.canuse[i].id;
          }
        }
      }
      // this.pay_price =
      //   this.total_money + this.dispatch_price - this.discount_price;
    },
    noChooseTicket() {
      this.$toast("请先取消已勾选优惠券再选择");
    },
    sureTicket() {
      this.discount_price = 0;
      this.ticket_num = 0;
      this.order_ticket_ids = "";
      for (var i = 0; i < this.ticket_lists.canuse.length; i++) {
        if (this.ticket_lists.canuse[i].selected == 1) {
          this.ticket_num++;
          this.discount_price =
            this.ticket_lists.canuse[i].money + this.discount_price;
          if (this.order_ticket_ids) {
            this.order_ticket_ids += "," + this.ticket_lists.canuse[i].id;
          } else {
            this.order_ticket_ids += this.ticket_lists.canuse[i].id;
          }
        }
      }
      // this.pay_price =
      //   this.total_money + this.dispatch_price - this.discount_price;
      this.couponModel = false;
      // console.log(this.order_ticket_ids);
    },
    reflesh() {
      console.log("取消了");
      location.reload();
      // this.infoData();
    }
  }
};
</script>

