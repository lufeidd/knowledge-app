<template>
  <div id="listPage" @click.stop="closeDelet">
    <van-tabs @click="tabChange" v-model="active" sticky>
      <van-tab
        :title="item.order_desc"
        v-for="(item,index) in order_nav_list"
        :key="index"
        :disabled="item.order_state == -1 ? true : false"
      >
        <div slot="default">

        </div>
        <van-list
          v-model="programLoading"
          :finished="programFinished"
          finished-text="无更多内容"
          @load="programLoad"
        >
          <div class="content">
            <div class="select-type">
              <span class="select-title" @click.stop="choose">
                {{select_goods_type}}
                <svg class="icon" aria-hidden="true" v-if="select_state">
                  <use xlink:href="#icon-unfold-line" />
                </svg>
                <svg class="icon" aria-hidden="true" v-else>
                  <use xlink:href="#icon-fold-line" />
                </svg>
              </span>
              <ul v-if="select_state">
                <li
                  v-for="(item,index) in goods_type_list"
                  :key="index"
                  @click.stop="chooseType(item,index)"
                >
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="'#icon-'+item.icon_name+'-line'" />
                  </svg>
                  <span class="type">{{item.goods_name}}</span>
                </li>
              </ul>
            </div>
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
                      <span
                        class="huoba-goods-list-label"
                        v-if="item.details[0].goods_type == 4"
                      >电子书</span>
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
                      <span
                        class="huoba-goods-list-label"
                        v-if="item.details[1].goods_type == 4"
                      >电子书</span>
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
                      <span
                        class="huoba-goods-list-label"
                        v-if="item.details[2].goods_type == 4"
                      >电子书</span>
                      <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 9">专辑</span>
                      <span class="huoba-goods-list-label" v-if="item.details[2].goods_type == 10">文件包</span>
                    </div>
                  </div>
                </div>
                <div class="huoba-goods-list-right">
                  <span class="huoba-goods-price">￥{{item.order_money.toFixed(2)}}</span>
                  <span class="huoba-goods-num">
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
                  <span class="huoba-goods-price">￥{{item.order_money.toFixed(2)}}</span>
                  <span class="huoba-goods-num">
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
                    class="delete_order"
                    v-if="item.delete_state == 1"
                    @click="delete_order(item,index)"
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
                    v-if="item.type == 2&&(item.state == 5)&&((item.if_all_send == 0 && item.send_package_nums > 0)||(item.if_all_send == 1 && item.send_package_nums > 1))"
                    @click="toPackageDetail(item)"
                  >包裹详情</button>
                  <button
                    class="huoba-btn huoba-btn-two"
                    style="margin-left:15px;"
                    v-if="item.state == 4&&item.if_comment == 0"
                    @click="toComment(item)"
                  >评价</button>
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
      </van-tab>
    </van-tabs>
    <div class="search" @click="toSearch">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-search-line" />
      </svg>
    </div>
    <!-- 快速导航 -->
    <EazyNav type="order" :isShow="true"></EazyNav>
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
      order_nav_list: [
        { order_state: 0, order_desc: "全部" },
        { order_state: 1, order_desc: "待付款" },
        { order_state: 2, order_desc: "待发货" },
        { order_state: 5, order_desc: "待收货" },
        { order_state: 4, order_desc: "已完成" },
        { order_state: 7, order_desc: "已取消" },
        { order_state: -1, order_desc: "" }
      ],
      goods_type_list: [
        { icon_name: "goods", goods_type: 3, goods_name: "实物商品" },
        { icon_name: "ebook", goods_type: 4, goods_name: "电子书" },
        { icon_name: "albumgoods", goods_type: 9, goods_name: "专辑" },
        { icon_name: "allgoods", goods_type: 0, goods_name: "全部商品" }
      ],
      select_goods_type: "全部商品",
      select_state: 0,
      active: 0,
      programLoading: false,
      programFinished: false,
      page: 1,
      page_size: 10,
      goods_list: [],
      order_state: 0,
      goods_types: 0,
      activity_list: []
    };
  },
  mounted() {},
  methods: {
    choose() {
      this.select_state ? (this.select_state = 0) : (this.select_state = 1);
    },
    chooseType(item, index) {
      this.select_state ? (this.select_state = 0) : (this.select_state = 1);
      this.select_goods_type = item.goods_name;
      this.goods_types = item.goods_type;
      this.goods_list = [];
      this.page = 1;
      this.programLoading = true; //下拉加载中
      this.programFinished = false; //下拉结束
      if (this.programLoading) {
        this.programLoad();
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
    // 搜索
    toSearch() {
      this.$router.push({
        name: "search",
        query: {
          type: "order"
        }
      });
    },
    // 标签切换
    tabChange(index, title) {
      console.log(index);
      this.active = index;
      this.select_state = 0;
      this.select_goods_type = "全部商品";
      this.goods_types = 0;
      this.goods_list = [];
      this.page = 1;
      this.order_state = this.order_nav_list[index].order_state;
      this.programLoading = true; //下拉加载中
      this.programFinished = false; //下拉结束
      if (this.programLoading) {
        this.programLoad();
      }
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
          order_id: item.order_id
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
      this.getOrderDetail(item.order_id);
    },
    // 分页加载
    programLoad() {
      this.getData();
    },
    // 获取数据
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        page: this.page,
        page_size: this.page_size,
        order_state: this.order_state,
        goods_types: this.goods_types,
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
        this.activity_list = res.response_data.activity_list;
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
            this.page = 1;
          }
        }, 1);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 删除订单
    delete_order(item, index) {
      this.$dialog
        .confirm({
          // title: "删除订单",
          message: "确定删除订单吗？\n删除后可能会影响售后服务。",
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


