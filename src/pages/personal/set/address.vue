<template>
  <div id="addressPage">
    <van-cell-group>
      <van-field v-model="addressInfo.name" label="收货人" placeholder="请输入收货人姓名" clearable />
      <van-field
        v-model="addressInfo.tel"
        clearable
        label="手机号码"
        placeholder="请输入手机号码"
        type="tel"
        maxlength="11"
      />

      <div style="position: relative;">
        <van-field v-model="addressDefault" label="所在地区" placeholder="省市区" />
        <div style="position: absolute;width: 100%;height: 100%;left: 0;top: 0;z-index: 1;" @click="showPopup"></div>
      </div>

      <van-field v-model="addressInfo.addressDetail" label="详细地址" clearable placeholder="详细地址" />

      <van-switch-cell
        v-model="addressInfo.isDefault"
        title="设置默认地址"
        @change="!addressInfo.isDefault"
      />
    </van-cell-group>

    <div style="margin: 50px 30px;">
      <van-button slot="button" size="large" round type="danger" @click="saveAddress">保存</van-button>
    </div>

    <!-- 选择省市区 -->
    <van-popup v-model="popupModel" position="bottom">
      <van-area
        class="areaBox"
        :area-list="areaList"
        :columns-num="3"
        title="配送至"
        @cancel="hidePopup"
        @confirm="onConfirm"
        :value="defaultArea"
      />
    </van-popup>

    <EazyNav type="brand"></EazyNav>
    <CopyRight></CopyRight>
  </div>
</template>

<style lang="scss">
@import url("./../../../style/scss/components/dateTimePicker.scss");

#addressPage {
  .van-button {
    border-radius: 50px;
  }
  .van-address-edit__buttons {
    padding: 100px 50px;
  }

  .van-cell:not(:last-child)::after {
    border-bottom: 1px #f6f6f6 solid;
  }

  .van-cell {
    font-size: $fontSize + 1;
    color: #333;
  }
}
</style>

<script>
//  引入接口
import { ADDRESS } from "../../../apis/public.js";
import {
  USER_ADDRESS_ADD,
  USER_ADDRESS_EDIT,
  USER_ADDRESS
} from "../../../apis/user.js";

export default {
  data() {
    return {
      addressDefault: "",
      defaultArea: "",
      popupModel: false,
      // 页面类型
      pageType: null,
      // 地址id，地址编辑用到
      addressId: null,
      // 表单数据
      addressInfo: {
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        isDefault: false
      },
      provinceId: "",
      cityId: "",
      countyId: "",
      // 省市区
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      }
    };
  },

  mounted() {
    // 设置类型
    this.pageType = this.$route.query.pageType;
    // 编辑
    if (this.pageType == "edit") {
      this.addressId = this.$route.query.addressId;
      // 获取当前地址信息
      this.getAddress();
    }
    // 初始化省市区
    this.$getAddressData();
  },

  methods: {
    showPopup() {
      this.popupModel = true;
    },
    hidePopup() {
      this.popupModel = false;
    },
    // 确认
    onConfirm(values) {
      this.popupModel = false;

      // 存储省市区
      this.addressInfo.province = values[0].name;
      this.addressInfo.city = values[1].name;
      this.addressInfo.county = values[2].name;

      // 存储省市区id
      this.provinceId = values[0].code.substring(0, 2);
      this.cityId = values[1].code.substring(0, 4);
      this.countyId = values[2].code.substring(0, 6);

      this.addressDefault =
        this.addressInfo.province +
        "/" +
        this.addressInfo.city +
        "/" +
        this.addressInfo.county;
    },
    // 根据address_id获取当前用户地址信息
    async getAddress() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        address_id: this.addressId,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_ADDRESS(data);
      if (res.hasOwnProperty("response_code")) {
        // store 设置登录状态
        this.$store.commit("changeLoginState", 1);
        localStorage.setItem("loginState", 1);

        this.addressInfo.name = res.response_data[0].consignee;
        this.addressInfo.tel = res.response_data[0].mobile;
        this.addressInfo.addressDetail = res.response_data[0].address;

        this.addressInfo.province = res.response_data[0].province;
        this.addressInfo.city = res.response_data[0].city;
        this.addressInfo.county = res.response_data[0].county;

        this.addressInfo.isDefault =
          res.response_data[0].is_default == 1 ? true : false;

        this.provinceId = res.response_data[0].province_id;
        this.cityId = res.response_data[0].city_id;
        this.countyId = res.response_data[0].county_id;

        this.defaultArea = this.countyId.toString();

        this.addressDefault =
          this.addressInfo.province +
          "/" +
          this.addressInfo.city +
          "/" +
          this.addressInfo.county;
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          localStorage.setItem("loginState", 100);
        }
        this.$toast(res.error_message);
      }
    },
    // 新增添加用户地址
    async addAddress() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        province_id: this.provinceId,
        city_id: this.cityId,
        county_id: this.countyId,
        address: this.addressInfo.addressDetail,
        consignee: this.addressInfo.name,
        mobile: this.addressInfo.tel,
        is_default: this.addressInfo.isDefault ? 1 : 0,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_ADDRESS_ADD(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("地址保存成功~");
        // this.$router.push({ name: "set" });
        // this.$router.push({ name: "addresslist" });
        this.$router.go(-1);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 修改当前地址
    async editAddress() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        address_id: this.addressId,
        province_id: this.provinceId,
        city_id: this.cityId,
        county_id: this.countyId,
        address: this.addressInfo.addressDetail,
        consignee: this.addressInfo.name,
        mobile: this.addressInfo.tel,
        is_default: this.addressInfo.isDefault ? 1 : 0,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await USER_ADDRESS_EDIT(data);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("地址修改成功~");

        this.$router.go(-1);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 保存
    saveAddress() {
      var address =
        this.addressInfo.province +
        this.addressInfo.city +
        this.addressInfo.county;
      if (this.addressInfo.name.trim().length > 20) {
        this.$toast("收货人长度不能大于20个字符~");
        return;
      }
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (!regPhone.test(this.addressInfo.tel)) {
        this.$toast("请输入正确格式的手机号码~");
        return;
      }
      if (this.addressInfo.addressDetail.trim().length > 200) {
        this.$toast("详细地址长度不能大于200个字符~");
        return;
      }
      if (address == "") {
        this.$toast("请设置省市区~");
        return;
      }

      if (this.pageType == "add") {
        // 地址新增
        this.addAddress();
      } else {
        // 地址编辑
        this.editAddress();
      }
    }
  }
};
</script>

