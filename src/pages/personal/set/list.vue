<template>
  <div id="listPage" :class="{ page: this.isIphx }">
    <ul class="addressBox">
      <template v-for="(item, key) in addressData">
        <li @click="choose(key)" :class="{ active: activeIndex == key }">
          <div class="info">
            <div>
              <span class="name">{{ item.name }}</span>
              <span class="phone">{{ item.phone }}</span>
            </div>
            <div class="address">{{ item.address }}</div>
          </div>
          <div class="action">
            <div class="default">
              <svg class="icon" aria-hidden="true" v-if="activeIndex == key">
                <use xlink:href="#icon-checked-circle"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-else>
                <use xlink:href="#icon-uncheck-line"></use>
              </svg>
              <span>默认地址</span>
            </div>
            <div class="edit">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-checked-circle"></use>
              </svg>
              <span>编辑</span>
            </div>
            <div class="delete">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-checked-circle"></use>
              </svg>
              <span>删除</span>
            </div>
          </div>
        </li>
      </template>
    </ul>
    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button size="large" type="danger">+新增收货地址</van-button>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/list.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      addressData: [
        {
          name: "李瑞",
          phone: "15088658807",
          address: "浙江省杭州市西湖区西湖边东区23树6洞3楼23树6 洞3楼 "
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

