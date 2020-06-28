<template>
  <div id="invoicePage">
    <div class="content">
      <div class="huoba-cell huoba-cell-eight">
        <div class="huoba-cell-left">订单编号:</div>
        <div class="huoba-cell-mid">
          <span>{{invoiceData.orderNumber}}</span>
        </div>
      </div>
      <div class="huoba-cell huoba-cell-eight">
        <div class="huoba-cell-left">开票金额:</div>
        <div class="huoba-cell-mid">
          <span class="money">￥{{invoiceData.invoice_money}}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="huoba-cell huoba-cell-eight">
        <div class="huoba-cell-left">发票类型:</div>
        <div class="huoba-cell-mid">
          <span>电子普通发票</span>
        </div>
      </div>
      <div class="huoba-cell huoba-cell-eight">
        <div class="huoba-cell-left">发票内容:</div>
        <div class="huoba-cell-mid">
          <span>商品明细</span>
        </div>
      </div>
      <div class="huoba-cell huoba-cell-eight">
        <div class="huoba-cell-left">抬头内容*:</div>
        <div class="huoba-cell-mid"  v-if="invoice.flag == 1 || invoice.flag == 2">
          <span>{{invoice.invoice_title}}</span>
        </div>
        <div class="huoba-cell-mid" v-else>
          <van-radio-group v-model="radio_state">
            <van-radio name="1">
              <svg
                :class="props.checked ? 'icon check':'icon'"
                aria-hidden="true"
                slot="icon"
                slot-scope="props"
              >
                <use :xlink:href="props.checked ? '#icon-radio-block' : '#icon-guanbi'" />
              </svg>
              个人
            </van-radio>
            <van-radio name="2">
              <svg
                :class="props.checked ? 'icon check':'icon'"
                aria-hidden="true"
                slot="icon"
                slot-scope="props"
              >
                <use :xlink:href="props.checked ? '#icon-radio-block' : '#icon-guanbi'" />
              </svg>
              单位
            </van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="huoba-cell huoba-cell-eight" v-if="radio_state == '1'">
        <div class="huoba-cell-left">个人名称*:</div>
        <div class="huoba-cell-mid">
          <input type="text" readonly v-model="invoice.notify_people" v-if="invoice.flag == 1 || invoice.flag == 2"/>
          <input type="text" placeholder="请填写“个人”或您的姓名" v-model="invoiceData.username" v-else/>
        </div>
      </div>
      <div class="huoba-cell huoba-cell-eight" v-if="radio_state == '2'">
        <div class="huoba-cell-left">单位名称*:</div>
        <div class="huoba-cell-mid">
          <input type="text" readonly v-if="invoice.flag == 1 || invoice.flag == 2" v-model="invoice.notify_people" />
          <input type="text" placeholder="请填写单位名称" v-model="invoiceData.companyName" v-else/>
        </div>
      </div>
      <div class="huoba-cell huoba-cell-eight" v-if="radio_state == '2'">
        <div class="huoba-cell-left">税号*:</div>
        <div class="huoba-cell-mid">
          <input type="text" readonly v-if="invoice.flag == 1 || invoice.flag == 2" v-model="invoice.tax_number" />
          <input type="text" placeholder="请在此填写纳税人识别号" v-model="invoiceData.number" v-else/>
        </div>
      </div>
      <div class="huoba-cell huoba-cell-eight">
        <div class="huoba-cell-left">手机号码*:</div>
        <div class="huoba-cell-mid">
          <input type="text" readonly v-if="invoice.flag == 1 || invoice.flag == 2" v-model="invoice.notify_mobile" />
          <input type="text" placeholder="请填写收票人的手机号码" v-model="invoiceData.phone" v-else/>
        </div>
      </div>
    </div>
    <div class="tips" v-if="radio_state == '1'">
      提交后不能修改，请谨慎填写。<br>
      发票由商家开具，火把平台不保证发票信息准确无误。<br>
      开票金额为实际支付金额，不包含虚拟资产，优惠等扣减金额。<br>
      按税法要求，发票内容将显示详细商品名称与价格信息
    </div>
    <div class="tips" v-if="radio_state == '2'">
      提交后不能修改，请谨慎填写。
      开票金额为实际支付金额，不包含虚拟资产，优惠等扣减金额。
      按税法要求，发票内容将显示详细商品名称与价格信息；
    </div>
    <div style="height:50px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <button class="huoba-btn huoba-btn-three disabled" v-if="invoice.flag == 1 || invoice.flag == 2">已提交申请，商家处理中</button>
      <button class="huoba-btn huoba-btn-three" @click="submitAction" v-else>提交</button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/invoice.scss" scoped lang="scss"></style>

