<template>
  <div id="listPage" class="page" :class="{ active: this.isIphx }">
    <ul class="addressBox">
     
      <li v-for="(item, key) in addressData" :key="key">
        <div class="info">
          <div>
            <span class="name">{{ item.consignee }}</span>
            <span class="phone">{{ item.mobile }}</span>
          </div>
          <div class="address">{{ item.address }}</div>
        </div>
        <div class="action">
          <div class="default" @click="choose(key)" :class="{ active: activeIndex == key }">
            <svg class="icon" aria-hidden="true" v-if="activeIndex == key">
              <use xlink:href="#icon-checked-block"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-uncheck-line"></use>
            </svg>
            <span>默认地址</span>
          </div>
          <router-link to="/personal/set/address" class="edit">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-edit-line"></use>
            </svg>
            <span>编辑</span>
          </router-link>
          <div class="delete" @click="deleteAction(key)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-delete-line"></use>
            </svg>
            <span>删除</span>
          </div>
        </div>
      </li>
        
    </ul>
    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button size="large" type="danger">+新增收货地址</van-button>
      <div class="count">{{ count }}/50</div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/list.scss" lang="scss"></style>

<script>
//  引入接口
import { USER_ADDRESS } from "../../../apis/user.js";
export default {
  data() {
    return {
        count: 5,
      activeIndex: 0,
      addressData: [],
    };
  },
  mounted () {
    this.getAddressData();
  },
  methods: {
    // 获取我的收货地址信息
    async getAddressData() {
      let data = {
        version: "1.0"
      };
      let res = await USER_ADDRESS(data);
      console.log("123", res.response_data);
      if (res.hasOwnProperty("response_code")) {
        for(let i = 0; i < res.response_data.length; i++) {
          this.addressData.push(res.response_data[i]);
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    choose(key) {
      console.log(key);
      this.activeIndex = key;
    },
    deleteAction(key) {
      console.log(key);
      this.$dialog
        .confirm({
          title: "标题",
          message: "弹窗内容"
        })
        .then(() => {
          // on confirm
          this.$toast('999');
        })
        .catch(() => {
          // on cancel
        });
      //   this.activeIndex = key;
    }
  }
};
</script>

