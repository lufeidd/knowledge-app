<template>
  <div id="listPage">
    <div class="nullBox" v-if="addressData.length == 0">
      <img src="./../../../assets/null/address.png" width="100%">
      <div>暂时没有收货地址,去添加吧~</div>
    </div>

    <ul v-else class="addressBox">
      <li v-for="(item, key) in addressData" :key="key">
        <div class="info">
          <div>
            <span class="name">{{ item.consignee }}</span>
            <span class="phone">{{ item.mobile }}</span>
          </div>
          <div class="address">{{ item.province }}{{ item.city }}{{ item.county }}{{ item.address }}</div>
        </div>
        <div class="action">
          <div
            class="default"
            @click="editAction(item.address_id)"
            :class="{ active: item.is_default == 1 }"
          >
            <svg class="icon" aria-hidden="true" v-if="item.is_default == 1">
              <use xlink:href="#icon-checked-block"></use>
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-uncheck-line"></use>
            </svg>
            <span>默认地址</span>
          </div>
          <router-link
            :to="{ name: 'address', params: {addressId: item.address_id, pageType: 'edit'}}"
            class="edit"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-edit-line"></use>
            </svg>
            <span>编辑</span>
          </router-link>
          <div class="delete" @click="deleteAction(item.address_id, key)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-delete-line"></use>
            </svg>
            <span>删除</span>
          </div>
        </div>
      </li>
    </ul>

    <div style="height: 60px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button size="large" type="danger" @click="addAddress">+新增收货地址</van-button>
      <div class="count">{{ addressData.length }}/50</div>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/list.scss" scoped lang="scss"></style>

<script>
//  引入接口
import {
  USER_ADDRESS_LIST,
  USER_ADDRESS_DEL,
  USER_ADDRESS_EDIT
} from "../../../apis/user.js";

export default {
  data() {
    return {
      addressData: []
    };
  },
  mounted() {
    this.getAddressData();
  },
  methods: {
    // 获取我的收货地址信息
    async getAddressData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_ADDRESS_LIST(data);
      if (res.hasOwnProperty("response_code")) {
        this.addressData = [];
        for (let i = 0; i < res.response_data.length; i++) {
          this.addressData.push(res.response_data[i]);
        }
      } else {
        this.$toast(res.error_message);
      }
      console.log(123, res);
    },
    // 修改当前地址
    async editAddress(addressId, key) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        address_id: addressId,
        is_default: 1,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_ADDRESS_EDIT(data);
      if (res.hasOwnProperty("response_code")) {
        this.getAddressData();
      } else {
        this.$toast(res.error_message);
      }
    },
    editAction(address_id, key) {
      this.editAddress(address_id, key);
    },
    // 删除地址
    deleteAction(address_id) {
      // console.log(address_id);
      this.$dialog
        .confirm({
          title: "标题",
          message: "弹窗内容"
        })
        .then(() => {
          // on confirm
          this.deleteAddress(address_id);
          this.getAddressData();
        })
        .catch(() => {
          // on cancel
        });
    },
    async deleteAddress(addressId) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        address_id: addressId,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_ADDRESS_DEL(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("地址删除成功~");
      } else {
        this.$toast(res.error_message);
      }
    },
    // 新增收货地址
    addAddress() {
      this.$router.push({ name: "address", params: { pageType: "add" } });
    }
  }
};
</script>

