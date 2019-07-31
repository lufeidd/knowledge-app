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
        <van-row class="info">
          <van-col span="12">
            <span class="price">¥{{ baseData.price }}</span>
            <del>¥{{ baseData.market_price }}</del>
          </van-col>
          <van-col span="12" v-if="baseData.stores <= 10" style="text-align: right;">库存紧张</van-col>
        </van-row>
        <div class="title">{{ baseData.title }}</div>
      </div>
      <van-cell
        v-if="location_info"
        :title="'配送至 ' + location_info.province+location_info.city"
        is-link
        :value="dispatch_str"
        @click="showPopup"
      />

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
      <div v-if="baseData.desc" class="introduction" v-html="changeHtml(baseData.desc)"></div>
      <!-- 目录及其他 -->

      <div class="foldBox" v-for="(item, index) in baseData.desc_arr" :key="index"   v-if="baseData.desc_arr">
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

      <div style="height: 60px;"></div>
      <div v-if="this.isIphx" style="height: 34px;"></div>

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
    <EazyNav type="brand"></EazyNav>
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
export default {
  data() {
    return {
      shoppingcart_num: 0,
      dispatch_str: "",
      addressData: [],
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
      popupModel: false
    };
  },
  mounted() {
    this.baseData.goods_id = parseInt(this.$route.query.goods_id);
    // this.baseData.goods_id = 482;
    // 初始化省市区
    this.$getAddressData();
    // 当前页接口信息
    this.albumData();
    this.getAddressData();
  },
  methods: {
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
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);

        this.addressData = [];
        for (let i = 0; i < res.response_data.length; i++) {
          this.addressData.push(res.response_data[i]);
        }
        this.finished = true;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          localStorage.setItem("loginState", 100);
        }
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
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await CART_ADD(data);

      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.success == 1) {
          this.$toast("添加购物车成功~");
          this.shoppingcart_num++;
        }
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          this.$router.push({name: 'login'})
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
      return content.replace(/\n/g, "<br>");
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

        // 立即购买信息
        this.detail.goods_id = res.response_data.base.goods_id;
        this.detail.sku_id = res.response_data.base.goods_id;
        this.detail.count = 1;

        // 展开全部状态
        if (this.baseData.desc_arr && this.baseData.desc_arr.length > 0) {
          for (let i = 0; i < this.baseData.desc_arr.length; i++) {
            this.baseData.desc_arr[i].showAll = false;
          }
        }

        // 获取页面分享信息
        var _pageName = "goods/detail";
        var _params = JSON.stringify({ goods_id: this.$route.query.goods_id });
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);

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
    },
    // 立即购买
    buyAction() {
      this.$router.push({
        name: "orderconfirm",
        query: { detail: JSON.stringify(this.detail) }
      });
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
    }
  }
};
</script>
