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
          <div class="picture" v-lazy:background-image="item.pic[0]"></div>
          <div class="content">
            <h3 class="title">{{item.title}}</h3>
            <p class="sub_title">{{item.sub_title}}</p>
            <p class="price">￥{{item.price}}</p>
            <van-button class="redeem_btn" type="primary" color="#F05654" @click="goodsRedeem(item)">免费兑换</van-button>
          </div>
        </div>
        <div class="goods_detail">{{item.content}}</div>
      </div>
    </van-list>
    <div class="rule">
      <p>{{goodsDetail.description}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "goods",
    data() {
      return {
        goodsDetail: {},
        goodsList: [
          // {
          //   id: '1',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '2',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '3',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '4',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '5',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // },
          // {
          //   id: '6',
          //   title: '标题文字',
          //   subTitle: '副标题',
          //   price: '￥123.00',
          //   detail: '这是一段描述这是一段描述这是这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述一段描述'
          // }
        ],
        goodsLoading: false,
        goodsFinished: false
      };
    },
    methods: {
      goodsLoad() {
        setTimeout(() => {
          let list = this.goodsDetail.goods_list;
          for (let i = 0; i < list.length; i++) {
            this.goodsList.push(list[i]);
          }
          // 加载状态结束
          this.goodsLoading = false;

          // 数据全部加载完成
          if (this.goodsList.length >= list.length) {
            this.goodsFinished = true;
          }
        }, 500);
      },
      goodsRedeem(item) {
        console.log(this.goodsDetail);
        if (false) { // 测试 未登录
          this.$router.push({name: 'redeemLogin', params: {goodsItem: JSON.stringify(item)}});
        } else if (this.goodsDetail.type == 3) {  // 商品类型是实物

        }
      }
    },
    created() {
      this.goodsDetail = JSON.parse(this.$route.params.goodsDetail);
    }
  }
</script>

<style src="@/style/scss/pages/redeem/goods.scss" lang="scss">

</style>
