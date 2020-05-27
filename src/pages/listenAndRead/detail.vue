<template>
  <div id="listenAndReadDetail">
    <van-list
      v-model="albumLoading"
      :finished="albumFinished"
      finished-text="没有更多了"
      @load="albumLoad"
      v-show="true"
    >
      <div class="huoba-album-list huoba-album-list-two">
        <div class="huoba-album-item">
          <div class="huoba-album-item-pic-box">
            <img src="http://file.mhuoba.com/picture/album/20190703/14/20190703141357973.png"
                 class="huoba-album-item-pic">
            <div class="icon-one-box">
              <svg class="icon icon-one" aria-hidden="true">
                <use xlink:href="#icon-sound-line"/>
              </svg>
            </div>
            <div class="img-one-box">
            </div>
            <span class="text-one">已购</span>
          </div>
          <div class="huoba-album-item-content">
            <div class="huoba-album-item-des">给孩子好的教育给孩子好的教育给孩子好的教育</div>
            <div class="huoba-album-item-total end">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-albumgoods-line"/>
              </svg>
              <span class="total-text">共1200集</span>
              <svg class="icon ellipsis-line" aria-hidden="true">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="huoba-album-item">
          <div class="huoba-album-item-pic-box">
            <img src="http://file.mhuoba.com/picture/album/20190703/14/20190703141357973.png"
                 class="huoba-album-item-pic">
            <div class="icon-one-box">
              <svg class="icon icon-one" aria-hidden="true">
                <use xlink:href="#icon-sound-line"/>
              </svg>
            </div>
            <div class="img-one-box">
            </div>
          </div>
          <div class="huoba-album-item-content">
            <div class="huoba-album-item-des">给孩子好的教育给孩子好的教育给孩子好的教育</div>
            <div class="huoba-album-item-total not-end">
              <svg class="icon" aria-hidden="true" v-show="false">
                <use xlink:href="#icon-albumgoods-line"/>
              </svg>
              <span class="total-text">更新至100集</span>
              <svg class="icon ellipsis-line" aria-hidden="true">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <van-list
      v-model="ebookLoading"
      :finished="ebookFinished"
      finished-text="没有更多了"
      @load="ebookLoad"
      v-show="false"
    >
      <div class="huoba-ebook-list huoba-ebook-list-two">
        <div class="huoba-ebook-item">
          <div class="huoba-ebook-item-pic-box">
            <img src="http://file.mhuoba.com/picture/ebook/20190703/14/20190703141357973.png"
                 class="huoba-ebook-item-pic">
            <div class="img-one-box">
            </div>
            <span class="text-one">已购</span>
          </div>
          <div class="huoba-ebook-item-content">
            <div class="huoba-ebook-item-des">给孩子好的教育给孩子好的教育给孩子好的教育</div>
            <div class="huoba-ebook-item-author"><span class="name">张东健</span>著</div>
            <div class="huoba-ebook-item-total end">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenzhang"/>
              </svg>
              <span class="total-text">共100章</span>
              <svg class="icon ellipsis-line" aria-hidden="true">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="huoba-ebook-item">
          <div class="huoba-ebook-item-pic-box">
            <img src="http://file.mhuoba.com/picture/ebook/20190703/14/20190703141357973.png"
                 class="huoba-ebook-item-pic">
            <div class="img-one-box">
            </div>
            <span class="text-one">已购</span>
          </div>
          <div class="huoba-ebook-item-content">
            <div class="huoba-ebook-item-des">给孩子好的教育给孩子好的教育给孩子好的教育</div>
            <div class="huoba-ebook-item-author"><span class="name">张东健</span>著</div>
            <div class="huoba-ebook-item-total not-end">
              <svg class="icon" aria-hidden="true" v-show="false">
                <use xlink:href="#icon-wenzhang"/>
              </svg>
              <span class="total-text">更新至100章</span>
              <svg class="icon ellipsis-line" aria-hidden="true">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <!--弹出层-->
    <van-popup v-model="pop_one_show" position="bottom" class="huoba-popup-one">
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-quxiaozhiding" />
        </svg>
        <span class="pop-one-item-text">取消置顶</span>
      </div>
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakan" />
        </svg>
        <span class="pop-one-item-text">查看电子书详情</span>
      </div>
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fenxiang" />
        </svg>
        <span class="pop-one-item-text">分享</span>
      </div>
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yichu" />
        </svg>
        <span class="pop-one-item-text">移出收藏</span>
      </div>
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shanchu2" />
        </svg>
        <span class="pop-one-item-text">清除缓存文件 23.3M</span>
      </div>
    </van-popup>
    <van-popup v-model="pop_two_show" position="center" class="huoba-popup-two">
      <h3 class="pop-two-text-one">置顶失败！</h3>
      <div class="pop-two-text-two">您最多可置顶3本电子书</div>
      <div class="pop-two-text-three">我知道了</div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        albumLoading: false,
        albumFinished: true,
        ebookLoading: false,
        ebookFinished: true,
        pop_one_show: true,
        pop_two_show: false,
      }
    },
    methods: {
      albumLoad() {

      },
      ebookLoad() {

      }
    }
  }
</script>

<style src="@/style/scss/pages/listenAndRead/detail.scss" lang="scss" scoped>

</style>
