<template>
  <div id="listenAndReadIndex">
    <header class="index-header">
      <div class="icon-box">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gouwuche"/>
        </svg>
        <span class="unread">100</span>
      </div>
      <div class="icon-box">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dingdan"/>
        </svg>
      </div>
      <div class="icon-box">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zuji"/>
        </svg>
      </div>
    </header>
    <section class="reminder" v-show="!isLogin">
      <div class="icon-box">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-weidenglu"/>
        </svg>
      </div>
      <p class="reminder-text">立即登录同步账号信息</p>
      <button class="huoba-btn huoba-btn-one" @click="goToLogin">登录</button>
    </section>
    <section class="reminder" v-show="noInterest">
      <div class="icon-box">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-wuneirong"/>
        </svg>
      </div>
      <p class="reminder-text">还没有感兴趣的内容</p>
      <button class="huoba-btn huoba-btn-one" @click="looking">随便看看</button>
    </section>
    <van-list
      v-model="recommendLoading"
      :finished="recommendFinished"
      finished-text="没有更多了"
      @load="recommendLoad"
      v-if="recommendShow"
    >
      <div class="recommend-box">
        <h3 class="recomment-text">热门推荐</h3>
        <div class="huoba-album-list-two huoba-ebook-list-two">
          <div v-for="item in recommendList" :key="item.goods_id">
            <div class="huoba-album-item" v-if="item.goods_type==9">
              <div class="huoba-album-item-pic-box">
                <img :src="item.pic" class="huoba-album-item-pic">
                <div class="icon-one-box">
                  <svg class="icon icon-one" aria-hidden="true">
                    <use xlink:href="#icon-sound-line"/>
                  </svg>
                </div>
              </div>
              <div class="huoba-album-item-content">
                <div class="huoba-album-item-des" v-text="item.title"></div>
                <div class="huoba-album-item-total end">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-albumgoods-line"/>
                  </svg>
                  <span class="total-text">共{{item.item_count}}集</span>
                  <!--<svg class="icon ellipsis-line" aria-hidden="true">-->
                  <!--<use xlink:href="#icon-ellipsis-line"/>-->
                  <!--</svg>-->
                </div>
              </div>
            </div>
            <div class="huoba-ebook-item" v-if="item.goods_type==4">
              <div class="huoba-ebook-item-pic-box">
                <img :src="item.pic" class="huoba-ebook-item-pic">
              </div>
              <div class="huoba-ebook-item-content">
                <div class="huoba-ebook-item-des" v-text="item.title"></div>
                <div class="huoba-ebook-item-author"><span class="name">张东健</span>著</div>
                <div class="huoba-ebook-item-total end">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-wenzhang"/>
                  </svg>
                  <span class="total-text">共{{item.item_count}}章</span>
                  <!--<svg class="icon ellipsis-line" aria-hidden="true">-->
                  <!--<use xlink:href="#icon-ellipsis-line"/>-->
                  <!--</svg>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <!--轮播图-->
    <van-swipe class="huoba-swipe-one" :autoplay="6000" indicator-color="#F05654" v-if="swipeList.length">
      <van-swipe-item v-for="item in swipeList" :key="item.goods_id">
        <img v-lazy="item.pic" class="swipe-one-pic">
        <div class="swipe-one-des" v-text="item.title"></div>
        <div class="swipe-one-button-box">
          <button class="huoba-btn huoba-btn-one">继续播放</button>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div v-if="albumFirst">
      <!--专辑列表一-->
      <div class="album-list-box" v-if="albumShow">
        <h3 class="list-title">专辑<span class="count" v-text="albumCount"></span></h3>
        <div class="huoba-album-list huoba-album-list-one">
          <div class="huoba-album-item" v-for="item in albumList" :key="item.goods_id">
            <div class="huoba-album-item-pic-box" @touchstart="touchStart(item)" @touchend="touchEnd">
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
            <div class="huoba-album-item-des" v-text="item.title"></div>
            <div class="huoba-album-item-total end" v-if="item.show_str.status==1">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-albumgoods-line"/>
              </svg>
              <span class="total-text">共{{item.show_str.content}}集</span>
            </div>
            <div class="huoba-album-item-total end" v-if="item.show_str.status==2">
              <span class="total-text">播放至{{item.show_str.content}}集</span>
            </div>
            <div class="huoba-album-item-total not-end" v-if="item.show_str.status==3">
              <span class="total-text">更新至{{item.show_str.content}}集</span>
            </div>
          </div>
        </div>
        <div class="button-box" v-if="albumCount>6">
          <button class="huoba-btn huoba-btn-five">
            全部专辑
            <svg class="icon next-line" aria-hidden="true">
              <use xlink:href="#icon-next-line"/>
            </svg>
          </button>
        </div>
      </div>
      <!--电子书列表一-->
      <div class="ebook-list-box" v-if="ebookShow">
        <h3 class="list-title">电子书<span class="count" v-text="ebookCount"></span></h3>
        <div class="huoba-ebook-list huoba-ebook-list-one">
          <div class="huoba-ebook-item" v-for="item in ebookList" :key="item.goods_id">
            <div class="huoba-ebook-item-pic-box">
              <img :src="item.pic" class="huoba-ebook-item-pic">
              <div class="img-one-box" v-if="item.is_top==1">
              </div>
              <span class="text-one" v-if="item.is_payed==1">已购</span>
            </div>
            <div class="huoba-ebook-item-des" v-text="item.title"></div>
            <div class="huoba-ebook-item-total end" v-if="item.show_str.status==1">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenzhang"/>
              </svg>
              <span class="total-text">共{{item.show_str.content}}章</span>
            </div>
            <div class="huoba-ebook-item-total end" v-if="item.show_str.status==2">
              <span class="total-text">已读{{item.show_str.content}}</span>
            </div>
            <div class="huoba-ebook-item-total not-end" v-if="item.show_str.status==3">>
              <span class="total-text">更新至{{item.show_str.content}}章</span>
            </div>
          </div>
        </div>
        <div class="button-box" v-if="ebookCount>6">
          <button class="huoba-btn huoba-btn-five">
            全部电子书
            <svg class="icon next-line" aria-hidden="true">
              <use xlink:href="#icon-next-line"/>
            </svg>
          </button>
        </div>
      </div>

    </div>

    <!--弹出层-->
    <van-popup v-model="pop_one_show" position="bottom" class="huoba-popup-one">
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-quxiaozhiding"/>
        </svg>
        <span class="pop-one-item-text">取消置顶</span>
      </div>
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chakan"/>
        </svg>
        <span class="pop-one-item-text">查看电子书详情</span>
      </div>
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fenxiang"/>
        </svg>
        <span class="pop-one-item-text">分享</span>
      </div>
      <div class="pop-one-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yichu"/>
        </svg>
        <span class="pop-one-item-text">移出收藏</span>
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
  import {ListenAndRead_INFO, ListenAndRead_RECOMMEND, ListenAndRead_LIST} from '@/apis/listenAndRead.js';

  export default {
    data() {
      return {
        albumShow: false,
        ebookShow: false,
        pop_one_show: true,
        pop_two_show: false,
        recommendShow: false,
        noInterest: false,
        isLogin: '1',
        swipeList: [],
        recommendList: [],
        albumList: [],
        albumCount: '',
        ebookList: [],
        ebookCount: '',
        albumFirst: true,
        lookingUrl: '',  // 随便看看跳转url
        loop: null,
        recommendLoading: false,
        recommendFinished: false,
        recommendPage: 1
      }
    },
    methods: {
      async getInfo() {
        let data = {
          version: '1.1'
        };
        let res = await ListenAndRead_INFO(data);
        console.log(res);
        if (res.hasOwnProperty('response_code')) {
          this.isLogin = res.response_data.is_login; // 获取登录状态 1已登录 0未登录
          this.lookingUrl = res.response_data.url_info.url;
          if (this.isLogin == 1) {
            // let _this = this;
            // this.getAlbumList().then(function () {
            //   _this.getEbookList().then(function () {
            //     if (_this.albumList.length != 0) {
            //       _this.albumShow = true;
            //     }
            //     if (_this.ebookList.length != 0) {
            //       _this.ebookList = true;
            //     }
            //
            //     if (_this.albumList.length == 0 && _this.ebookList.length == 0) {
            //       _this.noInterest = true; // 无感兴趣内容
            //     }
            //   });
            // });
            this.getAlbumList();
            this.getEbookList();
            if (this.albumList.length != 0) {
              this.albumShow = true;
            }
            if (this.ebookList.length != 0) {
              this.ebookList = true;
            }

            if (this.albumList.length == 0 && this.ebookList.length == 0) {
              this.noInterest = true; // 无感兴趣内容
            }

          }
          if (this.noInterest || this.isLogin == '0') {
            this.recommendShow = true; // 登录无感兴趣内容或未登录显示热门推荐
            console.log(33, this.recommendShow);
          }
          this.swipeList = res.response_data.recently_view; // 获取轮播图列表（最近访问的专辑和电子书）
          this.albumFirst = res.response_data.sort == 'album' ? true : false; //  电子书和专辑顺序  // 需思考一下合理方案
          console.log(this.albumFirst);
        } else {
          this.$toast(res.error_message);
        }
      },
      async getRecommendList() {
        let data = {
          version: '1.1',
          page: this.recommendPage,
          page_size: '2'
        };
        let res = await ListenAndRead_RECOMMEND(data);
        if (res.hasOwnProperty('response_code')) {
          // this.recommendList = res.response_data.list;  // 获取推荐列表
          // console.log('tuijian', this.recommendList);

          setTimeout(() => {
            var list = res.response_data.list;
            for (let i = 0; i < list.length; i++) {
              this.recommendList.push(list[i]);
            }
            // 加载状态结束
            this.recommendLoading = false;
            this.recommendPage++;
            // 数据全部加载完成
            if (this.recommendPage > res.response_data.total_page) {
              this.recommendFinished = true;
            }
          }, 500);
          console.log('tuijian', this.recommendList);


        } else {
          this.recommendFinished = true;
          // this.$toast(res.error_message);
        }
      },
      async getAlbumList() {
        let data = {
          version: '1.1',
          type: '9',
          page: '1',
          page_size: '6'
        };
        let res = await ListenAndRead_LIST(data);
        if (res.hasOwnProperty('response_code')) {
          //  大于6需选取前6条 暂未处理
          this.albumList = res.response_data.list;  // 获取专辑列表
          this.albumCount = res.response_data.total_count;
          console.log('zhuanji', this.albumList);
        } else {
          this.$toast(res.error_message);
        }
      },
      async getEbookList() {
        let data = {
          version: '1.1',
          type: '4',
          page: '1',
          page_size: '6'
        };
        let res = await ListenAndRead_LIST(data);
        if (res.hasOwnProperty('response_code')) {
          this.ebookList = res.response_data.list;  // 获取电子书列表
          this.ebookCount = res.response_data.total_count;
          console.log('dianzishu', this.ebookList);
        } else {
          this.$toast(res.error_message);
        }
      },
      goToLogin() {
        this.$router.push({name: 'login'});
      },
      looking() {
        window.location.href = this.lookingUrl;
      },
      touchStart() {
        clearInterval(this.loop);
        this.loop = setTimeout(function () {
          // 长按后需要出发的事件
          console.log('长按1s');
          this.pop_one_show = true;
        }.bind(this), 1000);
      },
      touchEnd() {
        clearInterval(this.loop);
      },
      recommendLoad() {
        this.getRecommendList();
      }
    },
    mounted() {
      this.getInfo();
      // this.getRecommendList();
    }
  }
</script>

<style src="@/style/scss/pages/listenAndRead/index.scss" lang="scss" scoped>

</style>
