import crypto from "crypto";

//  引入接口
import req from "./../apis/http.js";
// 支持await async
import regeneratorRuntime from './../regenerator-runtime/runtime.js';

// 时间戳
export const SERVER_TIME = params => req('post', '/timestamp', params);

export default {
  install: function (Vue, options) {

    // 获取并储存服务器和本地时间差
    Vue.prototype.$getServerTime = async function () {
      let data = {
        version: "1.0"
      }
      let localTime = new Date().getTime();
      let res = await SERVER_TIME(data);
      let serverTime = res.response_data.timestamp * 1000;
      this.diffTime = serverTime - localTime;
      console.log('时间差：', this.diffTime);
    }

    // 计算时间戳
    Vue.prototype.$getTimeStamp = function () {
      let localTime = new Date().getTime();
      let timeStamp = parseInt((localTime + this.diffTime) / 1000);
      console.log("时间戳:", timeStamp);
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
          console.log(time)
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
          console.log(res)
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

      console.log("排序并拼接后的data:", str);
      return data;
    }
    Vue.prototype.$getmd5 = function (str) {
      var res;
      var md5 = crypto.createHash("md5");
      //update("中文", "utf8")
      md5.update(str);
      var res = md5.digest("hex");
      console.log("md5:", res);
      return res;
    }

  }
}
