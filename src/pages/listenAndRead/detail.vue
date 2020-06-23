<template>
  <div id="listenAndReadDetail">
    <van-list
      v-model="albumLoading"
      :finished="albumFinished"
      finished-text="没有更多了"
      @load="albumLoad"
      v-if="albumShow"
    >
      <div class="huoba-album-list huoba-album-list-two">
        <div class="huoba-album-item" v-for="item in albumList" :key="item.goods_id"  @touchstart="touchStart('album', item)" @touchend="touchEnd" @touchmove="touchMove" @click="goToAlbum(item)">
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
              <svg class="icon ellipsis-line" aria-hidden="true" @click.stop="handleClick('album', item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-album-item-total end" v-if="item.show_str.status==2">
              <span class="total-text">播放至{{item.show_str.content}}集</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click.stop="handleClick('album', item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-album-item-total not-end" v-if="item.show_str.status==3">
              <span class="total-text">更新至{{item.show_str.content}}集</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click.stop="handleClick('album', item)">
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
      v-if="ebookShow"
    >
      <div class="huoba-ebook-list huoba-ebook-list-two">
        <div class="huoba-ebook-item" v-for="item in ebookList" :key="item.goods_id"  @touchstart="touchStart('ebook', item)" @touchend="touchEnd" @touchmove="touchMove" @click="goToPlay(4, item)">
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
              <svg class="icon ellipsis-line" aria-hidden="true" @click.stop="handleClick('ebook', item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-ebook-item-total end" v-if="item.show_str.status==2">
              <span class="total-text">已读{{item.show_str.content}}%</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click.stop="handleClick('ebook', item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
            <div class="huoba-ebook-item-total not-end" v-if="item.show_str.status==3">
              <span class="total-text">更新至{{item.show_str.content}}章</span>
              <svg class="icon ellipsis-line" aria-hidden="true" @click.stop="handleClick('ebook', item)">
                <use xlink:href="#icon-ellipsis-line"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <!--弹出层-->
    <!--弹出层-->
    <van-popup v-model="pop_one_show" position="bottom" class="huoba-popup-one">
      <div class="pop-one-item" v-if="isTop" @click="cancelTop">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-quxiaozhiding"/>
        </svg>
        <span class="pop-one-item-text">取消置顶</span>
      </div>
      <div class="pop-one-item" v-if="!isTop" @click="toTop">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zhiding"/>
        </svg>
        <span class="pop-one-item-text">置顶</span>
      </div>
      <div class="pop-one-item" @click="checkDetail">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakan"/>
        </svg>
        <span class="pop-one-item-text" v-if="touchType=='album'">查看专辑详情</span>
        <span class="pop-one-item-text" v-if="touchType=='ebook'">查看电子书详情</span>
      </div>
      <!--<div class="pop-one-item">-->
      <!--<svg class="icon" aria-hidden="true">-->
      <!--<use xlink:href="#icon-fenxiang"/>-->
      <!--</svg>-->
      <!--<span class="pop-one-item-text">分享</span>-->
      <!--</div>-->
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yichu"/>
        </svg>
        <span class="pop-one-item-text" @click="cancelCollect">移出收藏</span>
      </div>
    </van-popup>
    <van-popup v-model="pop_two_show" position="center" class="huoba-popup-two">
      <h3 class="pop-two-text-one">置顶失败！</h3>
      <div class="pop-two-text-two" v-if="touchType=='album'">您最多可置顶3张专辑</div>
      <div class="pop-two-text-two" v-if="touchType=='ebook'">您最多可置顶3本电子书</div>
      <div class="pop-two-text-three" @click="pop_two_show=false">我知道了</div>
    </van-popup>
  </div>
</template>

