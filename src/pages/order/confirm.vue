<template>
  <div id="orderconfirmPage">
    <!-- 地址 -->
    <router-link
      :to="{name: 'addresslist', query: {type:'confirm'}}"
      class="listBox"
      v-if="Object.keys(address).length == 0"
    >
      <div class="center">添加收货地址</div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </router-link>

    <router-link :to="{name: 'addresslist', query: {type:'confirm'}}" class="listBox" v-else>
      <div class="right one">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-location-line" />
        </svg>
      </div>
      <div class="center">
        <ul class="addressBox">
          <li>
            <div class="info">
              <div>
                <span class="name">{{ address.consignee }}</span>
                <span class="phone">{{ address.mobile }}</span>
              </div>
              <div
                class="address"
              >{{ address.province }}{{ address.city }}{{ address.county }}{{ address.address }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </router-link>
    <!-- 商品 -->
    <div @click="gotoDetail" v-if="goodspic && goodspic.length > 0" class="listBox">
      <div class="center" style="height: 45px;overflow: hidden;">
        <ul class="addressBox img">
          <li v-for="(img,index) in goodspic" :key="index">
            <div class="ratioBox">
              <div class="box">
                <img v-lazy="img" width="45px" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <span>共{{ goods_count }}件</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line" />
        </svg>
      </div>
    </div>
    <!-- 优惠券 -->
    <van-cell
      title
      is-link
      :value="discount_price_desc"
      @click="showCoupon"
      style="margin:5px 0;"
      v-if="ticket_lists.canuse.length>0"
    >
      <template slot="title">
        <span style="margin-right:10px;color:#333;">优惠券</span>
        <span class="toMall" v-if="discount_price == ticket_price">已选最大优惠</span>
        <span class="toMall" v-if="ticket_num">已选{{ticket_num}}张</span>
      </template>
    </van-cell>
    <van-cell
      title
      is-link
      value="拼团商品不可用券"
      style="margin:5px 0;"
      v-if="ticket_lists.canuse.length == 0 && (groupbuy_id || groupbuy_open_id)"
    >
      <template slot="title">
        <span style="margin-right:10px;color:#333;">优惠券</span>
      </template>
    </van-cell>
    <van-cell
      title
      is-link
      value="无可用券"
      style="margin:5px 0;"
      v-else
    >
      <template slot="title">
        <span style="margin-right:10px;color:#333;">优惠券</span>
      </template>
    </van-cell>
    <!-- 备注 -->
    <div class="priceInfo beizhu">
      <div class="first">
        <van-cell title="备注" />
      </div>
      <textarea placeholder="选填，请填写备注内容">{{ remark }}</textarea>
    </div>
    <!-- 价格 -->
    <div class="priceInfo">
      <div class="first">
        <van-cell title="商品总额" v-model="'¥'+order_money.toFixed(2)" />
      </div>
      <van-cell title="运费" v-model="'¥'+dispatch_price.toFixed(2)" />
      <van-cell title="商品优惠" v-model="'¥'+discount_price.toFixed(2)" />
    </div>

    <van-submit-bar
      :class="{iphx:this.isIphx}"
      safe-area-inset-bottom
      :price="pay_price * 100"
      button-text="去支付"
      @submit="onSubmit"
    ></van-submit-bar>
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
          <div class="checkedText">
            <span v-if="chooseMax">请选择优惠券</span>
            <span v-else>已选中优惠券{{ticket_num}}张，共优惠{{discount_price}}元</span>
            <span class="toMall" v-if="chooseMax" @click="chooseMaxPrice">选择最大优惠</span>
          </div>
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
                      <span class="dianpu" v-if="item.brand_id">店铺券</span>
                      <span class="dianpu" v-else>平台券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <div class="time">{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
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
                      <span class="dianpu" v-if="item.brand_id">店铺券</span>
                      <span class="dianpu" v-else>平台券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <span class="used">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-check-line" />
                    </svg>
                  </span>
                  <div class="time">{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
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
              <div style="border-radius:0 6px 6px 0;margin-top:10px;overflow:hidden;box-shadow:0 0 10px rgba(0,0,0,0.06);">
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
                      <span class="dianpu" v-if="item.brand_id">店铺券</span>
                      <span class="dianpu" v-else>平台券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <!-- <span class="used">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-received-line" />
                    </svg>
                  </span>-->
                  <div class="time">{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
                </div>
              </div>
              </div>
              <div class="whyNoUse">{{item.cart_money>0?'还差'+item.cart_money+'元可使用该券':'所结算商品中没有符合条件的商品'}}</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
    <EazyNav type="order"></EazyNav>
    <!-- <CopyRight></CopyRight> -->
  </div>
</template>

<style src="@/style/scss/pages/order.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
#orderconfirmPage {
  .van-cell {
    padding: 10px 15px;
  }
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
</style>
<script>
import {
  ORDER_PHYSICAL_ADDINFO,
  ORDER_PHYSICAL_ADD
} from "./../../apis/shopping";
export default {
  data() {
    return {
      address: {},
      goodspic: [],
      goods_count: 0,
      dispatch_price: 0,
      order_money: 0,
      pay_price: 0,
      ticket_price: 0,
      yh_price: 0,
      address_id: 0,
      remark: "",
      pay_id: "",
      location: 0,
      // 优惠券信息
      couponInfo: null,
      couponList: [],
      couponModel: false,
      active: 0,
      nouseCoupon: "",
      useCoupon: "",
      ticket_price: null,
      ticket_lists: {
        canuse:[],
        nouse:[]
      },
      discount_price: 0,
      ticket_num: 0,
      total_money: 0,
      order_ticket_ids: "",
      chooseMax:false,
      maxDiscount:null,
      discount_price_desc:'',
      groupbuy_id:null,
      groupbuy_open_id:null,
    };
  },
  mounted() {
    this.groupbuy_id = this.$route.query.groupbuy_id;
    this.groupbuy_open_id = this.$route.query.groupbuy_open_id;
    this.orderAddData();
  },
  methods: {
    gotoDetail() {
      var queryTmp = {};
      queryTmp.address_id = this.address_id;
      if (this.$route.query.detail_ids)
        queryTmp.detail_ids = this.$route.query.detail_ids;
      if (this.$route.query.detail) queryTmp.detail = this.$route.query.detail;
      if (this.$route.query.groupbuy_id) queryTmp.groupbuy_id = this.$route.query.groupbuy_id;
      if (this.$route.query.groupbuy_open_id) queryTmp.groupbuy_open_id = this.$route.query.groupbuy_open_id;
      queryTmp.order_ticket_ids = this.order_ticket_ids;
      queryTmp.location = JSON.stringify(this.location);
      this.$router.push({ name: "orderconfirmdetail", query: queryTmp });
    },
    // 新增实物订单
    async orderAddData() {
      var data = {};
      var tStamp = this.$getTimeStamp();
      data.timestamp = tStamp;
      data.version = "1.0";
      if (this.$route.query.detail_ids)
        data.detail_ids = this.$route.query.detail_ids;
      if (this.$route.query.detail) data.detail = this.$route.query.detail;
      if (this.$route.query.groupbuy_id) data.groupbuy_id = this.$route.query.groupbuy_id;
      if (this.$route.query.groupbuy_open_id) data.groupbuy_open_id = this.$route.query.groupbuy_open_id;
      // data.ticket_ids = this.order_ticket_ids;
      data.sign = this.$getSign(data);
      let res = await ORDER_PHYSICAL_ADDINFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.address = res.response_data.address;
        this.goodspic = res.response_data.goodspic;
        this.goods_count = res.response_data.goods_count;
        this.dispatch_price = res.response_data.dispatch_price;
        this.order_money = res.response_data.order_money;
        this.pay_price = res.response_data.pay_price;
        this.total_money = res.response_data.order_money;
        this.discount_price = res.response_data.ticket_price;
        this.yh_price = res.response_data.yh_price;
        // 优惠券
        this.ticket_price = res.response_data.ticket_price;
        this.ticket_lists = res.response_data.ticket_lists;
        this.maxDiscount = JSON.parse(JSON.stringify(res.response_data.ticket_lists));
        for (var i = 0; i < this.ticket_lists.canuse.length; i++) {
          if (this.ticket_lists.canuse[i].selected == 0) {
            this.ticket_lists.canuse[i].state = 0;
          } else {
            this.ticket_num++;
            if (this.order_ticket_ids) {
              this.order_ticket_ids +=
                "," + this.ticket_lists.canuse[i].id;
            } else {
              this.order_ticket_ids += this.ticket_lists.canuse[i].id;
            }
          }
        }
        if(this.discount_price>0){
          this.discount_price_desc='优惠￥'+this.discount_price;
        }else{
          this.discount_price_desc=this.ticket_lists.canuse.length+'张券可用'
        }
        if(this.ticket_price){this.chooseMax = false}else{this.chooseMax = true}
        // console.log(this.order_ticket_ids);
        this.nouseCoupon =
          "不可用优惠券（" + this.ticket_lists.nouse.length + "）";
        this.useCoupon =
          "可用优惠券（" + this.ticket_lists.canuse.length + "）";
        if (res.response_data.address.address_id) {
          this.address_id = res.response_data.address.address_id;
          this.location = {
            province_id: res.response_data.address.province_id,
            city_id: res.response_data.address.city_id
          };
        }

      } else {
        this.$toast(res.error_message);
      }
    },
    async computedFreight(){
      var data = {};
      var tStamp = this.$getTimeStamp();
      data.timestamp = tStamp;
      data.version = "1.0";
      if (this.$route.query.detail_ids)
        data.detail_ids = this.$route.query.detail_ids;
      if (this.$route.query.detail) data.detail = this.$route.query.detail;
      data.ticket_ids = this.order_ticket_ids;
      data.address_id = this.address_id;
      data.sign = this.$getSign(data);
      let res = await ORDER_PHYSICAL_ADDINFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.dispatch_price = res.response_data.dispatch_price;
        // this.pay_price = res.response_data.pay_price;
        this.pay_price =
        this.total_money + this.dispatch_price - this.discount_price;

        if(this.discount_price>0){
          this.discount_price_desc='优惠￥'+this.discount_price;
        }else{
          this.discount_price_desc=this.ticket_lists.canuse.length+'张券可用'
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 支付 获取pay_id
    async payIdData() {
      var data = {};
      var tStamp = this.$getTimeStamp();
      data.timestamp = tStamp;
      data.version = "1.0";
      if (this.$route.query.detail_ids)
        data.detail_ids = this.$route.query.detail_ids;
      if (this.$route.query.detail) data.detail = this.$route.query.detail;

      data.address_id = this.address_id;
      data.remark = this.remark;
      data.ticket_ids = this.order_ticket_ids?this.order_ticket_ids:0;
      data.groupbuy_id = this.groupbuy_id?this.groupbuy_id:0;
      data.sign = this.$getSign(data);
      let res = await ORDER_PHYSICAL_ADD(data);

      if (res.hasOwnProperty("response_code")) {
        this.pay_id = res.response_data.pay_id;
        this.$router.push({
          name: "pay",
          query: { pay_id: this.pay_id, money: this.pay_price }
        });
      } else {
        this.$toast(res.error_message);
      }
    },
    // 去支付
    onSubmit() {
      if (this.address_id == "") {
        this.$toast("请添加收货地址~");
        return;
      }
      this.payIdData();
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
      var _goods = []
      var _count = 0;
      // if(_state == 1){
        // _goods = [];
        for(var a=0;a<this.ticket_lists.canuse.length;a++){
          if(this.ticket_lists.canuse[a].selected == 1){
            // _goods.push(this.ticket_lists.canuse[a].goods_ids.join(','))
            _goods = _goods.concat(this.ticket_lists.canuse[a].goods_ids);
            _count ++;
          }
        }
        if(_count > 0){
          this.chooseMax = false
        }else{
          this.chooseMax = true
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
          var _length
          if(check_goods.length > tempArray1.length){
            _length = check_goods.length
          }else{
            _length = tempArray1.length
          }
          // console.log(999,_length)
          for (var k = 0; k < _length; k++) {
            // if (tempArray1[check_goods[k]]) {
            //   tempArray2.push(check_goods[k]);
            // }
            if(check_goods.includes(tempArray1[k])){
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
          }else{
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
            this.order_ticket_ids +=
              "," + this.ticket_lists.canuse[i].id;
          } else {
            this.order_ticket_ids += this.ticket_lists.canuse[i].id;
          }
        }
      }
      this.computedFreight();
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
            this.order_ticket_ids +=
              "," + this.ticket_lists.canuse[i].id;
          } else {
            this.order_ticket_ids += this.ticket_lists.canuse[i].id;
          }
        }
      }
      this.computedFreight();
      // this.pay_price =
      //   this.total_money + this.dispatch_price - this.discount_price;
      this.couponModel = false;
      // console.log(this.order_ticket_ids);
    },
    chooseMaxPrice(){
      this.ticket_lists = this.maxDiscount;
      this.discount_price = this.ticket_price;
      this.chooseMax = false;
      for (var i = 0; i < this.ticket_lists.canuse.length; i++) {
          if (this.ticket_lists.canuse[i].selected == 0) {
            this.ticket_lists.canuse[i].state = 0;
          } else {
            this.ticket_num++;
            if (this.order_ticket_ids) {
              this.order_ticket_ids +=
                "," + this.ticket_lists.canuse[i].id;
            } else {
              this.order_ticket_ids += this.ticket_lists.canuse[i].id;
            }
          }
        }
        this.computedFreight();
    },
  }
};
</script>

