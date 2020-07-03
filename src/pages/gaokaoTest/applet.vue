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
      }
    }

  }
</script>

<style src="@/style/scss/pages/gaokaoTest/applet.scss" lang="scss" scoped>

</style>