<script>
  import {ListenAndRead_LIST,ListenAndRead_TOPADD,ListenAndRead_TOPCANCEL} from '@/apis/listenAndRead.js';
  import {COLLECT_CANCEL} from '@/apis/listenAndRead.js';
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
        albumShow: false,
        ebookShow: false,
        loop: null,
        detailType: '',  // 专辑/电子书
        isTop: false,  //  标记touch的是否为置顶
        isMove: false, //  用户是否为滑动
        touchType: '',   //  标记touch是专辑还是电子书
        touchGoodsId: ''  // 标记touch的goods_id
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
          document.title = '专辑（' + this.albumCount + '）';

          setTimeout(() => {
            var list = res.response_data.list;
            for (let i = 0; i < list.length; i++) {
              this.albumList.push(list[i]);
            }
            // 加载状态结束
            this.albumLoading = false;
            this.albumPage++;
            // 数据全部加载完成
            console.log('albumpage',this.albumCount);
            console.log(res.response_data.total_count);
            if (this.albumCount == res.response_data.total_count) {
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
          document.title = '电子书（' + this.ebookCount + '）';

          setTimeout(() => {
            var list = res.response_data.list;
            for (let i = 0; i < list.length; i++) {
              this.ebookList.push(list[i]);
            }
            // 加载状态结束
            this.ebookLoading = false;
            this.ebookPage++;
            // 数据全部加载完成
            if (this.ebookCount == res.response_data.total_count) {
              this.ebookFinished = true;
            }
          }, 500);

        } else {
          this.$toast(res.error_message);
        }
      },
      async toTop() { // 置顶
        let data = {
          version: '1.0',
          goods_id: this.touchGoodsId
        };
        let res = await ListenAndRead_TOPADD(data);
        if (res.hasOwnProperty('response_code')) {
          this.$toast('置顶成功');
          window.location.reload();
        } else {
          this.pop_two_show = true;
        }
        this.pop_one_show = false;
      },
      async cancelTop() { // 取消置顶
        let data = {
          version: '1.0',
          goods_id: this.touchGoodsId
        };
        let res = await ListenAndRead_TOPCANCEL(data);
        if (res.hasOwnProperty('response_code')) {
          this.$toast('取消置顶成功');
          window.location.reload();
        } else {
          this.$toast(res.error_message);
        }
        this.pop_one_show = false;
      },
      async cancelCollect() { // 取消收藏
        let data = {
          version: '1.0',
          goods_id: this.touchGoodsId
        };
        let res = await COLLECT_CANCEL(data);
        if (res.hasOwnProperty('response_code')) {
          this.$toast('取消收藏成功');
          window.location.reload();
        } else {
          this.$toast(res.error_message);
        }
        this.pop_one_show = false;
      },
      albumLoad() {
        this.getAlbumList();
      },
      ebookLoad() {
        this.getEbookList();
      },
      handleClick(type, item) {
        if(type == 'album') {
          this.touchType = 'album';
        } else if (type == 'ebook') {
          this.touchType = 'ebook';
        }
        if (item.is_top == 1) {
          this.isTop = true;
        } else {
          this.isTop = false;
        }
        this.touchGoodsId = item.goods_id;
        this.pop_one_show = true;
      },
      touchStart(type, item) {
        clearInterval(this.loop);
        this.loop = setTimeout(function () {
          if (!this.isMove) {
            // 长按后需要触发的事件
            if(type == 'album') {
              this.touchType = 'album';
            } else if (type == 'ebook') {
              this.touchType = 'ebook';
            }
            if (item.is_top == 1) {
              this.isTop = true;
            } else {
              this.isTop = false;
            }
            this.touchGoodsId = item.goods_id;
            this.pop_one_show = true;
          }
        }.bind(this), 1000);
      },
      touchEnd() {
        this.isMove = false;
        clearInterval(this.loop);
      },
      touchMove() {
        this.isMove = true;
      },
      goToPlay(type, item) {
        if (item.show_str.status == 2) { // 用户播放过
          if (item.show_str.extra_info.type == 1) {  // 音频
            console.log('音频');
            this.$router.push({name: 'player',query: {pid: item.goods_id, goods_id: item.show_str.extra_info.id, goods_no: item.show_str.extra_info.sort}});
          } else if (item.show_str.extra_info.type == 2) { // 视频
            console.log('视频');
            this.$router.push({name: 'albumdetail',query: {pid: item.goods_id,goods_id: item.show_str.extra_info.id, goods_no: item.show_str.extra_info.sort}});

          }  else if (item.show_str.extra_info.type == 4) { // 电子书
            console.log('电子书');
            this.$router.push({name: 'ebookreader',query: {goods_id: item.goods_id, chapter_id: item.show_str.extra_info.id, currenChapterTitle: item.show_str.extra_info.sort}});
          }
        } else {  // 用户未播放过
          if (type == 9) {  // 专辑
            console.log('专辑');
            this.$router.push({name: 'album',query: {goods_id: item.goods_id}});
          } else if (type == 4) { // 电子书
            console.log('电子书');
            this.$router.push({name: 'ebookdetail', query: {goods_id: item.goods_id}});
          }

        }

      },
      goToAlbum(item) {
        this.$router.push({name: 'album',query: {goods_id: item.goods_id}});
      },
      checkDetail() { // 查看电子书/专辑详情
        if (this.touchType == 'album') {
          this.$router.push({name: 'album', query: {goods_id: this.touchGoodsId}});
        } else if (this.touchType == 'ebook') {
          this.$router.push({name: 'ebookdetail', query: {goods_id: this.touchGoodsId}});
        }
      }
    },
    mounted() {
      this.detailType = this.$route.query.detailType;
      if (this.detailType == 'album') {
        this.albumShow = true;
      } else if (this.detailType == 'ebook') {
        this.ebookShow = true;
      }
    }
  }
</script>

<style src="@/style/scss/pages/listenAndRead/detail.scss" lang="scss" scoped>

</style>
