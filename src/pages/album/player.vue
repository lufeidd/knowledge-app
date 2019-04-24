<template>
  <div id="playerPage">
    <!-- 音频 -->
    <music :musicData="musicData"></music>
  </div>
</template>

<style lang="scss">
#playerPage {
   background-color: $white;  
   height: 100%;
 } 
</style>


<script>
import music from "./../../components/music";
export default {
  components: {
    music
  },
  data() {
    return {
      musicData: {
        type: "play",
        id: "myAudio",
        src: "",
        // 分：秒格式
        duration: "00:00",
        currentTime: "00:00"
      }
    };
  },
  mounted() {
    this.musicData.src = require("./../../assets/music.mp3");
  },
  methods: {}
};
</script>

