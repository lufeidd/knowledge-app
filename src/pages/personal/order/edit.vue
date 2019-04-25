<template>
  <div id="editPage">
    <van-address-edit
      show-search-result
      :search-result="searchResult"
      @change-detail="onChangeDetail"
    />
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" lang="scss"></style>

<script>
export default {
  data () {
    return {
      searchResult: []
    }
  },
  methods:{
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [{
          name: '黄龙万科中心',
          address: '杭州市西湖区'
        }];
      } else {
        this.searchResult = [];
      }
    }
  }
}

</script>
