<template>
  <div id="detailPage">
    <div class="head">
      <div class="income" @click="showPopup()">
        {{clickSearchTime.join('')}}
        <van-icon class="arrow" name="arrow-down"/>
      </div>
      <div class="num">
        <span>支出：￥{{totalOutput==null ? 0:totalOutput}}</span>
        <span>收入：￥{{totalIncome==null ? 0:totalIncome}}</span>
      </div>
    </div>
    <van-list
      v-model="programLoading"
      :finished="programFinished"
      finished-text="没有更多了"
      @load="programLoad"
    >
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
    </van-list>
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
        @confirm="clickSearch"
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
      totalIncome: null,
      totalOutput: null,
      incomeData: [],
      clickSearchTime:['全部'],
      searchTime:null,
      show: false,
      maxDate: new Date(),
      currentDate: new Date(),
      page:1,
      searchPage:1,
      programLoading: false,
      programFinished: false,
      begintime:null,
      endtime:null,
      ning:false,
      loginState:true,
    };

  },
  mounted(){
    // this.getData();
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
    programLoad(){
      if(this.loginState == true){
        this.getData();
      }
      if(this.ning == true){
        this.search();
      }
      // console.log(111,this.searchPage)
    },
    clickSearch(){
      this.incomeData = [];
      this.totalIncome = null;
      this.totalOutput = null;
      this.clickSearchTime = this.searchTime;
      this.search();
    },
    async getData(){
      var tStamp = this.$getTimeStamp();
      var data={
        version:"1.0",
        page:this.page,
        timestamp:tStamp,
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_DETAILS(data);

      if(res.hasOwnProperty("response_code")){
        this.totalIncome += Number(res.response_data.total_money_in);
        this.totalOutput += Number(res.response_data.total_money_out);
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
            if (this.incomeData.length >= res.response_data.total_count) {
              this.programFinished = true;
              this.loginState = false;
              this.page = 1;
            }
          }, 500);
        }else{
          this.$toast(res.error_message);
        }
    },
    async search(){
      this.show=false;
      this.ning = true;
      var a = [];
      var b = [];
      for(let i=0;i<this.searchTime.length;i++){
        a.push(parseInt(this.searchTime[i]));
        b.push(parseInt(this.searchTime[i]));
      }
       this.begintime = a = a.join('-')+'-01 00:00:00';
       b[1]=Number(a.split('-')[1])+1;
       this.endtime = b = b.join('-')+'-01 00:00:00';
      //  this.incomeData = [];
      var tStamp = this.$getTimeStamp();
      var data={
        begin_time:this.begintime,
        end_time:this.endtime,
        page:this.searchPage,
        version:"1.0",
        timestamp:tStamp,
      };
      data.sign = this.$getSign(data);
      let res = await USER_REMAIN_DETAILS(data);

      if(res.hasOwnProperty("response_code")){
        this.totalIncome += Number(res.response_data.total_money_in);
        this.totalOutput += Number(res.response_data.total_money_out);

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
            if (this.incomeData.length >= res.response_data.total_count) {
              this.programFinished = true;
              this.searchPage = 1;
              this.ning = false;
            }
          }, 500);
        }else{
          this.$toast(res.error_message);
        }
    },
  }
}
</script>