<script>
import { USER_ORDER_INVOICE_ADD,USER_ORDER_DETAIL_GET } from "../../../apis/user.js";
export default {
  data() {
    return {
      username: "",
      invoiceData: {
        orderNumber: "",
        invoiceType: 2,
        invoice_content: "商品明细",
        invoice_money: null,
        companyName: "",
        number: "",
        username: "",
        phone: "",
        error_message: "",
        name_message: "",
        company_message: "",
        number_message: ""
      },
      radio_state: "1",
      invoice:{}
    };
  },
  mounted() {
    this.invoiceData.orderNumber = this.$route.query.order_id;
    this.getData();
  },
  methods: {
    checkPhone() {
      var phoneNumber = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      this.invoiceData.phone = this.invoiceData.phone.substring(0, 11);
      if (!phoneNumber.test(this.invoiceData.phone)) {
        this.invoiceData.error_message = "请输入正确的手机号";
      } else {
        this.invoiceData.error_message = "";
      }
    },
    checka() {
      // console.log(this.invoiceData.username.length)
      if (this.invoiceData.username.length > 20) {
        // this.invoiceData.name_message = "内容不能大于20字";
        this.invoiceData.username = this.invoiceData.username.substring(0, 20);
      } else {
        this.invoiceData.name_message = "";
        // console.log(111)
      }
    },
    check50() {
      if (this.invoiceData.number.length > 50) {
        // this.invoiceData.number_message = "税号不能大于50字";
        this.invoiceData.number = this.invoiceData.number.substring(0, 50);
      } else {
        this.invoiceData.number_message = "";
      }
    },
    checkb() {
      if (this.invoiceData.companyName.length > 50) {
        // this.invoiceData.company_message = "公司名称不能大于50字";
        this.invoiceData.companyName = this.invoiceData.companyName.substring(
          0,
          50
        );
      } else {
        this.invoiceData.company_message = "";
      }
    },
    async submitInvoice() {
      var data = {};
      var res;
      switch (this.radio_state) {
        case "1":
          data = {
            order_id: this.invoiceData.orderNumber,
            type: this.invoiceData.invoiceType,
            remarks: this.invoiceData.invoice_content,
            invoice_money: this.invoiceData.invoice_money,
            invoice_title: '个人',
            notify_people: this.invoiceData.username,
            notify_mobile: this.invoiceData.phone,
            version: "1.0"
          };
          res = await USER_ORDER_INVOICE_ADD(data);
          break;
        case "2":
          data = {
            order_id: this.invoiceData.orderNumber,
            invoice_title: '单位',
            type: this.invoiceData.invoiceType,
            remarks: this.invoiceData.invoice_content,
            invoice_money: this.invoiceData.invoice_money,
            tax_number: this.invoiceData.number,
            notify_people: this.invoiceData.companyName,
            notify_mobile: this.invoiceData.phone,
            version: "1.0"
          };
          res = await USER_ORDER_INVOICE_ADD(data);
          break;
      }
      // 出错提示
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        this.$toast('提交成功')
        this.$router.go(-1);
      } else {
        this.$toast(res.error_message);
      }
    },
    submitAction() {
      var phoneNumber = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (!phoneNumber.test(this.invoiceData.phone)) {
        this.$toast('请输入正确的手机号码')
        return
      }
      if (
        this.radio_state == '1' &&
        phoneNumber.test(this.invoiceData.phone) &&
        this.invoiceData.username.length > 0
      ) {
        this.submitInvoice("personal");
      } else if (
        this.radio_state == '2' &&
        this.invoiceData.number.length > 0 &&
        this.invoiceData.companyName.length > 0
      ) {
        this.submitInvoice("company");
        // console.log(this.invoiceData.invoice_money)
      } else {
        this.$toast("请填写完整信息");
      }
    },
    async getData(){
      var tStamp = this.$getTimeStamp();
      var data = {
        order_id: this.invoiceData.orderNumber,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_ORDER_DETAIL_GET(data);
      if (res.hasOwnProperty("response_code")) {
        if(res.response_data.can_invoice_money > 0){
          this.invoiceData.invoice_money = res.response_data.can_invoice_money;
        }else{
          this.invoiceData.invoice_money = res.response_data.invoice_info.invoice_money;
        }
        this.invoice = res.response_data.invoice_info;
        if(this.invoice.invoice_title == '单位'){
          this.radio_state = '2'
        }
      }else{
        this.$toast(res.error_message);
      }
    }
  }
};
</script>

