<template>
  <div id="recordPage">
    <div class="head">
      <div class="income" @click="showPopup()">
        {{timging}}
        <van-icon class="arrow" name="arrow-down"/>
      </div>
      <div class="num">￥{{totalIncome == null ? 0:totalIncome}}</div>
    </div>
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
    >

      <div class="content" v-for="(item,index) in incomeData" :key="index">

        <div class="chong">充</div>
        <div class="detail">
          <div class="top">
            <span class="into">充值-转入余额</span>
            <span class="money">{{item.amount}}</span>
          </div>
          <div class="bottom">
            <span class="date">{{item.create_time}}</span>
            <span class="order">{{item.order==0 ? '待发货':''}}</span>
          </div>
        </div>
      </div>
    </van-list>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        confirm-button-text="完成"
        @cancel="show=false"
        title="请选择时间"
        @change="change"
        @confirm="clickSearch"
      />
    </van-popup>
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="brand"></EazyNav>

  </div>
</template>

<style scoped src="@/style/scss/pages/personal/remain/index.scss" lang="scss"></style>
<style>
@import url("./../../../style/scss/components/dateTimePicker.scss");
</style>

<script>
import { USER_REMAIN_DETAILS } from "../../../apis/user.js";
// import easyNav from "./../../../components/easyNav";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   // searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "order"
      // },
      totalIncome: null,
      incomeData: [],
      clickSearchTime: null,
      timging: "本月",
      searchTime: null,
      show: false,
      minDate: new Date(1919, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      page: 1,
      searchPage: 1,
      programLoading: false,
      programFinished: false,
      begintime: null,
      endtime: null,
      ning: false,
      loginState: true
    };
  },
  mounted() {
    // this.getData();
    this.curDateTime();
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    change(e) {
      var val = e.getValues();
      this.searchTime = val;
    },
    // 列表下拉加载
    programLoad() {
      if (this.loginState == true) {
        this.getData();
      }
      if (this.ning == true) {
        this.search();
      }
    },
    // 点击完成时触发
    clickSearch() {
      if (this.searchTime) {
        this.incomeData = [];
        this.totalIncome = null;
        this.totalOutput = null;
        this.clickSearchTime = this.searchTime;
        this.timging = this.searchTime.join("");
        this.search();
      } else {
        this.$toast("请选择时间段！");
        this.show = false;
      }
    },
    // 获取页面基本信息
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        page: this.page,
        type: 1,
        begin_time: this.begintime,
        end_time: this.endtime,
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_DETAILS(data);

      if (
        res.hasOwnProperty("response_code") &&
        res.response_data.hasOwnProperty("result")
      ) {
        this.totalIncome += Number(res.response_data.total_money_in);
        var result = res.response_data.result;

        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.incomeData.push(result[i]);
          }
          // console.log('第一个:',this.incomeData);
          // 加载状态结束
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.loginState = false;
            this.page = 1;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取时间段的信息
    async search() {
      this.show = false;
      this.ning = true;
      var a = [];
      var b = [];
      for (let i = 0; i < this.searchTime.length; i++) {
        a.push(parseInt(this.searchTime[i]));
        b.push(parseInt(this.searchTime[i]));
      }
      this.begintime = a = a.join("-") + "-01 00:00:00";
      b[1] = Number(a.split("-")[1]) + 1;
      this.endtime = b = b.join("-") + "-01 00:00:00";
      //  this.incomeData = [];
      var tStamp = this.$getTimeStamp();
      var data = {
        begin_time: this.begintime,
        end_time: this.endtime,
        page: this.searchPage,
        type: 1,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_DETAILS(data);

      if (res.hasOwnProperty("response_code")) {
        this.totalIncome += Number(res.response_data.total_money_in);

        var result = res.response_data.result;
        setTimeout(() => {
          for (let i = 0; i < res.response_data.result.length; i++) {
            this.incomeData.push(result[i]);
          }
          // console.log('第二个:',this.searchData,this.ning)
          // 加载状态结束
          this.programLoading = false;
          this.searchPage++;
          this.programFinished = false;

          // 数据全部加载完成
          if (this.searchPage > res.response_data.total_page) {
            this.programFinished = true;
            this.searchPage = 1;
            this.ning = false;
          }
        }, 500);
      } else {
        this.$toast(res.error_message);
      }
    },
    //获取当前时间
    curDateTime() {
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var date = d.getDate();
      var day = d.getDay();
      // var curDateTime = year;
      var nextmonth = month + 1;
      if (month < 9) month = "0" + month;
      if (nextmonth < 9) nextmonth = "0" + nextmonth;
      var beginTime = year + "-" + month + "-" + "01" + " 00:00:00";
      var endTime = year + "-" + nextmonth + "-" + "01" + " 00:00:00";
      this.begintime = beginTime;
      this.endtime = endTime;
      console.log("当前日期" + beginTime, endTime);
    }
  }
};
</script>

