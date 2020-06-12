<template>
  <div id="detailPage">
    <div class="container">
      <!-- 顶部状态 -->
      <div class="content" v-if="infoData.state == 1 || infoData.state == 5">
        <div class="huoba-cell huoba-cell-four">
          <div class="huoba-cell-left">
            <svg class="icon" aria-hidden="true" v-if="infoData.state == 1">
              <use xlink:href="#icon-daizhifu" />
            </svg>
            <svg class="icon" aria-hidden="true" v-if="infoData.state == 5">
              <use xlink:href="#icon-tobereceive-line" />
            </svg>
          </div>
          <div class="huoba-cell-mid">
            <div v-if="infoData.state == 1">
              需付款:￥
              <span class="huoba-cell-money">{{infoData.order_money.toFixed(2)}}</span>
            </div>
            <div class="huoba-cell-state" v-if="infoData.state == 5">待收货</div>
            <div class="huoba-cell-paytime" v-if="infoData.state == 1">
              <span>支付剩余时间：</span>
              <span class="huoba-cell-time">{{timeH}}</span>:
              <span class="huoba-cell-time">{{timeM}}</span>:
              <span class="huoba-cell-time">{{timeS}}</span>
            </div>
            <div class="huoba-cell-paytime" v-if="infoData.state == 5">
              <span>剩余{{receive_time}}自动确认收货</span>
            </div>
          </div>
          <div class="huoba-cell-right">
            <span class="huoba-cell-gopay" @click="toPaid" v-if="infoData.state == 1">去支付</span>
            <span class="huoba-cell-gopay" @click="confirmReceive" v-if="infoData.state == 5">确认收货</span>
          </div>
        </div>
      </div>
      <!-- 其他状态 -->
      <div class="content" v-else>
        <div class="huoba-cell huoba-cell-four other">
          <div class="huoba-cell-left">
            <!-- 待发货 -->
            <svg class="icon" aria-hidden="true" v-if="infoData.state == 2">
              <use xlink:href="#icon-daifahuo" />
            </svg>
            <span class="huoba-cell-state" v-if="infoData.state == 2">待发货</span>
            <!-- 已完成 -->
            <svg class="icon" aria-hidden="true" v-if="infoData.state == 4">
              <use xlink:href="#icon-successed-line" />
            </svg>
            <span class="huoba-cell-state" v-if="infoData.state == 4">已完成</span>
            <!-- 已取消 -->
            <svg class="icon" aria-hidden="true" v-if="infoData.state == 7">
              <use xlink:href="#icon-quxiaodingdan" />
            </svg>
            <span class="huoba-cell-state" v-if="infoData.state == 7">订单已取消</span>
            <!-- 待成团 -->
            <svg class="icon" aria-hidden="true" v-if="infoData.state == 9">
              <use xlink:href="#icon-tobegroup-line" />
            </svg>
            <span class="huoba-cell-state" v-if="infoData.state == 9">待成团</span>
          </div>
          <div class="huoba-cell-mid"></div>
          <div class="huoba-cell-right">
            <!-- <span class="huoba-cell-gopay">去支付</span> -->
          </div>
        </div>
      </div>
      <!-- 物流信息 -->
      <div
        class="content"
        @click="tologistics"
        v-if="infoData.type == 2 &&(infoData.if_all_send == 1&& infoData.send_package_nums == 1)"
      >
        <div class="huoba-cell huoba-cell-three">
          <div class="huoba-cell-left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-logtic-block" />
            </svg>
          </div>
          <div class="huoba-cell-mid">
            <div class="huoba-cell-logticinfo">
              <span>{{infoData.express_info.desc}}</span>
            </div>
            <div class="huoba-cell-timeinfo">{{infoData.express_info.time}}</div>
          </div>
          <div class="huoba-cell-right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </div>
      </div>
      <!-- 多包裹 -->
      <div
        class="content"
        v-if="infoData.type == 2 &&((infoData.if_all_send == 0 && infoData.send_package_nums > 0)||(infoData.if_all_send == 1 && infoData.send_package_nums > 1))"
      >
        <div class="huoba-cell huoba-cell-three" @click="packageDetail">
          <div class="huoba-cell-left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-logtic-block" />
            </svg>
          </div>
          <div class="huoba-cell-mid">
            <div class="huoba-cell-logticinfo">
              <span>此订单已分拆为{{infoData.if_all_send == 1?infoData.send_package_nums:'多'}}个包裹，{{infoData.if_all_send == 1?'':'部分已发出'}}点击可查看详情</span>
            </div>
            <div class="huoba-cell-timeinfo">2019-2-13 20:34:34</div>
          </div>
          <div class="huoba-cell-right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </div>
      </div>
      <!-- 地址 -->
      <div class="content" v-if="infoData.type == 2">
        <div class="huoba-cell huoba-cell-three">
          <div class="huoba-cell-left">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-address-block" />
            </svg>
          </div>
          <div class="huoba-cell-mid">
            <div class="huoba-cell-info">
              <span class="huoba-cell-name">{{infoData.consignee_name}}</span>
              <span>{{infoData.consignee_mobilephone}}</span>
            </div>
            <div class="huoba-cell-subinfo">{{infoData.consignee_address}}</div>
          </div>
          <!-- <div class="huoba-cell-right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>-->
        </div>
      </div>
      <!-- 拼团 -->
      <div class="group" v-if="groupData && groupData.join_list.length > 0">
        <div class="grouphead">
          <span class="groupstate" v-if="groupData.state == 1">拼团中</span>
          <span class="groupstate" v-if="groupData.state == 4">拼团失败</span>
          <span class="groupstate" v-if="groupData.state == 2">拼团成功</span>
          <span class="groupdesc" @click="toGroupDetail">
            拼团详情
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div class="grouplist">
          <!-- 两人团 -->
          <div v-if="groupData.groupbuy_num == 2">
            <span>
              <img :src="groupData.join_list[0].head_pic" alt width="40px" height="40px" />
              <div class="name">团长</div>
            </span>
            <span v-if="groupData.join_list.length == 2">
              <img :src="groupData.join_list[1].head_pic" alt width="40px" height="40px" />
            </span>
            <span class="mark" v-if="groupData.join_list.length == 1">?</span>
          </div>
          <!-- 三人团 -->
          <div v-if="groupData.groupbuy_num == 3">
            <span>
              <img :src="groupData.join_list[0].head_pic" alt width="40px" height="40px" />
              <div class="name">团长</div>
            </span>
            <span v-if="groupData.join_list.length > 1">
              <img :src="groupData.join_list[1].head_pic" alt width="40px" height="40px" />
            </span>
            <span v-if="groupData.state == 2">
              <img :src="groupData.join_list[2].head_pic" alt width="40px" height="40px" />
            </span>
            <span class="mark" v-if="groupData.state == 1 || groupData.state == 4">?</span>
            <span class="mark over" v-if="groupData.state == 1 || groupData.state == 4">......</span>
          </div>
          <!-- 多人团 -->
          <div v-if="groupData.groupbuy_num > 3">
            <span>
              <img :src="groupData.join_list[0].head_pic" alt width="40px" height="40px" />
              <div class="name">团长</div>
            </span>
            <span v-if="groupData.join_list.length > 1">
              <img :src="groupData.join_list[1].head_pic" alt width="40px" height="40px" />
            </span>
            <span v-if="groupData.state == 2">
              <img :src="groupData.join_list[2].head_pic" alt width="40px" height="40px" />
            </span>
            <span class="mark" v-if="groupData.state == 1 || groupData.state == 4">?</span>
            <span class="mark over">......</span>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div class="content">
        <!-- 商品商家 -->
        <div class="huoba-cell">
          <div class="huoba-cell-title" @click="toBrandindex">
            <div class="huoba-cell-headImg">
              <div class="ratioBox">
                <div class="box">
                  <img :src="infoData.brand_header_pic" alt />
                </div>
              </div>
            </div>
            <span class="huoba-cell__title">{{infoData.brand_name}}</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
          <div class="huoba-cell-value"></div>
        </div>
        <!-- 商品列表 -->
        <div
          class="huoba-goods-list huoba-goods-list-one"
          v-for="(item,index) in goods_list"
          :key="index"
          @click="goodsDetail(item)"
        >
          <div class="huoba-goods-list-left">
            <div class="ratioBox">
              <div class="box">
                <img v-lazy="item.pic" alt />
              </div>
              <span class="huoba-goods-list-label" v-if="item.goods_type == 1">音频</span>
              <span class="huoba-goods-list-label" v-if="item.goods_type == 2">视频</span>
              <span class="huoba-goods-list-label" v-if="item.goods_type == 3">图书</span>
              <span class="huoba-goods-list-label" v-if="item.goods_type == 4">电子书</span>
              <span class="huoba-goods-list-label" v-if="item.goods_type == 9">专辑</span>
              <span class="huoba-goods-list-label" v-if="item.goods_type == 10">文件包</span>
            </div>
          </div>
          <div class="huoba-goods-list-mid">
            <span class="huoba-goods-title">
              <span>{{item.goods_name}}</span>
            </span>
            <div>
              <span class="huoba-goods-price">￥{{item.sale_price.toFixed(2)}}</span>
              <span class="huoba-goods-num">x{{item.buy_count}}</span>
            </div>
          </div>
          <div class="huoba-goods-list-right">
            <span></span>
            <span
              class="huoba-goods-opera"
              v-if="infoData.type == 2 && (item.if_refund == 1 || item.if_refund == 5) && infoData.pay_money > 0"
              @click.stop="torefund(item)"
            >申请售后</span>
            <span
              class="huoba-goods-opera"
              v-if="infoData.type == 2 && item.if_refund == 2 && infoData.pay_money > 0"
              @click.stop="toOngoing(item)"
            >退款审核中</span>
            <span
              class="huoba-goods-opera"
              v-if="infoData.type == 2 && item.if_refund == 3 && infoData.pay_money > 0"
              @click.stop="toOngoing(item)"
            >退款成功</span>
            <span
              class="huoba-goods-opera"
              v-if="infoData.type == 2 && item.if_refund == 4 && infoData.pay_money > 0"
              @click.stop="toOngoing(item)"
            >退款失败</span>
          </div>
        </div>
        <!-- 展开更多 -->
        <div class="huoba-cell huoba-cell-five" v-if="infoData.detail.length > 6">
          <span class="huoba-cell-text" @click="watchmore">此订单共{{order_nums}}件商品，点击查看</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line" />
          </svg>
        </div>
      </div>
      <!-- 价格 -->
      <div class="content">
        <div class="huoba-cell-six">
          <van-cell title="商品总额" :value="'￥'+infoData.order_goods_money.toFixed(2)"></van-cell>
          <!-- <van-cell
            title="商品优惠"
            v-if="infoData.activity_money"
            :value="'- ￥'+infoData.activity_money.toFixed(2)"
          ></van-cell> -->
          <van-cell
            title="活动立减"
            v-if="infoData.multi_money"
            :value="'- ￥'+infoData.multi_money.toFixed(2)"
          ></van-cell>
          <van-cell title="优惠券" v-if="infoData.ticket_money" :value="'- ￥'+infoData.ticket_money.toFixed(2)"></van-cell>
          <van-cell title="运费" v-if="infoData.type == 2" :value="'+ ￥'+infoData.dispatch_price.toFixed(2)"></van-cell>
          <div class="huoba-cell-last">
            <!-- <span>{{infoData.state == 1? '待支付':'实付款'}}</span> -->
            <span>订单总价</span>
            <span class="huoba-cell-last-money">
              ￥<span
                class="huoba-cell-last-num"
                v-if="infoData.pay_state"
              >{{infoData.pay_money.toFixed(2)}}</span>
              <span class="huoba-cell-last-num" v-else>{{infoData.order_money.toFixed(2)}}</span>
            </span>
          </div>
        </div>
      </div>
      <!-- 信息 -->
      <div class="content">
        <div class="huoba-cell-seven">
          <div class="huoba-cell-head huoba-cell-line">{{infoData.type == 1? '虚拟商品':'实物商品'}}</div>
          <div class="huoba-cell-order-num huoba-cell-line">
            <span>订单编号：{{infoData.order_id}}</span>
            <span class="huoba-cell-copy" @click="copy" :data-clipboard-text="infoData.order_id">复制</span>
          </div>
          <div class="huoba-cell-paytime huoba-cell-line">下单时间：{{infoData.order_time}}</div>
          <div
            class="huoba-cell-separate huoba-cell-line"
            v-if="infoData.pay_info && infoData.pay_info.length > 0"
          ></div>
          <div
            class="huoba-cell-payway huoba-cell-line"
            v-if="infoData.pay_info && infoData.pay_info.length > 0"
          >支付方式：{{infoData.pay_info[0].pay_bank}}</div>
          <div
            class="huoba-cell-paytime huoba-cell-line"
            v-if="(infoData.state !== 1 || infoData.state !== 7) && infoData.pay_time"
          >支付时间：{{infoData.pay_time}}</div>
        </div>
        <div v-if="infoData.type == 1" class="invent">虚拟商品由于特殊性，订单完成后不予退换。</div>
      </div>
      <div v-if="this.isIphx" style="height: 34px;"></div>
      <!-- 底部按钮导航 -->
      <div class="bottomBox" :class="{iphx:this.isIphx}" v-if="infoData.type == 2 || show_btn">
        <div class="huoba-button-nav">
          <div class="huoba-button-nav-left">
            <span
              class="word"
              v-if="(infoData.state == 4 || infoData.state == 7) && infoData.type == 2"
              @click="delete_order"
            >删除订单</span>
          </div>
          <div class="huoba-button-nav-right">
            <button
              class="huoba-btn huoba-btn-two"
              @click="apply"
              v-if="infoData.state == 4 && infoData.can_invoice_money > 0 && Object.keys(invoice).length == 0 && infoData.want_invoice == 1"
            >申请发票</button>
            <button
              class="huoba-btn huoba-btn-two"
              @click="apply"
              v-if="invoice !== undefined && Object.keys(invoice).length > 0 && invoice.flag == 1"
            >申请发票</button>
            <a
              style="margin-left:15px;"
              v-if="invoice !== undefined && Object.keys(invoice).length > 0 && invoice.flag == 2"
              :href="invoice.url"
              target="_blank"
              download="invoice.pdf"
            >
              <button class="huoba-btn huoba-btn-two">查看发票</button>
            </a>
            <button
              class="huoba-btn huoba-btn-two"
              style="margin-left:15px;"
              v-if="infoData.state == 5 && infoData.type== 2 && infoData.remain_receive_time_delayed == 1 && show_delay"
              @click="extend"
            >延长收货</button>
            <button
              class="huoba-btn huoba-btn-two"
              style="margin-left:15px;"
              v-if="infoData.state == 1"
              @click="cancel"
            >取消订单</button>
            <button
              class="huoba-btn huoba-btn-two"
              style="margin-left:15px;"
              v-if="infoData.type==2&&(infoData.state == 5)&&(infoData.if_all_send == 1&&infoData.send_package_nums == 1)"
              @click="tologistics"
            >查看物流</button>
            <button
              class="huoba-btn huoba-btn-two"
              style="margin-left:15px;"
              v-if="infoData.type == 2&& infoData.state == 5 && ((infoData.if_all_send == 0 && infoData.send_package_nums > 0)||(infoData.if_all_send == 1 && infoData.send_package_nums > 1))"
              @click="packageDetail"
            >包裹详情</button>
            <button
              class="huoba-btn huoba-btn-two"
              style="margin-left:15px;"
              v-if="infoData.state == 4 && infoData.if_comment == 0"
              @click="toComment"
            >评价</button>
            <button
              class="huoba-btn huoba-btn-one"
              style="margin-left:15px;"
              v-if="(infoData.state == 2 || infoData.state == 4 || infoData.state == 7) && infoData.type == 2"
              @click="repurchase"
            >再次购买</button>
            <button
              class="huoba-btn huoba-btn-one"
              style="margin-left:15px;"
              v-if="infoData.state == 9"
              @click="toGroupDetail"
            >拼团详情</button>
            <button
              class="huoba-btn huoba-btn-one"
              style="margin-left:15px;"
              v-if="infoData.state == 5 && infoData.type==2"
              @click="confirmReceive"
            >确认收货</button>
            <button
              class="huoba-btn huoba-btn-one"
              style="margin-left:15px;"
              v-if="infoData.state == 1"
              @click="toPaid"
            >去支付</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 快速导航 -->
    <EazyNav type="order" :isShow="true"></EazyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/personal/order/detail.scss" lang="scss"></style>

