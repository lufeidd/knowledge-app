<template>
  <div id="gaokaoTestIndex">
    <img src="./../../assets/gaokaoTest/huoba.png" class="logo">
    <footer>
      <div class="btn-box" @click="toDemystify"></div>
      <p>累计已有{{this.indexData.count}}人参与</p>
    </footer>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<script>
  import { GAOKAO_TEST_INDEX } from '@/apis/gaokaoTest';
  export default {
    data() {
      return {
        indexData: {}
      };
    },
    methods: {
      async gaokaoTestIndex() {
        let data = {
          version: '1.0'
        };
        let res = await GAOKAO_TEST_INDEX(data);
        if (res.hasOwnProperty('response_code')) {
          console.log(res);
          this.indexData = res.response_data;
        }
      },
      toDemystify() {
        if (this.indexData.is_login == 0) { // 未登录
          this.$router.push({name: 'login'});
        } else {  // 已登录
          if (this.indexData.result) {  // 已测试直接跳转到结果页
            this.$router.push({name: 'resultPage'});
          } else {
            this.$router.push({name: 'questionsPageOne'});
          }

        }
      },
    },
    mounted() {
      this.gaokaoTestIndex();
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/index.scss" lang="scss" scoped>

</style>
