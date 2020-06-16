<template>
  <div id="packDetailPage">
    <div class="head">{{infoData.desc}}</div>
    <!-- 已发货 -->
    <div class="content" v-for="(item,index) in goods_list" :key="index">
      <div class="title">
        <span>{{item.package_desc}}</span>
        <span class="state">{{item.state_desc}}</span>
      </div>
      <div class="huoba-cell huoba-cell-three" @click="tologitc(item)">
        <div class="huoba-cell-left">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-logtic-block" />
          </svg>
        </div>
        <div class="huoba-cell-mid">
          <div class="huoba-cell-logticinfo">
            <span>{{item.express_logs.desc}}</span>
          </div>
          <div class="huoba-cell-timeinfo">{{item.express_logs.time}}</div>
        </div>
        <div class="huoba-cell-right">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line" />
          </svg>
        </div>
      </div>
      <div class="deadline"></div>
      <div class="goods">
        <div class="num">共{{item.infolength}}件商品</div>
        <div class="huoba-goods-list huoba-goods-list-seven">
          <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(litem,lindex) in item.goods_info" :key="lindex">
              <div class="huoba-goods-list-imgs">
                <div class="ratioBox">
                  <!-- <span class="huoba-goods-list-label">图书</span> -->
                  <!-- <span class="huoba-goods-list-label price">￥60.00</span> -->
                  <div class="box">
                    <img
                      :src="litem.pic"
                      alt
                    />
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
    <!-- 未发货 -->
    <div class="content" v-if="wait_length > 0">
      <div class="title">
        <span>以下商品待发货</span>
        <span class="state"></span>
      </div>
      <div class="goods">
        <div class="num">共{{wait_length}}件商品</div>
        <div class="huoba-goods-list huoba-goods-list-seven">
          <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
            <swiper-slide  v-for="(item,index) in wait_goods_list" :key="index">
              <div class="huoba-goods-list-imgs">
                <div class="ratioBox">
                  <!-- <span class="huoba-goods-list-label">图书</span> -->
                  <!-- <span class="huoba-goods-list-label price">￥60.00</span> -->
                  <div class="box">
                    <img
                      :src="item.pic"
                      alt
                    />
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#packDetailPage {
  background-color: $greyLight;
  min-height: 100%;
  & .head {
    padding: 20px 15px 10px 15px;
    font-size: $fontSize - 1;
  }
  & .content {
    background-color: #fff;
    margin-bottom: 10px;
    & .title {
      padding: 10px 15px;
      font-size: $fontSize + 1;
      color: $cl9;
      & .state {
        color: $cl3;
      }
    }
    & .deadline {
      height: 1px;
      background-color: $greyLight;
      margin-left: 60px;
    }
    & .goods {
      padding-left: 45px;
      & .num {
        padding-left: 15px;
        margin-top: 20px;
      }
    }
  }
}
</style>
<script>
import { ORDER_PACKAGE_DETAIL } from "../../../../apis/shopping.js";
export default {
  data() {
    return {
      order_id: null,
      infoData: {},
      goods_list: [],
      wait_goods_list: [],
      wait_length:0,
      swiperOption: {
        slidesPerView: "auto"
      },
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.getData();
  },
  methods: {
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        order_id: this.order_id
      };
      data.sign = this.$getSign(data);
      let res = await ORDER_PACKAGE_DETAIL(data);
      if (res.hasOwnProperty("response_code")) {
        this.infoData = res.response_data;
        this.goods_list = res.response_data.package_info;
        this.wait_goods_list = res.response_data.wait_send_goods;
        this.wait_length = this.wait_goods_list.length;
        for(let i=0;i<this.goods_list.length;i++){
          for(let j=0;j<this.goods_list[i].goods_info.length;j++){
            this.goods_list[i].infolength = this.goods_list[i].goods_info.length
          }
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    tologitc(item) {
      this.$router.push({
        name: "logistics",
        query: {
          order_id: this.order_id,
          express_id: item.express_info.id
        }
      });
    }
  }
};
</script>
