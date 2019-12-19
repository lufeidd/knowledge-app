<template>
  <div id="listPage">
    <div class="nullBox" v-if="finished && addressData.length == 0">
      <img src="./../../../assets/null/address.png" width="100%" />
      <div>暂时没有收货地址,去添加吧~</div>
    </div>

    <ul v-else class="addressBox">
      <li v-for="(item, key) in addressData" :key="key">
        <div class="info" @click="editAction(item.address_id)">
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
              <use xlink:href="#icon-checked-block" />
            </svg>
            <svg class="icon" aria-hidden="true" v-else>
              <use xlink:href="#icon-uncheck-line" />
            </svg>
            <span>默认地址</span>
          </div>
          <router-link
            :to="{ name: 'address', query: {addressId: item.address_id, pageType: 'edit'}}"
            class="edit"
          >
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-edit-line" />
            </svg>
            <span>编辑</span>
          </router-link>
          <div class="delete" @click="deleteAction(item.address_id, key)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-delete-line" />
            </svg>
            <span>删除</span>
          </div>
        </div>
      </li>
    </ul>
    <CopyRight></CopyRight>
    <div style="height: 60px;"></div>
    <div v-if="this.isIphx" style="height: 34px;"></div>
    <div class="bottomBox" :class="{ iphx: this.isIphx }">
      <van-button
        v-if="addressData.length < 50"
        size="large"
        type="danger"
        @click="addAddress"
      >+新增收货地址</van-button>
      <van-button v-else size="large" type="danger" disabled>+新增收货地址</van-button>

      <div class="count">{{ addressData.length }}/50</div>
    </div>
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/personal/set/list.scss" scoped lang="scss"></style>
<style lang="scss">
#listPage {
  .van-button {
    border-radius: 0;
  }

  .van-button::before {
    display: none;
  }

  .van-button--plain.van-button--danger {
    background-color: #fff;
  }

  .van-button--danger {
    background-color: #f05654;
    border-color: #f05654;
  }

  .van-button--danger.van-button--disabled {
    background-color: #d6d6d6;
    border-color: #d6d6d6;
    opacity: 1;
  }

  .van-button--small {
    min-width: 80px;
  }

  .van-button--large {
    height: 50px;
    line-height: 50px;
  }

  .van-button--default {
    color: #333;
  }
}
</style>


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
      addressData: [],
      finished: false
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
        this.finished = true;
      } else {
        this.$toast(res.error_message);
      }
      // console.log(res);
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
        // 从订单确认页面进入的获取地址需要主动回退
        if (this.$route.query.type && this.$route.query.type == "confirm") {
          this.$router.go(-1);
        }
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
          message: "确定要删除该地址吗？"
        })
        .then(() => {
          // on confirm
          this.deleteAddress(address_id);
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
        this.getAddressData();
        this.$toast("地址删除成功~");
      } else {
        this.$toast(res.error_message);
      }
    },
    // 新增收货地址
    addAddress() {
      this.$router.replace({ name: "address", query: { pageType: "add" } });
    }
  }
};
</script>

