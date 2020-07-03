<template>
  <div id="resultPage">
    <div class="img-wrapper">
      <img src="./../../assets/gaokaoTest/sikao.png" alt="">
      <!--<img src="./../../assets/gaokaoTest/fuhe.png" alt="">-->

    </div>
    <div class="btn-box" @click="toQuery"></div>
    <div class="recommend-wrapper">
      <div class="recommend"></div>
      <div class="goods-list-one">
        <img src="./../../assets/gaokaoTest/goods-1.png" alt="" @click="toLook(0)">
        <img src="./../../assets/gaokaoTest/goods-2.png" alt="" @click="toLook(1)">
        <img src="./../../assets/gaokaoTest/goods-3.png" alt="" @click="toLook(2)">
      </div>
      <div class="goods-list-two">
        <div class="row">
          <img src="./../../assets/gaokaoTest/item-1.png" alt="" @click="toLook(3)">
          <img src="./../../assets/gaokaoTest/item-2.png" alt="" @click="toLook(4)">
        </div>
        <div class="row">
          <img src="./../../assets/gaokaoTest/item-3.png" alt="" @click="toLook(5)">
          <img src="./../../assets/gaokaoTest/item-4.png" alt="" @click="toLook(6)">
        </div>
        <div class="row">
          <img src="./../../assets/gaokaoTest/item-5.png" alt="" @click="toLook(7)">
          <img src="./../../assets/gaokaoTest/item-6.png" alt="" @click="toLook(8)">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        urlList: [
          'https://wap.mhuoba.com/#/album/index?goods_id=10541750&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10777911&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10781109&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10650463&brand_id=100051',
          'https://wap.mhuoba.com/#/album/index?goods_id=10781071&brand_id=100073',
        ]
      }
    },
    methods: {
      toQuery() {
        console.log('query');
      },
      toLook(index) {
        window.location.href = this.urlList[index];
      }
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/resultPage.scss" lang="scss" scoped>

</style>


