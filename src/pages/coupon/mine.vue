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
        <van-tab :title="'未使用（'+notUse+'）'">
          <van-list
            v-model="programLoading"
            :finished="programFinished"
            finished-text="已经到底了~"
            @load="programLoad"
          >
            <div class="content" v-for="(item,index) in couponList" :key="index">
              <!-- 可使用 -->
              <div class="toUse" @click="toresult(item,index)">
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">{{item.money}}</span>
                  </div>
                  <div class="condition">满{{item.use_min_money}}元可用</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu" v-if="item.brand_id">店铺券</span>
                      <span class="dianpu" v-else>平台券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">
                    {{item.use_range_desc}}
                    <van-button
                      size="mini"
                      round
                      type="primary"
                      v-if="(new Date(item.use_stime) - new Date())>0"
                    >可用商品</van-button>
                    <van-button size="mini" round type="danger" v-else>去使用</van-button>
                  </div>
                  <div
                    class="time"
                    v-if="(new Date(item.use_stime) - new Date())>0"
                  >{{count_time(item.use_stime)}}</div>
                  <div
                    class="time"
                    v-else
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-tab>
        <van-tab title="已使用">
          <van-list
            v-model="programLoading"
            :finished="programFinished"
            finished-text="已经到底了~"
            @load="programLoad"
          >
            <div class="content" v-for="(item,index) in couponList" :key="index">
              <div class="toUse isused" @click="toresult(item,index)">
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">{{item.money}}</span>
                  </div>
                  <div class="condition">满{{item.use_min_money}}元可用</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu" v-if="item.brand_id">店铺券</span>
                      <span class="dianpu" v-else>平台券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <span class="used">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-yishiyong1" />
                    </svg>
                  </span>
                  <!-- <span class="used" v-if="item.is_over">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-overed-line" />
                </svg>
                  </span>-->
                  <div
                    class="time"
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-tab>
        <van-tab title="已过期">
          <van-list
            v-model="programLoading"
            :finished="programFinished"
            finished-text="已经到底了~"
            @load="programLoad"
          >
            <div class="content" v-for="(item,index) in couponList" :key="index">
              <div class="toUse overdue" @click="toresult(item,index)">
                <div class="left"></div>
                <div class="mid">
                  <div>
                    ￥
                    <span class="price">5</span>
                  </div>
                  <div class="condition">满{{item.use_min_money}}元可用</div>
                  <span class="circle top"></span>
                  <span class="circle bottom"></span>
                </div>
                <div class="right">
                  <div>
                    <span class="shopCoupon">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-coupon-block" />
                      </svg>
                      <span class="dianpu" v-if="item.brand_id">店铺券</span>
                      <span class="dianpu" v-else>平台券</span>
                    </span>
                    <span class="shop">{{item.brand_name}}</span>
                  </div>
                  <div class="desc">{{item.use_range_desc}}</div>
                  <span class="used">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-overed-line" />
                    </svg>
                  </span>
                  <div
                    class="time"
                  >{{item.use_stime.replace(/-/g,'.').substring(0,10)}}-{{item.use_etime.replace(/-/g,'.').substring(0,10)}}</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-tab>
        <!-- <van-tab>
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
        </van-tab>-->
      </van-tabs>
    </div>
    <div class="bottomBox" :class="{iphx:this.isIphx}">
      <van-button size="large" @click="receiveMore">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-coupon-line" />
        </svg> 领取更多好券
      </van-button>
    </div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
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
    right: 10px;
    top: 45px;
    width: 60px;
    // padding:0 3px;
  }
  .bottomBox .van-button {
    color: $redLight;
    .icon {
      font-size: $fontSize + 4;
    }
  }
  .van-button--danger {
    position: absolute;
    right: 10px;
    top: 45px;
    width: 60px;
  }
  .van-list {
    padding: 0 15px;
    padding-bottom: 50px;
  }
}
</style>
<script>
import { USER_TICKET_GETS } from "../../apis/coupon.js";
export default {
  data() {
    return {
      programLoading: false,
      programFinished: false,
      activekey: 0,
      notUse: 0,
      priceSort: true,
      page: 1,
      couponList: [],
      coupon_state: 1
    };
  },
  mounted() {
    console.log(new Date("2019-09-29 00:00:00"));
  },
  methods: {
    // 点击tab页切换
    tabChange(index) {
      this.activekey = index;
      if (this.activekey == 0) {
        this.coupon_state = 1;
      } else if (this.activekey == 1) {
        this.coupon_state = 2;
      } else if (this.activekey == 2) {
        this.coupon_state = 4;
      }
      this.couponList = [];
      this.page = 1;
      this.programLoading = true; //下拉加载中
      this.programFinished = false; //下拉结束
      if (this.programLoading) {
        this.programLoad();
      }
    },
    programLoad() {
      this.getList();
    },
    async getList() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        page: this.page,
        state: this.coupon_state
      };
      data.sign = this.$getSign(data);
      let res = await USER_TICKET_GETS(data);
      if (res.hasOwnProperty("response_code")) {
        if (this.coupon_state == 0) {
          this.notUse = res.response_data.total_count;
        }
        // 异步更新数据
        var result = res.response_data.result;
        // setTimeout(() => {
          for (let i = 0; i < result.length; i++) {
            this.couponList.push(result[i]);
          }
          // 加载状态结束
          this.programLoading = false;
          this.page++;

          // 数据全部加载完成
          if (this.page > res.response_data.total_page) {
            this.programFinished = true;
            this.page = 1;
          }
        // }, 1);
      } else {
        this.$toast(res.error_message);
      }
    },
    toresult(item, index) {
      // console.log(item);
      this.$router.push({
        name: "couponresult",
        query: {
          ticket_id: item.ticket_id
        }
      });
    },
    receiveMore() {
      this.$linkToApp();
    },
    count_time(endtime) {
      var time1 = new Date(endtime);
      var time2 = new Date();
      var _desc;
      if (time1 > time2) {
        var diff = time1.getTime() - time2.getTime();
        var days = Math.floor(diff / (24 * 3600 * 1000));
        //计算出小时数
        var leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        _desc = days + "天" + hours + "小时" + minutes + "分钟后可用";
        // console.log(days, hours, minutes);
      }
      console.log(_desc);
      return _desc;
    }
  }
};
</script>
