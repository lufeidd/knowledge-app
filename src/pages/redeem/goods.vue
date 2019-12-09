<template>
  <div id="redeemGoodsPage">
    <van-list
      v-model="goodsLoading"
      :finished="goodsFinished"
      finished-text="没有更多了"
      @load="goodsLoad"
    >
      <div
        class="goods_wrapper"
        v-for="item in goodsList"
        :key="item.id"
        :title="item"
      >
        <div class="goods_intro">
          <!--<img src="" alt="" width="80" height="80">-->
          <!--<div class="picture" v-lazy:background-image="item.pic[0]"></div>-->
          <div class="content">
            <h3 class="title">{{item.title}}</h3>
            <p class="sub_title">{{item.sub_title}}</p>
            <p class="price">￥{{item.price}}</p>
            <van-button class="redeem_btn" type="primary" color="#F05654" @click="goodsRedeem(item)">免费兑换</van-button>
          </div>
        </div>
        <div class="goods_detail">{{item.content}}</div>
      </div>
    </van-list>
    <div class="rule">
      <p>{{goodsDetail.description}}</p>
    </div>
    <!-- 点击获取地址显示的弹层 -->
    <van-popup v-model="addressShowPopup" class="addressPopup">
      <svg class="icon close" aria-hidden="true" @click="addressClose">
        <use xlink:href="#icon-close-line" />
      </svg>
      <div class="addressBox">
        <div v-for="(Item,index) in addressData" :key="index">
          <div class="addressMember">
            <div
              class="default"
              @click="editAction(Item.address_id)"
              :class="{ active: Item.is_default == 1 }"
            >
              <svg class="icon" aria-hidden="true" v-if="Item.is_default == 1">
                <use xlink:href="#icon-checked-block" />
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-uncheck-line" />
              </svg>
            </div>
            <div class="title">{{ Item.consignee }}/{{ Item.mobile }}/{{ Item.province }}{{ Item.city }}{{ Item.county }}{{ Item.address }}</div>
          </div>
        </div>
      </div>
      <div class="button">
        <div class="addButton">
          <van-button type="default" @click="addAddress">新建收货地址</van-button>
        </div>
        <div class="define" v-if="addressData.length">
          <van-button type="primary" color="#F05654" @click="sureRedeem">确认兑换</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { USER_ADDRESS_EDIT , USER_ADDRESS_LIST } from "@/apis/user.js";
  import {REDEEM_GOODS} from "@/apis/redeem";

  export default {
    name: "goods",
    data() {
      return {
        code: '',
        goodsDetail: {},
        goodsList: [
          // {
          //   id: '1',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '2',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '3',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '4',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '5',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '6',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // }
        ],
        goodsLoading: false,
        goodsFinished: false,
        addressShowPopup: false,
        addressData: [],
        addressId: 0,
        percentGoods: {}
      };
    },
    methods: {
      goodsLoad() {
        setTimeout(() => {
          let list = this.goodsDetail.goods_list;
          for (let i = 0; i < list.length; i++) {
            this.goodsList.push(list[i]);
          }
          // 加载状态结束
          this.goodsLoading = false;

          // 数据全部加载完成
          if (this.goodsList.length >= list.length) {
            this.goodsFinished = true;
          }
        }, 500);
      },
      goodsRedeem(item) {
        if (item != undefined) {
          this.percentGoods = item;
        }
        // console.log(this.percentGoods);
        // console.log(this.goodsDetail);
        if (false) { // 测试 未登录
          this.$router.push({name: 'redeemLogin', params: {goodsItem: JSON.stringify(item)}});
        } else if (this.goodsDetail.goods_type == 3) {  // 商品类型是实物
          this.getAddressData();
          this.addressShowPopup = true;
        } else {
          this.submitRedeem();
        }
      },


      addressClose () {
        this.addressShowPopup = false;
      },
      // 新增收货地址
      addAddress () {
        this.$router.push({ name: "address", query: { pageType: "add" } });
      },
      // 获取我的收货地址信息
      async getAddressData () {
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
            if (res.response_data[i].is_default == 1) {
              this.addressId = res.response_data[i].address_id;
            }
            this.addressData.push(res.response_data[i]);
          }
          this.addressShowPopup = true;
        } else {
          if (res.hasOwnProperty("error_code") && res.error_code == 100) {
            // store 设置登录状态
            this.$store.commit("changeLoginState", 100);
            localStorage.setItem("loginState", 100);
          }
          this.$toast(res.error_message);
        }
      },
      //确认兑换
      async sureRedeem () {
        for (let i = 0; i < this.addressData.length; i++) {
          if (this.addressData[i].is_default == 1) {
            this.submitRedeem();
            return false;
          }
        }
        this.$dialog.alert({
          message: '请选择地址'
        });
      },
      // 修改当前地址
      async editAddress (addressId, key) {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          address_id: addressId,
          is_default: 1,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await USER_ADDRESS_EDIT(data);
        if (res.hasOwnProperty("response_code")) {
          this.getAddressData();
          // // 从订单确认页面进入的获取地址需要主动回退
          // if(this.$route.query.type && this.$route.query.type == 'confirm') {
          //   this.$router.go(-1);
          // }
        } else {
          this.$toast(res.error_message);
        }
      },
      editAction(address_id, key) {
        this.editAddress(address_id, key);
      },
      async submitRedeem() {
        let data = {
          redeem_id: this.goodsDetail.redeem_id,
          goods_id: this.percentGoods.goods_id,
          address_id: this.addressId,
          code: this.code,
          version: "1.0"
        };
        let res = await REDEEM_GOODS(data);
        if (res.hasOwnProperty("response_code")) {
          // console.log(res);
          if (false) { // APP
            this.$router.push({name: 'appSuccess', query: {goodsName: this.percentGoods.title}});
          } else {
            this.$router.push({name: 'wapSuccess', query: {goodsName: this.percentGoods.title}});
          }
        } else {
          this.$router.push({name: 'fail', query: {errorMsg: res.error_message}});
        }
      }
    },
    created() {
      this.goodsDetail = JSON.parse(this.$route.params.goodsDetail);
      this.code = this.$route.params.code;
    }
  }
</script>

<style src="@/style/scss/pages/redeem/goods.scss" lang="scss">

</style>
