<template>
  <div id="invoicePage">
    <van-cell-group id="one">
      <van-cell title="订单号:" v-model="invoiceData.orderNumber" value/>
      <van-cell title="发票类型:" :value="invoiceData.invoiceType"/>
      <van-field
        v-model="invoiceData.invoice_content"
        clearable
        clear
        label="发票内容:"
        placeholder="请填写发票内容"
      />
      <van-cell
        title="开票抬头:"
        value="个人"
        v-if="type == 1"
        is-link
        arrow-direction="down"
        @click="showAction()"
      />
      <van-cell title="开票抬头:" value="单位" v-else id="two" @click="showAction()" is-link
        arrow-direction="down"/>
    </van-cell-group>
    <van-cell-group>
      <template>
        <van-field
          v-model="invoiceData.companyName"
          clearable
          label="单位名称:"
          placeholder="请填写单位名称"
          clear
          v-show="type == 2 "
        />
        <van-field
          v-model="invoiceData.number"
          clearable
          label="税号:"
          placeholder="请填写税号"
          clear
          v-show="type == 2 "
        />
      </template>
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
        :error-message="invoiceData.error_message"
        @input="checkPhone"
      />
    </van-cell-group>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{iphx:this.isIphx}" @click="submitAction">
      <van-button type="danger" size="large">提交</van-button>
    </div>
    <easyNav :navData="navData"></easyNav>
    <van-actionsheet
      v-model="invoiceModle"
      :actions="invoiceActions"
      cancel-text="取消"
      @select="invoiceSelect"
      @cancel="invoiceModel=false"
    />
  </div>
</template>

<style src="@/style/scss/pages/personal/order/invoice.scss"  lang="scss"></style>
<style lang="scss">
#invoicePage {
.van-hairline--top-bottom:after {
border-width: 1px 0 0 0;
border-color: #ebedf0;
}
}
</style>


<script>
import easyNav from "./../../../components/easyNav";
import { USER_ORDER_INVOICE_ADD } from "../../../apis/user.js";
export default {
  components: {
    easyNav
  },
  data() {
    return {
      navData: {
        fold: false,
        home: true,
        homeLink: "/brand/index",
        search: false,
        // searchLink: "/search",
        personal: true,
        personalLink: "/personal/index",
        type: "brand"
      },
      username: "",
      type: 1,
      invoiceData: {
        orderNumber: "",
        invoiceType: "电子发票",
        invoice_content: "",
        invoice_money: null,
        companyName: "",
        number: "",
        username: "",
        phone: "",
        error_message: ""
      },
      invoiceModle: false,
      invoiceActions: [
        {
          name: "个人"
        },
        {
          name: "单位"
        }
      ]
    };
  },
  mounted() {
    this.invoiceData.orderNumber = this.$route.query.order_id;
    this.invoiceData.invoice_money = this.$route.query.money;
    console.log(this.invoiceData.invoice_money)
  },
  methods: {
    checkPhone() {
      var phoneNumber = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (phoneNumber.test(this.invoiceData.phone)) {
        this.invoiceData.error_message = "";
      } else {
        this.invoiceData.error_message = "请输入正确的手机号";
      }
    },
    async submitInvoice(__type) {
      var data = {};
      var res;
      switch (__type) {
        case "personal":
          data = {
            order_id: this.invoiceData.orderNumber,
            invoice_title: "个人",
            type: 2,
            remarks: this.invoiceData.invoice_content,
            invoice_money: this.invoiceData.invoice_money,
            notify_people: this.invoiceData.username,
            notify_mobile: this.invoiceData.phone,
            version: "1.0",
          };
          res = await USER_ORDER_INVOICE_ADD(data);
          this.$toast("已提交个人发票~");
          break;
        case "company":
          data = {
            order_id: this.invoiceData.orderNumber,
            invoice_title: this.invoiceData.companyName,
            type: 2,
            remarks: this.invoiceData.invoice_content,
            invoice_money: this.invoiceData.invoice_money,
            tax_number: this.invoiceData.number,
            notify_people: this.invoiceData.username,
            notify_mobile: this.invoiceData.phone,
            version: "1.0",
          };
          res = await USER_ORDER_INVOICE_ADD(data);
          this.$toast("已提交单位发票~");
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    },
    submitAction() {
      if ( this.type == 1 && this.invoiceData.phone.length > 0 && this.invoiceData.username.length > 0
      ) {
        this.submitInvoice("personal");
        // console.log(this.invoiceData.invoice_money)
      } else if (this.type == 2 && this.invoiceData.number.length > 0 && this.invoiceData.phone.length > 0 &&this.invoiceData.username.length > 0 && this.invoiceData.companyName.length > 0
      ) {
        this.submitInvoice("company");
        // console.log(this.invoiceData.invoice_money)
      } else {
        this.$toast("请填写完整信息");
      }
    },
    showAction(type) {
      this.invoiceModle = true;
    },
    // 发票抬头
    invoiceSelect(item, index) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.invoiceModle = false;
      // this.infoList.sex = index + 1;
      if(item.name == '个人'){
        this.type = 1;
      }else if(item.name == '单位'){
        this.type = 2;
      }
      console.log(item.name)
    }
  }
};
</script>

