<template>
  <div id="codeInputPage">
    <div class="top_bg"></div>
    <van-cell-group class="input_num_wrapper">
      <!--兑换码-->
        <van-field class="code_num"
                   maxlength="9"
                   clearable
                   ref="code"
                   v-model="codeNum"
                   @input="inputCode"
                   placeholder="请输入8位兑换码,不区分大小写,长按可粘贴。"
                   />
      <!--验证码-->
      <div v-show="validateFlag" class="validate_wrapper">
        <van-field class="validate_num" clearable v-model="validateNum" placeholder="请输入右侧验证码。"/>
        <div class="validate_image" @click="refreshImage">
          <img :src="validateImage" width="120" height="44" alt="">
        </div>
      </div>

    </van-cell-group>

    <van-button type="primary" size="large" style="background:#F05654;border: 1px solid #F05654;margin-top: 40px;" @click="toRedeem">兑换</van-button>

    <p class="notes_one">
      1.参与活动有机会获得兑换码,使用兑换码可兑换超值优惠券以及虚拟商品。
      <br/>
      2.请在兑换码有效期内完成兑换,过期自动失效;具体兑换结果以页面显示为准。
    </p>
    <p class="notes_two">
      提示：请使用英文输入法。
    </p>
  </div>
</template>

<script>
  import {REDEEM_ITEM_GET} from '@/apis/redeem.js';
  import axios from 'axios'
  export default {
    name: "code-input",
    data() {
      return {
        isDel: false,
        codeNum: '',
        validateNum: '',
        validateImage: '',
        validateFlag: false,
        userId: ''
      };
    },
    created() {
      sessionStorage.setItem('originLink', 1);
    },
    mounted() {
      let self = this;
      $('input').on('keydown', function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if( e && e.keyCode == 8 ) self.isDel = true;
      })
      document.title = '兑换码';
    },
    methods: {
      inputCode(event) {
        var code = this.codeNum;
        var str = '';
        var _bool = false;
        code = code.toLocaleUpperCase().replace(/[^a-zA-Z0-9]/g,'').substring(0, 8);

        var _len = code.length;
        Array.from(code, (item, index) => {
          if(index == 3) {
            str += item + ' ';
          } else {
            str += item;
          }
        });
        Array.from(str, (item, index) => {
          if(item == ' ' && index == _len) {
            _bool = true;
          }
        });
        if(_bool && this.isDel) {
          str = str.trim();
        };
        // console.log(_len, _bool, str)
        this.codeNum = str;
      },
      // 刷新验证码图片
      refreshImage() {
        let num = Math.ceil(Math.random() * 10);
        this.validateImage += `&${num}`;
      },
      async toRedeem() {
        let data = {
          code: this.codeNum,
          captcha: this.validateNum,
          version: "1.0"
        };

        let res = await REDEEM_ITEM_GET(data);
        if(res.hasOwnProperty("response_code")) {
          // 接口请求成功
          // 判断是商品还是优惠券
          if (res.response_data.goods_type == 2) {
            this.$router.push({name: 'redeemCoupons', query: {code: this.codeNum}});
          } else {
            this.$router.push({name: 'redeemGoods', query: {code: this.codeNum}});
          }
        } else {
          if(res.hasOwnProperty("error_code")) {
            if(res.error_code == 100) {
              console.log(res.error_message);
              // 需要输入验证码
              let msg = res.error_message.split('|')[0];
              this.userId = res.error_message.split('|')[1];
              // let id = this.userId.replace('+', '%2B');
              let id = encodeURIComponent(this.userId);
              // this.validateImage =  'http://wap.huoba.dev.lsk/callback/captcha?user_id=' + id;
              this.validateImage =  window.location.protocol + "//" + window.location.hostname + '/callback/captcha?user_id=' + id;
              this.validateFlag = true;
              this.$toast(msg);
            } else if (res.error_code == 0) {
              // 验证码错误
              this.validateNum = "";
              this.refreshImage();
              this.$toast(res.error_message);
            } else if (res.error_code == 99) {
              this.$toast(localStorage.getItem('loginState'));
              // 未登录跳转到登录页
              this.$router.push({name: 'login'});
              this.refreshImage();
              this.$toast(res.error_message);
            }
          } else {
            this.$toast(res.error_message);
          }
        }
      }
    },
  }
</script>

<style src="@/style/scss/pages/redeem/code/codeInput.scss" lang="scss">

</style>
