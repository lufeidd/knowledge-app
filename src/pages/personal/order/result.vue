<template>
  <div id="listPage" @click.stop="closeDelet">
    <!-- <div class="nullBox" v-if="programFinished && goods_list.length == 0">
      <img src="../../../assets/null/order_null.png" width="100%" />
      <div>您搜索的内容为空</div>
    </div>-->
    <div class="result-search">
      <div class="huoba-search">
        <van-search
          v-model="searchContent"
          placeholder="请输入搜索关键词"
          show-action
          shape="round"
          @input="onCancel"
        >
          <div slot="action" @click="onCancel">取消</div>
          <div slot="left-icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-littleSearch-line" />
            </svg>
          </div>
        </van-search>
      </div>
    </div>
    <div class="nullState" v-if="programFinished && goods_list.length == 0">
      <img src="../../../assets/null/order_null.png" alt height="103px" />
      <div>亲，暂时没有订单哦~</div>
    </div>
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
      v-else
    >
      <div class="content result">
        <div style="margin-bottom:10px;" v-for="(item,index) in goods_list" :key="index">
          <!-- 公号头部 -->
          <div class="huoba-cell">
            <div class="huoba-cell-title" @click="toBrandindex(item)">
              <div class="huoba-cell-headImg">
                <div class="ratioBox">
                  <div class="box">
                    <img :src="item.brand_header_pic" alt />
                  </div>
                </div>
              </div>
              <div class="huoba-cell__title">{{item.brand_name}}</div>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-next-line" />
              </svg>
            </div>
            <div class="huoba-cell-value">{{item.state_desc}}</div>
          </div>
          <!-- 商品列表 -->
          <div
            class="huoba-goods-list huoba-goods-list-four"
            v-if="item.details.length > 1"
            @click="toDetail(item)"
          >
            <div class="huoba-goods-list-left">
              <div class="huoba-goods-list-imgs" v-if="item.details.length > 0">
                <div class="ratioBox">
                  <div class="box">
                    <img v-lazy="item.details[0].pic" alt />
                  </div>
                  <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 1">音频</span>
                  <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 2">视频</span>
                  <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 3">图书</span>
                  <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 4">电子书</span>
                  <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 9">专辑</span>
                  <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 10">文件包</span>
                </div>
              </div>
              <div class="huoba-goods-list-imgs" v-if="item.details.length > 1">
                <div class="ratioBox">
                  <div class="box">
                    <img v-lazy="item.details[1].pic" alt />
                  </div>
                  <span class="huoba-goods-list-label" v-if="item.details[1].goods_type == 1">音频</span>
                  <span class="huoba-goods-list-label" v-if="item.details[1].goods_type == 2">视频</span>
                  <span class="huoba-goods-list-label" v-if="item.details[1].goods_type == 3">图书</span>
                  <span class="huoba-goods-list-label" v-if="item.details[1].goods_type == 4">电子书</span>
                  <span class="huoba-goods-list-label" v-if="item.details[1].goods_type == 9">专辑</span>
                  <span class="huoba-goods-list-label" v-if="item.details[1].goods_type == 10">文件包</span>
                </div>
              </div>
              <div class="huoba-goods-list-imgs" v-if="item.details.length > 2">
                <div class="ratioBox">
                  <div class="box">
                    <img v-lazy="item.details[2].pic" alt />
                  </div>
                  <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 1">音频</span>
                  <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 2">视频</span>
                  <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 3">图书</span>
                  <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 4">电子书</span>
                  <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 9">专辑</span>
                  <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 10">文件包</span>
                </div>
              </div>
            </div>
            <div class="huoba-goods-list-right">
              <span class="huoba-goods-price" v-if="item.if_changed !== 1">￥{{item.order_money.toFixed(2)}}</span>
              <span class="huoba-goods-num" v-if="item.if_changed !== 1">
                <span v-if="item.goods_nums > 1">共{{item.goods_nums}}件</span>
              </span>
              <span class="huoba-goods-bag">{{item.order_send_desc}}</span>
            </div>
          </div>
          <div
            class="huoba-goods-list huoba-goods-list-three"
            v-if="item.details.length == 1"
            @click="toDetail(item)"
          >
            <div class="huoba-goods-list-left">
              <div class="ratioBox">
                <div class="box">
                  <img v-lazy="item.details[0].pic" alt />
                </div>
                <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 1">音频</span>
                <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 2">视频</span>
                <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 3">图书</span>
                <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 4">电子书</span>
                <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 9">专辑</span>
                <span class="huoba-goods-list-label" v-if="item.details[0].goods_type == 10">文件包</span>
              </div>
            </div>
            <div class="huoba-goods-list-mid">
              <span class="huoba-goods-title">
                <span class="huoba-goods-title-label" v-if="item.act_type == 2">拼团</span>
                <span>{{item.details[0].goods_name}}</span>
              </span>
            </div>
            <div class="huoba-goods-list-right">
              <span class="huoba-goods-price" v-if="item.if_changed !== 1">￥{{item.order_money.toFixed(2)}}</span>
              <span class="huoba-goods-num" v-if="item.if_changed !== 1">
                <span v-if="item.goods_nums > 1">共{{item.goods_nums}}件</span>
              </span>
              <span class="huoba-goods-bag">{{item.order_send_desc}}</span>
            </div>
          </div>
          <!-- 按钮部分 -->
          <div class="huoba-button-nav">
            <div class="huoba-button-nav-left">
              <svg
                class="icon"
                aria-hidden="true"
                @click.stop="openDelet(item,index)"
                v-if="(item.state == 4 || item.state == 7) && item.type == 2"
              >
                <use xlink:href="#icon-ellipsis-line" />
              </svg>
              <div
                class="deleteOrder"
                v-if="item.delete_state == 1"
                @click="deleteOrder(item,index)"
              >删除订单</div>
            </div>
            <div class="huoba-button-nav-right">
              <button
                class="huoba-btn huoba-btn-two"
                v-if="item.type==2&&(item.state == 5||item.state == 4)&&(item.if_all_send == 1&&item.send_package_nums == 1)"
                @click="tologistics(item)"
              >查看物流</button>
              <button
                class="huoba-btn huoba-btn-two"
                style="margin-left:15px;"
                v-if="item.state == 4&&item.if_comment == 0"
                @click="toComment(item)"
              >评价</button>
              <button
                class="huoba-btn huoba-btn-two"
                style="margin-left:15px;"
                v-if="item.type == 2&&(item.state == 5)&&((item.if_all_send == 0 && item.send_package_nums > 0)||(item.if_all_send == 1 && item.send_package_nums > 1))"
                @click="toPackageDetail(item)"
              >包裹详情</button>
              <button
                class="huoba-btn huoba-btn-two"
                style="margin-left:15px;"
                v-if="item.state == 1"
                @click="cancel(item)"
              >取消订单</button>
              <button
                class="huoba-btn huoba-btn-one"
                style="margin-left:15px;"
                v-if="item.state == 9"
                @click="toGroupDetail(item)"
              >拼团详情</button>
              <button
                class="huoba-btn huoba-btn-one"
                style="margin-left:15px;"
                v-if="item.type==2&&(item.state == 4||item.state==7||item.state==2)"
                @click="buyAgain(item)"
              >再次购买</button>
              <button
                class="huoba-btn huoba-btn-one"
                style="margin-left:15px;"
                v-if="item.type == 2&&item.state == 5"
                @click="confirmReceive(item)"
              >确认收货</button>
              <button
                class="huoba-btn huoba-btn-one"
                style="margin-left:15px;"
                v-if="item.state == 1"
                @click="toPay(item)"
              >去支付</button>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <!-- <easyNav :navData="navData"></easyNav> -->
    <!-- 快速导航 -->
    <EazyNav type="order" :isShow="true"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>


