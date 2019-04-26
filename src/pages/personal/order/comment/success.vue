<template>
  <div id="successPage" class="comment">
    <div class="thanks">
      <svg class="icon order" aria-hidden="true">
        <use xlink:href="#icon-order-comment"></use>
      </svg>
      <span>感谢您的评价！</span>
    </div>
    <div class="continue">向下继续评价吧~</div>
    <div class="list">
      <div class="bookDetail">
        <div class="ratiobox">
          <a class="bookImg" v-lazy:background-image="imgUrl"></a>
        </div>
        <div class="info">
          <span class="title">宝宝巴士在线讲故事在线讲故事在线讲故事</span>
          <div class="commentLine">
            <span class="number">
              <span class="money">¥ 23.00</span> x1
            </span>
            <span class="button">评价</span>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="bookDetail">
        <div class="ratiobox">
          <a class="bookImg" v-lazy:background-image="imgUrl"></a>
        </div>
        <div class="info">
          <span class="title">宝宝巴士在线讲故事在线讲故事在线讲故事</span>
          <div class="commentLine">
            <span class="number">
              <span class="money">¥ 23.00</span> x1
            </span>
            <span class="button">评价</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/order/comment.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      imgUrl: "https://wdimg3.bookuu.com/goods/13/52/25/1554875545.jpg@!w210q85"
    };
  }
};
</script>
