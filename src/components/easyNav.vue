<template>
  <div v-if="isShow" id="easyNav">
    <div class="button" @click="foldAction">
      <svg class="icon" aria-hidden="true" v-if="navData.fold">
        <use xlink:href="#icon-more-line" />
      </svg>
      <svg class="icon" aria-hidden="true" v-else>
        <use xlink:href="#icon-open-line" />
      </svg>
      <div>
        快速
        <br />导航
      </div>
    </div>
    <div class="route" v-if="navData.fold">
      <div @click="gotoLink('origin')" class="link" v-if="navData.origin">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-home-line" />
        </svg>
        <div>来源</div>
      </div>
      <div @click="gotoLink('home')" class="link" v-if="navData.home">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-home-line" />
        </svg>
        <div>首页</div>
      </div>
      <!-- 公号首页 -->
      <router-link
        v-if="type == 'brand' && navData.search"
        :to="{path:navData.searchLink,query:{type:type}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>
      <!-- 我的订单 -->
      <router-link
        v-if="type == 'order' && navData.search"
        :to="{path:navData.searchLink,query:{type:type}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>
      <!-- 优惠券 -->
      <router-link
        v-if="type == 'coupon' && navData.search"
        :to="{path:navData.searchLink,query:{type:type,ticket_id:$route.query.ticket_id}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>
      <!-- 商城首页 -->
      <router-link
        v-if="type == 'mall' && navData.search"
        :to="{path:navData.searchLink,query:{type:type, supplier_id: $route.query.supplier_id}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>
      <!-- 首页 -->
      <router-link
        v-if="type == 'index' && navData.search"
        :to="{path:navData.searchLink,query:{type:type}}"
        class="link"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-littleSearch-line" />
        </svg>
        <div>搜索</div>
      </router-link>
      <!-- 购物车 -->
      <router-link :to="navData.cartLink" class="link" v-if="navData.cart&&is_Login">
        <div class="cart_buy">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gouwuche" />
          </svg>
          <span class="cart_num" v-if="navData.goods_nums">{{navData.goods_nums}}</span>
          <div>购物车</div>
        </div>
      </router-link>
      <router-link :to="navData.loginLink" class="link" v-else>
        <div class="cart_buy">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gouwuche" />
          </svg>
          <span class="cart_num" v-if="navData.goods_nums">{{navData.goods_nums}}</span>
          <div>购物车</div>
        </div>
      </router-link>
      <!-- 我的 -->
      <router-link :to="navData.personalLink" class="link" v-if="navData.personal">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-personal-line" />
        </svg>
        <div>我的</div>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
#easyNav {
  @include position(fixed, "br", 100px, 0, null, 60px, null);
  @include displayFlex(flex, center, center);
  z-index: 101;

  & .button {
    background-color: rgba(0, 0, 0, 0.6);
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    padding: 4px 6px 4px 6px;
    line-height: 1.4;
    @include font(null, $fontSize - 2, $white);
    @include displayFlex(flex, center, center);

    & .icon {
      margin-right: 5px;
    }
  }

  & .route {
    border: 1px #dfdfdf solid;
    border-width: 1px 0 1px 1px;
    padding: 10px 0;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    text-align: center;
    background-color: $white;
    z-index: 1;
    @include displayFlex(flex, center, center);

    & .link {
      @include font(null, $fontSize - 2, #333);
      padding: 0 10px;

      & .icon {
        width: 16px;
        height: 16px;
      }
    }
  }
  & .cart_buy {
    position: relative;
    & .cart_num {
      display: inline-block;
      font-size: 12px;
      padding: 0 3px;
      color: #fff;
      background-color: $redLight;
      position: absolute;
      right: 0;
      top: -8px;
      box-sizing: border-box;
      border-radius: 16px;
      line-height: 14px;
      min-width: 16px;
      text-align: center;
    }
  }
}
</style>

<script>
// vue无刷新修改url参数
import merge from "webpack-merge";
import { CART_INFO } from "../apis/shopping";
import { USER_HOMEPAGE } from "../apis/user";
export default {
  // name: "easyNav",
  props: ["type", "isShow"],
  data() {
    return {
      navData: {
        fold: false,
        origin: true,
        originLink: "/brand/index",
        home: true,
        homeLink: "/brand/index",
        search: true,
        searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        cart: true,
        cartLink: "/cart",
        type: "brand",
        loginLink: "/login/index",
        goods_nums: 0
      },
      is_Login: null
    };
  },
  mounted() {
    // home_id记录来源公号
    if (localStorage.getItem("home_id")) {
      this.navData.origin = true;
    } else {
      this.navData.origin = false;
    }
    if (this.type === undefined) {
      this.type = this.navData.type;
    }
    this.isLogin();
  },
  destroyed () {
    this.navData.fold = false;
  },
  methods: {
    gotoLink(_type) {
      var brand_id;
      // 来源公号
      if (_type == "origin") {
        // 进入来源公号
        sessionStorage.setItem("pagefrom", "origin");
        console.log(123)

        if (localStorage.getItem("home_id")) {
          brand_id = localStorage.getItem("home_id");
        } else {
          this.$toast("来源公号不存在！");
          return;
        }
      }
      // 当前公号
      if (_type == "home") {
        if (localStorage.getItem("home_id")) {
          brand_id = localStorage.getItem("brand_id");
        } else {
          this.$toast("公号不存在！");
          return;
        }
      }
      this.$router.replace({
        name: "brand",
        query: { brand_id: brand_id }
      });
      location.reload();
    },
    foldAction() {
      this.navData.fold = !this.navData.fold;
    },
    async isLogin() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_HOMEPAGE(data);

      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.hasOwnProperty("is_login")) {
          this.is_Login = res.response_data.is_login;
          localStorage.setItem("loginState", res.response_data.is_login);
        }
        if (res.response_data.is_login == 1) {
          this.cartData();
        }
      } else {
        localStorage.setItem("loginState", 0);
        this.$toast(res.error_message);
      }
    },
    // 获取购物车信息
    async cartData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await CART_INFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.navData.goods_nums = res.response_data.goods_nums;
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

