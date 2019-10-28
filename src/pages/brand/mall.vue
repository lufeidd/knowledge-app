<link rel="stylesheet" href="../../../../bookuu3.0/application/bkwd/styles/bnmp/wap/css/20191111/myClan/myClan.css">
<template>
  <div id="mallPage" v-if="module_list != null">
    <!--
    module_temp_id
    1   幻灯广告
    7	  横向滑屏
    9   一排四个，共两排
    70  固定四个板块
    10	一行两个带选项卡-纸质图书
    11  电子书一列
    110 电子书一列三排
    40	横向商品列表-音频
    60	横向滑屏-视频
    50	商品列表-横向-专辑
    -->
    <div v-for="(item,index) in module_list" :key="index">
      <!-- 顶部幻灯 -->
      <div class="popular" v-if="item.module_temp_id == 1">
        <div class="showContent">
          <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(litem,lindex) in item.contents.list" :key="lindex">
              <div class="slide" @click="linktoDetail(litem.contents.link_params)">
                <div class="ratiobox">
                  <div class="bookImg" :style="{'background-image': 'url('+litem.contents.pic+')'}"></div>
                  <!-- <div class="bookImg" v-lazy:background-image="litem.contents.pic"></div> -->
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </div>
      <!-- 横向滑屏 -->
      <!-- <div class="popular" v-if="item.module_temp_id == 7">
        <div class="text">
          <span class="verticleLine"></span>
          <span class="lh">{{item.module_name}}</span>
        </div>
        <div class="showContent">
          <swiper class="swiperTags" :options="swiperOption_column" ref="mySwiper">
            <swiper-slide v-for="(litem,lindex) in item.contents.list" :key="lindex">
              <div class="slide" @click="linktoDetail(litem.contents.link_params)">
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
                </div>
                <div class="content">
                  <p class="title" v-if="litem.contents.title">{{litem.contents.title}}</p>
                  <p class="message" v-if="litem.contents.sub_title">{{litem.contents.sub_title}}</p>
                  <p class="money" v-if="litem.contents.price">¥ {{litem.contents.price}}</p>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>-->
      <!-- 文字标签按钮 -->
      <div class="tag_button" v-if="item.module_temp_id == 9 && item.contents.list.length >3">
        <div class="row" v-for="(litem,lindex) in item.contents.list" :key="lindex">
          <span
            class="button"
            @click="linktoDetail(litem.contents.link_params)"
          >{{litem.contents.name}}</span>
        </div>
      </div>
      <!-- 固定四个标签 -->
      <div class="fourth_tag" v-if="item.module_temp_id == 70">
        <div class="materialTitle">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh">{{item.module_name}}</span>
          </div>
        </div>
        <div class="container">
          <div class="row" v-for="(litem,lindex) in item.contents.list" :key="lindex">
            <div class="content" @click="goodsDetail(litem)">
              <div class="ratiobox">
                <div class="bookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
              </div>
              <div class="right">
                <p class="title">{{litem.contents.title}}</p>
                <p class="price">¥ {{litem.contents.price}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 图书 -->
      <div class="book_moudel" v-if="item.module_temp_id == 10">
        <div class="materialTitle" @click="linktoDetail(item.module_more)">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_name}}</span>
          </div>
          <span class="all" v-if="item.is_more">
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div style="margin-top:5px;">
          <van-tabs
            animated
            color="#666"
            title-active-color="#333"
            @click="tabChange"
            v-model="activekey"
          >
            <van-tab title="推荐">
              <div class="materialObject">
                <div class="goods">
                  <div class="row" v-for="(items,indexs) in bookData" :key="indexs">
                    <div class="goodsInfo" @click="goodsDetail(items)">
                      <div class="ratiobox">
                        <div class="bookImg" v-lazy:background-image="items.contents.pics[0]"></div>
                      </div>
                      <p class="name">{{items.contents.title}}</p>
                      <!-- <p class="message">色法</p> -->
                      <div class="bottom">
                        <p class="money">¥{{items.contents.price}}</p>
                        <span class="buy">立即抢购</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </van-tab>
            <van-tab
              :title="litem.cat_name"
              v-for="(litem,lindex) in item.contents.catlist"
              :key="lindex"
            >
              <div class="materialObject">
                <div class="goods">
                  <div class="row" v-for="(item1,index1) in booktagData" :key="index1">
                    <div class="goodsInfo" @click="tabGoodsDetail(item1)">
                      <div class="ratiobox">
                        <div class="bookImg" v-lazy:background-image="item1.pic[0]"></div>
                      </div>
                      <p class="name">{{item1.title}}</p>
                      <!-- <p class="message">色法</p> -->
                      <div class="bottom">
                        <p class="money">¥{{item1.price}}</p>
                        <span class="buy">立即抢购</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
      <!-- 专辑 -->
      <div class="ablum_moudle" v-if="item.module_temp_id == 50">
        <div class="materialTitle" @click="linktoDetail(item.module_more)">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span class="all" v-if="item.is_more">
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div>
          <div
            class="content"
            v-for="(litem,lindex) in item.contents.list"
            :key="lindex"
            @click="goodsDetail(litem)"
          >
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
            </div>
            <div class="right">
              <div class="text">{{litem.contents.title}}</div>
              <div class="pinpai">{{litem.contents.sub_title}}</div>
              <div class="nice">
                <span>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-album-line" />
                    </svg>
                    <span>共{{litem.contents.item_count}}集</span>
                  </span>
                </span>
                <span class="price">￥{{litem.contents.price}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 电子书 -->
      <div class="ablum_moudle ebook" v-if="item.module_temp_id == 11">
        <div class="materialTitle" @click="linktoDetail(item.module_more)">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span class="all" v-if="item.is_more">
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div>
          <div
            class="content"
            v-for="(litem,lindex) in item.contents.list"
            :key="lindex"
            @click="goodsDetail(litem)"
          >
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
            </div>
            <div class="right">
              <div class="text">{{litem.contents.title}}</div>
              <div class="subTitle">{{litem.contents.sub_title}}</div>
              <div class="nice">
                <span>
                  <span class="time">
                    <span>{{litem.contents.book_author}}</span>
                  </span>
                </span>
                <span class="price" v-if="litem.contents.price">￥{{litem.contents.price}}</span>
                <span class="price" v-else>免费</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 电子书一列三排 -->
      <div class="ablum_moudle ebook" v-if="item.module_temp_id == 110">
        <div class="materialTitle" @click="linktoDetail(item.module_more)">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span class="all" v-if="item.is_more">
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div>
          <van-row gutter="20" type="flex" class="ebooklist">
            <van-col span="8" v-for="(litem,lindex) in item.contents.list" :key="lindex">
              <div class="ratioebox" @click="goodsDetail(litem)">
                <div class="ebookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
              </div>
              <div class="title">{{ litem.contents.title }}</div>
              <div class="schedule">{{ litem.contents.book_author }}</div>
            </van-col>
          </van-row>
        </div>
      </div>
      <!-- 视频 -->
      <div class="video_moudle" v-if="item.module_temp_id == 60">
        <div class="materialTitle" @click="linktoDetail(item.module_more)">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_name}}</span>
          </div>
          <span class="all" v-if="item.is_more">
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div class="showContent" style="margin-top:20px;">
          <swiper class="swiperTags" :options="swiperOption_video" ref="mySwiper">
            <swiper-slide v-for="(litem,lindex) in item.contents.list" :key="lindex">
              <div class="slide" @click="linktoDetail(litem.contents.link_params)">
                <div class="ratiobox">
                  <div class="bookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
                </div>
                <p class="text">{{litem.contents.title}}</p>
                <span class="vedio_icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-video-play" />
                  </svg>
                </span>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <!-- 音频 -->
      <div class="ablum_moudle audio" v-if="item.module_temp_id == 40">
        <div class="materialTitle" @click="linktoDetail(item.module_more)">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span class="all" v-if="item.is_more">
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div>
          <div
            class="content"
            v-for="(litem,lindex) in item.contents.list"
            :key="lindex"
            @click="goodsDetail(litem)"
          >
            <div class="ratiobox_audio">
              <div class="bookImg" v-lazy:background-image="litem.contents.pics[0]"></div>
            </div>
            <div class="right">
              <div class="text">{{litem.contents.title}}</div>
              <!-- <div class="pinpai">dfdffdf</div> -->
              <div class="nice">
                <span>
                  <span class="time">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-time-line" />
                    </svg>
                    <span>{{litem.contents.duration}}</span>
                  </span>
                </span>
                <span class="price">￥{{litem.contents.price}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="position:relative;height:90px;">
      <CopyRight></CopyRight>
    </div>
    <!-- <easyNav :navData="navData"></easyNav> -->
    <EazyNav type="mall"></EazyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/brand/mall.scss" lang="scss"></style>

<script>
import qs from "Qs";
// import easyNav from "../../components/easyNav";
import {
  BRAND_PAGE_MALL_INDEX,
  BRAND_SEARCH_GOODS_GETS
} from "../../apis/brand.js";
import { WX_SHARE } from "../../apis/public.js";
export default {
  // components: {
  //   easyNav
  // },
  data() {
    return {
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: true,
      //   searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "mall",
      //   supplier_id: null
      // },
      swiperOption: {
        loop: true,
        autoplay: {
          disableOnInteraction: false, //手动滑动之后不打断播放
          delay: 2000
        },
        pagination: {
          el: ".swiper-pagination"
        }
      },
      swiperOption_video: {
        slidesPerView: 1.4
      },
      swiperOption_column: {
        slidesPerView: 1.3
      },
      supplier_id: null,
      title: null,
      module_list: [],
      page_title: "",
      activekey: 0,
      bookData: [],
      booktagData: [],
      catlist: [],
      tagids: null
    };
  },
  mounted() {
    this.title = this.$route.query.title ? this.$route.query.title : "";
    this.supplier_id = this.$route.query.supplier_id;
    // this.navData.supplier_id = this.supplier_id;
    // title
    this.getData();
    // document.title = "商城-" + this.title;
  },
  // 进入当前页面
  beforeRouteEnter(to, from, next) {
    // console.log(to, from ,next);

    // 外链进入
    // if(from.name != null) {
    // }
    next();
  },
  methods: {
    async getData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        supplier_id: this.supplier_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_PAGE_MALL_INDEX(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        this.page_title = res.response_data.page_title;
        document.title = this.page_title;
        for (let i = 0; i < res.response_data.module_list.length; i++) {}

        this.module_list = res.response_data.module_list;

        for (let j = 0; j < this.module_list.length; j++) {
          if (this.module_list[j].module_temp_id == 9) {
            // console.log(7777,this.module_list[j].contents.list.length)

            if (
              4 < this.module_list[j].contents.list.length &&
              this.module_list[j].contents.list.length < 8
            ) {
              this.module_list[j].contents.list = this.module_list[
                j
              ].contents.list.slice(0, 4);
            }
            // console.log(666,this.module_list[j].contents.list);
            if (this.module_list[j].contents.list.length >= 8) {
              this.module_list[j].contents.list = this.module_list[
                j
              ].contents.list.slice(0, 8);
            }
            // console.log(this.module_list[j].contents.list)
          }
          if (this.module_list[j].module_temp_id == 10) {
            this.bookData = this.module_list[j].contents.list;
            this.catlist = this.module_list[j].contents.catlist;
          }
          if (this.module_list[j].module_temp_id == 70) {
            this.module_list[j].contents.list = this.module_list[
              j
            ].contents.list.slice(0, 4);
          }
        }

        // 获取页面分享信息
        // if(this.isWxLogin) this.wxShareData();
        var _pageName = "mall/index";
        var _params = JSON.stringify({
          brand_id: this.$route.query.brand_id,
          supplier_id: this.$route.query.supplier_id
        });
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);
      } else {
        this.$toast(res.error_message);
      }
    },
    linktoDetail(link) {
      // console.log(1111,link);return
      var data = this.$translate(JSON.parse(link));
      if (data.name == "") return;
      data.query.type = "mall";
      data.query.title = this.title;
      this.$router.push(data);
    },
    goodsDetail(item) {
      // console.log(item);return
      // 音频/视频
      if (item.contents.goods_type == 1 || item.contents.goods_type == 2) {
        this.$router.push({
          name: "albumdetail",
          query: {
            goods_id: item.contents.goods_id,
            pid: null
          }
        });
      }
      // 文章
      if (item.contents.goods_type == 6) {
        this.$router.push({
          name: "article",
          query: {
            goods_id: item.contents.goods_id,
            pid: null
          }
        });
      }
      //专辑
      if (item.contents.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: {
            goods_id: item.contents.goods_id,
            pid: null
          }
        });
      }
      // 实物商品
      if (item.contents.goods_type == 3) {
        this.$router.push({
          name: "detail",
          query: {
            goods_id: item.contents.goods_id,
            pid: null
          }
        });
      }
      //电子书
      if (item.contents.goods_type == 4) {
        this.$router.push({
          name: "ebookdetail",
          query: {
            goods_id: item.contents.goods_id
          }
        });
      }
    },
    tabGoodsDetail(item) {
      // console.log(item);return
      // 音频/视频
      if (item.goods_type == 1 || item.goods_type == 2) {
        this.$router.push({
          name: "albumdetail",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 文章
      if (item.goods_type == 6) {
        this.$router.push({
          name: "article",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      //专辑
      if (item.goods_type == 9) {
        this.$router.push({
          name: "album",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      // 实物商品
      if (item.goods_type == 3) {
        this.$router.push({
          name: "detail",
          query: {
            goods_id: item.goods_id,
            pid: null
          }
        });
      }
      //电子书
      if (item.goods_type == 4) {
        this.$router.push({
          name: "ebookdetail",
          query: {
            goods_id: item.goods_id
          }
        });
      }
    },
    tabChange(index) {
      // console.log(index);
      if (index > 0) {
        this.tagids = this.catlist[index - 1].cat_id;
        this.getTagData();
      }
    },
    async getTagData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        supplier_id: this.supplier_id,
        cids: this.tagids,
        page: 1,
        page_size: 6,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await BRAND_SEARCH_GOODS_GETS(data);

      if (res.hasOwnProperty("response_code")) {
        // console.log(res, this.tagids);
        this.booktagData = res.response_data.result;
      } else {
        this.$toast(res.error_message);
      }
    }
    // 获取页面分享信息
    // async wxShareData() {
    //   var tStamp = this.$getTimeStamp();
    //   var data = {
    //     page_name: "mall/index",
    //     params: JSON.stringify({
    //       brand_id: this.$route.query.brand_id,
    //       supplier_id: this.$route.query.supplier_id
    //     }),
    //     version: "1.0",
    //     timestamp: tStamp,
    //   };
    //   data.sign = this.$getSign(data);
    //   let res = await WX_SHARE(data);
    //   if (res.hasOwnProperty("response_code")) {
    //     // console.log(res.response_data)
    //     document.title = res.response_data.share_info.title;
    //     // 微信分享
    //     this.$getWxData(
    //       res.response_data.share_info.title,
    //       res.response_data.share_info.desc,
    //       res.response_data.share_info.pic,
    //       res.response_data.share_info.url
    //     );
    //   } else {
    //     this.$toast(res.error_message);
    //   }
    // }
  }
};
</script>
