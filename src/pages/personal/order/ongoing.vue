<template>
  <div id="ongoingPage">
    <div class="content">
      <div class="date">2019.02.11 12:00</div>
      <div class="buyer">
        <div class="message">
          <div class="title">买家发起了申请</div>
          <div class="stateMessage">
            <p>买家发起了退款申请，货物状态：待发货</p>
            <p>原因：不想要了</p>
            <p>金额：15.8元（包含运费5元）</p>
          </div>
        </div>
        <div class="wd">
          <img v-lazy="iconUrl" class="icon">
        </div>
      </div>
      <div class="seller">
        <div class="wd">
          <img v-lazy="iconUrl" class="icon">
        </div>
        <div class="message">
          <div class="title">待卖家处理</div>
          <div class="stateMessage">
            <p>客服会在五个工作日内处理。</p>
            <p>如果拒绝，您可以修改申请后再次发起，客服会重新处理。</p>
            <p>请勿相信任何人发来的可以退款的链接，以免钱款被骗。</p>
          </div>
        </div>
      </div>
      <div class="date">2019.02.11 12:00</div>
      <div class="seller">
        <div class="wd">
          <img v-lazy="iconUrl" class="icon">
        </div>
        <div class="message">
          <div class="title">卖家已同意，请尽快填写退货物流信息</div>
          <div class="stateMessage bb">
            <p>收件人：沈好看</p>
            <p>收件地址：浙江省杭州市余杭区金家读南路101</p>
            <p>联系电话：45612345685</p>
          </div>
          <p class="careful">请在五个工作日内填写退货物流信息，过期申请讲关闭。</p>
        </div>
      </div>
      <div class="seller">
        <div class="wd">
          <img v-lazy="iconUrl" class="icon">
        </div>
        <div class="message">
          <div class="title">退款失败</div>
          <div class="stateMessage mb">失败原因：订单已发出，需要退货后申请</div>
        </div>
      </div>
    </div>
    <div class="foot bottomBox" :class="{iphx:this.isIphx}">
      <span class="button">修改申请</span>
      <span class="button">重新申请</span>
      <span class="button">填写物流信息</span>
      <span class="button">撤销申请</span>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/refund.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      iconUrl: "https://bnmpstyle.bookuu.com/wap/images/default_shop.png"
    };
  }
};
</script>
