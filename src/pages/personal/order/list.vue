<template>
  <div id="listPage">
    <div class="nullBox" v-if="programFinished && publishData.length == 0 && goodsData.length == 0">
      <img src="../../../assets/null/list.png" width="100%" />
      <div>您的订单列表为空</div>
    </div>

    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      v-else
    >
      <!-- 实物商品-->
      <div v-if="goodsData.length > 0">
        <div class="content" v-for="(item,index) in goodsData" :key="index">
          <div class="head" @click="toBrandindex(item)">
            <div class="titleFrom">
              <div class="ratiobox">
                <a class="bookImg" v-lazy:background-image="item.brand_header_pic"></a>
              </div>
              <span class="publish">{{item.brand_name}}</span>
            </div>
            <span
              :class="(item.state == 4 || item.state == 7) ? 'order2':'order1'"
            >{{item.state_desc}}</span>
          </div>
          <div class="section">
            <div class="bookDetail" v-if="item.details.length == 1" @click="toDetail(item)">
              <div class="ratiobox">
                <a class="bookImg" v-lazy:background-image="item.details[0].pic"></a>
              </div>
              <span class="title">{{item.details[0].goods_name}}</span>
            </div>
            <swiper
              @click="toDetail(item)"
              class="swiperTags"
              :options="swiperOption"
              ref="mySwiper"
              v-else
            >
              <swiper-slide v-for="(item1,index) in item.details" :key="'swiper-'+index">
                <div class="ratiobox">
                  <a class="bookImg" v-lazy:background-image="item1.pic"></a>
                </div>
              </swiper-slide>
            </swiper>
            <div class="tip1">
              <span class="actulPay">
                共{{item.goods_nums}}件商品
                {{item.state == 1? '待付款:':'实付款:'}}
                <span class="money">￥{{item.order_money}}</span>
              </span>
            </div>
          </div>
          <div class="footFinish">
            <div>
              <span
                class="button button1"
                @click="repply(item)"
                v-if="item.invoice_id == 0 && item.state == 4"
              >申请发票</span>
            </div>
            <div>
              <span class="button button1" @click="cancel(item)" v-if="item.state == 1">取消订单</span>
              <span class="button button2" @click="toPay(item)" v-if="item.state == 1">去支付</span>
              <span
                class="button button2"
                @click="toComment(item,index)"
                v-if="item.state == 4&&item.if_comment == 0"
              >评价</span>
              <span
                class="button button1"
                @click="buyAgain(item)"
                v-if="item.state == 4||item.state==7"
              >再次购买</span>
              <span
                class="button button2"
                @click="confirmReceive(item)"
                v-if="item.state == 3||item.state == 5"
              >确认收货</span>
              <span
                class="button button1"
                @click="tologistics(item)"
                v-if="item.state == 2||item.state == 5"
              >查看物流</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 虚拟商品 -->
      <div class="content" v-for="(item,index) in publishData" :key="index">
        <div class="head" @click="toBrandindex(item)">
          <div class="titleFrom">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="item.brand_header_pic"></a>
            </div>
            <span class="publish">{{item.brand_name}}</span>
          </div>
          <span :class="item.state == 0? 'order1':'order2'">{{item.state_desc}}</span>
        </div>
        <div class="section" v-for="item1 in item.details" @click="toDetail(item)">
          <div class="bookDetail">
            <div class="ratiobox">
              <a class="bookImg" v-lazy:background-image="item1.pic"></a>
            </div>
            <span class="title">{{item1.goods_name}}</span>
          </div>
          <div class="tip2">
            <span class="noChange">虚拟内容不退不换</span>
            <span class="actulPay">
              实付款：
              <span class="money">￥{{item1.real_price}}</span>
            </span>
          </div>
        </div>
        <div class="foot">
          <div>
            <span class="button button1" @click="repply(item)" v-if="item.invoice_id == 0">申请发票</span>
          </div>
          <div>
            <span
              class="button button2"
              @click="toComment(item,index)"
              v-if="item.if_comment == 0"
            >评价</span>
            <!-- <span class="button1" v-if="item.state ==1">再次购买</span> -->
            <!-- <span class="button2" >去支付</span> -->
            <!-- <span class="button2" v-if="item.state ==0">确认收货</span> -->
          </div>
        </div>
      </div>
    </van-list>

    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="order"></EazyNav>
  </div>
