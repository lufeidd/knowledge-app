<template>
  <div id="personalPage">
    <div>{{ msg }}</div>

    <svg class="icon myIconStyle" aria-hidden="true">
      <use xlink:href="#icon-personalAccount"></use>
    </svg>
  </div>
</template>

<style>
.myIconStyle {
    width: 40px;
    height: 40px;
}
</style>


<script>
export default {
  components: {},
  data() {
    return {
      msg: "888"
    };
  },
  created() {},
  methods: {}
};
</script>

