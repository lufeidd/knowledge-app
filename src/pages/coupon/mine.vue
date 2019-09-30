<template>
  <div id="minePage">
    <div>
      <van-tabs
        sticky
        animated
        color="#666"
        title-active-color="#f05654"
        @click="tabChange"
        v-model="activekey"
      >
        <van-tab title="综合">
          <van-list
            v-model="programLoading"
            :finished="programFinished"
            finished-text="已经到底了~"
            @load="programLoad"
          >
            <div class="content" v-for="(item,index) in column_list_data" :key="index">
              <!-- 可使用 -->
              <div class="toUse" v-if="item.is_use == 0 && item.is_over == 0" @click>
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">5</span>
                  </div>
                  <div class="condition">满20元可用</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu">店铺券</span>
                    </span>
                    <span class="shop">博库网专营店</span>
                  </div>
                  <div class="desc">
                    限部分实体图书
                    <van-button size="mini" round type="danger" v-if="item.is_time">去使用</van-button>
                    <van-button size="mini" round type="primary" v-else>可用商品</van-button>
                  </div>
                  <div class="time">2019.09.01- 2019.10.20</div>
                </div>
              </div>
              <!-- 已使用 -->
              <div
                :class="item.is_over? 'toUse overdue':'toUse isused'"
                v-if="item.is_use == 1 || item.is_over == 1"
              >
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">5</span>
                  </div>
                  <div class="condition">满20元可用</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu">店铺券</span>
                    </span>
                    <span class="shop">博库网专营店</span>
                  </div>
                  <div class="desc">限部分实体图书</div>
                  <span class="used" v-if="item.is_use">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-yishiyong1" />
                    </svg>
                  </span>
                  <span class="used" v-if="item.is_over">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-overed-line" />
                    </svg>
                  </span>
                  <div class="time">2019.09.01- 2019.10.20</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-tab>
        <van-tab title="新品">222</van-tab>
        <van-tab title="销量">333</van-tab>
        <van-tab>
          <div slot="title">
            价格<svg class="icon" v-if="activekey !== 3" aria-hidden="true" >
            <use xlink:href="#icon-pricesort-block" />
          </svg>
          <svg class="icon" v-if="activekey == 3 && priceSort" aria-hidden="true" >
            <use xlink:href="#icon-priceup-block" />
          </svg>
          <svg class="icon" v-if="activekey == 3 && !priceSort" aria-hidden="true" >
            <use xlink:href="#icon-pricedown-block" />
          </svg>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button size="large"><svg class="icon" aria-hidden="true" >
            <use xlink:href="#icon-coupon-line" />
          </svg> 领取更多好券</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/coupon/mine.scss" scoped lang="scss"></style>

<style lang="scss" scoped>
#minePage {
  .van-button--primary {
    background-color: transparent;
    border-color: $redLight;
    color: $redLight;
    position: absolute;
    right: 5px;
    top: 35px;
    width: 60px;
    // padding:0 3px;
  }
  .bottomBox .van-button{
    color:$redLight;
    .icon{
      font-size: $fontSize + 4;
    }
  }
  .van-button--danger {
    position: absolute;
    right: 5px;
    top: 35px;
    width: 60px;
  }
  .van-list {
    padding: 0 15px;
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
      column_list: ["未使用", "已使用", "已过期"],
      column_list_data: [
        { is_use: 1, is_over: 0, is_time: 1 },
        { is_use: 1, is_over: 0, is_time: 0 },
        { is_use: 0, is_over: 0, is_time: 1 },
        { is_use: 0, is_over: 0, is_time: 0 },
        { is_use: 0, is_over: 1, is_time: 1 }
      ],
      priceSort:true,
    };
  },
  mounted() {},
  methods: {
    // 点击tab页切换
    tabChange(index) {
      this.activekey = index;
      console.log(this.activekey);
      if(this.priceSort){
        this.priceSort == false;
      }else{
        this.priceSort == true;
      }
      // this.column_list_data = [];
      // this.programFinished = false;
      // this.currentPage = 1;
    },
    programLoad() {}
  }
};
</script>
