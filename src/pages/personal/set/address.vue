<template>
  <div id="addressPage">
    <van-address-edit
      show-set-default
      :address-info="addressInfo"
      :area-list="areaList"
      :validator="validator"
      @save="saveAddress"
      @change-area="changeAction"
      ref="address"
    />
    <EazyNav type="brand"></EazyNav>
    
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
    $(".van-cell__title")
      .eq(0)
      .html("收货人");
    $(".van-cell__title")
      .eq(1)
      .html("手机号码");
    $(".van-cell__title")
      .eq(2)
      .html("所在地区");
    $(".van-cell__title")
      .eq(3)
      .html("详细地址");
    $(".van-cell__title")
      .eq(4)
      .html("设置默认地址");

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
    validator(key, value) {
      // console.log("validator", key, value);
      switch (key) {
        case "name":
          if (value.trim().length > 20) {
            return "收货人长度不能大于20个字符~";
          }
          break;
        case "tel":
          var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
          if (!regPhone.test(value)) {
            return "请输入正确格式的手机号码~";
          }
          break;
        case "areaCode":
          var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
          if (value.trim().length > 200) {
            return "详细地址长度不能大于200个字符~";
          }
          break;
      }
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
        // console.log(res, res.response_data[0]);

        // console.log(res.response_data[0], this.addressInfo);
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
        // this.$router.push({ name: "set" });
        // this.$router.push({ name: "addresslist" });
        this.$router.go(-1);
      } else {
        this.$toast(res.error_message);
      }
    },
    // 保存
    saveAddress(content) {
      this.$set(this.addressInfo, "name", content.name);
      this.$set(this.addressInfo, "tel", content.tel);
      this.$set(this.addressInfo, "province", content.province);
      this.$set(this.addressInfo, "city", content.city);
      this.$set(this.addressInfo, "county", content.county);
      this.$set(this.addressInfo, "addressDetail", content.addressDetail);
      this.$set(this.addressInfo, "isDefault", content.isDefault);

      if (this.pageType == "add") {
        // 地址新增
        this.addAddress();
      } else {
        // 地址编辑
        this.editAddress();
      }
    },
    // 切换
    changeAction(values) {
      var province = values[0].code;
      var city = values[1].code;
      var county = values[2].code;
      // 存储省市区id
      this.provinceId = province.substring(0, 2);
      this.cityId = city.substring(0, 4);
      this.countyId = county.substring(0, 6);

      console.log(456, values, this.provinceId, this.cityId, this.countyId);
    }
  }
};
</script>

