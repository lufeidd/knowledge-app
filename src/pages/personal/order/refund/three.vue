<template>
  <div class="refund" id="threePage">
    <div class="content">
      <div class="huoba-goods-list huoba-goods-list-one" v-if="goods_list.length == 1 && type_of !== 'edit'">
        <div class="huoba-goods-list-left">
          <div class="ratioBox">
            <div class="box">
              <img :src="goods_list[0].pic" alt />
            </div>
            <span class="huoba-goods-list-label" v-if="goods_list[0].goods_type == 1">音频</span>
            <span class="huoba-goods-list-label" v-if="goods_list[0].goods_type == 2">视频</span>
            <span class="huoba-goods-list-label" v-if="goods_list[0].goods_type == 3">图书</span>
            <span class="huoba-goods-list-label" v-if="goods_list[0].goods_type == 4">电子书</span>
            <span class="huoba-goods-list-label" v-if="goods_list[0].goods_type == 9">专辑</span>
          </div>
        </div>
        <div class="huoba-goods-list-mid">
          <span class="huoba-goods-title">
            <span>{{goods_list[0].goods_name}}</span>
          </span>
          <div>
            <span class="huoba-goods-price">￥{{goods_prices.toFixed(2)}}</span>
            <span class="huoba-goods-num">x{{goods_list[0].buy_count}}</span>
          </div>
        </div>
        <div class="huoba-goods-list-right">
          <span></span>
          <span class="huoba-goods-opera"></span>
        </div>
      </div>
      <!-- 编辑修改 -->
      <div class="huoba-goods-list huoba-goods-list-one" v-if="type_of == 'edit'">
        <div class="huoba-goods-list-left">
          <div class="ratioBox">
            <div class="box">
              <img :src="goods_info.pic" alt />
            </div>
            <span class="huoba-goods-list-label" v-if="goods_info.goods_type == 1">音频</span>
            <span class="huoba-goods-list-label" v-if="goods_info.goods_type == 2">视频</span>
            <span class="huoba-goods-list-label" v-if="goods_info.goods_type == 3">图书</span>
            <span class="huoba-goods-list-label" v-if="goods_info.goods_type == 4">电子书</span>
            <span class="huoba-goods-list-label" v-if="goods_info.goods_type == 9">专辑</span>
          </div>
        </div>
        <div class="huoba-goods-list-mid">
          <span class="huoba-goods-title">
            <span>{{goods_info.goods_name}}</span>
          </span>
          <div>
            <span class="huoba-goods-price">￥{{goods_prices.toFixed(2)}}</span>
            <span class="huoba-goods-num">x{{max_count}}</span>
          </div>
        </div>
        <div class="huoba-goods-list-right">
          <span></span>
          <span class="huoba-goods-opera"></span>
        </div>
      </div>
      <!-- 多个商品 -->
      <div class="huoba-goods-list huoba-goods-list-seven" v-if="goods_list.length > 1 && type_of !== 'edit'">
        <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item,index) in goods_list" :key="index">
            <div class="huoba-goods-list-imgs">
              <div class="ratioBox">
                <span class="huoba-goods-list-label" v-if="item.goods_type == 1">音频</span>
                <span class="huoba-goods-list-label" v-if="item.goods_type == 2">视频</span>
                <span class="huoba-goods-list-label" v-if="item.goods_type == 3">图书</span>
                <span class="huoba-goods-list-label" v-if="item.goods_type == 4">电子书</span>
                <span class="huoba-goods-list-label" v-if="item.goods_type == 9">专辑</span>
                <span class="huoba-goods-list-label price">￥{{item.all_money.toFixed(2)}}</span>
                <div class="box">
                  <img
                    :src="item.pic"
                    alt
                  />
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div style="padding:10px 15px;" v-if="type_of !== 'edit' && $route.query.goods_length > 1">
        <button class="huoba-btn huoba-btn-four" @click="addGoods">+添加和编辑</button>
      </div>
    </div>
    <div class="content" style="padding:0 15px;">
      <div class="cell reason" @click="choose()">
        <div>
          <span>退款原因*:&nbsp{{refund_reason}}</span>
          <span class="typeRefund"></span>
        </div>
        <span class="choose">
          <span v-if="!refund_reason">请选择退款原因</span>
          <svg class="icon arrow" aria-hidden="true">
            <use xlink:href="#icon-next-line" />
          </svg>
        </span>
      </div>
      <div class="cell">
        <div class="reason">
          <div>
            <span>退款金额*:</span>
            <span class="most">
              <span class="money" v-if="goods_list.length == 1 || type_of == 'edit'">￥<input type="text" v-model="real_refund_money" @input="refundmoney"></span>
              <span class="money" v-else>￥<input type="text" readonly v-model="real_refund_money"></span>
            </span>
          </div>
        </div>
        <div style="margin-top:15px;">
          <span
            class="choose"
            v-if="goods_list.length == 1 || type_of == 'edit'"
          >可修改，最多￥{{refundInfo.max_apply_money.toFixed(2)}}，含发货运费￥{{refundInfo.dispatch_price.toFixed(2)}}</span>
          <span
            class="choose"
            v-else
          >批量退款时不可修改，最多￥{{refundInfo.max_apply_money.toFixed(2)}}，含发货运费￥{{refundInfo.dispatch_price.toFixed(2)}}</span>
        </div>
      </div>
      <div class="cell number" v-if="goods_list.length == 1 || type_of == 'edit'">
        <div class="text">
          <span>退款数量*:</span>
        </div>
        <van-stepper
          v-model="refund_count"
          disable-input
          @change="goodsCount"
          integer
          :min="1"
          :max="max_count"
        />
      </div>
      <div class="cell explain">
        <span>退款说明：</span>
        <input @input="inputChange" v-model="refund_desc" placeholder="选填"></input>
      </div>
      <!-- 字数限制 -->
      <div class="count" style="display:none">
        <span :class="{ active: explainLength > explainTotal }">{{ explainLength }}</span>
        /{{ explainTotal }}
      </div>
    </div>
    <div class="content" style="padding:10px 15px;">
      <div class="upload">
        <span>上传凭证</span>
        <upload :uploadData="uploadData"></upload>
      </div>
    </div>
    <div style="height:90px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <div v-if="type_of =='edit'">
        <button class="huoba-btn huoba-btn-three" v-if="submit_state" @click="editRefund">修改</button>
        <button class="huoba-btn huoba-btn-three disabled" v-else>提交中</button>
      </div>
      <div v-else>
        <button class="huoba-btn huoba-btn-three" v-if="submit_state" @click="submitRefund">提交</button>
        <button class="huoba-btn huoba-btn-three disabled" v-else>提交中</button>
      </div>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="huoba-selectRadio-title">
        <span>退款原因</span>
      </div>
      <div class="huoba-selectRadio-content">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell
              :title="item"
              clickable
              @click="radioCheck(item,index)"
              v-for="(item,index) in reasonList"
              :key="index"
            >
              <van-radio :name="index" @click="radioCheck(item,index)" checked-color="#ff504e" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="huoba-selectRadio-bottom">
        <button class="huoba-btn huoba-btn-three" @click="close">关闭</button>
      </div>
    </van-popup>
    <EazyNav type="order" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
