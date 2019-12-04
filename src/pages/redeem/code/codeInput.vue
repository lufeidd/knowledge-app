<template>
  <div id="codeInputPage">
    <div class="top_bg"></div>
    <van-cell-group class="input_num_wrapper">
      <van-field class="code_num" clearable v-model="codeNum" placeholder="请输入8位兑换码,不区分大小写,长按可粘贴。" />
      <div v-show="validateFlag">
        <van-field class="validate_num" v-model="validateNum" placeholder="请输入右侧验证码。" />
        <div class="validate_image">
          12324
          <img src="" alt="">
        </div>
      </div>
    </van-cell-group>
    <div class="button_wrapper">
      <van-button type="primary" color="#F05654" @click="">兑换</van-button>
    </div>
    <p class="notes_one">
      1.参与活动有机会获得兑换码,使用兑换码可兑换超值优惠券以及虚拟商品。
      <br/>
      2.请在兑换码有效期内完成兑换,过期自动失效;具体兑换结果以页面显示为准。 提示：请使用英文输入法。
    </p>
    <p class="notes_two">
      提示：请使用英文输入法。
    </p>
  </div>
</template>

<script>
  export default {
    name: "code-input",
    data() {
      return {
        codeNum: '',
        validateNum: '',
        validateFlag: false
      };
    },
    watch: {
      codeNum: function(val) {
        if (val !== '') {
          this.validateFlag = true;
        } else {
          this.validateNum = '';
          this.validateFlag = false;
        }
      }
    }
  }
</script>

<style src="@/style/scss/pages/redeem/code/codeInput.scss" lang="scss">

</style>
