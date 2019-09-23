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
          <span class="tags">{{commentNumber}}</span>
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
      <div class="ebookDetail" v-html="detail_desc"></div>
      <div class="footBtn">
        <van-button round size="small" type="danger" @click="prev">上一章</van-button>
        <van-button round size="small" type="danger" @click="next">下一章</van-button>
      </div>
    </div>
    <!-- <div style="position:relative;height:90px;">
      <CopyRight></CopyRight>
    </div>-->

    <!-- 设置弹层 -->
    <van-popup v-model="setShow" position="bottom">
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
              @click="checkBg(item,index)"
            ></span>
          </div>
          <div class="setWord">
            <van-button
              round
              size="small"
              type="danger"
              @click="reduce"
              style="min-width:85px;font-size:18px;"
            >A-</van-button>
            <span class="fontSize">{{fontsize}}</span>
            <van-button
              round
              size="small"
              type="danger"
              @click="add"
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
    <ebookpay :goods_id="goods_id" ref="pay" :info="info" @rechargeBuy="payrecharge"></ebookpay>
    <!-- 充值余额并支付 -->
    <ebookrecharge ref="recharge" :info="info" @return="returnUp"></ebookrecharge>
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
    <ebookcomment ref="comment" :goods_id="goods_id"></ebookcomment>
    <EazyNav type="brand"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/ebook/reader.scss" scoped lang="scss"></style>
<style lang="scss">
#readerPage {
  .van-dialog__confirm {
    display: none;
  }
}
</style>
<script>
import ebookcatalog from "../ebook/catalog";
import ebookcomment from "../ebook/comment";
import ebookpay from "../ebook/pay";
import ebookrecharge from "../ebook/recharge";
//  引入接口
import { EBOOK_CHAPTER, EBOOK_CATALOG, EBOOK_INFO } from "../../apis/ebook.js";
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
      value: 0,
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
      currenChapterTitle:null,
      ebookList:[],
      test:true,
    };
  },
  mounted() {
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
        : 0
    );
    this.bgcolor = localStorage.getItem("bgcolor")
      ? localStorage.getItem("bgcolor")
      : "rgb(255, 255, 255)";
    this.fontsize = parseInt(
      localStorage.getItem("ebookFontSize")
        ? localStorage.getItem("ebookFontSize")
        : 31
    );
    $(".ebookDetail").css("font-size", this.fontsize + "px");
    // $(".ebookDetail").parent().css("background-color", this.bgcolor);
    $(".ebookDetail")
      .parent()
      .css("background-color", this.bgcolor);
    this.getebookInfo();
    this.getChapter(this.chapter_id);
    this.getebookList();
    this.commentData();
  },
  methods: {
    toShelf() {
      this.$router.push({ name: "ebookshelf" });
    },
    changecurrenChapterTitle(_value){
      this.currenChapterTitle = _value;
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
        console.log(res);
        this.info = res.response_data;
        document.title = res.response_data.goods_title;
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
        for(var i=0;i<res.response_data.length;i++){
          if(res.response_data[i].chapter_hidden == 0){
            this.ebookList.push(res.response_data[i])
          }
        }
        this.minChapter = this.ebookList[0].chapter_id;
        this.maxChapter = this.ebookList.slice(-1)[0].chapter_id;
        // console.log(777,this.minChapter,this.maxChapter)
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
        $("html,body").animate({ scrollTop: 0 }, 800);
        this.chapter_id = chapter_id;
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
        this.chapter_id = this.chapter_id - 1;
        this.getChapter(this.chapter_id);
        this.currenChapterTitle = this.currenChapterTitle - 1;
      } else {
        this.$toast("已经是第一章");
      }
    },
    // 下一章
    next() {
      if (this.chapter_id < this.maxChapter) {
        this.chapter_id = this.chapter_id + 1;
        this.getChapter(this.chapter_id);
        this.currenChapterTitle = this.currenChapterTitle + 1;
      } else {
        this.$toast("已经是最后一章");
      }
    },
    // 设置
    set() {
      this.setShow = true;
    },
    checkBg(item, index) {
      console.log(item, index);
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
      $(".ebookDetail")
        .parent()
        .css("background-color", _bgc);
      localStorage.setItem("bgcolor", _bgc);
      console.log(_bgc);
    },
    closePopup() {
      this.setShow = false;
      this.buyShow = false;
      this.rechargeShow = false;
    },
    onChange(value) {
      // this.$toast("当前值：" + value);
      this.changeFont(value);
      this.value = value;
    },
    // 转换对应值的字体
    changeFont(size) {
      var _size = size;
      if (size == 0) {
        _size = 31 + "px";
        this.fontsize = 31;
      } else if (size <= 20 && size > 0) {
        _size = 34 + "px";
        this.fontsize = 34;
        this.value = 20;
      } else if (size <= 40 && size > 20) {
        _size = 37 + "px";
        this.fontsize = 37;
        this.value = 40;
      } else if (size <= 60 && size > 40) {
        _size = 40 + "px";
        this.fontsize = 40;
        this.value = 60;
      } else if (size <= 80 && size > 60) {
        _size = 43 + "px";
        this.fontsize = 43;
        this.value = 80;
      } else if (size <= 100 && size > 80) {
        _size = 46 + "px";
        this.fontsize = 46;
        this.value = 100;
      }
      console.log(_size);
      localStorage.setItem("ebookFontSize", this.fontsize);
      localStorage.setItem("ebookFontSizeValue", size);
      $(".ebookDetail").css("font-size", _size);
    },
    reduce() {
      if (this.fontsize > 31) {
        this.fontsize = this.fontsize - 3;
        var _size = this.fontsize + "px";
        localStorage.setItem("ebookFontSize", this.fontsize);
        this.value = this.value - 20;
        $(".ebookDetail").css("font-size", _size);
        localStorage.setItem("ebookFontSizeValue", this.value);
      }
    },
    add() {
      // console.log(this.fontsize)
      if (this.fontsize < 46) {
        this.fontsize = this.fontsize + 3;
        var _size = this.fontsize + "px";
        localStorage.setItem("ebookFontSize", this.fontsize);
        this.value = this.value + 20;
        $(".ebookDetail").css("font-size", _size);
        localStorage.setItem("ebookFontSizeValue", this.value);
      }
    },
    // 目录
    showcatalog() {
      this.$refs.catalog.catalogPopup = true;
      // this.$refs.catalog.getInfo();
      // this.$refs.catalog.getList();
    },
    chargeChange(state) {
      this.charge = state;
    },
    // 评论
    showComment() {
      this.$refs.comment.commentPopup = true;
    },
    // 支付
    buyebook() {
      this.$refs.pay.buyShow = true;
    },
    payrecharge() {
      this.$refs.pay.buyShow = false;
      this.$refs.recharge.rechargeShow = true;
    },
    returnUp() {
      this.$refs.recharge.rechargeShow = false;
      this.$refs.pay.buyShow = true;
    }
  }
};
</script>
