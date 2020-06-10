<template>
  <div id="listenAndReadIndex">
    <header class="index-header">
      <div class="icon-box">
        <router-link :to="{name: 'cart'}">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gouwuche"/>
          </svg>
          <span class="cart" v-if="navData.goods_nums" v-text="navData.goods_nums"></span>
        </router-link>
      </div>
      <div class="icon-box">
        <router-link :to="{name: 'orderlist'}">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingdan"/>
          </svg>
        </router-link>
      </div>
      <div class="icon-box">
        <router-link :to="{name: 'history'}">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zuji"/>
          </svg>
        </router-link>
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
            <div class="huoba-album-item" v-if="item.goods_type==9" @click="recommendDetail(item)">
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
            <div class="huoba-ebook-item" v-if="item.goods_type==4" @click="recommendDetail(item)">
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
          <button class="huoba-btn huoba-btn-one" @click="goToPlay(item.type, item)" v-if="item.type == 9">继续播放</button>
          <button class="huoba-btn huoba-btn-one" @click="goToPlay(item.type, item)" v-else>继续阅读</button>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div v-if="albumFirst">
      <!--专辑列表一-->
      <div class="album-list-box" v-if="albumShow">
        <h3 class="list-title">专辑<span class="count" v-text="albumCount"></span></h3>
        <div class="huoba-album-list huoba-album-list-one">
          <div class="huoba-album-item" v-for="item in albumList" :key="item.goods_id">
            <div class="huoba-album-item-pic-box" @touchstart="touchStart('album', item)" @touchend="touchEnd" @click="goToPlay(9, item)">
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
        <div class="button-box" v-if="albumCount>6"  @click="goToDetail('album')">
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
            <div class="huoba-ebook-item-pic-box" @touchstart="touchStart('ebook', item)" @touchend="touchEnd" @click="goToPlay(4, item)">
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
              <span class="total-text">已读{{item.show_str.content}}%</span>
            </div>
            <div class="huoba-ebook-item-total not-end" v-if="item.show_str.status==3">
              <span class="total-text">更新至{{item.show_str.content}}章</span>
            </div>
          </div>
        </div>
        <div class="button-box" v-if="ebookCount>6"  @click="goToDetail('ebook')">
          <button class="huoba-btn huoba-btn-five">
            全部电子书
            <svg class="icon next-line" aria-hidden="true">
              <use xlink:href="#icon-next-line"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
    <div v-if="ebookFirst">
      <!--电子书列表一-->
      <div class="ebook-list-box" v-if="ebookShow">
        <h3 class="list-title">电子书<span class="count" v-text="ebookCount"></span></h3>
        <div class="huoba-ebook-list huoba-ebook-list-one">
          <div class="huoba-ebook-item" v-for="item in ebookList" :key="item.goods_id">
            <div class="huoba-ebook-item-pic-box" @touchstart="touchStart('ebook', item)" @touchend="touchEnd" @click="goToPlay(4, item)">
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
              <span class="total-text">已读{{item.show_str.content}}%</span>
            </div>
            <div class="huoba-ebook-item-total not-end" v-if="item.show_str.status==3">
              <span class="total-text">更新至{{item.show_str.content}}章</span>
            </div>
          </div>
        </div>
        <div class="button-box" v-if="ebookCount>6"  @click="goToDetail('ebook')">
          <button class="huoba-btn huoba-btn-five">
            全部电子书
            <svg class="icon next-line" aria-hidden="true">
              <use xlink:href="#icon-next-line"/>
            </svg>
          </button>
        </div>
      </div>
      <!--专辑列表一-->
      <div class="album-list-box" v-if="albumShow">
        <h3 class="list-title">专辑<span class="count" v-text="albumCount"></span></h3>
        <div class="huoba-album-list huoba-album-list-one">
          <div class="huoba-album-item" v-for="item in albumList" :key="item.goods_id">
            <div class="huoba-album-item-pic-box" @touchstart="touchStart('album', item)" @touchend="touchEnd" @click="goToPlay(9, item)">
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
        <div class="button-box" v-if="albumCount>6"  @click="goToDetail('album')">
          <button class="huoba-btn huoba-btn-five">
            全部专辑
            <svg class="icon next-line" aria-hidden="true">
              <use xlink:href="#icon-next-line"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

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
    <!-- 快速导航 -->
    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<script>
  import {ListenAndRead_INFO, ListenAndRead_RECOMMEND, ListenAndRead_LIST,ListenAndRead_TOPADD,ListenAndRead_TOPCANCEL} from '@/apis/listenAndRead.js';
  import {COLLECT_CANCEL} from '@/apis/listenAndRead.js';
  import { CART_INFO } from '@/apis/shopping';

  export default {
    data() {
      return {
        albumShow: false,
        ebookShow: false,
        pop_one_show: false,
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
        albumFirst: false,
        ebookFirst: false,
        lookingUrl: '',  // 随便看看跳转url
        loop: null,
        recommendLoading: false,
        recommendFinished: false,
        recommendPage: 1,
        isTop: false,  //  标记touch的是否为置顶
        touchType: '',   //  标记touch是专辑还是电子书
        touchGoodsId: '',  // 标记touch的goods_id
        navData: {}
      }
    },
    methods: {
      // 获取购物车信息
      async cartData() {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          version: "1.1"
        };
        data.sign = this.$getSign(data);
        let res = await CART_INFO(data);

        if (res.hasOwnProperty("response_code")) {
          this.navData.goods_nums = res.response_data.kind_num;
        } else {
          this.$toast(res.error_message);
        }
      },
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
            let _this = this;
            this.getAlbumList().then(function () {
              _this.getEbookList().then(function () {
                if (_this.albumList.length != 0) {
                  _this.albumShow = true;
                }
                if (_this.ebookList.length != 0) {
                  _this.ebookShow = true;
                }

                if (_this.albumList.length == 0 && _this.ebookList.length == 0) {
                  _this.noInterest = true; // 无感兴趣内容
                }

                if (_this.noInterest) {
                  _this.recommendShow = true; // 登录无感兴趣内容显示热门推荐
                  console.log(33, _this.recommendShow);
                }
              });
            });

          } else {
            this.recommendShow = true;  // 未登录显示热门推荐
          }
          this.swipeList = res.response_data.recently_view; // 获取轮播图列表（最近访问的专辑和电子书）
          this.albumFirst = res.response_data.sort == 'album' ? true : false; //  电子书和专辑顺序
          this.ebookFirst = res.response_data.sort == 'ebook' ? true : false; //  电子书和专辑顺序
          console.log(this.albumFirst);
        } else {
          this.$toast(res.error_message);
        }
      },
      async getRecommendList() {
        let data = {
          version: '1.1',
          page: this.recommendPage,
          page_size: '10'
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
          //  大于6需选取前6条
          this.albumList = res.response_data.list.slice(0,6);  // 获取专辑列表
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
          this.ebookList = res.response_data.list.slice(0,6);  // 获取电子书列表
          this.ebookCount = res.response_data.total_count;
          console.log('dianzishu', this.ebookList);
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
      goToLogin() {
        this.$router.push({name: 'login'});
      },
      goToDetail(type) {  //  跳转到详情页
        if (type == 'album') {
          this.$router.push({name: 'listenAndReadDetail', query: {detailType:'album'}});
        } else if (type == 'ebook') {
          this.$router.push({name: 'listenAndReadDetail', query: {detailType:'ebook'}});
        }
      },
      looking() {
        window.location.href = this.lookingUrl;
      },
      touchStart(type, item) {
        clearInterval(this.loop);
        this.loop = setTimeout(function () {
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
        }.bind(this), 1000);
      },
      touchEnd() {
        clearInterval(this.loop);
      },
      recommendLoad() {
        this.getRecommendList();
      },
      goToPlay(type, item) {
        if (item.show_str.status == 2) { // 用户播放过
          if (item.show_str.extra_info.type == 1) {  // 音频
            console.log('音频');
            this.$router.push({name: 'player',query: {pid: item.goods_id, goods_id: item.show_str.extra_info.id, goods_no: item.show_str.extra_info.sort}});
          } else if (item.show_str.extra_info.type == 2) { // 视频
            console.log('视频');
            this.$router.push({name: 'albumdetail',query: {goods_id: item.show_str.extra_info.id}});
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
      checkDetail() { // 查看 电子书/专辑 详情
        if (this.touchType == 'album') {
          this.$router.push({name: 'album', query: {goods_id: this.touchGoodsId}});
        } else if (this.touchType == 'ebook') {
          this.$router.push({name: 'ebookdetail', query: {goods_id: this.touchGoodsId}});
        }
      },
      recommendDetail(item) { // 查看推荐 电子书/专辑 详情
        if (item.goods_type==9) { // 专辑
          this.$router.push({name: 'album', query: {goods_id: item.goods_id}});
        } else if (item.goods_type==4) {  // 电子书
          this.$router.push({name: 'ebookdetail', query: {goods_id: item.goods_id}});
        }
      }
    },
    mounted() {
      this.cartData();
      this.getInfo();
    }
  }
</script>

<style src="@/style/scss/pages/listenAndRead/index.scss" lang="scss" scoped>

</style>
