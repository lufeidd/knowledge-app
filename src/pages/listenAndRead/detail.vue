<template>
  <div id="listenAndReadDetail">
    <van-list
      v-model="albumLoading"
      :finished="albumFinished"
      finished-text="没有更多了"
      @load="albumLoad"
      v-if="true"
    >
      <div class="huoba-album-list huoba-album-list-two">
        <div class="huoba-album-item" v-for="item in albumList" :key="item.goods_id">
          <div class="huoba-album-item-pic-box">
            <img :src="item.pic" class="huoba-album-item-pic">
            <div class="icon-one-box">
              <svg class="icon icon-one" aria-hidden="true">
                <use xlink:href="#icon-sound-line"/>
              </svg>
            </div>
            <div class="img-one-box" v-if="item.is_top==1">
            </div>
            <span class="text-one" v-if="item.is_payed==1">已购</span>
          </div>
          <div class="huoba-album-item-content">
            <div class="huoba-album-item-des" v-text="item.title"></div>
            <div class="huoba-album-item-total end" v-if="item.show_str.status==1">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-albumgoods-line"/>
              </svg>
              <span class="total-text">共{{item.show_str.content}}集</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click="handleAlbum(item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-album-item-total end" v-if="item.show_str.status==2">
              <span class="total-text">播放至{{item.show_str.content}}集</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click="handleAlbum(item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-album-item-total not-end" v-if="item.show_str.status==3">
              <span class="total-text">更新至{{item.show_str.content}}集</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click="handleAlbum(item)">
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
      v-if="false"
    >
      <div class="huoba-ebook-list huoba-ebook-list-two">
        <div class="huoba-ebook-item" v-for="item in ebookList" :key="item.goods_id">
          <div class="huoba-ebook-item-pic-box">
            <img :src="item.pic" class="huoba-ebook-item-pic">
            <div class="img-one-box" v-if="item.is_top==1">
            </div>
            <span class="text-one" v-if="item.is_payed==1">已购</span>
          </div>
          <div class="huoba-ebook-item-content">
            <div class="huoba-ebook-item-des" v-text="item.title"></div>
            <div class="huoba-ebook-item-author"><span class="name" v-text="item.author"></span>著</div>
            <div class="huoba-ebook-item-total end" v-if="item.show_str.status==1">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenzhang"/>
              </svg>
              <span class="total-text">共{{item.show_str.content}}章</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click="handleEbook(item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-ebook-item-total end" v-if="item.show_str.status==2">
              <span class="total-text">已读{{item.show_str.content}}</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click="handleEbook(item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-ebook-item-total not-end" v-if="item.show_str.status==3">
              <span class="total-text">更新至{{item.show_str.content}}章</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click="handleEbook(item)">
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
      <!--<div class="pop-one-item">-->
        <!--<svg class="icon" aria-hidden="true">-->
          <!--<use xlink:href="#icon-fenxiang" />-->
        <!--</svg>-->
        <!--<span class="pop-one-item-text">分享</span>-->
      <!--</div>-->
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
  import {ListenAndRead_LIST} from '@/apis/listenAndRead.js';
  export default {
    data() {
      return {
        albumList: [],
        albumCount: '',
        albumPage: '1',
        ebookList: [],
        ebookCount: '',
        ebookPage: '1',
        albumLoading: false,
        albumFinished: false,
        ebookLoading: false,
        ebookFinished: false,
        pop_one_show: false,
        pop_two_show: false,
      }
    },
    methods: {
      async getAlbumList() {
        let data = {
          version: '1.1',
          type: '9',
          page: this.albumPage,
          page_size: '10'
        };
        let res = await ListenAndRead_LIST(data);
        if (res.hasOwnProperty('response_code')) {
          this.albumCount = res.response_data.total_count;

          setTimeout(() => {
            var list = res.response_data.list;
            for (let i = 0; i < list.length; i++) {
              this.albumList.push(list[i]);
            }
            // 加载状态结束
            this.albumLoading = false;
            this.albumPage++;
            // 数据全部加载完成
            if (this.albumPage > res.response_data.total_page) {
              this.albumFinished = true;
            }
          }, 500);

        } else {
          this.$toast(res.error_message);
        }
      },
      async getEbookList() {
        let data = {
          version: '1.1',
          type: '4',
          page: this.ebookPage,
          page_size: '10'
        };
        let res = await ListenAndRead_LIST(data);
        if (res.hasOwnProperty('response_code')) {
          this.ebookCount = res.response_data.total_count;

          setTimeout(() => {
            var list = res.response_data.list;
            for (let i = 0; i < list.length; i++) {
              this.ebookList.push(list[i]);
            }
            // 加载状态结束
            this.ebookLoading = false;
            this.ebookPage++;
            // 数据全部加载完成
            if (this.ebookPage > res.response_data.total_page) {
              this.ebookFinished = true;
            }
          }, 500);

        } else {
          this.$toast(res.error_message);
        }
      },
      albumLoad() {
        this.getAlbumList();
      },
      ebookLoad() {
        this.getEbookList();
      },
      handleAlbum() {
        this.pop_one_show = true;
      },
      handleEbook() {
        this.pop_one_show = true;
      }
    },
    mounted() {

    }
  }
</script>

<style src="@/style/scss/pages/listenAndRead/detail.scss" lang="scss" scoped>

</style>
