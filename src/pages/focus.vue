<template>
  <div id="focusPage">
    <div class="msgBox">已有23家自媒体更新了内容</div>

    <template v-for="item in listData">
      <van-swipe-cell :right-width="65" :left-width="0" :on-close="onClose">
        <div class="listBox">
          <div class="left">
            <div class="ratioBox">
              <div class="box">
                <img :src="item.imgSrc">
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">{{ item.title }}</div>
            <div class="subTitle">已被{{ item.subTitle }}人关注</div>
            <div class="new">
              <span class="text">更新</span>
              <span class="count">{{ item.count }}</span>
            </div>
          </div>
        </div>
        <span slot="right">
          <div>取消关注</div>
        </span>
      </van-swipe-cell>
    </template>
  </div>
</template>
  </div>
</template>

<style src="@/style/scss/pages/focus.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      listData: [
        {
          title: "浙江出版传媒",
          subTitle: "15万",
          count: "+34",
          imgSrc:
            "https://media2.v.bookuu.com/activity/10/14/20190415101409783.gif"
        },
        {
          title: "浙江出版传媒",
          subTitle: "15万",
          count: "+34",
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

        this.$toast('取消关注成功');
        instance.close();
      }
    }
  }
};
</script>
