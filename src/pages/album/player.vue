<template>
  <div id="playerPage">
    <!-- 音频 -->
    <music :musicData="musicData"></music>
    <!-- 音频列表 -->
    <!-- <audioList :audioListData="audioListData"></audioList> -->
  </div>
</template>

<script>
import music from "./../../components/music";
import audioList from "./list";
export default {
  components: {
    music,
    audioList
  },
  data() {
    return {
      audioListData: {
        issue: {
          pic:
            "https://media2.v.bookuu.com/activity/08/53/20190418085322949.jpg@!q75",
          text:
            "宝宝巴士在线讲故事 宝宝巴士在线讲故事宝宝巴士在线讲故事宝宝巴士在线讲故事宝宝巴士在线讲故事"
        },
        albums: [
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          },
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          },
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          }
        ]
      },
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

