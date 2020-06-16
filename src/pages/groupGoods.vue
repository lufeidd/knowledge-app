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
        <div class="promotion">
          <img
            v-if="couponInfo.groupbuy && (couponInfo.groupbuy.user_remain_nums > 0 && couponInfo.groupbuy.remain_time > 0)"
            src="../assets/null/group_bg.png"
            width="100%"
            height="65px"
          />
          <img v-else src="../assets/null/group_bg2.png" width="100%" height="65px" />
          <div class="promotionLeft">
            <div class="promotionPrice">
              ￥
              <span class="price">{{couponInfo.groupbuy.groupbuy_price.toFixed(2)}}</span>
              <span class="group">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-rentuan" />
                </svg>
                <span class="group_num">{{couponInfo.groupbuy.groupbuy_num}}人团</span>
              </span>
            </div>
            <div class="original">直买价：￥{{baseData.price.toFixed(2)}}</div>
          </div>
          <div class="promotionRight">
            <div
              v-if="timeData"
              style="margin-top:5px;margin-bottom:5px;font-size:15px;"
            >{{timeData}}</div>
            <div v-else style="margin-top:5px;margin-bottom:5px;font-size:15px;">火把拼团</div>
            <div
              v-if="couponInfo.groupbuy.join_desc"
              style="font-size:13px;"
            >{{couponInfo.groupbuy.join_desc}}</div>
            <div v-else>该商品仅剩{{baseData.stores}}件</div>
          </div>
        </div>

        <div class="title">{{ baseData.title }}</div>
        <div class="sub_title">{{baseData.sub_title}}</div>
      </div>

      <van-cell
        v-if="Object.keys(location_info).length>0"
        :title="'配送至 ' + location_info.province+location_info.city"
        is-link
        :value="dispatch_str"
        @click="showPopup"
      />
      <!-- 拼团列表 -->
      <div
        class="group_list"
        v-if="couponInfo.groupbuy && couponInfo.groupbuy.open_list.length > 0 && couponInfo.groupbuy.user_remain_nums > 0"
      >
        <div class="content" v-for="(item,index) in couponInfo.groupbuy.open_list" :key="index">
          <!-- 2人团 -->
          <div class="left" v-if="item.nums == 2">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 三人团剩2人 -->
          <div class="left" v-if="item.nums == 3">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <span class="add" style="left:30px;z-index:3;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 三人团剩1人 -->
          <div class="left" v-if="item.nums == 3">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <img
              :src="item.user_head_list[1]"
              width="30px"
              height="30px"
              alt
              style="left:25px;z-index:3;"
            />
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 三人团剩1人 -->
          <div class="left" v-if="item.nums == 3">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <img
              :src="item.user_head_list[1]"
              width="30px"
              height="30px"
              alt
              style="left:25px;z-index:3;"
            />
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 四人团剩3人 -->
          <div class="left" v-if="item.nums == 4">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <span class="add" style="left:15px;z-index:2;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
            <span class="add" style="left:30px;z-index:3;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 四人团剩2人 -->
          <div class="left" v-if="item.nums == 4">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <img
              :src="item.user_head_list[1]"
              width="30px"
              height="30px"
              alt
              style="left:15px;z-index:2;"
            />
            <span class="add" style="left:30px;z-index:3;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 四人团剩1人 -->
          <div class="left" v-if="item.nums == 4">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <img
              :src="item.user_head_list[1]"
              width="30px"
              height="30px"
              alt
              style="left:15px;z-index:2;"
            />
            <img
              :src="item.user_head_list[2]"
              width="30px"
              height="30px"
              alt
              style="left:30px;z-index:3;"
            />
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 多人团剩n-1人 -->
          <div class="left" v-if="item.nums > 4 && item.remain_nums == item.nums - 1">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <span class="add" style="left:15px;z-index:2;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
            <span class="over" style="left:30px;z-index:3;">...</span>
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <!-- 多人团剩小于n-1人 -->
          <div class="left" v-if="item.nums > 4 && item.remain_nums < item.nums - 1">
            <img
              :src="item.user_head_list[0]"
              width="30px"
              height="30px"
              alt
              style="left:0;z-index:1;"
            />
            <img
              :src="item.user_head_list[1]"
              width="30px"
              height="30px"
              alt
              style="left:15px;z-index:2;"
            />
            <span class="over" style="left:30px;z-index:3;">...</span>
            <span class="add" style="left:50px;z-index:4;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renshu" />
              </svg>
            </span>
          </div>
          <div class="mid">
            <div>还差{{item.remain_nums}}人成团</div>
            <div class="time">剩余{{remain_time[index].date}}</div>
          </div>
          <div class="right">
            <van-button
              round
              size="small"
              type="danger"
              disabled
              v-if="couponInfo.groupbuy.user_remain_nums == 0"
            >去参团</van-button>
            <van-button round size="small" type="danger" @click="addgroup(item)" v-else>去参团</van-button>
          </div>
        </div>
      </div>
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

      <!-- <div v-if="this.isIphx" style="height: 34px;"></div> -->
      <div style="height:60px;"></div>
      <div class="groupFoot" :class="{iphx:this.isIphx}">
        <div>
          <van-row gutter="20" v-if="couponInfo.groupbuy && couponInfo.groupbuy.can_open_nums > 0">
            <van-col span="10">
              <van-button round type="primary" size="small" @click="buyTo">
                <div>￥{{baseData.price.toFixed(2)}}</div>
                <div style="margin-top:5px;">直接购买</div>
              </van-button>
            </van-col>
            <van-col span="14">
              <van-button round type="danger" size="small" @click="openGroup">
                <div>￥{{couponInfo.groupbuy.groupbuy_price.toFixed(2)}}</div>
                <div style="margin-top:5px;">我要开团</div>
              </van-button>
            </van-col>
          </van-row>
          <van-row v-else>
            <van-col span="24">
              <van-button round type="primary" size="small" @click="buyTo">
                <div style="font-size:15px;">直接购买 ￥{{baseData.price.toFixed(2)}}</div>
              </van-button>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <EazyNav type="brand" ref="nav" :isShow="true"></EazyNav>

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
}
</style>

