<template>
  <van-popup v-model="catalogPopup" position="bottom" style="min-height:100%;max-height:100%;">
    <div id="catalogList" class="catalogList">
      <div class="head">
        <span class="catalogWord">目录</span>
        <span>
          <svg class="icon" aria-hidden="true" @click="closePopup">
            <use xlink:href="#icon-close-line" />
          </svg>
        </span>
      </div>
      <div class="content">
        <div class="info">
          <div class="ratiobox">
            <div class="bookImg" :style="{'background-image':'url('+ebookInfo.pic+')'}"></div>
          </div>
          <div class="right">
            <div class="title">{{ebookInfo.goods_title}}</div>
            <div class="author">{{ebookInfo.author}}</div>
            <div class="detail">
              <span>共{{ebookInfo.chapter_count}}章</span>
              <span v-if="ebookInfo.serialize_status">{{ebookInfo.serialize_status == 1?'连载中':'完结'}}</span>
              <span>已读1.3%</span>
            </div>
          </div>
        </div>
        <!-- 章节目录 -->
        <div class="list">
          <ul>
            <li v-for="(item,index) in ebookList" :key="index" @click="read(item,index)">
              <div class="left red" v-if="item.chapter_id == chapter_id">
                <div>第{{index+1}}章</div>
                <div class="title">{{item.chapter_name}}</div>
              </div>
              <div class="left" v-else>
                <div>第{{index+1}}章</div>
                <div class="title">{{item.chapter_name}}</div>
              </div>
              <span>
                <svg
                  class="icon"
                  aria-hidden="true"
                  v-if="item.chapter_free == 0 && item.chapter_try == 0"
                >
                  <use xlink:href="#icon-lock-line" />
                </svg>
                <span v-if="item.chapter_free == 0 && item.chaprer_try == 1">试读</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss">
#catalogList {
  .head {
    background-color: #f5f5f5;
    padding: 0 15px;
    height: 40px;
    // position: fixed;
    // top: 0;
    // width: 100%;
    // box-sizing: border-box;
    @include displayFlex(flex, space-between, center);
    .catalogWord {
      font-size: $fontSize + 1;
    }
  }
  .content {
    padding: 15px;
    position: absolute;
    top: 40px;
    bottom:0;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    .info {
      @include displayFlex(flex, null, null);
      .ratiobox {
        min-width: 75px;
        .bookImg {
          box-sizing: border-box;
          display: block;
          @include ratioBox(
            100%,
            133.33%,
            1px solid $greyLight,
            contain,
            $white,
            null
          );
          border-radius: 3px;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
        }
      }
      .right {
        flex-grow: 1;
        width: 76%;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        align-content: space-between;
        justify-content: space-between;
        padding: 10px 0;
        .title {
          font-size: $fontSize + 2;
          @include textOverflow;
        }
        .author {
          color: $cl6;
        }
        .detail {
          font-size: $fontSize - 1;
          color: $cl9;
        }
      }
    }
  }
  .list {
    margin-top: 10px;
    ul {
      li {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        @include displayFlex(flex, space-between, center);
        .left {
          // flex-grow: 1;
          width: 95%;
          @include displayFlex(flex, null, center);
        }
        .left.grey {
          color: $cl9;
        }
        .left.red {
          color: $redDark;
        }
        .title {
          @include textOverflow;
          width: 80%;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>

<script>
import { EBOOK_CATALOG, EBOOK_INFO } from "../../apis/ebook.js";
export default {
  name: "catalog",
  props: ["goods_id", "chapter_id","ebookList"],
  data() {
    return {
      catalogPopup: false,
      ebookInfo: {},
      // ebookList: [],
      free: false
    };
  },
  mounted() {},
  methods: {
    async getInfo() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        goods_id: this.goods_id,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await EBOOK_INFO(data);
      if (res.hasOwnProperty("response_code")) {
        console.log(res);
        this.ebookInfo = res.response_data;
      } else {
        this.$toast(res.error_message);
      }
    },
    // async getList() {
    //   var tStamp = this.$getTimeStamp();
    //   let data = {
    //     timestamp: tStamp,
    //     goods_id: this.goods_id,
    //     version: "1.0"
    //   };
    //   data.sign = this.$getSign(data);
    //   let res = await EBOOK_CATALOG(data);
    //   if (res.hasOwnProperty("response_code")) {
    //     // console.log(res);
    //     // this.ebookList = res.response_data;
    //     for(var i=0;i<res.response_data.length;i++){
    //       if(res.response_data[i].chapter_hidden == 0){
    //         this.ebookList.push(res.response_data[i])
    //       }
    //     }
    //   } else {
    //     this.$toast(res.error_message);
    //   }
    // },
    closePopup() {
      this.catalogPopup = false;
    },
    read(item, index) {
      console.log(item);
      if (item.chapter_free == 0 && item.chapter_try == 0) {
        this.free = true;
        this.$emit("chargeChange",true);
        // this.$emit("ebookChange", item.chapter_id);
      } else {
        this.free = false;
        this.$emit("chargeChange",false);
        this.$emit("ebookChange", item.chapter_id);
      }
      this.catalogPopup = false;
    }
  }
};
</script>

