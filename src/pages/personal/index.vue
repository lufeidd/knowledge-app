<template>
  <div id="personalPage">
    <div class="infoBox">
      <div class="left">
        <div class="ratioBox" :class="{ active: !infoData.user_header }">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-personal-block"></use>
          </svg>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="desc">{{ infoData.user_name }}</div>
          <div class="action">
            <!-- <a class="tip" href="/personal/news">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalNews"></use>
              </svg>
            </a>-->
            <router-link :to="{path: '/personal/set/index', query: {user_name: infoData.user_name}}">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalSet"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="subTitle">登录后同步您的收藏</div>
      </div>
    </div>

    <div class="entryBox">
      <van-row type="flex" justify="space-around">
        <van-col span="6">
          <router-link to="/personal/focus">
            <div class="count">{{ infoData.follow_num }}</div>
            <div class="desc">关注</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/personal/collect">
            <div class="count">{{ infoData.collect_num }}</div>
            <div class="desc">收藏</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/personal/history">
            <div class="count">{{ infoData.history_num }}</div>
            <div class="desc">历史</div>
          </router-link>
        </van-col>
      </van-row>
    </div>

    <div class="cellBox">
      <template v-for="item in cellData">
        <a :href="item.href" class="cell">
          <div class="svg">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.svg"></use>
            </svg>
          </div>
          <div class="desc">
            <span class="text">{{ item.text }}</span>
            <span class="tip" v-if="item.tip">{{ item.tip }}</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true" v-if="item.icon">
              <use :xlink:href="item.icon"></use>
            </svg>
            <a class="text" :href="item.link" v-if="item.action">{{ item.action }}</a>
          </div>
        </a>
      </template>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/index.scss" lang="scss"></style>

<script>
//  引入接口
import { USER_HOMEPAGE } from "../../apis/user.js";

export default {
  data() {
    return {
      // 信息
      infoData: {},
      cellData: [
        {
          svg: "#icon-personalBuy",
          text: "我的余额",
          tip: "106点",
          link: "#/personal/remain/account",
          action: "充值"
        },
        {
          href: "#/personal/order/list",
          svg: "#icon-personalAccount",
          text: "我的购买",
          icon: "#icon-next-line"
        },
        {
          href: "#/cart",
          svg: "#icon-personalCart",
          text: "我的购物车",
          icon: "#icon-next-line"
        },
        // {
        //   href: "/",
        //   svg: "#icon-personalCoupon",
        //   text: "我的优惠券",
        //   icon: "#icon-next-line"
        // },
        {
          href: "#/personal/comment/index",
          svg: "#icon-personalComment",
          text: "我的评论",
          icon: "#icon-next-line"
        },
        // {
        //   href: "/",
        //   svg: "#icon-personalInvite",
        //   text: "邀请好友",
        //   icon: "#icon-next-line"
        // },
        {
          href: "#/personal/help/index",
          svg: "#icon-personalHelp",
          text: "帮助与反馈",
          icon: "#icon-next-line"
        }
      ]
    };
  },
  mounted() {
    this.homeData();
    console.log(this.infoData.user_header);
  },
  methods: {
    async homeData() {
      let data = {
        version: "1.0"
      };
      let res = await USER_HOMEPAGE(data);
      console.log("123", res);
      if (res.hasOwnProperty("response_code")) {
        this.$set(this.infoData, "user_header", res.response_data.user_header);
        this.$set(this.infoData, "user_name", res.response_data.user_name);
        this.$set(this.infoData, "follow_num", res.response_data.follow_num);
        this.$set(this.infoData, "collect_num", res.response_data.collect_num);
        this.$set(this.infoData, "history_num", res.response_data.history_num);

        $(".ratioBox").css(
          "background-image",
          "url(" + res.response_data.user_header + ")"
        );
        console.log("返回数据：", res.response_data);
      } else {
        this.$toast(res.error_message);
      }
    },
  }
};
</script>

