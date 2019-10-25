<template>
  <div id="readerPage">
    <div class="headNav">
      <div class="left">
        <svg class="icon" aria-hidden="true" @click="showcatalog">
          <use xlink:href="#icon-category-line" />
        </svg>
        <svg class="icon" aria-hidden="true" @click="set">
          <use xlink:href="#icon-personalSet" />
        </svg>
        <div style="position:relative;">
          <svg class="icon" aria-hidden="true" @click="showComment">
            <use xlink:href="#icon-personalNews" />
          </svg>
          <span class="tags" v-if="commentNumber">{{commentNumber}}</span>
        </div>
      </div>
      <div>
        <svg class="icon" aria-hidden="true" @click="toShelf">
          <use xlink:href="#icon-home-line" />
        </svg>
      </div>
    </div>
    <div v-if="charge" class="charge">
      <p class="price">￥{{info.price}}</p>
      <p class="title">第 {{currenChapterTitle}} 章</p>
      <p style="margin-top:80px;">
        <van-button
          round
          type="danger"
          style="min-width:255px;font-size:18px;"
          @click="buyebook"
        >余额支付</van-button>
      </p>
    </div>
    <div v-else>
      <div class="ebookDetail" v-html="detail_desc">{{detail_desc}}</div>
      <div class="footBtn">
        <van-button round size="small" type="danger" @click="prev">上一章</van-button>
        <van-button round size="small" type="danger" @click="next">下一章</van-button>
      </div>
    </div>
    <!-- <div style="position:relative;height:90px;">
      <CopyRight></CopyRight>
    </div>-->

    <!-- 设置弹层 -->
    <van-popup v-model="setShow" position="bottom" >
      <div class="set">
        <div class="head">
          <span>设置</span>
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </div>
        <div class="mid">
          <div class="setColor">
            <span
              :class="'circle'+ ' ' +item"
              v-for="(item,index) in bgColors"
              :key="index"
              @click.stop="checkBg(item,index)"
            ></span>
          </div>
          <div class="setWord">
            <van-button
              round
              size="small"
              type="danger"
              @click.stop="reduce"
              style="min-width:85px;font-size:18px;"
            >A-</van-button>
            <span class="fontSize">{{fontsize}}</span>
            <van-button
              round
              size="small"
              type="danger"
              @click.stop="add"
              style="min-width:85px;font-size:18px;"
            >A+</van-button>
          </div>
          <div class="sliderWord">
            <van-slider
              :step="5"
              inactive-color="#b5b5b5"
              active-color="#b5b5b5"
              v-model="value"
              @change="onChange"
            />
            <span style="left:0" class="rowLine"></span>
            <span style="left:20%" class="rowLine"></span>
            <span style="left:40%" class="rowLine"></span>
            <span style="left:60%" class="rowLine"></span>
            <span style="left:80%" class="rowLine"></span>
            <!-- <span style="left:30%" class="rowLine"></span> -->
            <span style="right:0" class="rowLine"></span>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 支付购买弹层 -->
    <ebookpay
      :goods_id="goods_id"
      ref="pay"
      :info="info"
      :isSuccessPay="isSuccessPay"
      @rechargeBuy="payrecharge"
      @payMoney="payMoney"
      @chooseCouponChangePrice="chooseCouponChangePrice"
    ></ebookpay>
    <!-- 充值余额并支付 -->
    <ebookrecharge ref="recharge" :goods_id="goods_id" :info="info" @return="returnUp"></ebookrecharge>
    <!-- 目录 -->
    <ebookcatalog
      ref="catalog"
      @chargeChange="chargeChange"
      :goods_id="goods_id"
      :chapter_id="chapter_id"
      @changecurrenChapterTitle="changecurrenChapterTitle"
      :ebookList="ebookList"
      :info="info"
      @ebookChange="getChapter"
    ></ebookcatalog>
    <!-- 评论 -->
    <ebookcomment ref="comment" :goods_id="goods_id" :isLogin="isLogin"></ebookcomment>
    <EazyNav type="brand" ref="nav"></EazyNav>
    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
    <van-dialog v-model="showDialog" title="请输入手机验证码" show-cancel-button cancelButtonText="放弃支付" @cancel="reflesh">
      <div class="codeBox">
        <div class="price">
          ¥
          <span class="money">{{ pay_money }}</span>
        </div>
        <div class="code">
          <van-row>
            <van-col span="14" style="text-align:left;">手机号:{{ pay_mobilephone }}</van-col>
            <van-col span="10" style="text-align: right;">
              <template v-if="codeData.disabled">
                <van-button size="small" round disabled type="danger">{{ codeData.timeMsg }}</van-button>
              </template>
              <template v-else>
                <van-button size="small" round type="danger" @click="getCode">{{ codeData.timeMsg }}</van-button>
              </template>
            </van-col>
          </van-row>
        </div>
        <!-- 密码输入框 -->
        <van-password-input :value="passvalue" :mask="false" @focus="keyboardShow" />
      </div>
    </van-dialog>
  </div>
