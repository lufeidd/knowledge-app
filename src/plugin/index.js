import crypto from "crypto";
import axios from 'axios'
import qs from "Qs";

// 微信分享，引入sdk
import wx from 'weixin-js-sdk';

//  引入时间戳接口
// import req from "./../apis/http.js";
import { SERVER_TIME, WX_SHARE } from "./../apis/public.js";

// 支持await async
import regeneratorRuntime from './../regenerator-runtime/runtime.js';

// 时间戳
// export const SERVER_TIME = params => req('post', '/timestamp', params);

export default {
  install: function (Vue, options) {

    // 微信分享
    Vue.prototype.$getWxData = async function (_title, _desc, _imgUrl, _route) {
      let url = 'http://wap.huoba.net/callback/weixin/jssdk?url=' + encodeURIComponent(window.location.href.split('#')[0]); //去掉签名
      var self = this
      axios.get(url)
        .then(function (response) {
          // console.log(response)
          let appId = response.data.appId;
          let nonceStr = response.data.nonceStr;
          let signature = response.data.signature;
          let timestamp = response.data.timestamp;
          wx.config({
            debug: false,
            appId: appId,         // 和获取Ticke的必须一样------必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr,   // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
            // 需要分享的列表项:发送给朋友，分享到朋友圈，分享到QQ，分享到QQ空间
            jsApiList: [
              'onMenuShareAppMessage',
              'onMenuShareTimeline',
              'onMenuShareQQ',
              'onMenuShareQZone'
            ]
          });

        })
        .catch(function (error) {
          self.fetchError = error
        })

      // 处理验证失败的信息
      wx.error(function (res) {
        // logUtil.printLog('验证失败返回的信息:', res);
      });

      wx.ready(function () {

        // 分享所需参数
        // console.log('route:', localStorage.getItem('routerLink'), 'loginState:', sessionStorage.getItem('loginState'))
        // let _link = localStorage.getItem('routerLink');
        let shareData = {
          title: _title,
          desc: _desc,
          // link: _link,
          link: _route,
          imgUrl: _imgUrl,
          // type: '',
          // 分享类型，music、video或link，不填默认为link
          // dataUrl: '',
          // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) {
            // 用户确认分享后执行的回调函数
            // logUtil.printLog("分享给朋友成功返回的信息为:", res);
          },
          cancel: function (res) {
            // 用户取消分享后执行的回调函数
            // logUtil.printLog("取消分享给朋友返回的信息为:", res);
          }
        };
        console.log('shareData:', shareData);
        wx.onMenuShareTimeline(shareData);    // 分享到朋友圈
        wx.onMenuShareAppMessage(shareData);  // 分享给朋友
        wx.onMenuShareQQ(shareData);          // 分享到QQ
        wx.onMenuShareWeibo(shareData);       // 分享到weibo
        wx.onMenuShareQZone(shareData);       // 分享到QQ空间
      });

    }

    // 获取并储存服务器和本地时间差
    Vue.prototype.$getServerTime = async function () {
      let data = {
        version: "1.0"
      }
      let localTime = new Date().getTime();
      let res = await SERVER_TIME(data);
      let serverTime = res.response_data.timestamp * 1000;
      this.diffTime = serverTime - localTime;
      // console.log('时间差：', this.diffTime);
    }

    // 计算时间戳
    Vue.prototype.$getTimeStamp = function () {
      let localTime = new Date().getTime();
      let timeStamp = parseInt((localTime + this.diffTime) / 1000);
      // console.log("时间戳:", timeStamp);
      return timeStamp;
    }

    // 判断是否是iphonex
    Vue.prototype.winWidth = $(window).width();
    Vue.prototype.winHeight = $(window).height();
    const ua = window.navigator.userAgent.toLowerCase();
    Vue.prototype.isIphx = ua.match(/mobile/) && $(window).width() == 375 && $(window).height() == 812;
    // 全局变量
    // 倒计时
    Vue.prototype.clock = null
    Vue.prototype.audioDuration = null
    Vue.prototype.videoDuration = null
    // 音频实时播放进度
    Vue.prototype.progressClock = null

    // 验证码倒计时
    Vue.prototype.$countDown = function (options) {
      let self = this
      let time = options.time

      if (typeof time === 'number') {
        this.clock = window.setInterval(() => {
          if (time === 0) {
            clearInterval(this.clock)
            options.disabled = false
            options.timeMsg = '获取验证码'
            return false
          }
          time--
          options.disabled = true
          options.timeMsg = time + 's'
          // console.log(time)
        }, 1000)
      } else {
        self.$toast('时间格式不正确')
      }
    }

    // 时间倒计时
    Vue.prototype.$timeCountDown = function (options) {
      let self = this
      let second = options.time
      if (typeof second === 'number') {
        this.clock = window.setInterval(() => {
          if (second === 0) {
            clearInterval(this.clock)
            return false
          }
          second--

          let h = Math.floor(second / 60 / 60)
          let m = Math.floor((second - h * 60 * 60) / 60)
          let s = second - (h * 60 * 60) - (m * 60)
          if (h < 10) h = '0' + h
          if (m < 10) m = '0' + m
          if (s < 10) s = '0' + s
          let res = h + ":" + m + ":" + s

          options.date = res;
          // console.log(res)
        }, 1000)
      } else {
        self.$toast('时间格式不正确')
      }

    }

    // ksort
    Vue.prototype.$ksort = function (inputArr) {
      // original by: GeekFG (http://www.0-php.com)
      var tmp_arr = {},
        keys = [],
        sorter,
        i,
        k,
        that = this,
        strictForIn = false,
        populateArr = {};

      // switch (sort_flags) {
      // case "SORT_STRING":
      //   // compare items as strings
      //   sorter = function (a, b) {
      //     return that.strnatcmp(a, b);
      //   };
      //   break;
      // case "SORT_LOCALE_STRING":
      //   // compare items as strings, original by the current locale (set with  i18n_loc_set_default() as of PHP6)
      //   var loc = this.i18n_loc_get_default();
      //   sorter = this.php_js.i18nLocales[loc].sorting;
      //   break;
      // case "SORT_NUMERIC":
      //   // compare items numerically
      //   sorter = function (a, b) {
      //     return a + 0 - (b + 0);
      //   };
      //   break;
      // case 'SORT_REGULAR': // compare items normally (don't change types)
      // default:
      sorter = function (a, b) {
        var aFloat = parseFloat(a),
          bFloat = parseFloat(b),
          aNumeric = aFloat + "" === a,
          bNumeric = bFloat + "" === b;
        if (aNumeric && bNumeric) {
          return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
        } else if (aNumeric && !bNumeric) {
          return 1;
        } else if (!aNumeric && bNumeric) {
          return -1;
        }
        return a > b ? 1 : a < b ? -1 : 0;
      };
      // break;
      // }

      // Make a list of key names
      for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
          keys.push(k);
        }
      }
      keys.sort(sorter);

      // BEGIN REDUNDANT
      this.php_js = this.php_js || {};
      this.php_js.ini = this.php_js.ini || {};
      // END REDUNDANT
      strictForIn =
        this.php_js.ini["phpjs.strictForIn"] &&
        this.php_js.ini["phpjs.strictForIn"].local_value &&
        this.php_js.ini["phpjs.strictForIn"].local_value !== "off";
      populateArr = strictForIn ? inputArr : populateArr;

      // Rebuild array with sorted key names
      for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmp_arr[k] = inputArr[k];
        if (strictForIn) {
          delete inputArr[k];
        }
      }
      for (i in tmp_arr) {
        if (tmp_arr.hasOwnProperty(i)) {
          populateArr[i] = tmp_arr[i];
        }
      }

      return strictForIn || populateArr;
    }

    // 本地和服务器的时间差值
    Vue.prototype.diffTime = 0

    // 签名
    Vue.prototype.$getSign = function (data) {
      let str = "";
      data = this.$ksort(data);

      Object.keys(data).forEach(function (key) {
        str += key + data[key];
      });
      data = this.$getmd5(str).toUpperCase();

      // console.log("排序并拼接后的data:", str);
      return data;
    }
    Vue.prototype.$getmd5 = function (str) {
      var res;
      var md5 = crypto.createHash("md5");
      //update("中文", "utf8")
      md5.update(str);
      var res = md5.digest("hex");
      // console.log("md5:", res);
      return res;
    }

    // 不定外链传参翻译
    Vue.prototype.$translate = function (data) {
      var dataTmp = data;
      var __name = null;
      var dataRes = {};

      switch (dataTmp.action) {
        // 商品详情
        case 'goods/detail':
          // 音/视频
          if (dataTmp.params.goods_type == 1 || dataTmp.params.goods_type == 2) {
            __name = 'albumdetail';
          } else if (dataTmp.params.goods_type == 6) { // 文章
            __name = 'article';
          } else if (dataTmp.params.goods_type == 9) { // 专辑
            __name = 'album';
          } else {

          }
          dataRes = {
            name: __name,
            query: {
              goods_id: parseInt(dataTmp.params.goods_id),
            }
          }

          break;
        case 'search/result':
          dataRes = {
            name: 'brandresult',
            query: {
              supplier_id: parseInt(dataTmp.params.supplier_id),
              goods_type: parseInt(dataTmp.params.goods_type),
            }
          }
          break;
      }
      return dataRes;
    }

    // 获取 brand_id
    // localStorage.setItem('globalBrandId', 1);
  }
}
