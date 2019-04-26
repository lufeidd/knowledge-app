<template>
  <div id="payaccountPage">
    <div class="listBox">
      <div class="left">
        <div class="ratioBox">
          <router-link to="/detail" class="box">
            <img src="https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75">
          </router-link>
        </div>
      </div>
      <div class="center">
        <div class="title">
          <router-link
            to="/detail"
            class="text"
          >是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生是地方军阀撒旦发射点发射点发生</router-link>
        </div>
        <div class="subTitle"></div>
        <div class="info">
          <span class="history">¥23.00</span>
        </div>
      </div>
    </div>

    <van-row class="editBox">
      <van-col span="24">
        <span class="title">选择支付方式：</span>
      </van-col>
    </van-row>

    <div class="listBox yue disable">
      <div class="check">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true">
          <use xlink:href="#icon-checked-right"></use>
        </svg>
      </div>
      <div class="center">
        <div class="title">
          <div class="text">
            <svg class="icon active" aria-hidden="true">
              <use xlink:href="#icon-wallet-block"></use>
            </svg>
            <span>余额 5.78</span>
          </div>
        </div>
      </div>
      <div class="left two">
        <van-button round type="danger">充值</van-button>
      </div>
    </div>
    <div class="listBox weixin">
      <div class="check">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-uncheck-line"></use>
        </svg>
        <svg class="icon active" aria-hidden="true">
          <use xlink:href="#icon-checked-right"></use>
        </svg>
      </div>
      <div class="center">
        <div class="title">
          <div class="text">
            <svg class="icon active" aria-hidden="true">
              <use xlink:href="#icon-weixin-block"></use>
            </svg>
            <span>微信支付</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tip">
      <div>1.您奖购买的内容为虚拟内容服务，购买之后不退订转让退换请斟酌后购买</div>
      <br>
      <div>2.购买后再我的购买中使用和查看。</div>
    </div>

    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button size="large" type="danger" @click="payAction">支付</van-button>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      @blur="showKeyboard = false"
    />
    <van-dialog v-model="showDialog" title="请输入手机验证码" show-cancel-button cancelButtonText="放弃支付">
      <div class="codeBox">
        <div class="price">
          ¥
          <span class="money">23.00</span>
        </div>
        <div class="code">
          <van-row>
            <van-col span="12" style="text-align:left;">手机号:138*****876</van-col>
            <van-col span="12" style="text-align: right;">
              <template v-if="codeData.disabled">
                <van-button size="small" round disabled type="danger">{{ codeData.timeMsg }}</van-button>
              </template>
              <template v-else>
                <van-button size="small" round type="danger" @click="getCode">{{ codeData.timeMsg }}</van-button>
              </template>
            </van-col>
          </van-row>
        </div>
        <!-- 密码输入框 -->
        <van-password-input :value="value" :mask="false" @focus="keyboardShow"/>
      </div>
    </van-dialog>
  </div>
</template>

<style src="@/style/scss/pages/pay.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      codeData: {
        disabled: false,
        timeMsg: "获取验证码",
        time: 3
      },
      showDialog: false,
      value: "123",
      showKeyboard: false
    };
  },
  methods: {
    getCode() {
      //   let method = "/sendsms";
      //   let phone = this.phone;
      //   let data = {
      //     mobile: phone
      //   };
      this.$countDown(this.codeData);
    },
    keyboardShow() {
      this.showKeyboard = true;
      $(".van-number-keyboard").css("z-index", 10000);
    },
    payAction() {
      this.showDialog = true;
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    }
  }
};
</script>

