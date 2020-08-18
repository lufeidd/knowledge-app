<template>
  <div id="ongoingPage">
    <div class="content">
      <div class="huoba-refund-step">
        <van-steps direction="vertical" :active="0" active-color="#F05654">
          <van-step v-for="(item,index) in infoData" :key="index">
            <template slot="active-icon">
              <span class="huoba-refund-step-icon"></span>
            </template>
            <div class="huoba-refund-step-title">{{item.title}}</div>
            <div class="huoba-refund-step-content" v-html="item.content"></div>
            <div class="huoba-refund-step-imgs" v-if="item.extra.refund_pic && item.extra.refund_pic.length > 0">
              <div class="huoba-refund-step-img" v-for="(litem,lindex) in item.extra.refund_pic" :key="lindex">
                <div class="ratioBox">
                  <div class="box">
                    <img
                      :src="litem"
                      alt
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="huoba-refund-step-time">{{item.time}}</div>
          </van-step>
        </van-steps>
      </div>
    </div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div style="height: 60px;" v-if="show_btn"></div>
    <div class="bottomBox" :class="{iphx:this.isIphx}" v-if="show_btn">
      <div class="huoba-button-nav">
        <div class="huoba-button-nav-left"></div>
        <div class="huoba-button-nav-right">
          <button
            class="huoba-btn huoba-btn-two"
            @click="writeLogistics"
            v-if="refund_state == 1 && refund_type==3"
          >填写物流信息</button>
          <button
            class="huoba-btn huoba-btn-two"
            style="margin-left:15px;"
            v-if="refund_state == 0 && (refund_type==2 || refund_type==3)"
            @click="editRefund"
          >修改申请</button>
          <button
            class="huoba-btn huoba-btn-one"
            style="margin-left:15px;"
            @click="reRefund"
            v-if="refund_state == 2"
          >重新申请</button>
          <button
            class="huoba-btn huoba-btn-one"
            style="margin-left:15px;"
            @click="canclerefund"
            v-if="(refund_state == 0 || refund_state == 1) && (refund_type==2 || refund_type==3)"
          >撤销申请</button>
        </div>
      </div>
    </div>
    <!-- <EazyNav type="order" :isShow="false"></EazyNav> -->
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
import {
  ORDER_REFUND_LOG_GETS,
  ORDER_REFUND_CANCEL,
  ORDER_REFUN_GET
} from "../../../apis/shopping.js";
import { USER_ORDER_DETAIL_GET } from "../../../apis/user.js";
export default {
  data() {
    return {
      order_id: null,
      detail_id: null,
      infoData: [],
      detailData: {},
      refund_state: null,
      apply_id: null,
      refund_type: null,
      refund_reason: null,
      refund_desc: null,
      refund_money: null,
      show_btn: true,
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    this.getInfo();
  },
  updated(){
    if($('.huoba-button-nav .huoba-button-nav-right').find('.huoba-btn').length > 0){
      this.show_btn = true
    }else{
      this.show_btn = false
    }
  },
  methods: {
    //获取退款记录
    async getInfo() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.1",
        timestamp: tStamp,
        order_id: this.order_id,
        detail_id: this.detail_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_LOG_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        this.infoData = res.response_data;
        this.refund_state =
          res.response_data[0].refund_state;
        this.apply_id =
          res.response_data[0].apply_id;
        this.refund_type =
          res.response_data[0].refund_type;

        for (let i = 0; i < this.infoData.length; i++) {
          this.infoData[i].content = this.infoData[i].content.replace(
            /[\r\n]/g,
            "</br>"
          );
        }
      } else {
        this.$toast(res.error_message);
      }
    },

    //撤销退款
    canclerefund() {
      this.$dialog
        .confirm({
          message: "确定撤销申请吗？售后期内你可以重新申请。",
          cancelButtonText: "否",
          confirmButtonText: "撤销申请"
        })
        .then(() => {
          this.cancle();
        })
        .catch(() => {
          // on cancel
        });
    },
    async cancle() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        apply_id: this.apply_id
        // order_id:this.order_id,
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_CANCEL(data);
      if (res.hasOwnProperty("response_code")) {
        this.$toast("撤销申请成功！");
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    },
    //重新申请
    reRefund() {
      this.getDetail("reget");
    },
    // 修改申请
    editRefund() {
      this.$dialog
        .confirm({
          message: "确定修改申请吗？",
          cancelButtonText: "否",
          confirmButtonText: "修改申请"
        })
        .then(() => {
          if (this.refund_type == 2 || this.refund_type == 1) {
            this.$router.push({
              name: "refundtwo",
              query: {
                order_id: this.order_id,
                apply_id: this.apply_id,
                type_of: "edit"
              }
            });
          } else if (this.refund_type == 3) {
            this.$router.push({
              name: "refundthree",
              query: {
                order_id: this.order_id,
                apply_id: this.apply_id,
                type_of: "edit"
              }
            });
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    //填写物流信息
    writeLogistics() {
      this.$router.push({
        name: "refundedit",
        query: {
          apply_id: this.apply_id
        }
      });
    },
    async getDetail(_type) {
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.order_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);
      if (res.hasOwnProperty("response_code")) {
        if (_type == "reget") {
          if (res.response_data.if_account) {
            this.$toast("抱歉，此商品已超过退款周期");
          } else {
            if (res.response_data.state == 2) {
              // this.$toast("抱歉，此商品已超过退款周期");
              this.$router.push({
                name: "refundtwo",
                query: {
                  order_id: this.order_id,
                  detail_id: this.detail_id,
                  goods_length: res.response_data.detail.length
                }
              });
            } else if (
              res.response_data.state == 4 ||
              res.response_data.state == 5
            ) {
              var _index;
              for (var i = 0; i < res.response_data.detail.length; i++) {
                if (this.detail_id == res.response_data.detail[i].detail_id) {
                  _index = i;
                }
              }
              this.$router.push({
                name: "refundtype",
                query: {
                  order_id: this.order_id,
                  detail_id: this.detail_id,
                  pic: res.response_data.detail[_index].pic,
                  goods_type: res.response_data.detail[_index].goods_type,
                  goods_num: res.response_data.detail[_index].buy_count,
                  goods_name: res.response_data.detail[_index].goods_name,
                  real_price: res.response_data.detail[_index].real_price,
                  goods_length: res.response_data.detail.length
                }
              });
            }
          }
        }
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
