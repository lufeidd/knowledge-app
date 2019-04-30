<template>
  <div id="recordPage">
    <div class="head">
      <div class="income" @click="showPopup()">
        本月
        <van-icon class="arrow" name="arrow-down"/>
      </div>
      <div class="num">收入：￥{{totalIncome}}</div>
    </div>
    <div class="content" v-for="item in incomeData">
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
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :max-date="maxDate"
        :formatter="formatter"
        confirm-button-text="完成"
        @cancel="show=false"
        title="请选择时间"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/personal/remain/index.scss" lang="scss"></style>

<script>
import { USER_REMAIN_DETAILS } from "../../../apis/user.js";
export default {
  data() {
    return {
      totalIncome: 1230.34,
      incomeData: [
        // { date: "2019-03-07", money: 1.533, order: 0 },
        // { date: "2019-03-07", money: 1.533, order: 1 },
        // { date: "2019-03-07", money: 1.533, order: 1 },
        // { date: "2019-03-07", money: 1.533, order: 0 }
      ],
      show: false,
      maxDate: new Date(),
      currentDate: new Date()
    };
  },
  mounted(){
    this.getData();
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
    async getData(){
      var tStamp = this.$getTimeStamp();
      var data={
        version:"1.0",
        type : 1,
        timestamp:tStamp,
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_DETAILS(data);

      if(res.hasOwnProperty("response_code")){
        this.totalIncome = res.response_data.total_money_in;
        this.incomeData = res.response_data.result;
        // console.log(res.response_data.total_money_in);y
        
      }else{
        this.$toast(res.error_message);
      }
    },
  }
};
</script>

