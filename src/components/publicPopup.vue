<template>
  <div id="publicPopup">
    <van-popup v-model="show" :close-on-click-overlay="layerClose" @click-overlay="closePopup('m', 1)" class="popup-box">
      <div class="close-one" v-if="iconOneClose">
        <svg class="icon" aria-hidden="true" @click="closePopup('c', 2)">
          <use xlink:href="#icon-yichu" />
        </svg>
      </div>
      <div class="img-box">
        <img :src="pic" alt="" @click="goToLink">
      </div>
      <div class="close-two" v-if="iconTwoClose">
        <svg class="icon" aria-hidden="true" @click="closePopup('c', 1)">
          <use xlink:href="#icon-yichu" />
        </svg>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { POPUP_INFO, POPUP_LOG } from '@/apis/public.js';
  export default {
    data() {
      return {
        show: false,
        popupId: '',
        pic: '',
        url: '',
        actType: '', // 用户行为
        pageName: '',
        params: '',
        layerClose: true,
        iconOneClose: false,
        iconTwoClose: false,
        closeType: {}
      }
    },
    computed: {
    },
    methods: {
      async getPopupInfo() {
        let data = {
          version: '1.0',
          page_name: this.pageName,
          params: JSON.stringify(this.params)
        };
        let res = await POPUP_INFO(data);
        if (res.hasOwnProperty('response_code') && Object.keys(res.response_data).length !== 0 ) {
          this.show = true; //  显示弹窗
          this.popupId = res.response_data.id;
          this.pic = res.response_data.pic; // 弹窗图片

          let closeState = JSON.parse(res.response_data.close_conf);
          if (closeState.m == 0) { // 不使用蒙层关闭
            this.layerClose = false;
            // console.log('不使用蒙层',this.layerClose);
          } else {
            this.layerClose = true;
          }
          if (closeState.c == 0) { // 不使用按钮关闭
            this.iconOneClose = false;
            this.iconTwoClose = false;
          } else if(closeState.c == 1) { // 使用下关闭按钮关闭
            this.iconOneClose = false;
            this.iconTwoClose = true;
          } else if(closeState.c == 2) { // 使用上关闭按钮关闭
            this.iconOneClose = true;
            this.iconTwoClose = false;
          }

          let urlObj = JSON.parse(res.response_data.url); // 图片跳转链接(JSON)
          let tempObj = this.$translate(urlObj);
          if (tempObj.name) {
            urlObj = this.$translate(urlObj);
          }
          let url = window.location.href.split('#')[0] + '#/' +  urlObj.action;

          // url拼接
          if (Object.keys(urlObj.params).length !== 0) {
            url += '?';
          }
          for (var k in urlObj.params) {
            url += ( k + '=' + urlObj.params[k] + '&');
          }
          this.url = url.substring(0, url.length - 1);
          // this.url = this.$translate(url);

          // console.log('URL',this.url);
        }
      },
      async sendPopupLog() {
        let data = {
          version: '1.0',
          popup_id: this.popupId,
          page_name: this.pageName,
          params: JSON.stringify(this.params),
          act_type: this.actType,
          close_info: JSON.stringify(this.closeType)
        };
        let res = await POPUP_LOG(data);
        if (res.hasOwnProperty('response_code')) {
          // console.log(res.response_data.success);
        }
      },
      closePopup(type, value) {
        this.actType = 'close';
        if (type === 'c') {
          this.closeType.c = value;
          this.sendPopupLog();
          this.show = false;
        } else if (this.layerClose === true && type === 'm') {
          this.closeType.m = value;
          this.sendPopupLog();
          // console.log('show',this.show);
          // console.log('layer',this.layerClose);
        }
      },
      goToLink() {
        this.actType = 'click';
        this.sendPopupLog();
        window.location.href = this.url;
      },
      // 获取当前页面路由信息
      getRouterInfo() {
        var params = window.location.hash.split('#')[1].split('?')[0];
        var linkData = this.$getRouterParams(params);
        // console.log(linkData);
        // this.pageName = '/customPage';
        this.pageName = linkData.page_name;
        this.params = linkData;
      }
    },
    mounted() {
      this.getRouterInfo();
      this.getPopupInfo();
    }
  }
</script>

<style lang="scss" scoped>
  #publicPopup {
    .van-popup {
      overflow-y: visible;
    }
    .popup-box {
      width: 300px;
      background: rgba(0, 0, 0, 0);
    }
    .img-box {
      margin: 0 auto;
      width: 285px;
      text-align: center;
      /*height: 370px;*/
      img {
        width: 85%;
      }
    }
    .close-one {
      position: absolute;
      top: -45px;
      right: 0;
      font-size: 28px;
      color: #fff;
    }
    .close-two {
      position: absolute;
      bottom: -68px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 28px;
      color: #fff;
    }
  }
</style>
