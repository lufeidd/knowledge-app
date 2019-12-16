<template>
  <div>
  </div>
</template>

<script>
  import {REDEEM_ITEM_GET} from '@/apis/redeem.js';

  export default {
    name: "straight-link-index",
    data() {
      return {
        redeem: ''
      };
    },
    methods: {
      async getDetail() {
        // console.log(this.validateNum);
        let data = {
          redeem_id: this.redeem,
          version: "1.0"
        };
        let res = await REDEEM_ITEM_GET(data);
        // this.$toast(res);
        if (res.hasOwnProperty("response_code")) {
          // 判断是商品还是优惠券
          if (res.response_data.goods_type == 2) {
            this.$router.push({name: 'redeemCoupons', params: {code: '0'}});
          } else {
            this.$router.push({name: 'redeemGoods', params: {code: '0'}});
          }
        } else {
          this.$router.push({name: 'fail', query: {errorMsg: res.error_message}});
        };
        console.log(res);
      }
    },
    created() {
      this.redeem = this.$route.query.redeem;
      sessionStorage.setItem("redeemId", this.redeem);
    },
    mounted() {
      this.getDetail();
    }
  }
</script>

<style lang="scss">

</style>
