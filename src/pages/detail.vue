<template>
  <div id="detailPage">
    <div class="nullBox" v-if="onsale == 0">
      <img src="./../assets/null/product.png" width="100%" />
      <div>该商品已下架~</div>
    </div>
    <div v-if="onsale == 1">
      <van-swipe :autoplay="3000" indicator-color="#f05654">
        <van-swipe-item v-for="(image, index) in baseData.pic" :key="index">
          <div class="ratioBox">
            <div class="box">
              <img v-lazy="image" />
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <div class="infoBox">
        <!-- 限时促销 -->
        <div class="promotion" v-if="baseData.single_activity_id">
          <img src="../assets/null/promotion.png" width="100%" height="65px" />
          <div class="promotionLeft">
            <div class="promotionPrice">
              ￥
              <span class="price">{{couponInfo.single.activity_price.toFixed(2)}}</span>
            </div>
            <div class="original">
              原价
              <del>￥{{baseData.market_price.toFixed(2)}}</del>
              <span class="discount">{{couponInfo.single.desc}}</span>
            </div>
          </div>
          <div class="promotionRight" v-if="showDay">
            <div class="red">{{timeDataDesc}}</div>
            <div v-if="baseData.stores > 100 ">库存充足</div>
            <div v-else>该价格仅剩{{baseData.stores}}件</div>
          </div>
          <div class="promotionRight" v-else>
            <div>
              <div class="activity">距活动结束还剩</div>
              <div class="timeD">
                <span class="time">{{timeH}}</span> ：
                <span class="time">{{timeM}}</span> ：
                <span class="time">{{timeS}}</span>
              </div>
            </div>
            <div v-if="baseData.stores > 100 ">库存充足</div>
            <div v-else>该价格仅剩{{baseData.stores}}件</div>
          </div>
        </div>
        <!-- <van-row class="info" v-else>
          <van-col span="12">
            <span class="price">¥{{ baseData.price }}</span>
            <div>原价<del>¥{{ baseData.market_price }}</del></div>
          </van-col>
          <van-col span="12" v-if="baseData.stores <= 10" style="text-align: right;">库存紧张</van-col>
          <van-col span="12" v-else style="text-align: right;">库存充足</van-col>
        </van-row>-->
        <div class="discountInfo" v-else>
          <span class="price">
            ¥
            <span class="dis_price">{{ baseData.price.toFixed(2) }}</span>
          </span>
          <div class="discount">
            <span class="original">
              原价
              <del
                v-if="baseData.price !== baseData.market_price"
              >¥{{ baseData.market_price.toFixed(2) }}</del>
              <span
                class="price"
                v-if="baseData.price !== baseData.market_price"
              >{{((baseData.price/baseData.market_price)*10).toFixed(1)}}折</span>
            </span>
            <span v-if="baseData.stores <= 10" class="stores">仅剩{{baseData.stores}}件</span>
            <span v-if="baseData.stores > 100" class="stores">库存充足</span>
          </div>
        </div>
        <div class="title">{{ baseData.title }}</div>
        <div class="sub_title">{{baseData.sub_title}}</div>
      </div>
      <div style="margin:5px 0;">
        <!-- 优惠券 -->
        <van-cell
          title
          is-link
          value
          @click="showCoupon"
          v-if="Object.keys(couponInfo.ticket).length>0"
        >
          <template slot="title">
            <span style="margin-right:10px;" v-if="isReceived">已领券</span>
            <span style="margin-right:10px;" v-else>领券</span>
            <span
              class="toMall"
              v-for="(item,index) in couponInfo.ticket.list"
              :key="index"
            >{{item}}</span>
          </template>
        </van-cell>
        <!-- 满减满折 -->
        <van-cell
          title
          is-link
          value
          @click="showMulti"
          v-if="couponInfo.multi && Object.keys(couponInfo.multi).length>0"
        >
          <template slot="title">
            <span style="margin-right:10px;">活动</span>
            <span class="multi_radio">{{couponInfo.multi.tag}}</span>
            <span class="multi_desc">{{couponInfo.multi.summary}}</span>
          </template>
        </van-cell>
      </div>

      <van-cell
        v-if="Object.keys(location_info).length>0"
        :title="'配送至 ' + location_info.province+location_info.city"
        is-link
        :value="dispatch_str"
        @click="showPopup"
      />
      <!-- 公号信息 -->
      <div class="brand_info">
        <div class="left" @click="toBrand">
          <div class="ratiobox">
            <div class="bookImg" v-lazy:background-image="brandInfoData.header_pic"></div>
          </div>
          <span class="name">{{brandInfoData.name}}</span>
        </div>
        <div class="toMall" @click="toMall">进入商城</div>
      </div>
      <!-- 出版信息 -->
      <div class="introduction" v-if="baseData.attr">
        <div class="text">
          <span class="verticleLine"></span>
          <span class="lh">出版信息</span>
        </div>
        <div class="detail" v-for="(item, index) in baseData.attr" :key="index">
          <van-row>
            <van-col span="12">{{ item.name }}</van-col>
            <van-col span="12" style="text-align:right;color: #999;">{{ item.val }}</van-col>
          </van-row>
        </div>
      </div>
      <!-- 图文 -->
      <div v-if="baseData.goods_desc" class="introduction" v-html="baseData.goods_desc"></div>
      <!-- 目录及其他 -->

      <div
        class="foldBox"
        v-for="(item, index) in baseData.desc_arr"
        :key="index"
        v-if="baseData.desc_arr"
      >
        <div class="introduction fold" v-if="!item.showAll">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh">{{ item.name }}</span>
          </div>
          <div class="detail" v-html="changeHtml(item.val)"></div>
          <div class="action" @click="showAllAction(index)">展开全部</div>
        </div>
        <div class="introduction unfold" v-else>
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh">{{ item.name }}</span>
          </div>
          <div class="detail" style v-html="changeHtml(item.val)"></div>
        </div>
      </div>

      <van-popup v-model="popupModel" position="bottom" @open="onOpen">
        <div class="audioList">
          <!-- 地址列表 -->
          <template v-if="!areaShow && isLogin == 1 && addressData.length > 0">
            <div class="title">
              <div class="action" @click="hidePopup">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fold-line" />
                </svg>
              </div>
              <div>配送至</div>
            </div>
            <ul class="audioListBox">
              <li
                v-for="(item, key) in addressData"
                :key="key"
                :class="{ active: activeIndex == key }"
                @click="onChoose(key, item)"
              >
                <div class="img">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-location-line" />
                  </svg>
                </div>

                <div class="info">
                  <div
                    class="album"
                  >{{ item.province }}{{ item.city }}{{ item.county }}{{ item.address }}</div>
                </div>
              </li>
            </ul>
            <van-button size="large" class="button" @click="showArea">选择其他地区</van-button>
          </template>
          <template v-else>
            <!-- 选择省市区 -->
            <van-area
              class="areaBox"
              :area-list="areaList"
              :columns-num="3"
              title="配送至"
              @cancel="hidePopup"
              @confirm="onConfirm"
            />
          </template>
        </div>
      </van-popup>
      <!-- 领取优惠券 -->
      <van-popup
        v-model="couponModel"
        v-if="couponInfo.ticket"
        position="bottom"
        style="max-height:65%;min-height:65%;"
      >
        <div class="header">
          <span class="catalogWord">可用优惠券（满足条件后可用于当前商品）</span>
          <span>
            <svg class="icon" aria-hidden="true" @click="closePopup">
              <use xlink:href="#icon-close-line" />
            </svg>
          </span>
        </div>
        <div class="content">
          <div
            style="margin-top:10px;overflow:hidden;border-radius:0 6px 6px 0;box-shadow:0 0 10px rgba(0,0,0,0.06);"
            v-for="(item,index) in couponList"
            :key="index"
          >
            <!-- 可领取 -->
            <div class="toUse" v-if="item.state == 1 || item.state == 3">
              <div class="left"></div>
              <div class="mid">
                <div>
                  ￥
                  <span class="price">{{item.money}}</span>
                </div>
                <div class="condition">{{item.use_time_desc}}</div>
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
                <div class="desc">
                  {{item.use_range_desc}}
                  <span
                    class="toMall btn red"
                    v-if="item.state == 1 && requestState"
                    @click="receive(item,index)"
                  >点击领取</span>
                  <span class="toMall btn red" v-if="item.state == 1 && !requestState">点击领取</span>
                  <span class="toMall btn" v-if="item.state == 3" @click="toResult(item,index)">可用商品</span>
                </div>
                <div class="time">
                  <span
                    v-if="item.state == 3"
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
                  <span v-else>
                    <span v-if="item.use_time_type == 2">领取后{{item.use_time_day}}天有效</span>
                    <span
                      v-else
                    >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</span>
                  </span>
                </div>
                <span class="used" v-if="item.state == 3">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yilingqu" />
                  </svg>
                </span>
              </div>
            </div>
            <!-- 已领完 -->
            <div class="toUse overdue" v-if="item.state == 2">
              <div class="left"></div>
              <div class="mid">
                <div>
                  ￥
                  <span class="price">{{item.money}}</span>
                </div>
                <div class="condition">{{item.use_time_desc}}</div>
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
                    <use xlink:href="#icon-received-line" />
                  </svg>
                </span>
                <div class="time" v-if="item.use_time_type == 2">领取后{{item.use_time_day}}天有效</div>
                <div
                  class="time"
                  v-else
                >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
      <!-- 满减满折 -->
      <van-popup
        v-model="multiModel"
        position="bottom"
        v-if="couponInfo.multi"
        style="max-height:50%;min-height:50%;"
      >
        <div class="header">
          <span class="catalogWord">活动</span>
          <span>
            <svg class="icon" aria-hidden="true" @click="closePopup">
              <use xlink:href="#icon-close-line" />
            </svg>
          </span>
        </div>
        <div class="content" style="padding:0">
          <van-cell is-link @click="toMultiResult" class="multi">
            <template slot="title">
              <span class="multi_radio">{{couponInfo.multi.tag}}</span>
              <span style="font-size:12px;white-space:wrap;">{{couponInfo.multi.desc}}</span>
            </template>
          </van-cell>
        </div>
      </van-popup>
      <!-- <div v-if="this.isIphx" style="height: 34px;"></div> -->
      <div style="height:60px;"></div>

      <!-- 加入购物车、立即购买 -->
      <van-goods-action>
        <van-goods-action-mini-btn
          v-if="shoppingcart_num > 0"
          :info="shoppingcart_num"
          icon="cart-o"
          text="购物车"
          @click="toCart"
        />
        <van-goods-action-mini-btn v-else icon="cart-o" text="购物车" @click="toCart" />
        <van-goods-action-big-btn text="加入购物车" @click="addToCart" />
        <van-goods-action-big-btn primary text="立即购买" @click="buyAction" />
      </van-goods-action>

      <!-- 暂无库存 -->
      <div class="disabled" v-if="baseData.stores <= 0">
        <div style="height: 50px;"></div>
        <div class="none">库存不足</div>
        <van-goods-action>
          <van-goods-action-mini-btn
            v-if="shoppingcart_num > 0"
            :info="shoppingcart_num"
            icon="cart-o"
            text="购物车"
            @click="toCart"
          />
          <van-goods-action-mini-btn v-else icon="cart-o" text="购物车" @click="toCart" />
          <van-goods-action-big-btn disabled text="加入购物车" @click="addToCart" />
          <van-goods-action-big-btn disabled primary text="立即购买" @click="buyAction" />
        </van-goods-action>
      </div>
    </div>
    <EazyNav type="brand" ref="nav" :isShow="true"></EazyNav>
    <!-- 拼团 -->
    <div
      class="groupBuy"
      v-if="couponInfo.groupbuy && Object.keys(couponInfo.groupbuy).length>0"
      @click="toGoodsGroup"
    >
      拼团价：￥{{couponInfo.groupbuy.groupbuy_price.toFixed(2)}}
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-next-line" />
      </svg>
    </div>
    <Loading :isLoading="isLoading"></Loading>
  </div>
