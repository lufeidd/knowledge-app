<template>
  <div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<script>
  import {REDEEM_ITEM_GET} from '@/apis/redeem.js';

  export default {
    name: "straight-link-index",
    data() {
      return {
        redeem: '',
        secShare: '' //  是否允许二次分享
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
          this.secShare = res.response_data.sec_share;
          let encryptRedeem = encodeURIComponent(res.response_data.redeem_id);
          console.log(encryptRedeem);
          // 判断是商品还是优惠券
          if (res.response_data.goods_type == 2) {
            this.$router.push({name: 'redeemCoupons', query: {redeem_id: encryptRedeem}});
          } else {
            this.$router.push({name: 'redeemGoods', query: {redeem_id: encryptRedeem}});
          }
        } else {
          this.$router.push({name: 'wapFail', query: {errorMsg: res.error_message}});
        };
        // console.log(res);
      }
    },
    created() {
      this.redeem = this.$route.query.redeem;
      sessionStorage.setItem('originLink', 1);
    },
    mounted() {
      this.getDetail();
    }
  }
</script>

<style lang="scss">

</style>
