<template>
  <div id="redeemLoginPage">
    <header class="header_wrapper">
      <!--<img src="" alt="" width="80" height="80">-->
      <div style="display: inline-block;width: 80px;height: 80px"></div>
      <div class="content">
        <h3 class="author">于丹教授</h3>
        <p class="title">汉字密码——中国文化必修课</p>
        <p class="price">
          ￥123.00
        </p>
      </div>
    </header>
    <div class="spacing_bar"></div>
    <main class="main_wrapper">
      <van-cell-group>
        <van-field
          class="phone_num"
          type="number"
          v-model="phone"
          placeholder="请输入您的手机号"
        />
        <van-field
          class="message_num"
          v-model="validateCode"
          placeholder="请输入短信验证码"
        >
          <van-button slot="button" size="small" type="default">获取验证码</van-button>
        </van-field>
      </van-cell-group>
      <div class="button_wrapper">
        <van-button type="primary" color="#F05654" @click="">兑换</van-button>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        phone: '',
        validateCode: ''
      };
    }
  }
</script>

<style src="@/style/scss/pages/redeem/login.scss" lang="scss">

</style>