</template>

<style src="@/style/scss/pages/detail.scss" scoped lang="scss"></style>
<style lang="scss">
@import url("./../style/scss/components/dateTimePicker.scss");
#detailPage {
  .van-cell__title,
  .van-cell__value {
    @include textOverflow;
    flex: auto;
    -webkit-box-flex: 0;
  }
  .van-cell__value {
    flex-shrink: 0;
  }
  .groupBuy {
    width: 126px;
    height: 30px;
    line-height: 30px;
    color: $white;
    background: linear-gradient(to left, #f72d3e 100%, #f35636 100%);
    border-radius: 0 15px 15px 0;
    font-size: $fontSize - 2;
    position: absolute;
    top: 40%;
    left: 0;
    text-align: center;
    .icon {
      position: absolute;
      right: 5px;
      top: 50%;
      margin-top: -6px;
    }
  }
  .multi .van-cell__title {
    white-space: pre-wrap;
  }
}
</style>

<script>
//  引入接口
import { ALBUM } from "../apis/album.js";
import { USER_ADDRESS_LIST } from "../apis/user.js";
import { CART_ADD, ORDER_PHYSICAL_ADDINFO } from "../apis/shopping.js";
import { LOCATION_CHANGE } from "../apis/public.js";
import { GOODS_TICKET_GETS, TICKET_LINK } from "../apis/coupon.js";
export default {
  data() {
    return {
      shoppingcart_num: 0,
      dispatch_str: "",
      addressData: [],
      location_info: null,
      finished: false,
      isLoading: true,
      detail: {
        goods_id: null,
        sku_id: null,
        count: 1
      },
      remark: "",
      address_id: "",
      areaShow: false,
      // 基础信息
      baseData: {
        title: "",
        sub_title: "",
        pic: [],
        goods_type: null,
        collection_num: 0,
        collect_id: null,
        goods_id: null
      },
      // 优惠券信息
      couponInfo: {
        groupbuy: {},
        single: {},
        ticket: {}
      },
      couponList: [],
      isReceived: false,
      // 所属媒体信息
      brandInfoData: {
        header_pic: "",
        name: "",
        fans: 0,
        is_followed: null
      },
      isLogin: null,
      onsale: null,
      // 省市区
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },

      activeIndex: 1,
      popupModel: false,
      couponModel: false,
      multiModel: false,
      requestState: true,
      // 倒计时
      timeData: "2019-10-17 20:28:00",
      timeH: null,
      timeM: null,
      timeS: null,
      showDay: true,
      timeDataDesc: ""
    };
  },
  mounted() {
    this.baseData.goods_id = parseInt(this.$route.query.goods_id);
    // this.baseData.goods_id = 482;
    // 初始化省市区
    this.$getAddressData();
    // 当前页接口信息
    this.albumData();
    this.getCouponList();
    // this.$countTime(this.timeData);
  },
  methods: {
    toGoodsGroup() {
      if (this.$refs.nav.is_Login) {
        this.$router.push({
          name: "groupgoods",
          query: {
            goods_id: this.baseData.goods_id,
            groupbuy_id: this.couponInfo.groupbuy.id
          }
        });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    toBrand() {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: this.brandInfoData.brand_id
        }
      });
    },
    // 定位地址信息手动变更动作
    async locationChangeData(locations, goods_detail) {
      var tStamp = this.$getTimeStamp();
      var data = {};
      data.timestamp = tStamp;
      data.version = "1.0";
      data.locations = JSON.stringify(locations);
      data.goods_detail = JSON.stringify(goods_detail);
      data.sign = this.$getSign(data);
      let res = await LOCATION_CHANGE(data);
      if (res.hasOwnProperty("response_code")) {
        this.dispatch_str = res.response_data.dispatch_str;
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取我的收货地址信息
    async getAddressData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_ADDRESS_LIST(data);
      if (res.hasOwnProperty("response_code")) {
        this.addressData = [];
        for (let i = 0; i < res.response_data.length; i++) {
          this.addressData.push(res.response_data[i]);
        }
        this.finished = true;
      } else {
        this.$toast(res.error_message);
      }
      // console.log(res);
    },
    // 加入购物车
    async toCartData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        sku_id: this.baseData.goods_id,
        count: 1,
        price: this.baseData.price,
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_ADD(data);

      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.success == 1) {
          this.$toast("添加购物车成功~");
          this.shoppingcart_num++;
          this.$refs.nav.navData.goods_nums++;
        }
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          this.$router.push({ name: "login" });
        }
        this.$toast(res.error_message);
      }
    },
    showAllAction(index) {
      this.baseData.desc_arr = this.baseData.desc_arr.map((value, key) => {
        if (key == index) value.showAll = true;
        return value;
      });
    },
    changeHtml(content) {
      if (typeof content == "string") {
        return content.replace(/\n/g, "<br>");
      } else {
        return content;
      }
    },
    // 获取专辑接口信息
    async albumData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);

      if (res.hasOwnProperty("response_code")) {
        this.shoppingcart_num = res.response_data.shoppingcart_num;
        // 邮费信息
        this.dispatch_str = res.response_data.dispatch_str;
        // 地址
        this.location_info = res.response_data.location_info;
        this.isLoading = false;
        //专辑基础信息
        this.baseData = res.response_data.base;
        // 所属媒体信息
        this.brandInfoData = res.response_data.brand_info;
        // 登录状态
        this.isLogin = res.response_data.user_info.is_login;

        // title
        document.title = "商品详情-" + res.response_data.base.title;
        // 优惠券
        this.couponInfo = res.response_data.activity;
        if (this.$route.query.isactivity == 1) {
        } else {
          if (this.couponInfo.groupbuy.state == 1) {
            this.$router.replace({
              name: "groupgoods",
              query: {
                goods_id: this.baseData.goods_id,
                groupbuy_id: this.couponInfo.groupbuy.id
              }
            });
            return;
          }
        }
        if (this.couponInfo.single.remain_time > 0) {
          this.$countTime(this.couponInfo.single.remain_time);
        }
        // 立即购买信息
        this.detail.goods_id = res.response_data.base.goods_id;
        this.detail.sku_id = res.response_data.base.goods_id;
        this.detail.count = 1;
        if (this.isLogin == 1) {
          this.getAddressData();
        }
        // 展开全部状态
        if (this.baseData.desc_arr && this.baseData.desc_arr.length > 0) {
          for (let i = 0; i < this.baseData.desc_arr.length; i++) {
            this.baseData.desc_arr[i].showAll = false;
          }
        }

        this.onsale = 1;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
          this.isLoading = false;
        }
        this.$toast(res.error_message);
      }

      // console.log("商品基础信息:", res.response_data);
    },
    // 促销活动结束回复原价
    async returnPrice() {
      var tStamp = this.$getTimeStamp();
      let data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);

      if (res.hasOwnProperty("response_code")) {
        this.baseData.price = res.response_data.base.price;
        this.baseData.market_price = res.response_data.base.market_price;
        this.baseData.single_activity_id =
          res.response_data.base.single_activity_id;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 401) {
          // 上下架状态, 1=> 在架, 0=> 下架
          this.onsale = 0;
        }
        this.$toast(res.error_message);
      }

      // console.log("商品基础信息:", res.response_data);
    },
    showArea() {
      this.areaShow = true;
    },
    // 配送至
    onChoose(key, item) {
      console.log(111, item);
      this.activeIndex = key;
      this.location_info.province = item.province;
      this.location_info.city = item.city;
      this.popupModel = false;
      // 获取邮费
      var locations = {
        province: item.province,
        city: item.city,
        province_id: item.province_id,
        city_id: item.city_id
      };
      var goods_detail = {
        goods_id: this.baseData.goods_id,
        sku_id: this.baseData.goods_id,
        count: 1
      };
      this.locationChangeData(locations, goods_detail);
    },
    onOpen() {
      // alert(999);
    },
    showPopup() {
      this.popupModel = true;
    },
    hidePopup() {
      this.popupModel = false;
      this.areaShow = false;
    },
    // 确认
    onConfirm(values) {
      this.popupModel = false;
      this.areaShow = false;
      console.log(888, values);
      this.location_info.province = values[0].name;
      this.location_info.city = values[1].name;
      // 获取邮费
      var locations = {
        province: values[0].name,
        city: values[1].name,
        province_id: values[0].code.substring(0, 2),
        city_id: values[1].code.substring(0, 4)
      };
      var goods_detail = {
        goods_id: this.baseData.goods_id,
        sku_id: this.baseData.goods_id,
        count: 1
      };
      this.locationChangeData(locations, goods_detail);
    },
    // 购物车
    toCart() {
      this.$router.push("/cart");
    },
    // 加入购物车
    addToCart() {
      this.toCartData();
      // this.$refs.nav.cartData();
    },
    // 立即购买
    buyAction() {
      if (this.$refs.nav.is_Login) {
        this.$router.push({
          name: "orderconfirm",
          query:{
            goods_id: this.detail.goods_id,
            sku_id: this.detail.sku_id,
            count: this.detail.count,
            detail: true
          }
        });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    // 新增实物订单
    async orderAddData() {
      var data = {};
      var tStamp = this.$getTimeStamp();
      data.timestamp = tStamp;
      data.version = "1.0";
      data.detail = JSON.stringify(this.detail);
      if (this.address_id != "") data.address_id = this.address_id;
      data.sign = this.$getSign(data);
      let res = await ORDER_PHYSICAL_ADDINFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.$router.push({
          name: "orderconfirm",
          query: { address_id: this.address_id }
        });
      } else {
        this.$toast(res.error_message);
      }
    },
    toMall() {
      this.$router.push({
        name: "custompage",
        query: {
          type: "mall",
          supplier_id: this.brandInfoData.supplier_id
        }
      });
    },
    showCoupon() {
      this.couponModel = true;
    },
    closePopup() {
      this.couponModel = false;
      this.multiModel = false;
    },
    async getCouponList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await GOODS_TICKET_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.couponList = res.response_data;
        for (var i = 0; i < this.couponList.length; i++) {
          if (this.couponList[i].state == 3) {
            this.isReceived = true;
          }
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 领取优惠券
    receive(item, index) {
      if (this.$refs.nav.is_Login == 0) {
        this.$router.push({ name: "login", params: {} });
        this.$toast("用户未登录!");
      } else {
        this.ticketLink(item.ticket_id, index);
      }
    },
    async ticketLink(ticket_id, index) {
      this.requestState = false;
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        ticket_id: ticket_id
      };
      data.sign = this.$getSign(data);
      let res = await TICKET_LINK(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.$toast("领取成功！");
        this.requestState = true;
        this.couponList = this.couponList.map((value, key) => {
          if (key == index) {
            value.state = 3;
            value.use_stime = res.response_data.use_stime;
            value.use_etime = res.response_data.use_etime;
          }
          return value;
        });
      } else {
        this.$toast(res.error_message);
        this.requestState = true;
      }
    },
    toResult(item, index) {
      this.$router.push({
        name: "couponresult",
        query: {
          ticket_id: item.ticket_id
        }
      });
    },
    showMulti() {
      this.multiModel = true;
    },
    toMultiResult() {
      this.$router.push({
        name: "multiresult",
        query: {
          multi_id: this.couponInfo.multi.activity_id
        }
      });
    }
  }
};
</script>
