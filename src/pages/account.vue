<template>
    <div id="accountPage">
      <div class="content">
        <span>¥</span>
        <span class="money">{{money.toFixed(2)}}</span>
        <p class="currentRemain">当前余额</p>
      </div>
      <div class="account">
        <p>请选择充值金额</p>
        <ul class="choose">
          <li v-for="item,index in rechargeAmount" :class="activeClass == index ? 'active':''" @click="getActive(index)">{{item}}元</li>
        </ul>
        <p class="explain">充值说明:</p>
      </div>
      <div class="recharge">
        <van-button slot="button" size="large" round type="danger" @click="account()">充值</van-button>
      </div>
    </div>
</template>

<style src="@/style/scss/pages/remain.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {
      money:12.5,
      rechargeAmount:[5,20,50,100,150,200,280,320],
      activeClass :-1,
    }
  },
  methods: {
    getActive(index){
      this.activeClass = index;
    },
    account(){

    }
  }
}
</script>

