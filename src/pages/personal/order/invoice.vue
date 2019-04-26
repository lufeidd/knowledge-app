<template>
  <div id="invoicePage">
    <van-cell-group id="one">
      <van-cell
        title="订单号:"
        v-model="invoiceData.orderNumber"
        value
        is-link
        arrow-direction="down"
      />
      <van-cell title="发票类型:" v-model="invoiceData.invoiceType" value/>
      <van-cell title="发票内容:" v-model="invoiceData.invoiceContent" value/>
    </van-cell-group>
    <van-cell-group>
      <van-field clearable label="开票抬头:" placeholder="个人" clear v-show="type.personal"/>
      <van-field clearable label="开票抬头:" placeholder="单位" clear v-show="!type.personal"/>
      <van-field
        v-model="invoiceData.companyName"
        clearable
        label="单位名称:"
        placeholder="请填写单位名称"
        clear
        v-show="!type.personal"
      />
      <van-field
        v-model="invoiceData.number"
        clearable
        label="税号:"
        placeholder="请填写税号"
        clear
        v-show="!type.personal"
      />
      <van-field
        v-model="invoiceData.username"
        clearable
        label="收票人姓名:"
        placeholder="请填写收票人姓名"
        clear
      />
      <van-field
        v-model="invoiceData.phone"
        clearable
        label="收票人手机号:"
        placeholder="请填写收票人手机号"
        clear
      />
    </van-cell-group>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button type="danger" size="large">提交</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/invoice.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      username: "",
      type: { personal: false },
      invoiceData: {
        orderNumber: "4567892654",
        invoiceType: "电子发票",
        invoiceContent: "明细",
        companyName: "",
        number: "66",
        username: "",
        phone: ""
      }
    };
  },
  methods: {}
};
</script>

