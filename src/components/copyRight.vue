<template>
  <div id="copyRight">
      <div class="ratiobox">
        <div class="bookImg" v-lazy:background-image="require('../assets/copyright_logo.png')"></div>
      </div>
    <span class="text" style="white-space:nowrap;">火把知识提供技术支持 wap.mhuoba.com</span>
  </div>
</template>

<style lang="scss">
  #copyRight{
    position: relative;
    width: 100%;
    max-width: 640px;
    padding: 0 15px;
    line-height: 60px;
    text-align: center;
    color:$cl9;
    box-sizing: border-box;
    width: 100%;
    font-size:$fontSize -1;
    @include displayFlex(flex,center,center);
    white-space: nowrap;
    .ratiobox {
      width: 16px;
      height: 16px;
      background-color: $cl9;
      border-radius: 50%;
      padding: 2px;
      box-sizing: border-box;
      margin-right: 5px;
      .bookImg {
        display: block;
        @include ratioBox (98%, 100%, null, contain, $cl9, null);
        border-radius: 50%;
      }
    }
  }
</style>
