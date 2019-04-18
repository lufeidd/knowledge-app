<template>
  <div id="personalPage">
    <div class="infoBox">
      <div class="left">
        <div class="ratioBox" :class="{ active: infoData.bgImg }">
          <svg class="icon" aria-hidden="true" v-if="!infoData.bgImg">
            <use xlink:href="#icon-personal-block"></use>
          </svg>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="desc">{{ infoData.title }}</div>
          <div class="action">
            <!-- <a class="tip" href="/personal/news">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalNews"></use>
              </svg>
            </a> -->
            <a href="#/personal/set/index">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalSet"></use>
              </svg>
            </a>
          </div>
        </div>
        <div class="subTitle">{{ infoData.subTitle }}</div>
      </div>
    </div>

    <div class="entryBox">
      <van-row type="flex" justify="space-around">
        <van-col span="6">
          <router-link to="/personal/focus">
            <div class="count">119</div>
            <div class="desc">关注</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/personal/collect">
            <div class="count">2365</div>
            <div class="desc">收藏</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/personal/history">
            <div class="count">123</div>
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
export default {
  components: {},
  data() {
    return {
      infoData: {
        title:
          "Sa快乐  Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐",
        subTitle: "登录后同步您的收藏",
        bgImg: true,
        imgSrc:
          "https://wdimg3.bookuu.com/goods/06/26/42/2018102330285485-76655.jpg@!w210"
      },
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
          href: "/",
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
          href: "/",
          svg: "#icon-personalComment",
          text: "我的评论",
          icon: "#icon-next-line"
        },
        {
          href: "/",
          svg: "#icon-personalInvite",
          text: "邀请好友",
          icon: "#icon-next-line"
        },
        {
          href: "/",
          svg: "#icon-personalHelp",
          text: "帮助与反馈",
          icon: "#icon-next-line"
        }
      ]
    };
  },
  created() {},
  mounted() {
    if (this.infoData.bgImg) {
      $(".ratioBox.active").css(
        "background-image",
        "url(" + this.infoData.imgSrc + ")"
      );
    }
  },
  methods: {}
};
</script>