</template>

<style scoped  src="@/style/scss/pages/personal/order/list.scss" lang="scss"></style>

<script>
// import easyNav from "./../../../components/easyNav";
import { USER_ORDER_DETAIL_GETS } from "../../../apis/user.js";
import {
  ORDER_RECEIVE,
  ORDER_CANCEL,
  CART_ADD,
  ORDER_AGAIN
} from "../../../apis/shopping.js";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: true,
      //   searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "order"
      // },
      publishData: [],
      goodsData: [],
      state: { evaluate: true, isPay: true, rePurchase: true, confirm: true },
      swiperOption: {
        slidesPerView: 5.3
      },
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10,
      order_id: ""
    };
  },
  mounted() {
    // this.getData();
    // console.log(brandId);
  },
  methods: {
    programLoad() {
      this.getData();
    },
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        // order_id:1905062000270095,
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GETS(data);
      if (
        res.hasOwnProperty("response_code") &&
        res.response_data.hasOwnProperty("result")
      ) {
        var result = res.response_data.result;

        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);

        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].type == 1) {
              this.publishData.push(result[i]);
            } else {
              this.goodsData.push(result[i]);
            }
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        }, 500);
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          localStorage.setItem("loginState", 100);
        }

        this.$toast(res.error_message);
      }
    },
    toDetail(item) {
      this.$router.push({
        name: "orderdetail",
        query: {
          order_id: item.order_id,
          invoice_id: item.invoice_id
        }
      });
    },
    //申请发票
    repply(item) {
      // console.log(item);
      this.$router.push({
        name: "orderinvoice",
        query: {
          order_id: item.order_id,
          money: item.order_money
        }
      });
    },
    //跳转公号主页
    toBrandindex(item) {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: item.brand_id
        }
      });
    },
    //评价
    toComment(item, index) {
      console.log(item);
      // console.log(item.details[index].detail_id);
      // return;
      this.$router.push({
        name: "ordercomment",
        query: {
          order_id: item.order_id
        }
      });
    },
    //查看物流信息
    tologistics(item) {
      this.$router.push({
        name: "logistics",
        query: {
          order_id: item.order_id
        }
      });
    },
    //确认收货
    confirmReceive(item) {
      this.$dialog
        .confirm({
          message: "确认收货？"
        })
        .then(() => {
          this.orderReceive(item.order_id);
        })
        .catch(() => {
          // on cancel
        });
    },
    async orderReceive(order_id) {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: order_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_RECEIVE(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("确认收货成功！");
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    },
    //取消订单
    cancel(item) {
      console.log(item);
      this.$dialog
        .confirm({
          message: "确认取消订单？"
        })
        .then(() => {
          this.cancelOrder(item.order_id);
        })
        .catch(() => {
          // on cancel
        });
    },
    async cancelOrder(order_id) {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: order_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_CANCEL(data);

      if (res.hasOwnProperty("response_code")) {
        // this.page = 1;
        // this.publishData = [];
        // this.goodsData = [];
        // this.getData();
        this.$toast("已取消订单！");
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    },
    // 去支付
    toPay(item) {
      this.$router.push({
        name: "pay",
        query: { pay_id: item.pay_id }
      });
    },
    //获取再次购买信息
    async getAgainData(order_id) {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_AGAIN(data);

      if (res.hasOwnProperty("response_code")) {
        this.detail_ids = res.response_data.detail_ids;
        this.$router.push({ name: "cart" });
      } else {
        this.$toast(res.error_message);
      }
    },
    //再次购买
    buyAgain(item) {
      this.getAgainData(item.order_id);
    }
  }
};
</script>


