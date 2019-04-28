<template>
  <div id="detailPage">
    <div class="head">
      <div class="income" @click="showPopup()">
        本月
        <van-icon class="arrow" name="arrow-down"/>
      </div>
      <div class="num">
        <span>支出：￥{{totalOutput}}</span>
        <span>收入：￥{{totalIncome}}</span>
      </div>
    </div>
    <div class="content" v-for="item in incomeData">
      <div class="chong">{{item.type==1 ? '收':'支'}}</div>
      <div class="detail">
        <div class="top">
          <span class="into">{{item.summary}}</span>
          <span class="money">{{item.amount}}</span>
        </div>
        <div class="bottom">
          <span class="date">{{item.create_time}}</span>
          <!-- <span class="order">{{item.order==0 ? '待发货':''}}</span> -->
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
        @change="change"
        @confirm="search"
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
      totalIncome: '',
      totalOutput: '',
      incomeData: [
        // { text: "支", date: "2019-03-07", money: 1.533, order: 0 },
        // { text: "充", date: "2019-03-07", money: 1.533, order: 1 },
        // { text: "退", date: "2019-03-07", money: 1.533, order: 1 },
        // { text: "赔", date: "2019-03-07", money: 1.533, order: 0 }
      ],
      searchTime:[],
      show: false,
      maxDate: new Date(),
      currentDate: new Date(),
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
    change(e){
      var val=e.getValues();
      this.searchTime= val;
    },
    async getData(){
      var data={
        version:"1.0",
      };
      let res = await USER_REMAIN_DETAILS(data);

      if(res.hasOwnProperty("response_code")){
        this.totalIncome = res.response_data.total_money_in;
        this.totalOutput = res.response_data.total_money_out;
        this.incomeData = res.response_data.result;
        // console.log(res.response_data.total_money_in);
      }else{
        this.$toast(res.error_message);
      }
    },
    async search(){
      this.show=false;
      var begintime=[];
      var endtime=[];
      for(let i=0;i<this.searchTime.length;i++){
        begintime.push(parseInt(this.searchTime[i]));
         endtime.push(parseInt(this.searchTime[i]));
      }
      begintime=begintime.join('-')+'-01 00:00:00';
       endtime[1]=Number(begintime.split('-')[1])+1;
       endtime=endtime.join('-')+'-01 00:00:00';
      // console.log(begintime,endtime);

      var data={
        begin_time:begintime,
        end_time:endtime,
        version:"1.0",
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_DETAILS(data);
      if(res.hasOwnProperty("response_code")){
        this.totalIncome = res.response_data.total_money_in;
        this.totalOutput = res.response_data.total_money_out;
        this.incomeData = res.response_data.result;
        // console.log(res);
      }
    },
  }
}
</script>

