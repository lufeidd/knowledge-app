<template>
  <div id="customPage" v-if="module_list != null">
    <!--
    module_type
    11  轮播广告
    12	图文广告
    13  图文导航
    14  搜索栏
    15	文章展示
    16  音频展示
    17  视频展示
    18	专辑展示
    19	图书展示
    20	电子书展示
    21  图书推荐
    22  滑动图片组
    -->
    <div v-for="(item,index) in module_list" :key="index">
      <!-- 轮播图 -->
      <div
        class="popular"
        v-if="item.module_type == 11 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'+'padding:15px;'"
      >
        <div class="materialTitle" v-if="item.is_show_title == 1">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div class="showContent">
          <swiper class="swiperTags" :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="(litem,lindex) in item.content.list" :key="lindex">
              <div class="slide" @click="linktoDetail(litem.url,item.supplier_id)">
                <div class="ratiobox">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':'43.75%','background-size':'cover'}"
                  ></div>
                </div>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
      </div>
      <!-- 图文广告 -->
      <div
        class="photoadvertising"
        v-if="item.module_type == 12 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div
          class="materialTitle"
          style="padding-left:15px;padding-right:15px;"
          v-if="item.is_show_title == 1"
        >
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div class="content">
          <div
            v-if="item.temp_id == 101 || item.temp_id == 102 || item.temp_id == 111 || item.temp_id == 112 || item.temp_id == 113"
          >
            <van-row>
              <van-col
                span="24"
                v-if="item.temp_id == 101"
                v-for="(litem,lindex) in item.content.list"
                :key="lindex"
              >
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':(item.content.list[0].height/item.content.list[0].width)*100+'%','background-size':'cover'}"
                  ></div>
                </div>
              </van-col>
              <van-col
                span="12"
                v-if="item.temp_id == 102"
                v-for="(litem,lindex) in item.content.list"
                :key="lindex"
              >
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':(item.content.list[0].height/item.content.list[0].width)*100+'%','background-size':'cover'}"
                  ></div>
                </div>
              </van-col>
              <van-col
                span="8"
                v-if="item.temp_id == 111"
                v-for="(litem,lindex) in item.content.list"
                :key="lindex"
              >
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':(item.content.list[0].height/item.content.list[0].width)*100+'%','background-size':'cover'}"
                  ></div>
                </div>
              </van-col>
              <van-col
                span="6"
                v-if="item.temp_id == 112"
                v-for="(litem,lindex) in item.content.list"
                :key="lindex"
              >
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':(item.content.list[0].height/item.content.list[0].width)*100+'%','background-size':'cover'}"
                  ></div>
                </div>
              </van-col>
              <van-col
                span="24"
                style="padding:7px 15px;"
                v-if="item.temp_id == 113"
                v-for="(litem,lindex) in item.content.list"
                :key="lindex"
              >
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':(item.content.list[0].height/item.content.list[0].width)*100+'%','border-radius':'3px','background-size':'cover'}"
                  ></div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div v-if="item.temp_id == 114 || item.temp_id == 115" style="padding:0 15px;">
            <van-row gutter="15">
              <van-col
                class="Separate"
                style="margin-bottom:10px;"
                span="12"
                v-if="item.temp_id == 114"
                v-for="(litem,lindex) in item.content.list"
                :key="lindex"
              >
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':(item.content.list[0].height/item.content.list[0].width)*100+'%','border-radius':'3px','background-size':'cover'}"
                  ></div>
                </div>
              </van-col>
              <van-col
                class="Separate2"
                style="margin-bottom:10px;"
                span="8"
                v-if="item.temp_id == 115"
                v-for="(litem,lindex) in item.content.list"
                :key="lindex"
              >
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':(item.content.list[0].height/item.content.list[0].width)*100+'%','border-radius':'3px','background-size':'cover'}"
                  ></div>
                </div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
      <!-- 图文导航 -->
      <div
        class="bookNav"
        v-if="item.module_type == 13 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div class="materialTitle" v-if="item.is_show_title == 1">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div class="navImg">
          <!-- 一个 -->
          <div
            style="width:100%;margin-top:10px;text-align:center;"
            v-for="(litem,lindex) in item.content.list"
            :key="lindex"
            @click="linktoDetail(litem.url,item.supplier_id)"
            v-if="item.content.list.length == 1"
          >
            <img :src="litem.pic" alt width="44px" height="44px" style="border-radius:50%;" />
            <div class="title">{{litem.title}}</div>
          </div>
          <!-- 两个 -->
          <div
            style="width:50%;margin-top:10px;text-align:center;"
            v-for="(litem,lindex) in item.content.list"
            :key="lindex"
            @click="linktoDetail(litem.url,item.supplier_id)"
            v-if="item.content.list.length == 2"
          >
            <img :src="litem.pic" alt width="44px" height="44px" style="border-radius:50%;" />
            <div class="title">{{litem.title}}</div>
          </div>
          <!-- 三个 -->
          <div
            style="width:33.33%;margin-top:10px;text-align:center;"
            v-for="(litem,lindex) in item.content.list"
            :key="lindex"
            @click="linktoDetail(litem.url,item.supplier_id)"
            v-if="item.content.list.length == 3"
          >
            <img :src="litem.pic" alt width="44px" height="44px" style="border-radius:50%;" />
            <div class="title">{{litem.title}}</div>
          </div>
          <!-- 四个 -->
          <div
            style="width:25%;margin-top:10px;text-align:center;"
            v-for="(litem,lindex) in item.content.list"
            :key="lindex"
            @click="linktoDetail(litem.url,item.supplier_id)"
            v-if="item.content.list.length == 4"
          >
            <img :src="litem.pic" alt width="44px" height="44px" style="border-radius:50%;" />
            <div class="title">{{litem.title}}</div>
          </div>
          <!-- 五个 -->
          <div
            style="width:20%;margin-top:10px;text-align:center;"
            v-for="(litem,lindex) in item.content.list"
            :key="lindex"
            @click="linktoDetail(litem.url,item.supplier_id)"
            v-if="item.content.list.length == 5"
          >
            <img :src="litem.pic" alt width="44px" height="44px" style="border-radius:50%;" />
            <div class="title">{{litem.title}}</div>
          </div>
        </div>
      </div>
      <!-- 滑动图片组 -->
      <div
        class="popular"
        v-if="item.module_type == 22 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div class="materialTitle" v-if="item.is_show_title == 1" style="padding-right:15px;">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div class="showContent">
          <swiper class="swiperTags" :options="swiperOption_column" ref="mySwiper">
            <swiper-slide v-for="(litem,lindex) in item.content.list" :key="lindex">
              <div class="slide">
                <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                  <div
                    class="bookImg"
                    :style="{'background-image':'url('+litem.pic+')','padding-bottom':'70.67%','background-size':'cover'}"
                  ></div>
                  <div class="desc" v-if="litem.title">{{litem.title}}</div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <!-- 搜索栏 -->
      <div
        class="searhResult"
        v-if="item.module_type == 14"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div class="materialTitle" v-if="item.is_show_title == 1" style="padding:10px 15px;">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div style="position:relative;padding-top:15px;">
          <svg class="icon searchIcon" aria-hidden="true">
            <use xlink:href="#icon-search-line" />
          </svg>
          <input type="text" @focus="inputText" placeholder="发现你感兴趣的内容......" />
        </div>
      </div>
      <!-- 文章展示 -->
      <div
        class="articleShow"
        v-if="item.module_type == 15 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div class="materialTitle" v-if="item.is_show_title == 1">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div
          class="content"
          v-for="(litem,lindex) in item.content.list"
          :key="lindex"
          @click="linktoDetail(litem.url,item.supplier_id)"
        >
          <div class="ratiobox">
            <div class="bookImg" v-lazy:background-image="litem.pic"></div>
          </div>
          <div class="right">
            <div class="text">{{litem.title}}</div>
          </div>
        </div>
      </div>
      <!-- 专辑 -->
      <div
        class="articleShow ebook ablum_moudle"
        v-if="item.module_type == 18 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div
          class="materialTitle"
          v-if="item.is_show_title == 1"
          @click="linktoDetail(item.more_url,item.supplier_id)"
        >
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
            <van-col span="8" v-for="(litem,lindex) in item.content.list" :key="lindex">
              <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                <div class="ebookImg" v-lazy:background-image="litem.pic"></div>
              </div>
              <div class="title">{{ litem.title }}</div>
              <div class="schedule">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-album-line" />
                </svg>
                <span class="album_num">共{{ litem.item_count }}集</span>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
      <!-- 电子书 -->
      <div
        class="articleShow ebook"
        v-if="item.module_type == 20 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div class="materialTitle" v-if="item.is_show_title == 1">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <!-- 单排 -->
        <div v-if="item.temp_id == 110">
          <div
            class="content"
            v-for="(litem,lindex) in item.content.list"
            :key="lindex"
            @click="linktoDetail(litem.url,item.supplier_id)"
          >
            <div class="ratiobox">
              <div class="bookImg" v-lazy:background-image="litem.pic"></div>
            </div>
            <div class="right">
              <div class="text">{{litem.title}}</div>
              <div class="subTitle">{{litem.sub_title}}</div>
              <div class="nice">
                <div class="author">{{litem.book_author}}</div>
                <span class="price" v-if="litem.price">￥{{litem.price}}</span>
                <span class="price" v-else>免费</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 一排三个 -->
        <div v-if="item.temp_id == 118">
          <van-row gutter="20" type="flex" class="ebooklist">
            <van-col span="8" v-for="(litem,lindex) in item.content.list" :key="lindex">
              <div class="ratioebox" @click="linktoDetail(litem.url,item.supplier_id)">
                <div class="ebookImg" v-lazy:background-image="litem.pic"></div>
              </div>
              <div class="title">{{ litem.title }}</div>
              <div class="schedule">{{ litem.book_author }}</div>
            </van-col>
          </van-row>
        </div>
      </div>
      <!-- 图书展示 -->
      <div
        class="articleShow ebook ablum_moudle"
        v-if="item.module_type == 19 && item.content.list.length>0"
        :style="'margin-bottom:'+item.top_px+'px;'"
      >
        <div class="materialTitle" v-if="item.is_show_title == 1">
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
            更多
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </span>
        </div>
        <div>
          <van-row gutter="20" type="flex" class="ebooklist">
            <van-col span="8" v-for="(litem,lindex) in item.content.list" :key="lindex">
              <div class="ratiobox" @click="linktoDetail(litem.url,item.supplier_id)">
                <div class="ebookImg" v-lazy:background-image="litem.pic"></div>
              </div>
              <div class="title">{{ litem.title }}</div>
              <div class="price">￥{{ litem.price }}</div>
            </van-col>
          </van-row>
        </div>
      </div>

      <!-- 图书推荐 -->
      <div
        class="articleShow ebook ablum_moudle"
        :style="'margin-bottom:'+item.top_px+'px;padding:0;'"
        v-if="item.module_type == 21 && item.content.list.length>0"
      >
        <div
          class="materialTitle"
          style="padding-left:15px;padding-right:15px;"
          v-if="item.is_show_title == 1"
        >
          <div class="text">
            <span class="verticleLine"></span>
            <span class="lh titleOver">{{item.module_title}}</span>
          </div>
          <span
            class="all"
            v-if="item.is_more"
            @click="linktoDetail(item.more_url,item.supplier_id)"
          >
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
            @click="tabChange($event,index)"
            :v-model="index"
          >
            <van-tab title="推荐">
              <div class="materialObject" style="padding:0 15px 15px 15px;">
                <van-row gutter="20" type="flex" class="ebooklist">
                  <van-col span="8" v-for="(items,indexs) in item.content.list" :key="indexs">
                    <div class="ratiobox" @click="linktoDetail(items.url,item.supplier_id)">
                      <div class="ebookImg" v-lazy:background-image="items.pic"></div>
                    </div>
                    <div class="title">{{items.title}}</div>
                    <div class="bottom">
                      <div class="price" v-if="items.price">¥{{items.price}}</div>
                      <div class="price" v-else>免费</div>
                    </div>
                  </van-col>
                </van-row>
              </div>
            </van-tab>
            <van-tab
              :title="litem.cat_name"
              v-for="(litem,lindex) in item.content.catlist"
              :key="lindex"
            >
              <div class="materialObject" style="padding:0 15px 15px 15px;">
                <van-row gutter="20" type="flex" class="ebooklist">
                  <van-col span="8" v-for="(item1,index1) in bookRecommend[index]" :key="index1">
                    <div class="ratiobox" @click="goodsDetail(item1)">
                      <div class="ebookImg" v-lazy:background-image="item1.pic[0]"></div>
                    </div>
                    <div class="title">{{item1.title}}</div>
                    <div class="bottom">
                      <div class="price" v-if="item1.price">¥{{item1.price}}</div>
                      <div class="price" v-else>免费</div>
                    </div>
                  </van-col>
                </van-row>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
    <EazyNav type="mall" :isShow="true"></EazyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/customPage.scss" lang="scss"></style>
