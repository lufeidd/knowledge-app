<template>
  <div id="redeemGoodsPage" :style="{'background-color':goodsDetail.colour.bg?goodsDetail.colour.bg:''}" v-show="pageShow">
    <div v-if="!remindPopShow">
      <!-- <van-list
     v-model="goodsLoading"
     :finished="goodsFinished"
     finished-text="没有更多了"
     @load="goodsLoad"
   > -->
      <div class="propaganda" v-if="goodsDetail.pic">
        <img :src="goodsDetail.pic" alt="" width="100%">
      </div>
      <div
        class="goods_wrapper"
        v-for="item in goodsList"
        :key="item.id"
        :title="item"
      >
        <div class="goods_intro">
          <!--<img src="" alt="" width="80" height="80">-->
          <div class="picture" v-lazy:background-image="item.pic">
            <div class="nothing_left" v-if="item.state == 0">
              <p class="text">已领完</p>
            </div>
          </div>
          <div class="content">
            <h3 class="title">{{item.title}}</h3>
            <p class="sub_title">{{item.sub_title}}</p>
            <p class="price">
              ￥{{item.price}}
              <van-button class="redeem_btn" type="primary" disabled style="background:#F05654;border: 1px solid #F05654;" v-if="item.state == 0">免费兑换
              </van-button>
              <van-button class="redeem_btn" type="primary" style="background:#F05654;border: 1px solid #F05654;" @click="goodsRedeem(item)" v-else>免费兑换
              </van-button>
            </p>
          </div>
        </div>
        <!--<div class="goods_detail">{{item.contents}}</div>-->
      </div>
      <!-- </van-list> -->
      <div class="rule">
        <p :style="{'color':goodsDetail.colour.text?goodsDetail.colour.text:''}" v-html="goodsDetail.description"></p>
      </div>
      <!-- 点击获取地址显示的弹层 -->
      <van-popup v-model="addressShowPopup" class="addressPopup">
        <svg class="icon close" aria-hidden="true" @click="addressClose">
          <use xlink:href="#icon-close-line"/>
        </svg>
        <div class="addressBox">
          <div v-for="(Item,index) in addressData" :key="index">
            <div class="addressMember">
              <div
                class="default"
                @click="editAction(Item.address_id,index)"
                :class="{ active: Item.is_default == 1 }"
              >
                <svg class="icon" aria-hidden="true" v-if="Item.is_default == 1">
                  <use xlink:href="#icon-checked-block"/>
                </svg>
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-uncheck-line"/>
                </svg>
              </div>
              <div class="title">{{ Item.consignee }}/{{ Item.mobile }}/{{ Item.province }}{{ Item.city }}{{ Item.county
                }}{{ Item.address }}
              </div>
            </div>
          </div>
        </div>
        <div class="button">
          <div class="addButton">
            <van-button type="default" @click="addAddress">新建收货地址</van-button>
          </div>
          <div class="define" v-if="addressData.length">
            <van-button type="primary" style="background:#F05654;border: 1px solid #F05654;" @click="sureRedeem">确认兑换</van-button>
          </div>
        </div>
      </van-popup>
    </div>
    <van-popup class="limit_info" v-model="remindPopShow">
      <h4 class="limit_title">此活动仅限受邀用户参加</h4>
      <div class="limit_img"></div>
      <p class="limit_remind"><span>{{time}}</span>秒后回到个人中心</p>
    </van-popup>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<script>
  import easyNav from "@/components/easyNav";
  import {USER_ADDRESS_EDIT, USER_ADDRESS_LIST} from "@/apis/user.js";
  import {REDEEM_ITEM_GET, REDEEM_GOODS} from "@/apis/redeem.js";

  export default {
    name: "goods",
    data() {
      return {
        code: '0',
        redeem: '',
        secShare: '',
        remindPopShow: false,
        time: 3,
        goodsDetail: {
          colour:{bg:'',text:''}
        },
        goodsList: [],
        // goodsLoading: false,
        // goodsFinished: false,
        addressShowPopup: false,
        addressData: [],
        addressId: 0,
        percentGoods: {},
        popFlag: false,
        pageShow: true
      };
    },
    methods: {
      async getGoodsDetail() {
        let data = {
          code: this.code,
          redeem_id: this.redeem,
          access: 1,
          encrypt: 1,
          is_captcha: 1,
          version: "1.0"
        };
        // console.log(data);
        let res = await REDEEM_ITEM_GET(data);
        // console.log(res);
        if (res.hasOwnProperty("response_code")) {
          this.goodsDetail = res.response_data;
          this.secShare = res.response_data.sec_share;
          this.visitPage();
          this.goodsDetail.colour = JSON.parse(this.goodsDetail.colour);
          document.title = this.goodsDetail.page_title?this.goodsDetail.page_title:'火把知识'
          // console.log(this.goodsDetail.colour.bg)
        }

        let list = this.goodsDetail.goods_list;
        // console.log(list);
        list.forEach((item) => {
          if (item.goods_num == item.used_num) {
            item.state = 0; // 已领完
          }
        });
        this.goodsList = [];
        //  加载
        for (let i = 0; i < list.length; i++) {
          this.goodsList.push(list[i]);
        }
        // 加载状态结束
        // this.goodsLoading = false;

        // 数据全部加载完成
        if (this.goodsList.length >= list.length) {
          // this.goodsFinished = true;
        }
      },
      goodsRedeem(item) {
        if (item != undefined) {
          this.percentGoods = item;
          sessionStorage.setItem("goodsItem", JSON.stringify(item));
          sessionStorage.setItem("goodsType", "goods");
        }
        // console.log(this.percentGoods);
        // console.log(this.goodsDetail);
        this.submitRedeem();
      },


      addressClose() {
        this.addressShowPopup = false;
      },
      // 新增收货地址
      addAddress() {
        this.$router.push({name: "address", query: {pageType: "add"}});
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
            if (res.response_data[i].is_default == 1) {
              this.addressId = res.response_data[i].address_id;
            }
            this.addressData.push(res.response_data[i]);
          }
          this.addressShowPopup = true;
        } else {
          // this.$toast(res.error_message);
          if (localStorage.getItem("unionid")) {
          // if (true) {
            this.$router.push({name: 'redeemLogin'});
          } else {
            this.$router.push({name: 'login'});
          }
        }
      },
      //确认兑换
      async sureRedeem() {
        for (let i = 0; i < this.addressData.length; i++) {
          if (this.addressData[i].is_default == 1) {
            this.popFlag = true;
            this.submitRedeem();
            return false;
          }
        }
        this.$dialog.alert({
          message: '请选择地址'
        });
      },
      // 修改当前地址
      async editAddress(addressId, key) {
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
        let res;
        if (this.goodsDetail.goods_type == 3 && localStorage.getItem("loginState") == 1) {
          if (!this.popFlag) {
            this.getAddressData();
            this.addressShowPopup = true;
            return false;
          } else {
            let data = {
              address_id: this.addressId,
              redeem_id: this.goodsDetail.redeem_id,
              goods_id: this.percentGoods.goods_id,
              code: this.code,
              version: "1.0"
            };
            res = await REDEEM_GOODS(data);
          }
        } else{
          let data = {
            redeem_id: this.goodsDetail.redeem_id,
            goods_id: this.percentGoods.goods_id,
            code: this.code,
            version: "1.0"
          };
          res = await REDEEM_GOODS(data);
        }
        if (res.error_code == 100) { // 未登录

          // if (true) {
          if (localStorage.getItem("unionid")) {
            this.$router.push({name: 'redeemLogin'});
          } else {
            this.$router.push({name: 'login'});
          }

        } else if (res.hasOwnProperty("response_code")) {
            // console.log(res);
            let data = res.response_data;
            if (this.isApp()) { // APP
              this.$router.push({name: 'appSuccess', query: {goodsName: this.percentGoods.title, resData: data, goodsNameType: 'goods'}});
            } else {  //  WAP
              this.$router.push({name: 'wapSuccess', query: {goodsName: this.percentGoods.title, goodsNameType: 'goods'}});
            }
          } else {
            if (this.isApp()) { // APP
              this.$router.push({name: 'appFail', query: {errorMsg: res.error_message}});
            } else {  //  WAP
              this.$router.push({name: 'wapFail', query: {errorMsg: res.error_message}});
            }
          }
      },
      // 是否是APP
      isApp() {
        if (localStorage.getItem("isHuobaIosLogin") == "yes" || localStorage.getItem("isHuobaAndroidLogin") == "yes") {
          return true;
        } else {
          return false;
        }
      },
      visitPage() {
        if (this.secShare == 0 &&  localStorage.getItem('originLink') != 1) { // 不可二次分享
          this.remindPopShow = true;
          const timer = setInterval(() => {
            this.time--;
            if (this.time == 0) {
              this.remindPopShow = false;
              clearInterval(timer);
              this.$router.push({name: 'personalIndex'});
            }
          }, 1000);
        }
      }
    },
    created() {
      this.code = this.$route.query.code;
      this.redeem = decodeURI(this.$route.query.redeem_id).replace(/\s/g, '+');
      localStorage.setItem('hash', window.location.hash);
    },
    mounted() {
      let _this = this;
      this.getGoodsDetail().then(function () {
        if (sessionStorage.getItem('fromRedeemLogin') == '1') {
          if (_this.goodsDetail.goods_type != 3 ) { // 非实物商品
            _this.pageShow = false;
          }
          _this.popFlag = false;
          console.log('goodsItem',JSON.parse(sessionStorage.getItem('goodsItem')));
          _this.goodsRedeem(JSON.parse(sessionStorage.getItem('goodsItem')));
          sessionStorage.setItem('fromRedeemLogin', '0');
        }
      });
    },
  }
</script>

<style src="@/style/scss/pages/redeem/goods.scss" lang="scss">

</style>
