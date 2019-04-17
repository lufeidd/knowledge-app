<template>
  <div id="setindexPage">
    <div v-for="item in listData">
      <router-link :to="item.link" class="listBox" :class="{ active: item.isActive }">
        <div class="left" v-if="item.imgSrc">
          <div class="ratioBox">
            <div class="box">
              <img :src="item.imgSrc">
            </div>
          </div>
        </div>
        <div class="center">
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="right">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line"></use>
          </svg>
        </div>
      </router-link>
    </div>
    <div style="margin-top: 5px;">
      <van-button size="large">退出登录</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/index.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      listData: [
        {
          isActive: true,
          link: "/personal/set/info",
          title: "用户路人甲",
          imgSrc:
            "https://bnmppic.bookuu.com/topic/20161108/1478612622195756.jpg"
        },
        {
          link: "/personal/set/safe",
          title: "账号和安全"
        },
        {
          isActive: true,
          link: "/personal/set/list",
          title: "我的收货地址"
        },
        {
          link: "/personal/set/send",
          title: "推送设置"
        },
        {
          link: "",
          title: "注销账号"
        },
        {
          link: "/personal/set/about",
          title: "关于"
        }
      ]
    };
  },
  mounted() {},
  methods: {}
};
</script>
