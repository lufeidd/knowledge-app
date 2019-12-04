<template>
  <div id="libraryIndex">
    <div class="contain">
      <div class="ratiobox">
        <div class="bookImg" v-lazy:background-image="resourceData.base.pic[0]"></div>
      </div>
      <div class="right">
        <div class="text">{{ this.resourceData.base.title }}</div>
        <div class="author">{{ this.resourceData.base.author }}</div>
        <div class="terrace">
          <div class="name">{{ this.resourceData.brand_info.name }}</div>
          <div class="oval" v-if="resourceData.brand_info.last_vistors.length > 0">
            <div class="bookImg" v-lazy:background-image="resourceData.brand_info.last_vistors[0].header_pic"></div>
          </div>
          <div class="oval" style="right: 43px;" v-if="resourceData.brand_info.last_vistors.length > 1">
            <div class="bookImg" v-lazy:background-image="resourceData.brand_info.last_vistors[1].header_pic"></div>
          </div>
          <div class="oval" style="right: 56px;" v-if="resourceData.brand_info.last_vistors.length > 2">
            <div class="bookImg" v-lazy:background-image="resourceData.brand_info.last_vistors[2].header_pic"></div>
          </div>
          <div class="icon-img" @click="numBrandId">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="iconHref" v-if="electron">
      <div class="left" @click="bookLink(resourceData.base)">
        <img src="../../assets/library/icon3.png" alt width="43px" height="40px" />
        <div class="text">
          <div class="top">纸质书</div>
          <div class="bottom">￥{{ this.resourceData.base.price }}</div>
        </div>
      </div>
      <div class="right" @click="ebookDetail(resourceData.ebook_info)">
        <img src="../../assets/library/icon1.png" alt width="43px" height="40px" />
        <div class="text">
          <div class="top">电子书</div>
          <div class="bottom">免费</div>
        </div>
      </div>
    </div>
    <div class="iconHrefNo" v-else>
      <div class="box" @click="bookLink(resourceData.base)">
        <div class="picture">
          <img src="../../assets/library/icon3.png" alt width="43px" height="40px" />
        </div>
        <div class="text">纸质书</div>
        <div class="price">￥{{ this.resourceData.base.price }}</div>
      </div>
    </div>
    <div class="package" v-if="fileShow">
      <div class="title">
        <div class="text">
          <span class="line"></span>
          <span class="lh titleOver">文件包</span>
        </div>
      </div>
      <div v-for="(item,index) in resourceData.resource_list.filepackage" :key="index">
        <div class="content" @click="goodsDetail(item)">
          <img src="../../assets/library/img_big2.png" alt width="30px" height="25px"/>
          <div class="text">{{ item.goods_info.title }}</div>
          <div class="price">
            ￥{{ item.goods_info.price }}
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-next-line" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="package" v-if="bookShow">
      <div class="title">
        <div class="text">
          <span class="line"></span>
          <span class="lh titleOver">文章</span>
        </div>
      </div>
      <div v-for="(item,index) in resourceData.resource_list.article" :key="index">
        <div class="detailContent" @click="goodsDetail(item)">
          <div class="ratiobox">
            <div class="bookImg" v-lazy:background-image="item.goods_info.pic[0]"></div>
          </div>
          <div class="right">
            <div class="text">{{ item.goods_info.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="package" v-if="classShow">
      <div class="title">
        <div class="text">
          <span class="line"></span>
          <span class="lh titleOver">课程</span>
        </div>
      </div>
      <div v-for="(item,index) in resourceData.resource_list.album" :key="index">
        <div class="classContent" @click="goodsDetail(item)">
          <div class="ratiobox">
            <div class="bookImg" v-lazy:background-image="item.goods_info.pic[0]"></div>
          </div>
          <div class="right">
            <div class="text">{{ item.goods_info.title }}</div>
            <div class="subTitle">{{ item.goods_info.sub_title }}</div>
            <div class="nice">
              <div class="episodes">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-album-line" />
                </svg>
                <span class="album_num">共{{ item.goods_info.album_total_count }}集</span>
              </div>
              <div class="price">￥{{ item.goods_info.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="footer" @click="numBrandId">
        <div class="footer-img">
          <div class="bookImg" v-lazy:background-image="resourceData.brand_info.header_pic"></div>
        </div>
        <div class="text">{{ resourceData.brand_info.name }}</div>
        <div class="icon-footer">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-line" />
          </svg>
        </div>
      </div>
    </div>
    <Loading :isLoading="isLoading"></Loading>
  </div>
</template>

<style src="@/style/scss/pages/library/index.scss" scoped lang="scss"></style>
<style lang="scss">
  #loadingPage{
    background: #f0f0f0!important;
  }
</style>
<script>
  import { RESOURCE_GET } from "../../apis/bookresource.js";
  export default {
    data () {
      return {
        isLoading: true,
        fileShow: false,
        bookShow: false,
        classShow: false,
        resourceData: {
          base: {
            pic: []
          },
          brand_info: {
            last_vistors: []
          },
          resource_list: {
            album: [],
            article: [],
            filepackage: []
          },
          ebook_info: []
        },
        electron: true,
        goods_id: 0,
        brand_id: ''
      }
    },
    mounted () {
      this.goods_id = this.$route.query.goods_id;
      this.resourceGet();
    },
    methods: {
      //图书资源基本初始化
      async resourceGet () {
        var tStamp = this.$getTimeStamp();
        let data = {
          timestamp: tStamp,
          goods_id: this.goods_id,
          version: "1.0"
        };
        data.sign = this.$getSign(data);
        let res = await RESOURCE_GET(data);
        if (res.hasOwnProperty("response_code")) {
          this.resourceData = res.response_data;
          this.brand_id = this.resourceData.base.brand_id;
          if (this.resourceData.resource_list.filepackage.length > 0) {
            this.fileShow = true;
          }
          if (this.resourceData.resource_list.album.length > 0) {
            this.classShow = true;
          }
          if (this.resourceData.resource_list.article.length > 0) {
            this.bookShow = true;
          }
          if (this.resourceData.ebook_info.length == 0) {
            this.electron = false;
          }
          this.isLoading = false;
          console.log(this.resourceData);
        } else {
          this.$toast(res.error_message);
        }
      },
      // 公众号跳转
      numBrandId () {
        this.$router.push({ name: "brand/index", query: { brand_id: this.resourceData.brand_info.brand_id }});
      },
      // 纸质书跳转
      bookLink (link) {
        this.$router.push({
          name: "detail",
          query: {
            goods_id: link.goods_id,
            type: 'mall',
            title: null,
            brand_id: link.brand_id
          }
        });
      },
      // 其余商品跳转
      goodsDetail (item) {
        // 文章
        if (item.goods_type == 6) {
          this.$router.push({
            name: "article",
            query: {
              goods_id: item.goods_id,
              type: 'mall',
              title: null,
              brand_id: this.brand_id
            }
          });
        }
        //专辑
        if (item.goods_type == 9) {
          this.$router.push({
            name: "album",
            query: {
              goods_id: item.goods_id,
              type: 'mall',
              title: null,
              brand_id: this.brand_id
            }
          });
        }
        // 文件包
        if (item.goods_type == 10) {
          this.$router.push({
            name: "librarydetail",
            query: {
              goods_id: item.goods_id
            }
          });
        }
      },
      // 电子书免费跳转
      ebookDetail (item) {
        if (item != null) {
          this.$router.push({
            name: "ebookdetail",
            query: {
              goods_id: item.goods_id,
              type: 'mall',
              title: null,
              brand_id: this.brand_id
            }
          });
        }
      }
    }
  }
</script>
