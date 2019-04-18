<template>
  <div id="safePage">
    <div class="cellBox">
      <template v-for="item in cellData">
        <a :href="item.href" class="cell">
          <div class="desc">
            <span class="text">{{ item.text }}</span>
          </div>
          <div class="action">
            <svg class="icon" aria-hidden="true" v-if="item.icon">
              <use :xlink:href="item.icon"></use>
            </svg>
          </div>
        </a>
      </template>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/safe.scss" lang="scss"></style>

<script>
export default {
  components: {},
  data() {
    return {
      cellData: [
        {
          href: "#/personal/set/bind",
          text: "账号绑定",
          icon: "#icon-next-line"
        },
        {
          href: "/",
          text: "修改密码",
          icon: "#icon-next-line"
        },
        {
          href: "/",
          text: "注销账户",
          icon: "#icon-next-line"
        },
      ]
    };
  },
  created() {},
  mounted() {
  },
  methods: {}
};
</script>