<style scoped  src="@/style/scss/pages/personal/order/list.scss" lang="scss"></style>

<script>
// import easyNav from "./../../../components/easyNav";
import {
  USER_ORDER_DETAIL_GETS,
  USER_ORDER_DETAIL_GET
} from "../../../apis/user.js";
import {
  ORDER_RECEIVE,
  ORDER_CANCEL,
  CART_ADD,
  ORDER_AGAIN,
  ORDER_DELETE
} from "../../../apis/shopping.js";
export default {
  data() {
    return {
      goods_list: [],
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10,
      type: "order",
      searchContent: "",
      number: false
    };
  },
  mounted() {
    if(this.$route.query.searchContent){
      this.searchContent = this.$route.query.searchContent;
    }else if(sessionStorage.getItem('saveSearchContent')){
      this.searchContent = sessionStorage.getItem('saveSearchContent')
    }

    if(/^\d{16}$/.test(this.searchContent)){
        this.number = true;
    }else{
    	  this.number = false;
    }
    // console.log(this.number)
  },
  methods: {
    programLoad() {
      this.getData();
    },
    onCancel() {
      this.$router.push({
        name: "search",
        query: {
          type: "order"
        }
      });
    },
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        page: this.page,
        page_size: this.page_size,
        version: "1.0",
        timestamp: tStamp
      };
      if(this.number){
        data.order_id = this.searchContent
      }else{
        data.keyword = this.searchContent
      }
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        var result = res.response_data.result;
        for (let j = 0; j < result.lenght; j++) {
          if (result[j].state == 4 || result[j].state == 7) {
            result[j].delete_state = 1;
          } else {
            result[j].delete_state = 0;
          }
        }
        setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.goods_list.push(result[i]);
          }
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
        this.programFinished = true;
      }
    },
    openDelet(item, index) {
      this.goods_list = this.goods_list.map((value, key) => {
        if (index == key) {
          value.delete_state
            ? (value.delete_state = 0)
            : (value.delete_state = 1);
        } else {
          value.delete_state = 0;
        }
        return value;
      });
    },
    closeDelet() {
      this.goods_list = this.goods_list.map((value, key) => {
        value.delete_state = 0;
        return value;
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
    // 跳转订单详情
    toDetail(item) {
      this.$router.push({
        name: "orderdetail",
        query: {
          order_id: item.order_id,
          invoice_id: item.invoice_id
        }
      });
    },
    //评价
    toComment(item, index) {
      if (item.details.length > 1) {
        this.$router.push({
          name: "ordercomment",
          query: {
            order_id: item.order_id
          }
        });
      } else if (item.details.length == 1) {
        this.$router.push({
          name: "commentpunish",
          query: {
            pic: item.details[0].pic,
            order_id: item.order_id,
            detail_id: item.details[0].detail_id
          }
        });
      }
    },
    //查看物流信息
    tologistics(item) {
      this.$router.push({
        name: "logistics",
        query: {
          order_id: item.order_id,
          express_id: item.package_info[0].id
        }
      });
    },
    //取消订单
    cancel(item) {
      console.log(item);
      this.$dialog
        .confirm({
          message: "确定取消订单吗？",
          cancelButtonText: "我再想想",
          confirmButtonText: "取消订单",
          cancelButtonColor: "#333",
          confirmButtonColor: "#999"
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
        this.$toast("已取消订单！");
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
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
    // 去支付
    toPay(item) {
      this.$router.push({
        name: "pay",
        query: { pay_id: item.pay_id }
      });
    },
    // 跳转包裹详情
    toPackageDetail(item) {
      this.$router.push({
        name: "packagedetail",
        query: {
          order_id: item.order_id
        }
      });
    },
    // 跳转拼团详情页
    toGroupDetail(item) {
      this.getOrderDetail(item.order_id)
    },
    // 删除订单
    deleteOrder(item, index) {
      this.$dialog
        .confirm({
          // title: "删除订单",
          message: "确定删除订单吗？删除后可能会影响售后服务。",
          cancelButtonText: "我再想想",
          confirmButtonText: "删除订单",
          cancelButtonColor: "#333",
          confirmButtonColor: "#999"
        })
        .then(() => {
          this.delete(item.order_id, index);
        })
        .catch(() => {
          // on cancel
        });
    },
    async delete(order_id, index) {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_DELETE(data);
      if (res.hasOwnProperty("response_code")) {
        this.$toast("删除订单成功");
        this.goods_list = this.goods_list.filter((value, key) => {
          return index != key;
        });
      } else {
        this.$toast(res.error_message);
      }
    },
    async getOrderDetail(order_id) {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.$router.push({
          name: "groupdetail",
          query: {
            open_id: res.response_data.groupbuy_info.open_id
          }
        });
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>


