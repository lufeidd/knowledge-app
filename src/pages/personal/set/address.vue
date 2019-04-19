<template>
  <div id="addressPage">
    <van-address-edit
      show-set-default
      :address-info="addressInfo"
      :area-list="areaList"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<style src="@/style/scss/pages/personal/set/address.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      addressInfo: {
        name: "曾",
        tel: "15266666666"
      },
      areaList: {
        province_list: {
          110000: "北京市",
          120000: "天津市"
        },
        city_list: {
          110100: "北京市",
          110200: "县",
          120100: "天津市",
          120200: "县"
        },
        county_list: {
          110101: "东城区",
          110102: "西城区",
          110105: "朝阳区",
          110106: "丰台区",
          120101: "和平区",
          120102: "河东区",
          120103: "河西区",
          120104: "南开区",
          120105: "河北区"
          // ....
        }
      }
    };
  },

  mounted() {
    $(".van-cell__title").eq(0).html("收货人");
    $(".van-cell__title").eq(1).html("手机号码");
    $(".van-cell__title").eq(2).html("所在地区");
    $(".van-cell__title").eq(3).html("详细地址");
    $(".van-cell__title").eq(4).html("设置默认地址");
  },

  methods: {
    onSave() {
      this.$toast("save");
      //   this.$ref.setAddressDetail('88888888')
    },
    onDelete() {
      this.$toast("delete");
    }
  }
};
</script>

