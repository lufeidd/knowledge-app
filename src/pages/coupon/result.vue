<template>
  <div id="couponResultPage">
    <div>
      <div class="searhResult">
        <svg class="icon searchIcon" aria-hidden="true">
          <use xlink:href="#icon-search-line" />
        </svg>
        <input type="text" v-model="searchContent" @focus="inputText" />
        <span class="cancel" @click="inputText">取消</span>
      </div>
      <van-tabs
        sticky
        animated
        color="#666"
        title-active-color="#f05654"
        @click="tabChange"
        v-model="activekey"
      >
        <van-tab :title="items" v-for="(items,index) in column_list" :key="index">
          <template v-if="activekey == index">
            <div style="margin-top:15px;font-size:16px;margin-left:15px;">以下商品可使用149-100的优惠券</div>
            <van-list
              v-model="programLoading"
              :finished="programFinished"
              finished-text="已经到底了~"
              @load="programLoad"
            >
              <div class="content" v-for="(item,index) in column_list_data" :key="index">
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="item.pic"></div>
                  <div class="only">仅剩2件</div>
                </div>
                <div class="right">
                  <div class="text">我是一段商品标题最长商品标题最长商</div>
                  <div class="pinpai">
                    <van-button size="mini" round type="danger">领券满149-100</van-button>
                    <van-button size="mini" round type="danger">领券满149-100</van-button>
                  </div>
                  <div class="nice">
                    <span class="price">￥936</span>
                    <span class="cart">
                      <svg class="icon" aria-hidden="true" @click="set">
                        <use xlink:href="#icon-cart-line" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </van-list>
          </template>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/coupon/result.scss" scoped lang="scss"></style>
<style lang="scss" scoped>
#couponResultPage {
  .van-list {
    padding: 0 15px;
  }
  .van-button--danger{
    font-size:$fontSize - 4;
    background-color: transparent;
    border-color: $redLight;
    color:$redLight;
    padding:0 3px;
  }

}
</style>
<script>
export default {
  data() {
    return {
      currentPage: 1,
      programLoading: false,
      programFinished: false,
      activekey: 0,
      column_list: ["综合", "新品", "销量", "价格"],
      searchContent: "",
      column_list_data: [
        {pic:"http://file.huoba.dev.zw/shop/10016/100042/picture/ebook/20190823/13/20190823131440268.jpg"}
      ]
    };
  },
  mounted() {},
  methods: {
    programLoad() {},
    // 点击tab页切换
    tabChange(index) {
      this.activekey = index;
      // this.column_list_data = [];
      // this.programFinished = false;
      // this.currentPage = 1;
    },
    inputText() {
      this.$toast({
        type:'html',
        message:'<div style="padding:15px;text-align:center;"><p style="font-size:26px;"><svg class="icon" aria-hidden="true" @click="set"><use xlink:href="#icon-failed-line" /></svg></p><p>成功加入购物车</p></div>'
      })
    },
    set(){}
  }
};
</script>
