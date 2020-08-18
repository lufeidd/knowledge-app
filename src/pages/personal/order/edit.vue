<template>
  <div id="editPage">
    <!-- <div class="company">
      <van-cell title="物流公司：" @click="choose" v-model="dispatch_compay" value/>
    </div>
    <div class="freight">
      <span class="freightText">物流单号：</span>
      <input type="text" placeholder="请输入物流单号" @input="number" v-model="dispatch_number">
    </div>-->
    <div class="content">
      <van-cell-group>
        <van-field
          v-model="dispatch_compay"
          label="物流公司："
          placeholder="请选择物流公司"
          readonly
          @click="choose"
        />
        <van-field v-model="dispatch_number" label="物流单号：" placeholder="请输入物流单号" clearable />
      </van-cell-group>
    </div>

    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button type="danger" size="large" @click="submit">提交</van-button>
    </div>
    <van-popup v-model="show" position="bottom">
      <van-picker
        show-toolbar
        title="请选择物流公司"
        :columns="companyList"
        @cancel="onCancel"
        :default-index="1"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- <CopyRight></CopyRight> -->
    <!-- <EazyNav type="order" :isShow="false"></EazyNav> -->
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" scoped lang="scss"></style>


<script>
import {
  ORDER_REFUND_DISPATCH_EDIT,
  ORDER_REFUND_DISPATCH_COMPANY
} from "../../../apis/shopping.js";
export default {
  data() {
    return {
      apply_id: null,
      dispatch_compay: "",
      dispatch_number: "",
      show: false,
      companyList: []
    };
  },
  mounted() {
    this.apply_id = this.$route.query.apply_id;
    this.logisticsCompany();
  },
  methods: {
    choose() {
      this.show = true;
    },
    onConfirm(value, index) {
      console.log(value);
      this.dispatch_compay = value;
      this.show = false;
    },
    onCancel() {
      this.show = false;
    },
    submit() {
      if (this.dispatch_compay.length > 0 && this.dispatch_number.length > 0) {
        this.logistics();
      } else {
        this.$toast("请填写完整信息！");
      }
    },
    async logistics() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        apply_id: this.apply_id,
        dispatch_compay: this.dispatch_compay,
        dispatch_number: this.dispatch_number
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_DISPATCH_EDIT(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("提交成功！");
        this.$router.go(-1);
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取物流公司
    async logisticsCompany() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_REFUND_DISPATCH_COMPANY(data);

      if (res.hasOwnProperty("response_code")) {
        this.companyList = res.response_data.company;
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

