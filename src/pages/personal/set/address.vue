<template>
  <div id="addressPage">
    <van-address-edit
      show-set-default
      :address-info="addressInfo"
      :area-list="areaList"
      @save="saveAddress"
      @change-area="changeAction"
    />
  </div>
</template>

<style lang="scss">
@import url("./../../../style/scss/components/dateTimePicker.scss");
@import url("./../../../style/scss/components/button.scss");

#addressPage {
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
    this.getAddressData();
  },

  methods: {
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
      } else {
        if (res.hasOwnProperty("error_code") && res.error_code == 100) {
          // store 设置登录状态
          this.$store.commit("changeLoginState", 100);
          
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
        this.$router.push({ name: "addresslist" });
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

      console.log(456, this.cityId, this.countyId);

      if (res.hasOwnProperty("response_code")) {
        this.$toast("地址修改成功~");
        // this.$router.push({ name: "set" });
        this.$router.push({ name: "addresslist" });
      } else {
        this.$toast(res.error_message);
      }
    },
    // 获取省市区数据
    async getAddressData() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ADDRESS(data);
      if (res.hasOwnProperty("response_code")) {
        var pstr = new Array();
        var cstr = new Array();
        var ctstr = new Array();

        if (res.response_data) {
          for (let i = 0; i < res.response_data.length; i++) {
            // console.log('省：', res.response_data[i]);
            pstr +=
              '"' +
              res.response_data[i].id +
              "0000" +
              '"' +
              ":" +
              '"' +
              res.response_data[i].name +
              '"' +
              ",";

            // console.log('省str：', pstr)

            // 市
            if (res.response_data[i].city) {
              for (let j = 0; j < res.response_data[i].city.length; j++) {
                // console.log("市：", res.response_data[i].city[j]);
                cstr +=
                  '"' +
                  res.response_data[i].city[j].id +
                  "00" +
                  '"' +
                  ":" +
                  '"' +
                  res.response_data[i].city[j].name +
                  '"' +
                  ",";

                // console.log('市str：', cstr)

                // 区
                if (res.response_data[i].city[j].county) {
                  for (
                    let k = 0;
                    k < res.response_data[i].city[j].county.length;
                    k++
                  ) {
                    // console.log("区：", res.response_data[i].city[j].county[k]);
                    ctstr +=
                      '"' +
                      res.response_data[i].city[j].county[k].id +
                      '"' +
                      ":" +
                      '"' +
                      res.response_data[i].city[j].county[k].name +
                      '"' +
                      ",";
                  }
                  // console.log('区str：', ctstr)
                }
              }
            }
          }

          // 省
          this.areaList.province_list = this.stringToJson(pstr);
          // 市
          this.areaList.city_list = this.stringToJson(cstr);
          // 区
          this.areaList.county_list = this.stringToJson(ctstr);
        }
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
    // 字符串转换成json格式
    stringToJson(str) {
      var arr1 = new Array();
      var arr2 = new Array();
      var __json = new Array();

      arr1 = str.split(",");
      arr2 = "{" + arr1 + "}";
      __json = eval("(" + arr2 + ")");

      // console.log('__json:', __json);
      return __json;
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
      // console.log(values, this.provinceId, this.cityId, this.countyId);
    }
  }
};
</script>

