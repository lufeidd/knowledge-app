<!--废弃-->
<template>
  <div id="applet">
    <div class="save" @click="save"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      save() {
        console.log('save');
        // 保存小程序二维码
        if (!window.plus) {
          return;
        } else {
          window.plus.gallery.save('./../../assets/gaokaoTest/code.png', function () {
            window.plus.nativeUI.alert("保存成功");
          }, function () {
            window.plus.nativeUI.alert("保存失败");
          });
        }

      }
    }

  }
</script>

<style src="@/style/scss/pages/gaokaoTest/applet.scss" lang="scss" scoped>

</style>