<script>
//调用cilpboard
import Clipboard from "clipboard";
import { USER_ORDER_DETAIL_GET } from "../../../apis/user.js";
import {
  ORDER_RECEIVE,
  ORDER_CANCEL,
  ORDER_AGAIN,
  ORDER_RECEIVE_DELAY,
  ORDER_DELETE
} from "../../../apis/shopping.js";

export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      order_id: null,
      infoData: {
        order_goods_money: 0,
        dispatch_price: 0,
        activity_money: 0,
        multi_money: 0,
        pay_money: 0,
        order_money: 0,
        pay_info: [{ pay_bank: "" }],
        detail: []
      },
      invoice: {},
      if_refund: true,
      detail_ids: null,
      groupData: {
        join_list: []
      },
      timeH: "00",
      timeM: "00",
      timeS: "00",
      receive_time: "",
      goods_list: [],
      show_btn: true,
      order_nums: 0,
      show_delay: false
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.getData();
  },
  updated() {
    if (
      $(".huoba-button-nav .huoba-button-nav-right").find(".huoba-btn").length >
      0
    ) {
      this.show_btn = true;
    } else {
      this.show_btn = false;
    }
  },
  methods: {
    // 包裹详情页
    packageDetail() {
      this.$router.push({
        name: "packagedetail",
        query: {
          order_id: this.infoData.order_id
        }
      });
    },
    //获取页面基本信息
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.infoData = res.response_data;
        this.invoice = res.response_data.invoice_info;
        this.order_nums = this.infoData.detail.length;
        if (this.infoData.detail.length > 6) {
          this.goods_list = this.infoData.detail.slice(0, 6);
        } else {
          this.goods_list = this.infoData.detail;
        }

        this.groupData = res.response_data.groupbuy_info;
        for (let i = 0; i < this.infoData.detail.length; i++) {
          if (
            this.infoData.detail[i].if_refund == 2 ||
            this.infoData.detail[i].if_refund == 3
          ) {
            this.if_refund = false;
          }
        }
        if (
          this.infoData &&
          this.infoData.remain_pay_time &&
          this.infoData.state == 1
        ) {
          this.$countTime(this.infoData.remain_pay_time);
        }
        if (
          this.infoData &&
          this.infoData.remain_receive_time &&
          this.infoData.state == 5
        ) {
          this.$countTime(this.infoData.remain_receive_time);
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    // 复制订单编号
    copy() {
      const clipboard = new Clipboard(".huoba-cell-copy");
      clipboard.on("success", e => {
        this.$toast("复制成功");
        // this.$message({ type: 'success', message: '复制成功' });
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // this.$message({ type: 'waning', message: '该浏览器不支持自动复制' });
        clipboard.destroy();
      });
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
          // on confirm
          this.delete(this.infoData.order_id);
        })
        .catch(() => {
          // on cancel
        });
    },
    async delete(order_id) {
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
        setTimeout(()=>{
          this.$router.push({
            name: "orderlist",
          });
        },1000)
      } else {
        this.$toast(res.error_message);
      }
    },
    //取消订单
    cancel() {
      this.$dialog
        .confirm({
          message: "确定取消订单吗？",
          cancelButtonText: "我再想想",
          confirmButtonText: "取消订单",
          cancelButtonColor: "#333",
          confirmButtonColor: "#999"
        })
        .then(() => {
          this.cancelOrder(this.infoData.order_id);
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
    //查看物流信息
    tologistics() {
      this.$router.push({
        name: "logistics",
        query: {
          order_id: this.infoData.order_id,
          express_id: this.infoData.package_info[0].id
        }
      });
    },
    //评价
    toComment() {
      // console.log(this.infoData.order_id);
      if (this.infoData.detail.length > 1) {
        this.$router.push({
          name: "ordercomment",
          query: {
            order_id: this.infoData.order_id
          }
        });
      } else if (this.infoData.detail.length == 1) {
        this.$router.push({
          name: "commentpunish",
          query: {
            pic: this.infoData.detail[0].pic,
            order_id: this.infoData.order_id,
            detail_id: this.infoData.detail[0].detail_id
          }
        });
      }
    },
    //再次购买
    repurchase() {
      this.getAgainData();
    },
    //获取再次购买信息
    async getAgainData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
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
    // 跳转拼团详情
    toGroupDetail() {
      this.$router.push({
        name: "groupdetail",
        query: {
          open_id: this.groupData.open_id
        }
      });
    },
    // 去支付
    toPaid() {
      this.$router.push({
        name: "pay",
        query: { pay_id: this.infoData.pay_id }
      });
    },
    goodsDetail(item) {
      // console.log(item);return
      // 音频/视频
      if (item.goods_type == 1 || item.goods_type == 2) {
        this.$router.push({
          name: "albumdetail",
          query: {
            goods_id: item.goods_id,
            pid: item.album_id ? item.album_id : 0
          }
        });
      }
      // 文章
      else if (item.goods_type == 6) {
        this.$router.push({
          name: "article",
          query: {
            goods_id: item.goods_id
          }
        });
      }
      //专辑
      else if (item.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: {
            goods_id: item.goods_id
          }
        });
      }
      // 实物商品
      else if (item.goods_type == 3) {
        this.$router.push({
          name: "detail",
          query: {
            goods_id: item.goods_id
          }
        });
      }
      // 电子书
      else if (item.goods_type == 4) {
        this.$router.push({
          name: "ebookdetail",
          query: {
            goods_id: item.goods_id
          }
        });
      }
      // 文件包
      else if (item.goods_type == 10) {
        this.$router.push({
          name: "librarydetail",
          query: {
            goods_id: item.goods_id
          }
        });
      }
    },
    //跳转公号主页
    toBrandindex() {
      this.$router.push({
        name: "brand",
        query: {
          brand_id: this.infoData.brand_id
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
          this.orderReceive();
        })
        .catch(() => {
          // on cancel
        });
    },
    async orderReceive() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: this.infoData.order_id
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
    // 申请售后
    torefund(item) {
      if (this.infoData.if_account == 1) {
        this.$toast("抱歉，此商品已超过退款周期");
        return;
      } else if (this.infoData.state == 2) {
        // this.$toast("抱歉，此商品已超过退款周期");
        this.$router.push({
          name: "refundtwo",
          query: {
            order_id: this.infoData.order_id,
            detail_id: item.id,
            goods_length: this.infoData.detail.length
          }
        });
      } else if (this.infoData.state == 4 || this.infoData.state == 5) {
        this.$router.push({
          name: "refundtype",
          query: {
            order_id: this.infoData.order_id,
            detail_id: item.id,
            // pic: item.pic,
            // goods_type: item.goods_type,
            // goods_num: item.buy_count,
            // goods_name: item.goods_name,
            // real_price: item.real_price,
            goods_length: this.infoData.detail.length
          }
        });
      }
    },
    // 查看退款进度
    toOngoing(item) {
      this.$router.push({
        name: "ongoing",
        query: {
          order_id: this.infoData.order_id,
          detail_id: item.id
        }
      });
    },
    returnPrice() {
      location.reload();
    },
    // 延长收货
    extend() {
      this.$dialog
        .confirm({
          message: "确认延长收货时间？\n每笔订单只能延迟一次哦",
          cancelButtonText: "取消",
          confirmButtonText: "确认",
          cancelButtonColor: "#333",
          confirmButtonColor: "#999"
        })
        .then(() => {
          this.extendOrder(this.infoData.order_id);
        })
        .catch(() => {
          // on cancel
        });
    },
    async extendOrder(order_id) {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: order_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_RECEIVE_DELAY(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("延长收货成功！");
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    },
    //申请发票
    apply() {
      this.$router.push({
        name: "orderinvoice",
        query: {
          order_id: this.infoData.order_id
        }
      });
    },
    // 查看全部商品
    watchmore() {
      this.$router.push({
        name: "packageallgoods",
        query: {
          order_id: this.infoData.order_id
        }
      });
    },
    // 查看收货地址
    toAddress() {
      this.$router.push({
        name: "addresslist"
      });
    }
  }
};
</script>
