<template>
  <div id="choosePage">
    <div class="content">
      <div
        class="huoba-goods-list huoba-goods-list-five"
        v-for="(item,index) in can_list"
        :key="index"
      >
        <div class="huoba-goods-list-check">
          <svg
            class="icon checked"
            aria-hidden="true"
            v-if="item.is_checked"
            @click="checkGoods(item,index)"
          >
            <use xlink:href="#icon-checked-block" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else @click="checkGoods(item,index)">
            <use xlink:href="#icon-uncheck-line" />
          </svg>
        </div>
        <div class="huoba-goods-list-left">
          <div class="ratioBox">
            <div class="box">
              <img :src="item.pic" alt />
            </div>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 1">音频</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 2">视频</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 3">图书</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 4">电子书</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 9">专辑</span>
          </div>
        </div>
        <div class="huoba-goods-list-mid">
          <span class="huoba-goods-title">
            <span>{{item.goods_name}}</span>
          </span>
          <div>
            <span class="huoba-goods-price">￥{{item.real_price}}</span>
            <span class="huoba-goods-num">x{{item.buy_count}}</span>
          </div>
        </div>
        <div class="huoba-goods-list-right">
          <span></span>
          <!-- <span class="huoba-goods-opera">已退款</span> -->
        </div>
      </div>
    </div>
    <!-- 不可选 -->
    <div class="content" v-if="no_list.length > 0">
      <div
        class="huoba-goods-list huoba-goods-list-five uncheck"
        v-for="(item,index) in no_list"
        :key="index"
      >
        <div class="huoba-goods-list-check">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-uncheck-line" />
          </svg>
        </div>
        <div class="huoba-goods-list-left">
          <div class="ratioBox">
            <div class="box">
              <img :src="item.pic" alt />
            </div>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 1">音频</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 2">视频</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 3">图书</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 4">电子书</span>
            <span class="huoba-goods-list-label" v-if="item.goods_type == 9">专辑</span>
          </div>
        </div>
        <div class="huoba-goods-list-mid">
          <span class="huoba-goods-title">
            <span>{{item.goods_name}}</span>
          </span>
          <div>
            <span class="huoba-goods-price">￥{{item.real_price.toFixed(2)}}</span>
            <span class="huoba-goods-num">x{{item.buy_count}}</span>
          </div>
        </div>
        <div class="huoba-goods-list-right">
          <span></span>
          <span class="huoba-goods-opera">{{item.desc}}</span>
        </div>
      </div>
    </div>
    <div style="height:50px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <!-- 底部 -->
    <div class="submitBox" :class="{iphx:this.isIphx}">
      <div class="left">
        <div>
          <svg class="icon checked" aria-hidden="true" v-if="is_checked" @click="checkAll">
            <use xlink:href="#icon-checked-block" />
          </svg>
          <svg class="icon" aria-hidden="true" v-else @click="checkAll">
            <use xlink:href="#icon-uncheck-line" />
          </svg>
          <span @click="checkAll">全选</span>
        </div>
        <div class="total">
          已选&nbsp<span class="num">{{choose_num}}</span>&nbsp件
        </div>
      </div>
      <div class="right" @click="onSubmit">提交</div>
    </div>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>
<style lang="scss">
#choosePage {
  background-color: $greyLight;
  min-height: 100%;
  & .content {
    margin-bottom: 10px;
  }
  & .submitBox {
    @include position(fixed, "bl", 0, auto, 100%, 49px, null);
    max-width: 640px;
    @include displayFlex(flex, space-between, center);
    background-color: #fff;
    font-size: $fontSize + 1;
    & .left {
      padding: 0 15px;
      @include displayFlex(flex, space-between, center);
      flex-grow: 1;
      & .total {
        & .num {
          color: $redDark;
        }
      }
      & .icon {
        color: $cl9;
        font-size: $fontSize + 8;
        margin-right: 13px;
        top: 0;
      }
      & .icon.checked {
        color: $redDark;
      }
    }
    & .right {
      width: 105px;
      background-color: $redDark;
      line-height: 49px;
      @include font(null, $fontSize + 2, #fff);
      text-align: center;
    }
  }
}
</style>
<script>
import { ORDER_REFUND_GOODS_GETS } from "../../../../apis/shopping.js";
export default {
  data() {
    return {
      choose_num: 0,
      is_checked: 0,
      order_id: null,
      can_list: [],
      no_list: [],
      detail_id: null
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    this.getData();
  },
  methods: {
    // 勾选
    checkGoods(item, index) {
      this.can_list = this.can_list.map((value, key) => {
        if (key == index) {
          value.is_checked
            ? (value.is_checked = false)
            : (value.is_checked = true);
        }
        return value;
      });
      this.getCount();
    },
    // 计数
    getCount() {
      var _count = 0,
        detail_ids = "";
      for (var i = 0; i < this.can_list.length; i++) {
        if (this.can_list[i].is_checked) {
          _count++;
          if (detail_ids) {
            detail_ids += "," + this.can_list[i].detail_id;
          } else {
            detail_ids += this.can_list[i].detail_id;
          }
        }
      }
      if (_count == this.can_list.length) {
        this.is_checked = 1;
      } else {
        this.is_checked = 0;
      }
      this.choose_num = _count;
      this.detail_id = detail_ids;
      console.log(77, _count, detail_ids);
    },
    // 全选
    checkAll() {
      this.is_checked ? (this.is_checked = 0) : (this.is_checked = 1);
      if (this.is_checked) {
        this.can_list = this.can_list.map((value, key) => {
          value.is_checked = true;
          return value;
        });
      } else {
        this.can_list = this.can_list.map((value, key) => {
          value.is_checked = false;
          return value;
        });
      }
      this.getCount();
    },
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
        version: "1.1",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_GOODS_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        var arr = res.response_data.can;
        var detail_id = this.detail_id.toString().split(",");
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
          if (detail_id.includes(arr[i].detail_id.toString())) {
            arr[i].is_checked = true;
            count++;
          } else {
            arr[i].is_checked = false;
          }
        }
        if (count == arr.length) {
          this.is_checked = 1;
        }
        this.choose_num = count;
        this.can_list = arr;
        this.no_list = res.response_data.no;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 提交
    onSubmit() {
      if(this.choose_num > 0){
        this.$router.replace({
          name:this.$route.query.name==1?"refundtwo":"refundthree",
          query:{
            order_id: this.order_id,
            detail_id: this.detail_id,
            goods_length: this.can_list.length
          }
        })
      }else{
        this.$toast('请选择商品')
      }
    }
  }
};
</script>
