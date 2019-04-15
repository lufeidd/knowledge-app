<template>
  <div id="personalPage">
    <div class="infoBox">
      <div class="left">
        <div class="ratioBox">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-personal-block"></use>
          </svg>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <div class="desc">{{ info.title }}</div>
          <div class="action">
            <router-link to="/news">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalNews"></use>
              </svg>
            </router-link>
            <router-link to="/set">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-personalSet"></use>
              </svg>
            </router-link>
          </div>
        </div>
        <div class="subTitle">{{ info.subTitle }}</div>
      </div>
    </div>

    <div class="entryBox">
      <van-row type="flex" justify="space-around">
        <van-col span="6">
          <router-link to="/focus">
            <div class="count">119</div>
            <div class="desc">关注</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/collect">
            <div class="count">2365</div>
            <div class="desc">收藏</div>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/history">
            <div class="count">123</div>
            <div class="desc">历史</div>
          </router-link>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal.scss" lang="scss"></style>

<script>
export default {
  components: {},
  data() {
    return {
      info: {
        title:
          "Sa快乐  Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐Sa快乐",
        subTitle: "登录后同步您的收藏"
      }
    };
  },
  created() {},
  methods: {}
};
</script>

