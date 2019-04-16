<template>
  <div id="collectPage">
    <div v-for="item in listData">
      <van-swipe-cell :right-width="65" :left-width="0" :on-close="onClose">
        <router-link to="/" class="listBox">
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.imgSrc">
                <div class="tip">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-sound-line"></use>
                  </svg>
                  {{ item.focus }}
                </div>
              </div>
            </div>
          </div>
          <div class="center">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">{{ item.subTitle }}</div>
            <div class="info">
              <span class="time">{{ item.time }}更新</span>
            </div>
          </div>
          <div class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line"></use>
            </svg>
          </div>
        </router-link>
        <span slot="right">
          <div>取消收藏</div>
        </span>
      </van-swipe-cell>
    </div>
  </div>
</template>

<style src="@/style/scss/pages/personal/collect.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      listData: [
        {
          title: "少儿英语在线听故事二十",
          subTitle: "观看温柔的声音陪伴宝宝入睡",
          time: "2019.2.17",
          focus: "32.7w",
          imgSrc:
            "https://media2.v.bookuu.com/activity/10/14/20190415101409783.gif"
        },
        {
          title: "浙江出版传媒",
          subTitle: "观看温柔的声音陪伴宝宝入睡",
          time: "2019.2.17",
          focus: "32.7w",
          imgSrc:
            "https://bnmppic.bookuu.com/topic/20161108/1478612622195756.jpg"
        },
        {
          title: "浙江出版传媒",
          subTitle: "观看温柔的声音陪伴宝宝入睡",
          time: "2019.2.17",
          focus: "32.7w",
          imgSrc:
            "https://bnmppic.bookuu.com/topic/20161108/1478612622195756.jpg"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    onClose(clickPosition, instance) {
      switch (clickPosition) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          //   this.$dialog
          //     .confirm({
          //       message: "确定删除吗？"
          //     })
          //     .then(() => {
          //       instance.close();
          //     });

          this.$toast("取消收藏成功");
          instance.close();
      }
    }
  }
};
</script>
