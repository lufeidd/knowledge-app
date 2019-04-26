<template>
  <div id="detailPage">
    <van-swipe :autoplay="3000" indicator-color="#f05654">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <div class="ratioBox">
          <div class="box">
            <img v-lazy="image">
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>

    <div class="infoBox">
      <van-row class="info">
        <van-col span="12">
          <span class="price">¥23.00</span>
          <del>¥28</del>
        </van-col>
        <van-col span="12" style="text-align: right;">库存充足</van-col>
      </van-row>
      <div
        class="title"
      >少儿图书大全绘本基地啊家了减胜多负少划付款我少儿图书大全绘本基地啊家了减胜多负少划付款我少儿图书大全绘本基地啊家了减胜多负少划付款我少儿图书大全绘本基地啊家了减胜多负少划付款我少儿图书大全绘本基地啊家了减胜多负少划付款我</div>
    </div>
    <van-cell title="配送至 西湖区" is-link value="运费8元，满99包邮" @click="showPopup"/>

    <div class="introduction">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">简介</span>
      </div>
      <div class="detail">
        <van-row>
          <van-col span="12">ISBN</van-col>
          <van-col span="12" style="text-align:right;color: #999;">2479365141234</van-col>
        </van-row>
        <van-row>
          <van-col span="12">ISBN</van-col>
          <van-col span="12" style="text-align:right;color: #999;">2479365141234</van-col>
        </van-row>
      </div>
    </div>
    <div class="introduction">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">目录</span>
      </div>
      <div class="detail">
        <van-row>
          <van-col span="12">ISBN</van-col>
          <van-col span="12" style="text-align:right;color: #999;">2479365141234</van-col>
        </van-row>
        <van-row>
          <van-col span="12">ISBN</van-col>
          <van-col span="12" style="text-align:right;color: #999;">2479365141234</van-col>
        </van-row>
      </div>
      <div class="action">展开全部</div>
    </div>
    <div class="introduction">
      <div class="text">
        <span class="verticleLine"></span>
        <span class="lh">前言</span>
      </div>
      <div class="detail">
        <van-row>
          <van-col span="12">ISBN</van-col>
          <van-col span="12" style="text-align:right;color: #999;">2479365141234</van-col>
        </van-row>
        <van-row>
          <van-col span="12">ISBN</van-col>
          <van-col span="12" style="text-align:right;color: #999;">2479365141234</van-col>
        </van-row>
      </div>
      <div class="action">展开全部</div>
    </div>

    <van-goods-action>
      <van-goods-action-mini-btn icon="cart-o" text="购物车" @click="onClickMiniBtn"/>
      <van-goods-action-big-btn text="加入购物车" @click="onClickBigBtn"/>
      <van-goods-action-big-btn primary text="立即购买" @click="onClickBigBtn"/>
    </van-goods-action>

    <van-popup v-model="popupModel" position="bottom" @open="onOpen">
      <div class="audioList">
        <div class="title">
          <div class="action" @click="hidePopup">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-fold-line"></use>
            </svg>
          </div>
          <div>配送至</div>
        </div>

        <ul class="audioListBox">
          <li
            v-for="(item, key) in audioListData.albums"
            :key="key"
            :class="{ active: activeIndex == key }"
            @click="onPlay(key)"
          >
            <div class="img">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-location-line"></use>
              </svg>
            </div>

            <div class="info">
              <div class="album">dfgdf</div>
            </div>
          </li>
        </ul>

        <van-area class="areaBox" :area-list="areaList" :columns-num="3" title="配送至" @cancel="hidePopup"/>

        <van-button size="large" class="button" @click="showArea">选择其他地区</van-button>
      </div>
    </van-popup>
  </div>
</template>

<style src="@/style/scss/pages/detail.scss" lang="scss"></style>

<script>
export default {
  data() {
    return {
      addressInfo: {
        name: "曾",
        tel: "15266666666"
      },
      areaList: {
        province_list: {
          110000: "北京市",
          120000: "天津市"
        },
        city_list: {
          110100: "北京市",
          110200: "县",
          120100: "天津市",
          120200: "县"
        },
        county_list: {
          110101: "东城区",
          110102: "西城区",
          110105: "朝阳区",
          110106: "丰台区",
          120101: "和平区",
          120102: "河东区",
          120103: "河西区",
          120104: "南开区",
          120105: "河北区"
          // ....
        }
      },

      activeIndex: 1,
      audioListData: {
        albums: [
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          },
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          },
          {
            album:
              "试听课 钙铁锌硒怎么吃 ？ 吃什么才对 试听课 钙铁锌硒怎么吃 ？ 吃什么才对",
            duration: "16：00",
            percent: "1%"
          }
        ]
      },
      popupModel: false,
      images: ["https://img.yzcdn.cn/2.jpg", "https://img.yzcdn.cn/2.jpg"]
    };
  },
  methods: {
    showArea() {
      $(".areaBox").css("display", "block");
      $(".audioListBox, .audioList .button, .audioList .title").css("display", "none");
    },
    onPlay(key) {
      console.log(key);
      this.activeIndex = key;
    },
    hidePopup() {
      this.popupModel = false;
    },
    onOpen() {
      // alert(999);
    },
    showPopup() {
      this.popupModel = true;
    },
    onClickMiniBtn() {
      this.$toast("点击图标");
    },
    onClickBigBtn() {
      this.$toast("点击按钮");
    },
    callback() {}
  }
};
</script>
