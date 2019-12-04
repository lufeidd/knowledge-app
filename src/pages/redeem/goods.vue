<template>
  <div id="redeemGoodsPage">
    <van-list
      v-model="goodsLoading"
      :finished="goodsFinished"
      finished-text="没有更多了"
      @load="goodsLoad"
    >
      <div
        class="goods_wrapper"
        v-for="item in goodsList"
        :key="item.id"
        :title="item"
      >
        <div class="goods_intro">
          <!--<img src="" alt="" width="80" height="80">-->
          <div style="display: inline-block;width: 80px;height: 80px"></div>
          <div class="content">
            <h3 class="title">{{item.title}}</h3>
            <p class="sub_title">{{item.subTitle}}</p>
            <p class="price">{{item.price}}</p>
            <van-button class="redeem_btn" type="primary" color="#F05654" @click="">免费兑换</van-button>
          </div>
        </div>
        <div class="goods_detail">{{item.detail}}</div>
      </div>
    </van-list>
    <div class="rule">
      <p>
        1.活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则
      </p>
      <p>
        2.活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "goods",
    data() {
      return {
        goodsList: [
          {
            id: '1',
            title: '标题文字',
            subTitle: '副标题',
            price: '￥123.00',
            detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          },
          {
            id: '2',
            title: '标题文字',
            subTitle: '副标题',
            price: '￥123.00',
            detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          },
          {
            id: '3',
            title: '标题文字',
            subTitle: '副标题',
            price: '￥123.00',
            detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          },
          {
            id: '4',
            title: '标题文字',
            subTitle: '副标题',
            price: '￥123.00',
            detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          },
          {
            id: '5',
            title: '标题文字',
            subTitle: '副标题',
            price: '￥123.00',
            detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          },
          {
            id: '6',
            title: '标题文字',
            subTitle: '副标题',
            price: '￥123.00',
            detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          }
        ],
        goodsLoading: false,
        goodsFinished: false,
      };
    },
    methods: {
      goodsLoad() {
        // 异步更新数据
        // setTimeout(() => {
        //   for (let i = 0; i < 10; i++) {
        //     this.goodsList.push(this.goodsList.length + 1);
        //   }
        //   // 加载状态结束
        //   this.goodsLoading = false;
        //
        //   // 数据全部加载完成
        //   if (this.goodsList.length >= 40) {
        //     this.goodsFinished = true;
        //   }
        // }, 500);
      }
    }
  }
</script>

<style src="@/style/scss/pages/redeem/goods.scss" lang="scss">

</style>
