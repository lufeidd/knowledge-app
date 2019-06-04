<template>
  <div id="orderdetailPage">
    <van-row class="editBox">
      <van-col span="12">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-package-line"></use>
        </svg>
        <span class="title">包裹1</span>
        <span class="type">自营</span>
        <span class="count">共3件</span>
      </van-col>
      <van-col span="12" class="postage" style="text-align: right;">运费5元</van-col>
    </van-row>

    <div class="listBox">
      <div class="left">
        <div class="ratioBox">
          <router-link to="/detail" class="box">
            <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
          </router-link>
        </div>
      </div>
      <div class="center">
        <div class="title">
          <router-link
            to="/detail"
            class="text"
          >是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生</router-link>
        </div>
        <div class="subTitle"></div>
        <div class="info">
          <span class="history">¥23.00</span>
          <span class="count">×2</span>
        </div>
      </div>
    </div>
    <div class="listBox">
      <div class="left">
        <div class="ratioBox">
          <router-link to="/detail" class="box">
            <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
          </router-link>
        </div>
      </div>
      <div class="center">
        <div class="title">
          <router-link
            to="/detail"
            class="text"
          >是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生</router-link>
        </div>
        <div class="subTitle"></div>
        <div class="info">
          <span class="history">¥23.00</span>
          <span class="count">×2</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/order.scss" scoped lang="scss"></style>

<script>
export default {
  data() {
    return {};
  }
};
</script>