import upload from "../../../../components/upload";
import { COMMON_UPLOAD } from "../../../../apis/public.js";
import {
  ORDER_REFUND_ADD,
  ORDER_REFUND_ADDINFO,
  ORDER_REFUND_EDIT,
  ORDER_REFUN_GET
} from "../../../../apis/shopping.js";
import { setTimeout } from "timers";
export default {
  components: {
    upload
  },
  data() {
    return {
      uploadData: {
        maxlength: 3,
        text: "上传凭证(最多三张)"
      },
      show: false,
      swiperOption: {
        slidesPerView: "auto"
      },
      radio: null,
      reasonList: [],
      order_id: null,
      detail_id: null,
      refund_type: 3,
      refund_reason: "",
      refund_desc: "",
      refund_count: 0,
      real_refund_money: 0,
      pic: "",
      explainTotal: 500,
      explainLength: 0,
      refundInfo: {
        max_apply_money:0,
        dispatch_price:0
      },
      type_of: "refund",
      apply_id: null,
      show_dispatch: false,
      count_show: true,
      max_price: 0,
      max_count: 0,
      submit_state: true,
      dispatch_price: 0,
      goods_prices: 0,
      goods_list: [],
      goods_info:{}
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    this.apply_id = this.$route.query.apply_id;
    this.type_of = this.$route.query.type_of?this.$route.query.type_of:'refund';
    if (this.type_of == "edit") {
      this.getRefundDetail();
    }else{
      this.getInfo();
    }
  },
  methods: {
    choose() {
      this.show = true;
    },
    inputChange() {
      this.explainLength = this.refund_desc.trim().length;
      if (this.explainLength > this.explainTotal) {
        this.refund_desc = this.refund_desc
          .trim()
          .substring(0, this.explainTotal);
        this.explainLength = this.explainTotal;
      }
    },
    close() {
      this.show = false;
    },
    refundmoney(){
      if(Number(this.real_refund_money) > Number(this.refundInfo.max_apply_money)){
        this.$toast("超出最大退款金额！");
        this.real_refund_money = Number(this.refundInfo.max_apply_money).toFixed(2);
      }
    },
    radioCheck(item, index) {
      this.radio = index;
      this.refund_reason = item;
      this.show = false;
      if(this.goods_list.length == 1 || this.type_of == 'edit'){
        this.reasonMoney()
      }else{
        if (this.refund_reason == "7天无理由退换" || this.refund_reason == "不喜欢/不想要") {
          this.real_refund_money = Number(this.max_price - this.dispatch_price).toFixed(2);
          this.refundInfo.max_apply_money = this.max_price - this.dispatch_price
          this.refundInfo.dispatch_price = 0
        }else{
          this.real_refund_money = Number(this.max_price).toFixed(2);
          this.refundInfo.max_apply_money = this.max_price
          this.refundInfo.dispatch_price = this.dispatch_price
        }
      }
    },
    // 获取上传图片路径
    async uploadImg(url){
        var tStamp = this.$getTimeStamp();
        var data = {
          version: "1.0",
          timestamp: tStamp,
          file: url,
          opt_type: "refund",
          file_type: "Base64",
          source: 1
        };

        data.sign = this.$getSign(data);
        let res = await COMMON_UPLOAD(data);
        if (res.hasOwnProperty("response_code")) {
          for(let i=0;i<res.response_data.length;i++){
            $(".content.set").eq(i).attr('data-src',res.response_data[i].url)
          }
          var _this = this;
          $(".content.set").each(function(){
            var feedbackImgs = $(this).attr('data-src');
            if(feedbackImgs){
              if(_this.pic){
                _this.pic += ',' + feedbackImgs
              }else{
                _this.pic += feedbackImgs
              }
            }
          })
          console.log(111,this.pic)
          if (this.type_of == "edit") {
            this.editAll();
          } else {
            this.submitAll();
          }
        } else {
          this.$toast(res.error_message);
        }
    },
    getImgUrl() {
      var uploadPic = "",_this = this;
      this.pic = ""
      if ($(".flex-box").length > 1) {
        $(".content.set").each(function(index,value){
          var _src = $(this).attr('data-src');
            if(_src.indexOf(';base64,')>-1){
              if(uploadPic){
                uploadPic += "||" + _src
              }else{
                uploadPic += _src
              }
            }
        })
      }
      if(uploadPic) {
        this.uploadImg(uploadPic)
      }else{
          $(".content.set").each(function(){
            var feedbackImgs = $(this).attr('data-src');
            if(feedbackImgs){
              if(_this.pic){
                _this.pic += ',' + feedbackImgs
              }else{
                _this.pic += feedbackImgs
              }
            }
          })
          console.log(111,this.pic)
        if (this.type_of == "edit") {
          this.editAll();
        } else {
          this.submitAll();
        }
      }
    },
    submitRefund() {
      if (
        this.refund_reason &&
        this.order_id &&
        this.detail_id &&
        this.real_refund_money
      ) {
        if(this.refundInfo.error_state == 1){
            this.$dialog.confirm({
              message: "由于订单运费发生变更\n相关商品需要一起申请退款哦",
              cancelButtonText: "我再想想",
              confirmButtonText: "一起退款",
              cancelButtonColor: "#333",
              confirmButtonColor: "#999"
            })
            .then(() => {
              for(let i=0;i<this.refundInfo.other_detail_ids.length;i++){
                this.detail_id += ','+this.refundInfo.other_detail_ids[i]
              }
              this.getInfo()
            })
            .catch(() => {
              // on cancel
            });
        }else{
          this.submit_state = false;
          this.getImgUrl();
        }
      } else {
        this.$toast("请填写完整信息！");
      }
    },
    async submitAll() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.1",
        timestamp: tStamp,
        order_id: this.order_id,
        detail_ids: this.detail_id,
        refund_type: 3,
        refund_money: this.real_refund_money,
        refund_count: Number(this.refund_count),
        refund_reason: this.refund_reason,
        refund_desc: this.refund_desc,
        dispatch_price: this.refundInfo.dispatch_price,
        pic: this.pic
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.submit_state = true;
        this.$toast("申请成功!");
        this.$router.replace({
          name: "orderdetail",
          query: {
            order_id: this.order_id
          }
        });
      } else {
        this.submit_state = true;
        this.$toast(res.error_message);
      }
    },
    //获取退款信息
    async getInfo() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.1",
        timestamp: tStamp,
        order_id: this.order_id,
        detail_ids: this.detail_id,
        refund_type: 2
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_ADDINFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.refundInfo = res.response_data;
        this.goods_list = res.response_data.refund_goods;
        if(this.goods_list.length == 1) {
          this.refund_count = this.goods_list[0].buy_count
          this.goods_prices = this.goods_list[0].real_price
        };
        this.reasonList = res.response_data.refund_reasons.returngoods;
        this.real_refund_money = Number(res.response_data.max_apply_money).toFixed(2);
        this.max_price = Number(res.response_data.max_apply_money);
        this.dispatch_price = Number(res.response_data.dispatch_price);
        this.max_count = res.response_data.refund_goods[0].buy_count;
      } else {
        this.$toast(res.error_message);
      }
    },
    //修改申请
    editRefund() {
      if (
        this.refund_reason &&
        this.real_refund_money &&
        this.apply_id
      ) {
        this.submit_state = false;
        this.getImgUrl();
      } else {
        this.$toast("请填写完整信息！");
      }
    },
    async editAll() {
      this.submit_state = false;
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        apply_id: this.apply_id,
        refund_type: this.refund_type,
        refund_money: this.real_refund_money,
        refund_count: Number(this.refund_count),
        refund_reason: this.refund_reason,
        refund_desc: this.refund_desc,
        pic: this.pic
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_EDIT(data);
      if (res.hasOwnProperty("response_code")) {
        this.submit_state = true;
        this.$toast("修改成功!");
        this.$router.replace({
          name: "orderdetail",
          query: {
            order_id: this.order_id
          }
        });
      } else {
        this.submit_state = true;
        this.$toast(res.error_message);
      }
    },
    //获取退款详情
    async getRefundDetail() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.1",
        timestamp: tStamp,
        apply_id: this.apply_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUN_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.refund_reason = res.response_data.refund_reason;
        this.refund_desc = res.response_data.refund_desc;
        this.refund_count = res.response_data.refund_count;
        this.real_refund_money = Number(res.response_data.refund_money).toFixed(2);
        this.reasonList = res.response_data.reason_list.returngoods;
        this.max_count = res.response_data.goods_info.buy_count;
        this.refundInfo.dispatch_price = res.response_data.if_dispatch_price?Number(res.response_data.dispatch_price):0
        this.dispatch_price = Number(res.response_data.dispatch_price)
        this.goods_prices = Number(res.response_data.goods_info.real_price)
        for(var i=0;i<this.reasonList.length;i++){
          if(this.refund_reason == this.reasonList[i]){
            this.radio = i
          }
        }
        this.max_price = Number(res.response_data.max_money);
        this.dispatch_price = Number(res.response_data.dispatch_price);
        this.goods_info = res.response_data.goods_info

        if (res.response_data.pic !== null) {
          if (res.response_data.pic.length > 0) {
            for (let i = 0; i < res.response_data.pic.length; i++) {
              $("#upload").prepend(
                '<div class="flex-box">' +
                  '<div class="box">' +
                  '<div class="content set" data-src="' +
                  res.response_data.shorturl_pic[i] +
                  '" style="background-image: url(' +
                  res.response_data.pic[i] +
                  ');">' +
                  '<div class="del">' +
                  '<svg class="icon" aria-hidden="true">' +
                  '<use xlink:href="#icon-close-line"></use>' +
                  "</svg>" +
                  "</div>" +
                  "</div>" +
                  "</div>" +
                  "</div>"
              );
            }
          }
          if (res.response_data.pic.length == 3) {
            $("#van").css("display", "none");
          }
        }
        $("#upload .del").on("click", function() {
          // length = box.length;
          $(this)
            .parents(".flex-box")
            .remove();

          $("#van").css("display", "block");
        });

          if (this.refund_reason == "7天无理由退换" || this.refund_reason == "不喜欢/不想要"){
            if(this.refund_count == this.max_count){
              this.refundInfo.max_apply_money = this.max_price - this.dispatch_price
              this.refundInfo.dispatch_price = 0
            }else{
              this.refundInfo.max_apply_money = this.refund_count * this.goods_prices
              this.refundInfo.dispatch_price = 0
            }
          }else{
            if(this.refund_count == this.max_count){
              this.refundInfo.max_apply_money = this.max_price
              this.refundInfo.dispatch_price = this.dispatch_price
            }else{
              this.refundInfo.max_apply_money = this.refund_count * this.goods_prices
              this.refundInfo.dispatch_price = 0
            }
          }
      } else {
        this.$toast(res.error_message);
      }
    },
    //计数改变
    goodsCount() {
      this.reasonMoney()
    },
    // 根据原因变化金额
    reasonMoney(){
        if (this.refund_reason == "7天无理由退换" || this.refund_reason == "不喜欢/不想要"){
          this.real_refund_money = Number(this.refund_count * this.goods_prices).toFixed(2)
          this.refundInfo.dispatch_price = 0
          this.refundInfo.max_apply_money = this.refund_count * this.goods_prices
        }else{
          if(this.refund_count == this.max_count){
            this.real_refund_money = Number(this.max_price).toFixed(2);
            this.refundInfo.dispatch_price = this.dispatch_price;
            this.refundInfo.max_apply_money = this.max_price;
          }else{
            this.real_refund_money = Number(this.refund_count * this.goods_prices).toFixed(2)
            this.refundInfo.dispatch_price = 0
            this.refundInfo.max_apply_money = this.refund_count * this.goods_prices
          }
        }
    },
    addGoods() {
      this.$router.push({
        name: "refundchoose",
        query: {
          order_id: this.order_id,
          detail_id: this.detail_id,
          name: 2
        }
      });
    }
  }
};
</script>
