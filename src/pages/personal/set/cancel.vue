<template>
  <div id="cancelPage">
    <div class="tilte">请选择注销原因:</div>
    <ul class="reasonBox">
      <template v-for="(item, key) in reasonData">
        <li @click="choose(key)" :class="{ active: activeIndex == key }">

          <svg class="icon" aria-hidden="true" v-if="activeIndex == key">
            <use xlink:href="#icon-checked-circle"></use>
          </svg>

          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-uncheck-line"></use>
          </svg>
          <div>{{ item.text }}</div>
        </li>
      </template>
    </ul>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button size="large" type="danger">确定注销账号</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/cancel.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      reasonData: [
        {
          text: "需要解绑手机"
        },
        {
          text: "安全隐私顾虑"
        },
        {
          text: "这是多余的账号"
        },
        {
          text: "其他"
        }
      ]
    };
  },
  methods: {
    choose(key) {
      console.log(key);
      this.activeIndex = key;
    }
  }
};
</script>

