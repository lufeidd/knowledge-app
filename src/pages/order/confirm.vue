<template>
  <div id="orderconfirmPage">
    <div class="listBox">
      <div class="right one">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-location-line"></use>
        </svg>
      </div>
      <div class="center">
        <ul class="addressBox">
          <li>
            <div class="info">
              <div>
                <span class="name">受到德国</span>
                <span class="phone">豆腐干豆腐干反对</span>
              </div>
              <div class="address">大概豆腐干豆腐干反对豆腐干豆腐干地方地方官党规党法风格豆腐干反对</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </div>
    </div>

    <div class="listBox">
      <div class="center">
        <ul class="addressBox img">
          <li v-for="img in imageList">
            <div class="ratioBox">
              <div class="box">
                <img v-lazy="img" width="45px">
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right">
          <span>共5件</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-next-line"></use>
        </svg>
      </div>
    </div>
    
    <div class="priceInfo beizhu">
      <div class="first">
        <van-cell title="备注"/>
      </div>
      <textarea placeholder="选填，请填写备注内容"></textarea>
    </div>

    <div class="priceInfo">
      <div class="first">
        <van-cell title="商品总额" v-model="'-¥'+priceInfo.totalPrice.toFixed(2)"/>
      </div>
      <van-cell title="运费" v-model="'¥'+priceInfo.freight.toFixed(2)"/>
      <van-cell title="商品优惠" v-model="'¥'+priceInfo.discount.toFixed(2)"/>
      <van-cell title="余额" v-model="'-¥'+priceInfo.remain.toFixed(2)"/>
    </div>

  </div>
</template>

<style src="@/style/scss/pages/order.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      imageList: ["https://img.yzcdn.cn/2.jpg", "https://img.yzcdn.cn/2.jpg", "https://img.yzcdn.cn/2.jpg", "https://img.yzcdn.cn/2.jpg"],
      priceInfo: {
        totalPrice: 95.0,
        freight: 22.3,
        discount: 5.0,
        remain: 22.3
      }
    };
  }
};
</script>