<style lang="scss">
#customPage {
  .van-tabs--line .van-tabs__wrap {
    border-bottom-width: 0 !important;
  }
}
</style>
<script>
// vue无刷新修改url参数
import merge from "webpack-merge";
import qs from "Qs";
// import easyNav from "../../components/easyNav";
import {
  BRAND_PAGE_MALL_INDEX,
  BRAND_SEARCH_GOODS_GETS,
  PAGE_GET
} from "../apis/brand.js";
export default {
  data() {
    return {
      swiperOption: {
        loop: true,
        autoplay: {
          disableOnInteraction: false, //手动滑动之后不打断播放
          delay: 4000
        },
        pagination: {
          el: ".swiper-pagination"
        }
      },
      swiperOption_column: {
        slidesPerView: 2.7,
        spaceBetween: 15
      },
      supplier_id: null,
      title: null,
      module_list: [],
      page_title: "",
      activekey: 0,
      bookData: [],
      booktagData: [],
      catlist: [],
      tagids: null,
      page_id: null,
      bgColor: "",
      brand_id: null,
      bookRecommend: {},
      bookRecommendTmp: {}
    };
  },
  mounted() {
    this.page_id = this.$route.query.page_id;
    this.supplier_id = this.$route.query.supplier_id;
    this.getData();
  },
  updated() {
    $("#customPage").css("backgroundColor", this.bgColor);
  },
  // 进入当前页面
  beforeRouteEnter(to, from, next) {
    next();
  },
  methods: {
    inputText() {
      this.$router.push({
        name: "search",
        query: {
          type: "mall",
          brand_id: this.brand_id,
          supplier_id: this.supplier_id
        }
      });
    },
    // 自定义装修页面
    async getData() {
      var _type = this.$route.query.type ? this.$route.query.type : "page";
      var tStamp = this.$getTimeStamp();
      var data = {};
      data.version = "1.0";
      data.timestamp = tStamp;
      switch (_type) {
        // 自定义装修页面
        case "page":
          data.type = "page";
          data.page_id = this.page_id;
          break;
        // 商城页
        case "mall":
          data.type = "mall";
          data.supplier_id = this.$route.query.supplier_id;
          break;
        // 发现页
        case "find":
          data.type = "find";
          break;
        default:
          break;
      }
      data.sign = this.$getSign(data);
      let res = await PAGE_GET(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(1234, res);
        this.page_title = res.response_data.title;
        document.title = this.page_title;
        this.bgColor = res.response_data.page_info.bgcolor;
        this.supplier_id = res.response_data.supplier_id;
        this.$route.query.supplier_id = res.response_data.supplier_id;
        this.brand_id = res.response_data.brand_id;
        this.module_list = res.response_data.module_list;
        // console.log(888,this.$route.query.supplier_id)
        for (let j = 0; j < this.module_list.length; j++) {
          if (this.module_list[j].module_type == 21) {
            this.bookData = this.module_list[j].content.list;
            this.catlist = this.module_list[j].content.catlist;
            this.bookRecommend[j] = [];
            this.bookRecommendTmp[j] = [];
          }
        }
        // console.log(111,this.bookRecommend)
        // 获取页面分享信息
        // if(this.isWxLogin) this.wxShareData();
        var _pageName = "page/get";
        var _data = {};

        if(this.$route.query.type) _data.type = this.$route.query.type;
        if(this.$route.query.page_id) _data.page_id = this.$route.query.page_id;
        if(this.$route.query.supplier_id) _data.supplier_id = this.$route.query.supplier_id;

        var _params = JSON.stringify(_data);
        if (this.isWxLogin) this.$getWxShareData(_pageName, _params);
      } else {
        this.$toast(res.error_message);
      }
    },
    linktoDetail(link, supplierId) {
      var data = this.$translate(JSON.parse(link));
      // data.query.title = this.title;
      if (JSON.parse(link).action == "page/get") {
        data.query.supplier_id = supplierId;
      }
      // console.log(1111,supplierId,data.query.supplier_id, data.query.page_id);return
      // return;
      if (data.name == "") {
        return;
      } else if (data.name == "url") {
        // 网页链接
        window.location.href = data.query.url;
        return;
      }
      // else if (data.name == "custompage") {
      //   // 自定义页面
      //   this.$router.replace({
      //     query: merge(this.$route.query, { page_id: data.query.page_id })
      //   });
      // }
      else {
        this.$router.push(data);
      }
    },
    goodsDetail(item) {
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
    tabChange(pindex, index) {
      if (pindex > 0) {
        this.tagids = this.catlist[pindex - 1].cat_id;
        this.getTagData(index);
      }

      // console.log(666, pindex, index, this.tagids);
    },
    async getTagData(index) {
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
        this.bookRecommend = {};
        this.bookRecommend[index] = res.response_data.result;
        this.bookRecommendTmp[index] = res.response_data.result;
        this.bookRecommend = this.bookRecommendTmp;

        // console.log(777, this.bookRecommend);
      } else {
        this.$toast(res.error_message);
      }
    }
  }
};
</script>
