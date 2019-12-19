<template>
  <div id="ongoingPage">
    <div class="content" v-for="(item,index) in infoData">
      <div class="date">{{item.time}}</div>
      <div
        class="buyer"
        :style="{'justify-content': item.from == 'user' ? 'flex-end':'flex-start'}"
      >
        <div class="wd_left" v-if="item.from == 'admin'">
          <div class="ratiobox">
            <a class="bookImg" v-lazy:background-image="item.header_pic"></a>
          </div>
        </div>
        <div class="message">
          <div class="title">{{item.title}}</div>
          <div class="stateMessage">
            <p v-html="item.content"></p>
          </div>
          <div class="notice" v-if="item.notice">
            {{item.notice}}
          </div>
        </div>
        <div class="wd_right" v-if="item.from == 'user'">
          <div class="ratiobox">
            <a class="bookImg" v-lazy:background-image="item.header_pic"></a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div style="height: 60px;"></div>
    <div class="foot bottomBox" :class="{iphx:this.isIphx}" v-if="refund_state<3">
      <span class="button" @click="edit_refund" v-if="refund_state == 0">修改申请</span>
      <span class="button" @click="write_logistics" v-if="refund_state == 1 && refund_type==3">填写物流信息</span>
      <span class="button" @click="re_refund" v-if="refund_state == 2">重新申请</span>
      <span class="button" @click="cancle_refund" v-if="refund_state == 0 || refund_state == 1">撤销申请</span>
    </div>
    <EazyNav type="order" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>

<script>
import {
  ORDER_REFUND_LOG_GETS,
  ORDER_REFUND_CANCEL,ORDER_REFUN_GET
} from "../../../apis/shopping.js";
export default {
  data() {
    return {
      iconUrl: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png",
      order_id: null,
      detail_id: null,
      infoData: [],
      detailData:{},
      refund_state: null,
      apply_id:null,
      refund_type:null,
      refund_reason:null,
      refund_desc:null,
      refund_money:null,
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.detail_id = this.$route.query.detail_id;
    this.getInfo();
  },
  methods: {
    //获取退款记录
    async getInfo() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: this.order_id,
        detail_id: this.detail_id,
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_LOG_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        this.infoData = res.response_data;
        this.refund_state =
          res.response_data[res.response_data.length - 1].refund_state;
        this.apply_id = res.response_data[res.response_data.length - 1].apply_id;
        this.refund_type = res.response_data[res.response_data.length - 1].refund_type;

        for(let i=0;i<this.infoData.length;i++){
          this.infoData[i].content = this.infoData[i].content.replace(/[\r\n]/g,"</br>");
          console.log(this.infoData[i].content)
       }

      } else {
        this.$toast(res.error_message);
      }
    },

    //撤销退款
    cancle_refund() {
      this.$dialog
        .confirm({
          message: "您确定要撤销申请吗？"
        })
        .then(() => {
          this.cancle();
        })
        .catch(() => {
          // on cancel
        });
    },
    async cancle(){
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        apply_id:this.apply_id,
        // order_id:this.order_id,
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_CANCEL(data);
      if (res.hasOwnProperty("response_code")) {
        this.$toast('撤销申请成功！');
        location.reload();
      } else {
        this.$toast(res.error_message);
      }
    },
    //重新申请
    re_refund(){
      if(this.refund_type == 1){
        this.$router.push({
          name:"refundone",
          query:{
            order_id:this.order_id,
            detail_id:this.detail_id,
          }
        })
      }else if(this.refund_type == 2){
        this.$router.push({
          name:"refundtwo",
          query:{
            order_id:this.order_id,
            detail_id:this.detail_id,
          }
        })
      }else{
        this.$router.push({
          name:"refundthree",
          query:{
            order_id:this.order_id,
            detail_id:this.detail_id,
          }
        })
      }
    },
    // 修改申请
    edit_refund(){
      if(this.refund_type == 1){
        this.$router.push({
          name:"refundone",
          query:{
            order_id:this.order_id,
            detail_id:this.detail_id,
            apply_id:this.apply_id,
            type_of:'edit'
          }
        })
      }else if(this.refund_type == 2){
        this.$router.push({
          name:"refundtwo",
          query:{
            order_id:this.order_id,
            detail_id:this.detail_id,
            apply_id:this.apply_id,
            type_of:'edit'
          }
        })
      }else{
        this.$router.push({
          name:"refundthree",
          query:{
            order_id:this.order_id,
            detail_id:this.detail_id,
            apply_id:this.apply_id,
            type_of:'edit'
          }
        })
      }
    },
    //填写物流信息
    write_logistics(){
      this.$router.push({
        name:"refundedit",
        query:{
          apply_id:this.apply_id,
        }
      })
    }
  }
};
</script>
