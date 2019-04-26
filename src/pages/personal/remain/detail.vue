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
      <div class="chong">{{item.text}}</div>
      <div class="detail">
        <div class="top">
          <span class="into">充值-转入余额</span>
          <span class="money">{{item.money}}</span>
        </div>
        <div class="bottom">
          <span class="date">{{item.date}}</span>
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
      />
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/personal/remain/index.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      totalIncome: 1230.34,
      totalOutput: 1230.34,
      incomeData: [
        { text: "支", date: "2019-03-07", money: 1.533, order: 0 },
        { text: "充", date: "2019-03-07", money: 1.533, order: 1 },
        { text: "退", date: "2019-03-07", money: 1.533, order: 1 },
        { text: "赔", date: "2019-03-07", money: 1.533, order: 0 }
      ],
      show: false,
      maxDate: new Date(),
      currentDate: new Date()
    };
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
    }
  }
};
</script>

