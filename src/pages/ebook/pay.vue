<template>
  <div id="ebookpayPage">
    <van-popup v-model="buyShow" position="bottom">
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
              ￥{{price}}
            </div>
          </div>
        </div>
        <!-- 优惠券 -->
        <div class="coupon" v-if="Object.keys(ticketList).length>0 && ticketList.canuse.length > 0">
          <span class="text">优惠券</span>
          <div class="chooseCoupon" v-if="isgroup">
            <span class="chooseText">拼团商品不可用券</span>
          </div>
          <div class="chooseCoupon" v-else @click.stop="showChoose">
            <span class="chooseText">不使用优惠券</span>
            <span class="arrow" v-if="choose">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fold-line" />
              </svg>
            </span>
            <span class="arrow" v-else>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-unfold-line" />
              </svg>
            </span>
            <ul>
              <li
                @click.stop="ticket(item,index)"
                v-for="(item,index) in ticketList.canuse"
                :key="index"
              >店铺券￥{{item.money}}</li>
            </ul>
          </div>
        </div>
        <p class="remain">
          当前余额￥{{wallet.balance}}
          <span v-if="wallet.balance<price">
            ，还需充值
            <span>￥{{(Math.abs(wallet.balance-price)).toFixed(2)}}</span>
          </span>
        </p>
        <div>
          <van-button
            round
            type="danger"
            style="width:100%;font-size:18px;"
            @click="rechargeBuy"
            v-if="wallet.balance<price"
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
      margin-top: 100px;
      font-size: $fontSize - 1;
    }
    .coupon {
      @include displayFlex(flex, space-between, center);
      margin-top: 10px;
      .text {
        font-size: $fontSize + 1;
      }
      .chooseCoupon {
        width: 70%;
        position: relative;
        padding: 6px 15px;
        background-color: #eee;
        color: $cl6;
        font-size: $fontSize - 1;
        .arrow {
          position: absolute;
          right: 10px;
        }
        ul {
          position: absolute;
          height: 96px;
          width: 100%;
          bottom: -96px;
          left: 0;
          box-sizing: border-box;
          // border: 1px solid #d2d2d2;
          border-top: 0;
          overflow-y: auto;
          display: none;
          li {
            padding: 6px 15px;
            border: 1px solid #d2d2d2;
            border-width: 0 1px 1px 1px;
            color: $cl9;
          }
        }
      }
    }
  }
}
</style>

<script>
//  引入接口
import { USER_REMAIN_INFO } from "../../apis/user.js";
export default {
  name: "pay",
  props: ["goods_id", "info", "isSuccessPay"],
  data() {
    return {
      buyShow: false,
      wallet: {},
      choose: true,
      ticketList: [],
      price: null,
      order_ticket_id: ""
    };
  },
  mounted() {
    this.getRemainData();
    if (this.isSuccessPay == "false") {
      this.buyShow = true;
    }
    $("body").on("click", function() {
      this.choose = true;
      // console.log('test',this.choose);
      $(".chooseCoupon ul").css("display", "none");
    });
    // this.price = this.info.price;
    // console.log(333333456,this.info.price,this.price)
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
        this.wallet = res.response_data;
        if (this.isSuccessPay == "false") {
          this.buyShow = true;
        }
        // console.log(res);
      } else {
        // this.$toast(res.error_message);
      }
    },
    paymoney() {
      this.buyShow = false;
      this.$emit("payMoney");
    },
    rechargeBuy() {
      this.$emit("rechargeBuy");
    },
    showChoose() {
      if (this.choose == true) {
        this.choose = false;
        $(".chooseCoupon ul").css("display", "block");
      } else {
        this.choose = true;
        $(".chooseCoupon ul").css("display", "none");
      }
    },
    ticket(item, index) {
      this.choose = true;
      // console.log(item);return
      $(".chooseCoupon ul").css("display", "none");
      $(".chooseText").text("店铺券" + "￥" + item.money);
      this.price = this.info.price - item.money;
      this.order_ticket_id = item.id;
      this.$emit("chooseCouponChangePrice", this.price);
    }
  }
};
</script>
