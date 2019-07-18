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
      <van-cell title="配送至 西湖区" is-link value="运费8元，满99包邮" @click="showPopup" />

      <!-- 出版信息 -->
      <div class="introduction">
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
      <div class="introduction" v-for="(item, index) in baseData.desc_arr" :key="index">
        <div class="text">
          <span class="verticleLine"></span>
          <span class="lh">{{ item.name }}</span>
        </div>
        <template v-if="item.showAll">
          <div class="detail" v-html="changeHtml(item.val)"></div>
        </template>
        <template v-else>
          <div class="detail" style="height: 35px;overflow: hidden;" v-html="changeHtml(item.val)"></div>
          <div class="action" @click="showAllAction(index)">展开全部</div>
        </template>
      </div>

      <div style="height: 60px;"></div>
      <div v-if="this.isIphx" style="height: 34px;"></div>

      <van-goods-action>
        <van-goods-action-mini-btn info="5" icon="cart-o" text="购物车" @click="toCart" />
        <van-goods-action-big-btn text="加入购物车" @click="addToCart" />
        <van-goods-action-big-btn primary text="立即购买" @click="buyAction" />
      </van-goods-action>

      <van-popup v-model="popupModel" position="bottom" @open="onOpen">
        <div class="audioList">
          <!-- 地址列表 -->
          <template v-if="!areaShow">
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
                v-for="(item, key) in audioListData.albums"
                :key="key"
                :class="{ active: activeIndex == key }"
                @click="onChoose(key)"
              >
                <div class="img">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-location-line" />
                  </svg>
                </div>

                <div class="info">
                  <div class="album">dfgdf</div>
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
    </div>
    <EazyNav type="brand"></EazyNav>
    <Loading></Loading>
  </div>
</template>

<style src="@/style/scss/pages/detail.scss" scoped lang="scss"></style>
<style>
@import url("./../style/scss/components/dateTimePicker.scss");
</style>

<script>
//  引入接口
import { ALBUM } from "../apis/album.js";
import { CART_ADD, ORDER_PHYSICAL_ADDINFO } from "../apis/shopping.js";
export default {
  data() {
    return {
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
      audioListData: {
        albums: [
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          },
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          },
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          }
        ]
      },
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
  },
  methods: {
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
        }
      } else {
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

      console.log("商品基础信息:", res.response_data);
    },
    showArea() {
      this.areaShow = true;
    },
    onChoose(key) {
      console.log(key);
      this.activeIndex = key;
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
    onConfirm() {
      this.popupModel = false;
      this.areaShow = false;
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