</template>

<style src="@/style/scss/pages/ebook/reader.scss" scoped lang="scss"></style>
<style lang="scss">
#readerPage {
  .van-dialog__confirm {
    display: none;
  }
  .ebookDetail.cl5 p {
    color: #646a7a !important;
  }
  .ebookDetail.cl5 p span{
    color: #646a7a !important;
  }
  .ebookDetail.cl5 h1 {
    color: #646a7a !important;
  }
  .ebookDetail.cl5 h2 {
    color: #646a7a !important;
  }
  table{
    width:auto !important;
  }
  .ebookDetail.cl5 table{
    color:#646a7a !important;
  }
}
</style>
<script>
import ebookcatalog from "../ebook/catalog";
import ebookcomment from "../ebook/comment";
import ebookpay from "../ebook/pay";
import ebookrecharge from "../ebook/recharge";

//  引入接口
import {
  ORDER_VIRTUAL_ADD,
  ORDER_VIRTUAL_ADD_SENDCODE,
  ORDER_VIRTUAL_ADD_PAY,
  ORDER_VIRTUAL_ADDINFO
} from "../../apis/shopping.js";
import {
  EBOOK_CHAPTER,
  EBOOK_CATALOG,
  EBOOK_INFO,
  EBOOK_READING,
  EBOOK_STYLE
} from "../../apis/ebook.js";
import { COMMENT } from "../../apis/public.js";
export default {
  components: { ebookcatalog, ebookcomment, ebookpay, ebookrecharge },
  data() {
    return {
      goods_id: null,
      chapter_id: null,
      charge: false,
      chargeChapter: "",
      setShow: false,
      rechargeShow: false,
      detail_desc: "",
      bgColors: ["cl1", "cl2", "cl3", "cl4", "cl5", "cl6"],
      value: 40,
      fontsize: 31,
      bgcolor: "rgb(255, 255, 255)",
      info: {},
      minChapter: null,
      maxChapter: null,
      // 支付方式
      payBank: [],
      // tip
      descInfo: [],
      commentNumber: null,
      currenChapterTitle: null,
      ebookList: [],
      test: true,
      ebookSchedule: null,
      isLogin: null,
      // 密码输入框
      showDialog: false,
      passvalue: "",
      showKeyboard: false,
      mobile: "",
      code: "",
      pay_mobilephone: "",
      pay_money: "",
      // 验证码
      codeData: {
        disabled: false,
        timeMsg: "获取验证码",
        time: 120
      },
      // 订单号
      order_id: "",
      pay_id: "",
      isSuccessPay:null,
    };
  },
  mounted() {
    this.isSuccessPay = this.$route.query.isSuccessPay;
    this.currenChapterTitle = parseInt(this.$route.query.currenChapterTitle);
    this.goods_id = parseInt(
      this.$route.query.goods_id ? this.$route.query.goods_id : null
    );
    this.chapter_id = parseInt(
      this.$route.query.chapter_id ? this.$route.query.chapter_id : null
    );
    this.value = parseInt(
      localStorage.getItem("ebookFontSizeValue")
        ? localStorage.getItem("ebookFontSizeValue")
        : 40
    );
    this.bgcolor = localStorage.getItem("bgcolor")
      ? localStorage.getItem("bgcolor")
      : "rgb(255, 255, 255)";
    this.fontsize = parseInt(
      localStorage.getItem("ebookFontSize")
        ? localStorage.getItem("ebookFontSize")
        : 16
    );
    if (this.bgcolor == "rgb(22, 26, 38)") {
      $(".ebookDetail").addClass("cl5");
    } else {
      $(".ebookDetail").removeClass("cl5");
    }
    $(".ebookDetail").css("font-size", this.fontsize + "px");
    $("#readerPage").css("background-color", this.bgcolor);
    this.getebookInfo();
    this.getebookList();
    // this.getChapter(this.chapter_id);
    this.commentData();
    this.getEbookStyle()
    $('body').on('click','.ebookDetail a',function(e){
      e.preventDefault();
    })
  },
  methods: {
    toShelf() {
      this.$router.push({ name: "ebookshelf" });
    },
    changecurrenChapterTitle(_value) {
      this.currenChapterTitle = _value;
    },
    async getEbookStyle(){
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        goods_id: this.goods_id,
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_STYLE(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    },
    //记录电子书阅读时长
    async ebookReadingRecord() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        goods_id: this.goods_id,
        chapter_id: this.chapter_id,
        index_value: 0,
        schedule: this.ebookSchedule
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_READING(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取评论条数
    async commentData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        page: 1,
        goods_id: this.goods_id,
        page_size: 10,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await COMMENT(data);

      if (res.hasOwnProperty("response_code")) {
        this.commentNumber = res.response_data.total_count;
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取电子书基本信息
    async getebookInfo() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(res);
        this.info = res.response_data;
        this.$refs.pay.price = this.info.price;
        document.title = res.response_data.goods_title;

        // 获取页面分享信息
        var _pageName = "goods/detail";
        var _params = JSON.stringify({
          goods_id: this.$route.query.goods_id
          // album_id: this.$route.query.pid
        });
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取电子书章节
    async getebookList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_CATALOG(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        for (var i = 0; i < res.response_data.length; i++) {
          if (res.response_data[i].chapter_hidden == 0) {
            this.ebookList.push(res.response_data[i]);
          }
        }
        this.minChapter = this.ebookList[0].chapter_id;
        this.maxChapter = this.ebookList.slice(-1)[0].chapter_id;
        this.ebookSchedule = (
          (this.currenChapterTitle / this.ebookList.length) *
          100
        ).toFixed(2);
        this.ebookSchedule = Number(this.ebookSchedule);
        this.getChapter(this.chapter_id);
        // console.log(777,this.currenChapterTitle,this.ebookList.length,this.ebookSchedule)
        // if(this.charge){
        //   this.ebookReadingRecord();
        // }
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取电子书单独章节内容
    async getChapter(chapter_id) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        chapter_id: chapter_id,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_CHAPTER(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        this.charge = false;
        // $(".ebookDetail").html(res.response_data.chapter_content);
        this.detail_desc = res.response_data.chapter_content;
        // $("html,body").animate({ scrollTop: 0 }, 800);
        this.chapter_id = chapter_id;
        this.ebookReadingRecord();
        // $('.ebookDetail').find('link').remove();
        // console.log(777,$('.ebookDetail').find('link'))
      } else {
        this.$toast(res.error_message);
        if (res.error_message == "该章节是收费章节，请先购买") {
          this.charge = true;
        }
      }
    },
    // 上一章
    prev() {
      if (this.chapter_id > this.minChapter) {
        this.currenChapterTitle = this.currenChapterTitle - 1;
        this.chapter_id = this.ebookList[this.currenChapterTitle-1].chapter_id;
        // console.log(555,this.chapter_id);return
        this.$router.push({
          name: "ebookreader",
          query: {
            goods_id: this.goods_id,
            chapter_id: this.chapter_id,
            currenChapterTitle: this.currenChapterTitle
          }
        });
        location.reload();
      } else {
        this.$toast("已经是第一章");
      }
    },
    // 下一章
    next() {
      if (this.chapter_id < this.maxChapter) {
        // this.chapter_id = this.chapter_id + 1;
        this.chapter_id = this.ebookList[this.currenChapterTitle].chapter_id;
        this.currenChapterTitle = this.currenChapterTitle + 1;
        // console.log(666,this.chapter_id);return
        this.$router.push({
          name: "ebookreader",
          query: {
            goods_id: this.goods_id,
            chapter_id: this.chapter_id,
            currenChapterTitle: this.currenChapterTitle
          }
        });
        location.reload();
      } else {
        this.$toast("已经是最后一章");
      }
    },
    // 设置
    set() {
      this.setShow = true;
    },
    checkBg(item, index) {
      // console.log(item, index);
      $(".circle")
        .eq(index)
        .addClass("checked");
      $(".circle")
        .eq(index)
        .siblings()
        .removeClass("checked");
      var _bgc = $(".circle")
        .eq(index)
        .css("background-color");
      // $(".ebookDetail").parent().css("background-color", _bgc);
      $("#readerPage").css("background-color", _bgc);
      localStorage.setItem("bgcolor", _bgc);
      if (index == 4) {
        $(".ebookDetail").addClass("cl5");
      } else {
        $(".ebookDetail").removeClass("cl5");
      }
    },
    closePopup() {
      this.setShow = false;
      this.buyShow = false;
      this.rechargeShow = false;
    },
    onChange(value) {
      // this.$toast("当前值：" + value);
      this.changeFont(value);
    },
    // 转换对应值的字体
    changeFont(size) {
      var _size;
      if (size == 0) {
        _size = 12 + "px";
        this.fontsize = 12;
      } else if (size <= 20 && size > 0) {
        _size = 14 + "px";
        this.fontsize = 14;
        this.value = 20;
      } else if (size <= 40 && size > 20) {
        _size = 16 + "px";
        this.fontsize = 16;
        this.value = 40;
      } else if (size <= 60 && size > 40) {
        _size = 19 + "px";
        this.fontsize = 19;
        this.value = 60;
      } else if (size <= 80 && size > 60) {
        _size = 22 + "px";
        this.fontsize = 22;
        this.value = 80;
      } else if (size <= 100 && size > 80) {
        _size = 24 + "px";
        this.fontsize = 24;
        this.value = 100;
      }
      // console.log(_size);
      localStorage.setItem("ebookFontSize", this.fontsize);
      localStorage.setItem("ebookFontSizeValue", size);
      $(".ebookDetail").css("font-size", _size);
    },
    reduce() {
      if (this.fontsize > 12) {
        if (this.fontsize == 19 || this.fontsize == 22) {
          this.fontsize = this.fontsize - 3;
          this.value = this.value - 20;
        } else {
          this.fontsize = this.fontsize - 2;
          this.value = this.value - 20;
        }
      }
      var _size = this.fontsize + "px";
      localStorage.setItem("ebookFontSize", this.fontsize);
      $(".ebookDetail").css("font-size", _size);
      localStorage.setItem("ebookFontSizeValue", this.value);
    },
    add() {
      if (this.fontsize < 24) {
        if (this.fontsize == 16 || this.fontsize == 19) {
          this.fontsize = this.fontsize + 3;
          this.value = this.value + 20;
        } else {
          this.fontsize = this.fontsize + 2;
          this.value = this.value + 20;
        }
      }
      var _size = this.fontsize + "px";
      localStorage.setItem("ebookFontSize", this.fontsize);
      $(".ebookDetail").css("font-size", _size);
      localStorage.setItem("ebookFontSizeValue", this.value);
    },
    // 目录
    showcatalog() {
      this.$refs.catalog.catalogPopup = true;
      this.$refs.catalog.getebookReading();
      // this.$refs.catalog.getInfo();
      // this.$refs.catalog.getList();
    },
    chargeChange(state) {
      this.charge = state;
    },
    // 评论
    showComment() {
      this.$refs.comment.commentPopup = true;
      this.isLogin = this.$refs.nav.is_Login;
      // console.log(777,this.$refs.nav.is_Login);
    },
    // 支付
    buyebook() {
      this.isLogin = this.$refs.nav.is_Login;
      if (this.isLogin) {
        this.$refs.pay.buyShow = true;
        this.$refs.pay.price = this.info.price;
        this.ebookCoupon();
      } else {
        this.$router.push({ name: "login" });
      }
    },
    payrecharge() {
      this.$refs.pay.buyShow = false;
      this.$refs.recharge.rechargeShow = true;
      // location.reload();
    },
    returnUp() {
      this.$refs.recharge.rechargeShow = false;
      this.$refs.pay.buyShow = true;
    },
        // 数字键盘支付
    payMoney() {
      this.passvalue = "";
      this.showDialog = true;
      // 重置倒计时
      clearInterval(this.clock);
      this.clock = null;
      this.codeData.disabled = false;
      this.codeData.timeMsg = "获取验证码";
      this.addOrderData(this.activeIndex);
    },
    // 新增虚拟订单
    async addOrderData(_index) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        ticket_id: this.$refs.pay.order_ticket_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD(data);
      if (res.hasOwnProperty("response_code")) {
        this.pay_mobilephone = res.response_data.pay_mobilephone;
        this.pay_money = res.response_data.pay_money;
        this.order_id = res.response_data.order_id;
        this.pay_id = res.response_data.pay_id;

        // 交易支付请求发起
        // this.cashierPayData(this.pay_id);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 订单余额支付手机验证码发送
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    async sms() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        order_id: this.order_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD_SENDCODE(data);
      if (res.hasOwnProperty("response_code")) {
        // console.log(123, res);
      } else {
        this.$toast(res.error_message);
      }
    },
    keyboardShow() {
      this.showKeyboard = true;
      $(".van-number-keyboard").css("z-index", 10000);
    },
    onInput(key) {
      this.passvalue = (this.passvalue + key).slice(0, 6);
      if (this.passvalue.length == 6) {
        this.payData(this.passvalue);
      }
    },
    onDelete() {
      this.passvalue = this.passvalue.slice(0, this.passvalue.length - 1);
    },
    // 输完验证码获取支付接口
    async payData(__code) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        pay_id: this.pay_id,
        type: "NORMAL",
        code: __code,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADD_PAY(data);
      if (res.hasOwnProperty("response_code")) {
        this.showDialog = false;
        this.showKeyboard = false;
        clearInterval(this.clock);
        this.clock = null;
        this.codeData.disabled = false;
        this.codeData.timeMsg = "获取验证码";
        location.reload();
        this.$toast("支付成功");
      } else {
        this.$toast(res.error_message);
      }
    },
    // 电子书优惠券
    async ebookCoupon() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        goods_id:this.goods_id,
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_VIRTUAL_ADDINFO(data);
      if (res.hasOwnProperty("response_code")) {
        this.$refs.pay.ticketList = res.response_data.ticket_lists;
      } else {
        this.$toast(res.error_message);
      }
    },
    reflesh(){
      this.ebookCoupon();
    },
    // 选择优惠券改变价格
    chooseCouponChangePrice(price){
      this.$refs.recharge.price = price;
    }
  }
};
</script>
