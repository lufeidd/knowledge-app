<template>
  <div id="cancelPage">
    <div class="tilte">请选择注销原因:</div>
    <ul class="reasonBox">
      <template v-for="(item, index) in reasonData">
         
        <li :class="{ active: item.isActive }" @click="choose()" :name="index">
          <svg class="icon" aria-hidden="true" v-if="item.isActive">
            <use xlink:href="#icon-checked-circle"></use>
          </svg>

          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-uncheck-line"></use>
          </svg>
          <div>{{ item.text }}</div>
        </li>
      </template>
    </ul>
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
      reasonData: [
        {
          isActive: true,
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
    choose() {
      console.log();
    }
  }
};
</script>

