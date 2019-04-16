<template>
    <div id="remainPage">
        <div class="content">
          <span>¥</span>
          <span class="money">{{money.toFixed(2)}}</span>
          <p class="currentRemain">当前余额</p>
          <van-row type="flex" justify="center" class="detail">
            <van-col span="6"><router-link to="/detail">账单明细</router-link></van-col>
            <van-col span="6">|</van-col>
            <van-col span="6"><router-link to="/record">充值记录</router-link></van-col>
          </van-row>
          <router-view></router-view>
        </div>
        <div class="recharge">
          <van-button slot="button" size="large" round type="danger" @click="recharge()">充值</van-button>
        </div>
    </div>
</template>

<style src="@/style/scss/pages/personal/remain/index.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {
      money:12.5,
    }
  },
    methods: {
      onClickLeft() {
        this.$router.go(-1);
      },
      recharge(){
        this.$router.go({path:'/account'});
      }
    }
}
</script>

