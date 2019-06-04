<template>
  <div id="cartPage">
    <van-row class="editBox">
      <van-col span="12">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-cart-line"></use>
        </svg>
        共12件商品
      </van-col>
      <van-col span="12" style="text-align: right;">编辑</van-col>
    </van-row>

    <div class="listBox total">
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true">
          <use xlink:href="#icon-checked-block"></use>
        </svg>
      </div>
      <router-link to="/detail" class="center">
        <div class="title">
          <div
            class="text"
          >是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生</div>
        </div>
      </router-link>
      <router-link to="/detail" class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </router-link>
    </div>

    <div class="listBox">
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true">
          <use xlink:href="#icon-checked-block"></use>
        </svg>
      </div>
      <div class="left">
        <div class="ratioBox">
          <router-link to="/detail" class="box">
            <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            <div class="tag">仅剩2件</div>
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
          <div class="action">
            <van-stepper v-model="stepModel[0].value" integer @plus="addCount(0)" :min="1"/>
          </div>
        </div>
      </div>
    </div>

    <van-row class="editBox">
      <van-col span="12">失效商品</van-col>
      <van-col span="12" style="text-align: right;">清空失效商品</van-col>
    </van-row>
    <div class="listBox">
      <div class="right">
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true">
          <use xlink:href="#icon-checked-block"></use>
        </svg>-->
      </div>
      <div class="left">
        <div class="ratioBox">
          <router-link to="/detail" class="box">
            <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
            <div class="tag">售罄</div>
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
          <div class="action">
            <van-stepper v-model="stepModel[1].value" integer @plus="addCount(1)" :min="1"/>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 60px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>

    <van-submit-bar
      :class="{iphx:this.isIphx}"
      safe-area-inset-bottom
      :price="3050"
      button-text="结算"
      @submit="onSubmit"
    >
      <!-- <van-checkbox v-model="checked">全选</van-checkbox> -->
      <div class="totalBox">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true">
          <use xlink:href="#icon-checked-block"></use>
        </svg>
        <span>全选</span>
      </div>
    </van-submit-bar>

    <van-submit-bar
      :class="{iphx:this.isIphx}"
      class="deleteBox"
      safe-area-inset-bottom
      button-type="plain"
      button-text="删除"
      @submit="onSubmit"
    >
      <!-- <van-checkbox v-model="checked">全选</van-checkbox> -->
      <div class="totalBox">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true">
          <use xlink:href="#icon-checked-block"></use>
        </svg>
        <span>全选</span>
      </div>
    </van-submit-bar>
  </div>
</template>
<style src="@/style/scss/pages/cart.scss" scoped lang="scss"></style>
<script>
export default {
  data() {
    return {
      stepModel: [{ value: 1 }, { value: 2 }]
    };
  },
  methods: {
    onSubmit() {},
    addCount(key) {
    }
  }
};
</script>

