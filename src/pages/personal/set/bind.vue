<template>
  <div id="bindPage">


    <van-cell title="手机绑定" is-link value="13200025452" style="margin-top:5px;"/>
    <van-cell title="用户名" is-link value="微信绑定"/>
    <van-cell title="qq绑定" is-link value="qq绑定" @click="showAction('bind')"/>

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

<style lang="sass">
 html {
   background-color: $greyLight;
 }
</style>


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