<script>
//  引入接口
import { ALBUM } from "../apis/album.js";
import { USER_ADDRESS_LIST } from "../apis/user.js";
import { CART_ADD, ORDER_PHYSICAL_ADDINFO } from "../apis/shopping.js";
import { LOCATION_CHANGE } from "../apis/public.js";
import { GROUPBUY_OPEN_DETAIL } from "../apis/coupon.js";
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
      requestState: true,
      // 倒计时
      timeData: "",
      timeH: null,
      timeM: null,
      timeS: null,
      showDay: true,
      remain_time: [],
      groupbuy_id: null
    };
  },
  mounted() {
    this.baseData.goods_id = parseInt(this.$route.query.goods_id);
    this.groupbuy_id = parseInt(this.$route.query.groupbuy_id);
    // this.baseData.goods_id = 482;
    // 初始化省市区
    this.$getAddressData();
    // 当前页接口信息
    this.getGroupData();
    // this.$countTime(this.timeData);
  },
  methods: {
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
      data.groupbuy_id = this.groupbuy_id;
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
    async getGroupData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        ad: parseInt(this.$route.query.ad) == 1 ? 1 : 0,
        timestamp: tStamp,
        goods_id: this.baseData.goods_id,
        groupbuy_id: this.groupbuy_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ALBUM(data);

      if (res.hasOwnProperty("response_code")) {
        // console.log(666,this.navData.goods_nums)
        this.shoppingcart_num = res.response_data.shoppingcart_num;
        // 邮费信息
        this.dispatch_str = res.response_data.activity.groupbuy.dispatch_str;
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
        if (Object.keys(this.couponInfo.groupbuy).length == 0) {
          this.$router.replace({
            name: "detail",
            query: {
              goods_id: this.baseData.goods_id
            }
          });
        }
        if (this.couponInfo.groupbuy && this.couponInfo.groupbuy.remain_time) {
          this.$countTime(this.couponInfo.groupbuy.remain_time);
        }
        if (
          this.couponInfo.groupbuy &&
          Object.keys(this.couponInfo.groupbuy).length > 0 &&
          this.couponInfo.groupbuy.open_list.length > 0
        ) {
          for (var i = 0; i < this.couponInfo.groupbuy.open_list.length; i++) {
            this.remain_time.push({
              time: this.couponInfo.groupbuy.open_list[i].remain_time,
              date: ""
            });
            this.$timeCountDown(this.remain_time[i]);
          }
        }
        if (
          this.couponInfo.groupbuy &&
          this.couponInfo.groupbuy.my_open_ids.length > 0
        ) {
          this.$dialog
            .confirm({
              message: "您有一个进行中的拼团"
            })
            .then(() => {
              this.$router.push({
                name: "groupdetail",
                query: {
                  open_id: this.couponInfo.groupbuy.my_open_ids[0]
                }
              });
            })
            .catch(() => {
              // on cancel
            });
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

        // 获取页面分享信息
        // var _pageName = "groupbuy/goods/detail";
        // var _params = JSON.stringify({
        //   groupbuy_id: this.groupbuy_id,
        //   brand_id: this.brandInfoData.brand_id
        // });
        // if (this.isWxLogin) this.$getWxShareData(_pageName, _params);

        this.onsale = 1;
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
      // console.log(111, item);
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
      // console.log(888, values);
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
    toMall() {
      this.$router.push({
        name: "custompage",
        query: {
          type: "mall",
          supplier_id: this.brandInfoData.supplier_id
        }
      });
    },
    buyTo() {
      this.$router.push({
        name: "detail",
        query: {
          goods_id: this.baseData.goods_id,
          isactivity: 1
        }
      });
    },
    // 开团
    openGroup() {
      if (this.$refs.nav.is_Login) {
        this.$router.push({
          name: "orderconfirm",
          query: {
            address_id: this.address_id,
            goods_id: this.detail.goods_id,
            sku_id: this.detail.sku_id,
            count: 1,
            detail: true,
            groupbuy_id: this.couponInfo.groupbuy.id
          }
        });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    // 参团
    addgroup(item) {
      if (this.$refs.nav.is_Login) {
        this.$router.push({
          name: "groupdetail",
          query: {
            open_id: item.open_id
          }
        });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    // 倒计时
    countDownFun(time) {
      time--; //时间一秒秒的减
      let h = Math.floor(time / 60 / 60);
      let m = Math.floor((time - h * 60 * 60) / 60);
      let s = time - h * 60 * 60 - m * 60;
      if (h < 10) h = "0" + h;
      if (m < 10) m = "0" + m;
      if (s < 10) s = "0" + s;
      let res = h + ":" + m + ":" + s;
      return res;
    }
  }
};
</script>
