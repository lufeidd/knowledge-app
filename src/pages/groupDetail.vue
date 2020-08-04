<template>
  <div id="groupDetailPage">
    <div>
      <div class="top">
        <div class="stepIcon">
          <van-row type="flex" justify="space-between">
            <van-col span="4">
              <div class="radio">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xuanzeshangpin" />
                </svg>
                <div class="text">1. 选择商品开团/参团</div>
              </div>
            </van-col>
            <van-col span="6">
              <div class="line"></div>
            </van-col>
            <van-col span="4">
              <div class="radio">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yaoqinghaoyou" />
                </svg>
                <div class="text">2.邀请好友参团</div>
              </div>
            </van-col>
            <van-col span="6">
              <div class="line"></div>
            </van-col>
            <van-col span="4">
              <div class="radio">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-renmanchengtuan" />
                </svg>
                <div class="text" style="bottom:-23px;">3.人满成团</div>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <div class="mid" @click="toDetail">
        <div class="left">
          <div class="ratiobox">
            <div class="bookImg" :style="{'background-image':'url('+groupData.goods_pic+')'}"></div>
          </div>
        </div>
        <div class="right">
          <div class="title">{{groupData.title}}</div>
          <div class="sign">{{groupData.groupbuy_num}}人团：￥{{groupData.groupbuy_price.toFixed(2)}}</div>
          <div class="desc">
            直买价：￥
            <del>{{groupData.price.toFixed(2)}}</del>
          </div>
        </div>
        <div class="state">
          <svg class="icon" aria-hidden="true" v-if="groupData.state == 2">
            <use xlink:href="#icon-chenggongyinzhang" />
          </svg>
          <svg class="icon" aria-hidden="true" v-if="groupData.state == 4">
            <use xlink:href="#icon-shibaiyinzhang" />
          </svg>
        </div>
      </div>
      <div class="bottom">
        <div class="desc" v-if="groupData.state == 1">
          还差
          <span class="red">{{groupData.remain_nums}}人</span> 拼团成功，还剩
          <span class="red" v-if="groupshowDay">{{grouptimeData}} 天</span>
          <span v-else>
            <span class="time">{{timeH}}</span> ：<span class="time">{{timeM}}</span> ：<span class="time">{{timeS}}</span>
          </span>
        </div>
        <div class="state" v-if="groupData.state == 2">
          <span class="cry">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiao1" />
            </svg>
          </span>
          <span class="text">恭喜您，拼团成功啦~</span>
        </div>
        <div class="state" v-if="groupData.state == 4">
          <span class="cry">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-ku" />
            </svg>
          </span>
          <span class="text">不要灰心哦，试试再开一团~</span>
        </div>
        <div class="headpic">
          <!-- 两人团 -->
          <div v-if="groupData.groupbuy_num == 2">
            <span>
              <img :src="groupData.join_list[0].head_pic" alt width="40px" height="40px" />
              <div class="name">团长</div>
            </span>
            <span v-if="groupData.join_list.length == 2">
              <img :src="groupData.join_list[1].head_pic" alt width="40px" height="40px" />
            </span>
            <span class="mark" v-if="groupData.join_list.length == 1">?</span>
          </div>
          <!-- 三人团 -->
          <div v-if="groupData.groupbuy_num == 3">
            <span>
              <img :src="groupData.join_list[0].head_pic" alt width="40px" height="40px" />
              <div class="name">团长</div>
            </span>
            <span v-if="groupData.join_list.length > 1">
              <img :src="groupData.join_list[1].head_pic" alt width="40px" height="40px" />
            </span>
            <span v-if="groupData.state == 2">
              <img :src="groupData.join_list[2].head_pic" alt width="40px" height="40px" />
            </span>
            <span class="mark" v-if="groupData.state == 1 || groupData.state == 4">?</span>
            <span class="mark over" v-if="groupData.state == 1 || groupData.state == 4">......</span>
          </div>
          <!-- 多人团 -->
          <div v-if="groupData.groupbuy_num > 3">
            <span>
              <img :src="groupData.join_list[0].head_pic" alt width="40px" height="40px" />
              <div class="name">团长</div>
            </span>
            <span v-if="groupData.join_list.length > 1">
              <img :src="groupData.join_list[1].head_pic" alt width="40px" height="40px" />
            </span>
            <span v-if="groupData.state == 2">
              <img :src="groupData.join_list[2].head_pic" alt width="40px" height="40px" />
            </span>
            <span class="mark" v-if="groupData.state == 1 || groupData.state == 4">?</span>
            <span class="mark over">......</span>
          </div>
          <div class="button" v-if="groupData.my_order_id.length == 0 && groupData.state == 1">
            <van-button type="danger" round @click="addgroup">我要参团</van-button>
          </div>
          <div class="button" v-if="groupData.my_order_id && groupData.state == 1">
            <van-button type="danger" round @click.stop="share">邀请好友参团</van-button>
            <van-button type="primary" round @click="order" v-if="groupData.my_order_id">查看订单</van-button>
          </div>
          <div class="button" v-if="groupData.state == 4 && groupData.groupbuy_open_nums == 0">
            <van-button type="danger" round @click="order" v-if="groupData.my_order_id">查看订单</van-button>
          </div>
          <div class="button" v-if="groupData.state == 4 && groupData.groupbuy_open_nums > 0">
            <van-button type="danger" round @click="opengroup">再开一团</van-button>
            <van-button type="primary" round @click="order" v-if="groupData.my_order_id">查看订单</van-button>
          </div>
          <div class="button" v-if="groupData.state == 2 && groupData.groupbuy_open_nums == 0">
            <van-button type="danger" round @click="order" v-if="groupData.my_order_id">查看订单</van-button>
          </div>
          <div class="button" v-if="groupData.state == 2 && groupData.groupbuy_open_nums > 0">
            <van-button type="danger" round @click="opengroup">再开一团</van-button>
            <van-button type="primary" round @click="order" v-if="groupData.my_order_id">查看订单</van-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 分享弹层 -->
    <van-popup
      v-model="show"
      style="width:100%;max-height:100%;height:100%;background-color:rgba(0,0,0,0.4);"
      @click="close"
    >
      <span class="arrow" @click="close">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-left-arrow" />
        </svg>
      </span>
      <div class="cloud">
        <img src="../assets/null/share_text.png" alt />
      </div>
      <span class="clip">. . .</span>
    </van-popup>
    <EazyNav type="brand" :isShow="false"></EazyNav>
    <!--通用弹窗-->
    <PublicPopup></PublicPopup>
  </div>
