<template>
  <div id="resultPage">
    <div class="img-wrapper">
      <img src="./../../assets/gaokaoTest/yishu.png" v-if="resultType== 'A'">
      <img src="./../../assets/gaokaoTest/shehui.png" v-if="resultType== 'B'">
      <img src="./../../assets/gaokaoTest/lingdao.png" v-if="resultType== 'C'">
      <img src="./../../assets/gaokaoTest/shicao.png" v-if="resultType== 'D'">
      <img src="./../../assets/gaokaoTest/sikao.png" v-if="resultType== 'E'">
      <img src="./../../assets/gaokaoTest/fuhe.png" v-if="resultType== 'F'">
    </div>
    <div class="code-wrapper">
      <div class="code">
        <img class="code-img" src="./../../assets/gaokaoTest/code.png">
        <img class="code-pointer" src="./../../assets/gaokaoTest/pointer.png">
      </div>
      <div class="btn-box"></div>
    </div>
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
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<script>
  import { GAOKAO_TEST_RESULT } from '@/apis/gaokaoTest';
  import { GAOKAO_TEST_INDEX } from '@/apis/gaokaoTest';

  export default {
    data() {
      return {
        resultType: '',
        urlList: [
          'https://wap.mhuoba.com/#/album/index?goods_id=10541750&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10777911&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10781109&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10650463&brand_id=100051',
          'https://wap.mhuoba.com/#/album/index?goods_id=10781071&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10778935&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10786581&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10786593&brand_id=100073',
          'https://wap.mhuoba.com/#/album/index?goods_id=10004111&brand_id=100030',
        ]
      }
    },
    methods: {
      async gaokaoTestIndex() {
        let data = {
          version: '1.0',
        };
        let res = await GAOKAO_TEST_INDEX(data);
        if (res.hasOwnProperty('response_code')) {
          var resData = res.response_data;
          if (resData.result == '') {
            this.$router.push({name: 'gaokaoTestIndex'});
          }

        }
      },
      async gaokaoTestResult() {
        let data = {
          version: '1.0',
        };
        let res = await GAOKAO_TEST_RESULT(data);
        if (res.hasOwnProperty('response_code')) {
          console.log(res);
          this.resultType = res.response_data.result;
          console.log(this.resultType);
        }
      },
      // toQuery() {
      //   console.log('query');
      //   if (localStorage.getItem('isWxLogin')== 'yes') {
      //     // 跳转到小程序
      //   } else {
      //     this.$router.push({name: 'applet'});
      //   }
      // },
      toLook(index) {
        window.location.href = this.urlList[index];
      }
    },
    created() {
      if(localStorage.getItem('loginState') != 1) {
        this.$router.push({name: 'login'});
      }
    },
    mounted() {
      this.gaokaoTestIndex();
      this.gaokaoTestResult();
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/resultPage.scss" lang="scss" scoped>

</style>


