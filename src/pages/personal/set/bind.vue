<template>
  <div id="bindPage">
    <div v-for="item in listData">
      <div class="listBox" :class="{ active: item.isActive }" @click="showAction(item.type)">
        <div class="center">
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="left">
          <template v-if="item.text">{{ item.text }}</template>
        </div>
        <div class="right">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line"></use>
          </svg>
        </div>
        
      </div>
    </div>
    <!-- 头像裁切，异步组件 -->
    <!-- 性别 -->
    <van-actionsheet
      v-model="bindModel"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
      @cancel="bindModel=false"
    />
  </div>
</template>

<style src="@/style/scss/pages/personal/set/bind.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      // 性别
      bindModel: false,
      actions: [
        {
          name: "解绑"
        },
      ],
      listData: [
        {
            isActive: true,
          text: "134****3931",
          title: "头手机绑定像"
        },
        {
          text: "微信绑定",
          title: "路人甲"
        },
        {
          text: "去绑定",
          title: "QQ绑定"
        },
        {
          type: "bind",
          text: "QQ绑定",
          title: "新浪文博绑定"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    showAction(type) {
      if (type) {
        switch (type) {
          // 性别
          case "bind":
            this.bindModel = true;
            break;
        }
      }
    },
    // 性别
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.bindModel = false;
      this.listData[4].text = item.name;
      //   this.$toast(item.name);
    },
  }
};
</script>
