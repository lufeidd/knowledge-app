<template>
  <div id="gaokaoTestIndex">
    <header>

    </header>
    <footer>
      <div class="btn-box" @click="toDemystify"></div>
      <p>累计已有41323568人参与</p>
    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      toDemystify() {
        console.log('click');
      }
    }
  }
</script>

<style src="@/style/scss/pages/gaokaoTest/index.scss" lang="scss" scoped>

</style>
