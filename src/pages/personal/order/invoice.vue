<template>
  <div id="invoicePage">
    <van-cell-group id="one">
      <van-cell title="订单号:" v-model="invoiceData.orderNumber" value/>
      <!-- <van-cell title="发票类型:" value="普通发票" v-if="this.invoiceData.invoiceType == 1" is-link arrow-direction="down" @click="choosetype"/> -->
      <van-cell title="发票类型:" value="电子发票" />
      <van-cell title="发票内容:" :value="invoiceData.invoice_content"/>
      <!-- <van-field
        v-model="invoiceData.invoice_content"
        clearable
        clear
        label="发票内容:"
        placeholder="请填写发票内容"
      /> -->
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
          :error-message="invoiceData.company_message"
          @input="checkb"
        />
        <van-field
          v-model="invoiceData.number"
          clearable
          label="税号:"
          placeholder="请填写税号"
          clear
          v-show="type == 2 "
          :error-message="invoiceData.number_message"
          @input="check50"
        />
      </template>
      <van-field
        v-model="invoiceData.username"
        clearable
        label="收票人姓名:"
        placeholder="请填写收票人姓名"
        clear
        :error-message="invoiceData.name_message"
        @input="checka"
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
    <!-- <van-actionsheet
      v-model="invoiceTypeModle"
      :actions="invoiceTypeActions"
      cancel-text="取消"
      @select="invoiceTypeSelect"
      @cancel="invoiceTypeModle=false"
    /> -->
  </div>
</template>

<style src="@/style/scss/pages/personal/order/invoice.scss"  lang="scss"></style>

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
        invoiceType: 1,
        invoice_content: "明细",
        invoice_money: null,
        companyName: "",
        number: "",
        username: "",
        phone: "",
        error_message: "",
        name_message:"",
        company_message:"",
        number_message:"",
      },
      invoiceModle: false,
      // invoiceTypeModle: false,
      invoiceActions: [
        {
          name: "个人"
        },
        {
          name: "单位"
        }
      ],
      // invoiceTypeActions: [
      //   {
      //     name: "普通发票"
      //   },
      //   {
      //     name: "电子发票"
      //   }
      // ]
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
        // this.invoiceData.phone.length = 11 ;
      }
    },
    checka(){
      // console.log(this.invoiceData.username.length)
      if( this.invoiceData.username.length > 20){
        this.invoiceData.name_message = "内容不能大于20字";
        this.invoiceData.username = this.invoiceData.username.substring(0,20);
      }else{
        this.invoiceData.name_message = "";
        // console.log(111)
      }
    },
    check50(){
      if( this.invoiceData.number.length > 50 ){
        this.invoiceData.number_message = "税号不能大于50字";
        this.invoiceData.number = this.invoiceData.number.substring(0,50);
      }else{
        this.invoiceData.number_message = "";
      }
    },
    checkb(){
      if( this.invoiceData.companyName.length > 50 ){
        this.invoiceData.company_message = "公司名称不能大于50字";
        this.invoiceData.companyName = this.invoiceData.companyName.substring(0,50);
      }else{
        this.invoiceData.company_message = "";
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
            type: this.invoiceData.invoiceType,
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
            type: this.invoiceData.invoiceType,
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
        this.$router.go(-1);
        // this.$router.push('/personal/order/list');
        // this.$reload();
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
    // 选择发票抬头
    showAction(type) {
      this.invoiceModle = true;
    },
    invoiceSelect(item, index) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.invoiceModle = false;
      // this.infoList.sex = index + 1;
      if(item.name == '个人'){
        this.type = 1;
      }else if(item.name == '单位'){
        this.type = 2;
      }
      // console.log(item.name)
    },
    //选择发票类型
    // choosetype(){
    //   this.invoiceTypeModle = true;
    // },
    // invoiceTypeSelect(item, index) {
    //   // 点击选项时默认不会关闭菜单，可以手动关闭
    //   this.invoiceTypeModle = false;
    //   // this.infoList.sex = index + 1;
    //   if(item.name == '普通发票'){
    //     this.invoiceData.invoiceType = 1;
    //   }else if(item.name == '电子发票'){
    //     this.invoiceData.invoiceType = 2;
    //   }
    //   // console.log(item.name)
    // },
  }
};
</script>

