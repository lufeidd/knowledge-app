<template>
  <ul class="audioListBox">
    <li>
      <div class="ratioBox">
        <div class="box">
          <img :src="audioListData.issue.pic">
        </div>
      </div>
      <div class="issue">{{ audioListData.issue.text }}</div>
    </li>
    <li
      v-for="(item, key) in audioListData.albums"
      :key="key"
      :class="{ active: activeIndex == key }"
      @click="onPlay(key)"
    >
      <div class="img">
        <img src="./../../assets/audio.svg" width="22" height="22" alt v-if="activeIndex == key">
        <svg class="icon" aria-hidden="true" v-else>
          <use xlink:href="#icon-videoPause-line"></use>
        </svg>
      </div>

      <div class="info">
        <div class="album">{{ item.album }}</div>
        <div class="program">
          <span class="duration">时长{{ item.duration }}</span>
          <span>已播{{ item.percent }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style lang="scss">
.audioListBox {
  @include position(absolute, "tl", 44px, 0, 100%, null, null);
  @include textOverflow;
  bottom: 0;
  overflow-y: scroll;
  & li {
    @include textOverflow;
    @include displayFlex(flex, flex-start, center);
    padding: 10px;
    border-bottom: 1px #eee solid;
    position: relative;

    & .ratioBox {
      width: 65px;
      padding-bottom: 65px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    & .issue {
      @include font("PingFangBold", $fontSize + 2, #333);
      @include textOverflow;
      margin-left: 10px;
    }

    & .img {
      & .icon {
        width: 22px;
        height: 22px;
        color: #e3e3e3;
      }
    }

    & .info {
      @include textOverflow;
      width: 100%;
      padding-left: 8px;
      box-sizing: border-box;

      & .album {
        @include textOverflow;
        @include font(null, $fontSize + 1, #666);
      }

      & .program {
        @include textOverflow;
        font-size: $fontSize - 1;
        color: #999;

        & .duration {
          margin-right: 10px;
        }
      }

      & .list {
        @include textOverflow;
      }
    }
  }
  & li.active {
    & .info {
      & .album {
        @include font(null, $fontSize + 1, $redDark);
      }

      & .program {
        color: #333;
      }
    }
  }
}
</style>

<script>
export default {
  name: "music",
  props: ["audioListData"],
  data() {
    return {
      activeIndex: 1
    };
  },
  mounted() {},
  methods: {
    onPlay(key) {
      console.log(key);
      this.activeIndex = key;
    }
  }
};
</script>

