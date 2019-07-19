<template>
  <div id="onePage" class="refund">
    <div class="cell">
      <span>退款类型:</span>
      <span class="typeRefund">退款</span>
    </div>
    <div class="cell reason" @click="choose()">
      <div>
        <span>退款原因:{{refund_reason}}</span>
        <span class="typeRefund"></span>
      </div>
      <span class="choose">
        请选择退款原因
        <svg class="icon arrow" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </span>
    </div>
    <div class="cell">
      <span>商品数量:</span>
      <span class="typeRefund">{{refundInfo.buy_count}}</span>
    </div>
    <div class="cell reason">
      <div>
        <span>退款金额:</span>
        <span class="money">{{refundInfo.goods_price*refundInfo.buy_count}}元</span>
      </div>
      <span class="choose" v-if="refundInfo.dispatch_price">（包含运费：{{refundInfo.dispatch_price}}元）</span>
    </div>
    <div class="cell explain">
      <span>退款说明:</span>
      <textarea @input="inputChange" v-model="refund_desc" placeholder="字数不得超过500"></textarea>
    </div>
    <!-- 字数限制 -->
    <div class="count">
      <span :class="{ active: explainLength > explainTotal }">{{ explainLength }}</span>
      /{{ explainTotal }}
    </div>
    <div class="upload">
      <span>上传凭证</span>
      <upload :uploadData="uploadData"></upload>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button type="danger" v-if="type_of =='edit'" size="large" @click="editRefund">修改申请</van-button>
      <van-button type="danger" v-else size="large" @click="submitRefund">提交申请</van-button>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="title">
        <span>请选择退款原因</span>
        <span class="complete" @click="show=false">完成</span>
      </div>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
            :title="item"
            clickable
            v-for="(item,index) in reasonList"
            :key="index"
            @click="radio_check(item,index)"
          >
            <van-radio :name="index" @click="radio_check(item,index)" checked-color="#ff504e"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <EazyNav type="order"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
import upload from "../../../../components/upload";
import { COMMON_UPLOAD } from "../../../../apis/public.js";
import { ORDER_REFUND_ADD,ORDER_REFUND_ADDINFO,ORDER_REFUND_EDIT,ORDER_REFUN_GET } from "../../../../apis/shopping.js"
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
      radio:null,
      reasonList: [],
      order_id:null,
      detail_id: null,
      refund_reason: "",
      refund_desc: "",
      pic: "",
      explainTotal:500,
      explainLength:0,
      refundInfo:{},
      type_of:'refund',
      apply_id:null,
    };
  },
  mounted(){
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    this.apply_id = this.$route.query.apply_id;
    this.type_of = this.$route.query.type_of;
    this.getInfo();
    console.log(this.type_of)
    if(this.type_of == 'edit'){
      this.getRefundDetail();
    }
  },
  methods: {
    choose() {
      this.show = true;
    },
    inputChange() {
      this.explainLength = this.refund_desc.trim().length;
      if (this.explainLength > this.explainTotal) {
        this.refund_desc = this.refund_desc.trim().substring(0,this.explainTotal);
        this.explainLength = this.explainTotal;
      }
    },
    refundmoney(){
      if(Number(this.real_refund_money) > Number(this.refund_money)){
        this.real_refund_money = this.refund_money;
      }
    },
    radio_check(item,index) {
      this.radio = index;
      this.refund_reason = item;
    },
    // 获取上传图片路径
    async getImgUrl() {
      var feedbackImgs =
        $(".content.set")
          .eq(0)
          .attr("data-src") +
        "||" +
        $(".content.set")
          .eq(1)
          .attr("data-src") +
        "||" +
        $(".content.set")
          .eq(2)
          .attr("data-src");
      feedbackImgs = feedbackImgs
        .split("||")
        .filter(item => item !== "undefined")
        .join("||");
      // console.log(this.feedbackImgs)

      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        file: feedbackImgs,
        opt_type: "refund",
        file_type: "Base64",
        source: 1
      };

      data.sign = this.$getSign(data);
      let res = await COMMON_UPLOAD(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);

        // console.log(res);
        var arr = [];
        for (let i = 0; i < res.response_data.length; i++) {
          arr.push(res.response_data[i].url);
        }
        this.pic = arr.join(",");
        console.log(this.pic);

        // console.log(this.content,this.contact)
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
        }
        this.$toast(res.error_message);
      }
    },
    //提交申请
    async submitRefund() {
      if ($(".flex-box").length > 1) {
        this.getImgUrl();
      }
      if(this.refund_reason && this.order_id && this.detail_id && this.refundInfo.goods_price && this.refund_desc){
        var tStamp = this.$getTimeStamp();
        var data = {
          version: "1.0",
          timestamp: tStamp,
          order_id: this.order_id,
          detail_id: this.detail_id,
          refund_type: this.refundInfo.refund_type,
          refund_money: this.refundInfo.goods_price*this.refundInfo.buy_count,
          refund_count: this.refundInfo.buy_count,
          refund_reason:this.refund_reason,
          refund_desc: this.refund_desc,
          pic:this.pic,
        };
        data.sign = this.$getSign(data);
        let res = await ORDER_REFUND_ADD(data);
        if (res.hasOwnProperty("response_code")) {
          this.$toast("申请成功!");
        this.$router.push({
          name:"orderdetail",
          query:{order_id:this.order_id}
        });
        } else {
          this.$toast(res.error_message);
          console.log(this.refund_money);
        }
      }else{
        this.$toast('请填写完整信息！')
      }
    },
    //修改申请
    async editRefund(){
      if ($(".flex-box").length > 1) {
        this.getImgUrl();
      }
      if(this.refund_reason && this.order_id && this.detail_id && this.refundInfo.goods_price && this.refund_desc){
        var tStamp = this.$getTimeStamp();
        var data = {
          version: "1.0",
          timestamp: tStamp,
          apply_id:this.apply_id,
          refund_type: this.refundInfo.refund_type,
          refund_money: this.refundInfo.goods_price*this.refundInfo.buy_count,
          refund_count: this.refundInfo.buy_count,
          refund_reason:this.refund_reason,
          refund_desc: this.refund_desc,
          pic:this.pic,
        };
        data.sign = this.$getSign(data);
        let res = await ORDER_REFUND_EDIT(data);
        if (res.hasOwnProperty("response_code")) {
          this.$toast("修改成功!");
          this.$router.go(-1);
        } else {
          this.$toast(res.error_message);
          console.log(this.refund_money);
        }
      }else{
        this.$toast('请填写完整信息！')
      }
    },
    //获取退款信息
    async getInfo(){
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id:this.order_id,
        detail_id:this.detail_id,
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_ADDINFO(data);

      if (res.hasOwnProperty("response_code")) {
        this.refundInfo = res.response_data;
        this.reasonList = res.response_data.reason_list.refund;
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取退款详情
    async getRefundDetail(){
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        apply_id:this.apply_id,
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUN_GET(data);

      if (res.hasOwnProperty("response_code")) {
        this.refund_reason = res.response_data.refund_reason;
        this.refund_desc = res.response_data.refund_desc;
      } else {
        this.$toast(res.error_message);
      }
    },
  }
};
</script>