</template>

<style src="@/style/scss/pages/groupDetail.scss" scoped lang="scss"></style>

<script>
import { GROUPBUY_OPEN_DETAIL } from "../apis/coupon.js";
import { USER_HOMEPAGE } from "../apis/user.js";
export default {
  data() {
    return {
      open_id: null,
      groupData: {
        groupbuy_price: 0,
        price: 0,
        my_order_id: 0,
        join_list: []
      },
      grouptimeData: null,
      groupshowDay: false,
      timeH: null,
      timeM: null,
      timeS: null,
      show: false,
      is_login: null
    };
  },
  mounted() {
    this.open_id = parseInt(this.$route.query.open_id);
    this.returnPrice();
    this.getLogin();
    var self = this
    $('body').on('click',function(){
      self.show = false;
    })
  },
  methods: {
    async getLogin() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_HOMEPAGE(data);

      if (res.hasOwnProperty("response_code")) {
        this.is_login = res.response_data.is_login;
      } else {
        this.$toast(res.error_message);
      }
    },
    async returnPrice() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        open_id: this.open_id
      };
      data.sign = this.$getSign(data);
      let res = await GROUPBUY_OPEN_DETAIL(data);

      if (res.hasOwnProperty("response_code")) {
        this.groupData = res.response_data;
        if (this.groupData.remain_time > 0)
          this.$countTime(this.groupData.remain_time);



      } else {
        this.$toast(res.error_message);
      }
    },
    share() {
      this.show = true;
    },
    close() {
      console.log(2121)
      this.show = false;
    },
    order() {
      if (this.is_login) {
        this.$router.push({
          name: "orderdetail",
          query: { order_id: this.groupData.my_order_id }
        });
      } else {
        this.$router.push({
          name: "login"
        });
      }
    },
    opengroup() {
      if (this.is_login) {
        if (this.groupData.goods_type == 3) {
          this.$router.push({
            name: "orderconfirm",
            query: {
              groupbuy_id: this.groupData.groupbuy_id,
              goods_id:this.groupData.goods_id,
              sku_id:this.groupData.goods_id,
              count: 1,
              detail: true
            }
          });
        } else {
          this.$router.push({
            name: "payaccount",
            query: {
              goods_id: this.groupData.goods_id,
              groupbuy_id: this.groupData.groupbuy_id,
            }
          });
        }
      } else {
        this.$router.push({
          name: "login"
        });
      }
    },
    addgroup() {
      if (this.is_login) {
        if (this.groupData.goods_type == 3) {
          this.$router.push({
            name: "orderconfirm",
            query: {
              groupbuy_open_id: this.groupData.open_id,
              groupbuy_id: this.groupData.groupbuy_id,
              goods_id: this.groupData.goods_id,
              sku_id: this.groupData.goods_id,
              count: 1,
              detail: true,
            }
          });
        } else {
          this.$router.push({
            name: "payaccount",
            query: {
              goods_id: this.groupData.goods_id,
              groupbuy_id: this.groupData.groupbuy_id,
              groupbuy_open_id: this.groupData.open_id,
            }
          });
        }
      } else {
        this.$router.push({
          name: "login"
        });
      }
    },
    toDetail(){
      if(this.groupData.goods_type == 1 || this.groupData.goods_type == 2){
        this.$router.push({
          name: "albumdetail",
          query: { goods_id: this.groupData.goods_id }
        });
      }else if(this.groupData.goods_type == 9){
        this.$router.push({
          name: "album",
          query: { goods_id: this.groupData.goods_id }
        });
      }else if(this.groupData.goods_type == 4){
        this.$router.push({
          name: "ebookdetail",
          query: { goods_id: this.groupData.goods_id }
        });
      }else if(this.groupData.goods_type == 3){
        this.$router.push({
          name: "groupgoods",
          query: { goods_id: this.groupData.goods_id,groupbuy_id:this.groupData.groupbuy_id }
        });
      }
    }
  }
};
</script>
