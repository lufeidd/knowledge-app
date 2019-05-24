<template>
  <div id="app">
    <!-- 页面缓存, $route.meta.keepAlive默认false -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<style>
/* @import url("./style/font"); */
</style>


<script>
import axios from "axios";
export default {
  name: "App",
  mounted() {
  }
};
</script>
