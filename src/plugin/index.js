import crypto from "crypto";
import axios from 'axios'
import qs from "Qs";

// 微信分享，引入sdk
import wx from 'weixin-js-sdk';

//  引入时间戳接口
// import req from "./../apis/http.js";
import { SERVER_TIME, WX_SHARE, WX_SHARE_LOG, ADDRESS, CASHIER_PAY_CHECK } from "./../apis/public.js";
import { LOGIN_PARTERNER, PAGE_INFO } from "./../apis/passport.js";

// 支持await async
// import regeneratorRuntime from './../regenerator-runtime/runtime.js';

// 时间戳
// export const SERVER_TIME = params => req('post', '/timestamp', params);

export default {
  install: function (Vue, options) {
    // 分享信息
    Vue.prototype.share_info = {};
    Vue.prototype.page_name = '';
    Vue.prototype.params = {};
    Vue.prototype.share_type = 1;
    // 省市区
    // 省
    Vue.prototype.provinceList = {};
    // 市
    Vue.prototype.cityList = {};
    // 区
    Vue.prototype.countyList = {};

    // 判断是否是iphonex
    Vue.prototype.winWidth = $(window).width();
    Vue.prototype.winHeight = $(window).height();
    const ua = window.navigator.userAgent.toLowerCase();

    Vue.prototype.isIphx = ua.match(/mobile/) && $(window).width() == 375 && $(window).height() == 812;
    Vue.prototype.isWxLogin = ua.match(/MicroMessenger/i) == 'micromessenger';

    // 存储第三方登录code
    Vue.prototype.wxCodeStr = '';
    Vue.prototype.appid = "wx0980638eef192092";

    // 获取第三方微信登录
    Vue.prototype.$getWxCode = async function () {
      // 获取微信登录授权code
      var str = window.location.href;
      str = str.split("#")[0];
      if (str.indexOf('code=') != -1) {
        var sIndex = str.split("#")[0].indexOf("code=") + 5;
        var eIndex = str.split("#")[0].indexOf("code=") + 37;

        // 存储第三方登录code
        this.wxCodeStr = str.substring(sIndex, eIndex);
        // localStorage.setItem('wxCode', this.wxCodeStr);
        console.log('code:', this.wxCodeStr);
      }
    }
    Vue.prototype.$getWxLoginData = async function () {
      // 已经授权过
      if (this.wxCodeStr == '') {
        if (localStorage.getItem('unionid') != undefined || localStorage.getItem('unionid') != 'undefined' || localStorage.getItem('unionid') != 'null' || localStorage.getItem('unionid') != null) {
          // 第三方用户登录接口
          this.$getLoginParterner(localStorage.getItem('headimg'), localStorage.getItem('unionid'), localStorage.getItem('nickname'), 2);
        }

      } else {
        let url = window.location.protocol + "//" + window.location.hostname + "/callback/weixin/Userinfo?code=" + this.wxCodeStr;
        var self = this;
        console.log('url:', url)
        axios
          .get(url)
          .then(function (response) {
            console.log('response',response);
            localStorage.setItem('nickname', response.data.nickname);
            localStorage.setItem('headimg', response.data.headimgurl);
            localStorage.setItem('openid', response.data.openid);
            localStorage.setItem('unionid', response.data.unionid);
            // 第三方用户登录接口
            self.$getLoginParterner(response.data.headimgurl, response.data.unionid, response.data.nickname, 2);
          })
          .catch(function (error) {
            self.fetchError = error;
            console.log('error:', error);
          });
      }
    }
    Vue.prototype.$getLoginParterner = async function (_headimg, _unionid, _outerName, _type) {
      var tStamp = this.$getTimeStamp();
      let data = {
        outer_id: _unionid,
        outer_name: _outerName,
        header_pic: _headimg,
        timestamp: tStamp,
        type: _type,
        openid: localStorage.getItem('openid'),
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await LOGIN_PARTERNER(data);

      // console.log(res);

      // 出错提示
      if (res.hasOwnProperty("response_code")) {
        console.log("unionid:", _unionid, "parterner:", res.response_data);
        // 登录成功exist = 1；没有绑定过 exist = 0；
        if (res.response_data.exist == 0) {

          // this.$router.replace({
          //   name: "bindphone",
          //   query: { bindtype: _type, outerId: _unionid }
          // });
          this.$router.replace({
            name: "bindPhone",
            query: { bindtype: _type, outerId: _unionid }
          });
        }
        if (res.response_data.exist == 1) {
          // brand_id等信息
          // var route = window.location.href.split('#')[1];
          // var query = '';
          // if (route.indexOf('?') != -1) {
          //   query = '?' + route.split('?')[1];
          // }
          // window.location.href = window.location.protocol + "//" + window.location.hostname + '/#/personal/index' + query;

          // linkFrom=gzh，公众号绑定手机号入口进入，提示已绑定手机号
          if (localStorage.getItem("linkFrom") == 'gzh') {
            this.$dialog.alert({
              message: res.response_data.msg
            }).then(() => {
              // 微信第三方登录回退到指定页面defaultLink
              window.location.href = localStorage.getItem("defaultLink");
            });
          } else {
            // 微信第三方登录回退到指定页面defaultLink
            window.location.href = localStorage.getItem("defaultLink");
          }

          this.wxCodeStr = '';
        }
      } else {
        this.$toast(res.error_message);
      }
    }
    // 微信授权，确定授权返回code
    Vue.prototype.$wxLogin = async function () {
      var url = encodeURIComponent(window.location.href);
      var type = "code";
      var scope = "snsapi_userinfo";

      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        this.appid +
        "&redirect_uri=" +
        url +
        "&response_type=" +
        type +
        "&scope=" +
        scope +
        "&state=STATE#wechat_redirect";

    }

    // 微信分享
    Vue.prototype.$getWxData = async function (_title, _desc, _imgUrl, _route) {
      let url = window.location.protocol + "//" + window.location.hostname + '/callback/weixin/jssdk?url=' + encodeURIComponent(window.location.href.split('#')[0]); //去掉签名

      var self = this;
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
              'onMenuShareQZone',
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
        let shareData = {
          title: _title,
          desc: _desc,
          link: _route,
          imgUrl: _imgUrl,
          // 如果type是music或video，则要提供数据链接，默认为空
          success: function (res) {
            // 用户确认分享后执行的回调函数
            // logUtil.printLog("分享给朋友成功返回的信息为:", res);
            if (res.errMsg.toLowerCase().indexOf('appmessage:ok') != -1) {
              self.share_type = 1;
            }
            if (res.errMsg.toLowerCase().indexOf('timeline:ok') != -1) {
              self.share_type = 2;
            }
            // console.log('111', res);
            // 分享成功后通知后台
            self.$getShareLog(self.page_name, self.params, self.share_type);
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


    // 获取页面分享信息
    Vue.prototype.$getWxShareData = async function () {
      // 在微信端
      if (this.isWxLogin ||
        localStorage.getItem("isHuobaIosLogin") == "yes" ||
        localStorage.getItem("isHuobaAndroidLogin") == "yes" || true) {
        let _href = window.location.href.split('#')[1];
        let _name = _href.split('?')[0].toLowerCase();
        let _params = this.$getPageParams(_name);
        let _pageName = _params.page_name;

        this.page_name = _pageName;
        this.params = _params;

        if (!_pageName || _pageName == '' || !_params || _params == '') {
          return;
        }

        if (_pageName == "goods/detail" || _pageName == "page/get" || _pageName == "groupbuy/open/detail" || _pageName == "groupbuy/goods/detail" || _pageName == "activity/interest" || _pageName == "assist/index" || _pageName == "assist/index" || _pageName == "brand/index" || _pageName == "mall/index" || _pageName == "mall/goods/search" || _pageName == "brand/goods/search" || _pageName == "brand/goods/search" || _pageName == "brand/goods/search") {
          // 需要调分享的页面
          var tStamp = this.$getTimeStamp();
          let data = {
            page_name: _pageName,
            params: JSON.stringify(_params),
            home_id: localStorage.getItem('home_id'),
            timestamp: tStamp,
            version: "1.1"
          };
          data.sign = this.$getSign(data);
          let res = await WX_SHARE(data);
          if (res.hasOwnProperty("response_code")) {
            // 记录分享信息
            this.share_info = res.response_data.share_info;
            // 火把知识app端webview判断是否跳app原生页面
            this.$gotoApp(_name, _params);
            // 微信分享
            this.$getWxData(
              res.response_data.share_info.title,
              res.response_data.share_info.desc,
              res.response_data.share_info.pic,
              res.response_data.share_info.url
            );

          } else {
            this.$toast(res.error_message);
          }

        } else {
          // 火把知识app端webview判断是否跳app原生页面
          this.$gotoApp(_name, _params);
        }
      }
    }

    // 火把知识app端webview判断是否跳app原生页面
    Vue.prototype.$gotoApp = async function (_name, _params) {
      let tStamp = this.$getTimeStamp();
      let data = {
        page_name: _name,
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await PAGE_INFO(data);
      let _linkData = {};
      let _isJump = false;
      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.app_page_name && res.response_data.auto_jump == 1) {
          // 当app_page_name不为空，以及auto_jump值为1需要跳原生页面
          // 页面信息
          _linkData = this.$getPageParams(_name);
          _linkData.page_name = res.response_data.app_page_name;
          _isJump = true;
        }

        // console.log(888, {
        //   share_info: this.share_info,
        //   link_data: _linkData,
        //   params: _params,
        //   isJump: _isJump
        // });
        // 安卓
        if (localStorage.getItem("isHuobaAndroidLogin") == "yes") {
          window.JSWEB.RequestNative(JSON.stringify({
            share_info: this.share_info,
            link_data: _linkData,
            params: _params,
            isJump: _isJump
          }));
        }
        // ios
        if (localStorage.getItem("isHuobaIosLogin") == "yes") {
          window.webkit.messageHandlers.shareAndJump.postMessage({
            share_info: this.share_info,
            link_data: _linkData,
            params: _params,
            isJump: _isJump
          })
        }
      } else {
        this.$toast(res.error_message);
      }
    }

    // 不同页面不同参数信息
    Vue.prototype.$getPageParams = function (_name) {
      _name = _name.toLowerCase();
      let linkData = {
        page_name: _name
      };
      if (_name == '/custompage') {
        // 自定义装修页面
        linkData.page_name = 'page/get';
        if (this.$route.query.type) linkData.type = this.$route.query.type;
        if (this.$route.query.page_id) linkData.page_id = this.$route.query.page_id;
        if (this.$route.query.supplier_id) linkData.supplier_id = this.$route.query.supplier_id;

      } else if (_name == '/detail') {
        // 商品详情
        linkData.page_name = 'goods/detail';
        linkData.goods_id = this.$route.query.goods_id;
      } else if (_name == '/groupDetail') {
        // 拼团详情
        linkData.page_name = 'groupbuy/open/detail';
        linkData.open_id = parseInt(this.$route.query.open_id);
      } else if (_name == '/groupGoods') {
        // 实物商品拼团页面
        linkData.page_name = 'groupbuy/goods/detail';
        linkData.groupbuy_id = parseInt(this.$route.query.groupbuy_id);
        linkData.brand_id = this.$route.query.brand_id;//??
      } else if (_name == '/activity/interest') {
        // 问卷调查
        linkData.page_name = 'activity/interest';
      } else if (_name == '/album/detail') {
        // 专辑
        linkData.page_name = 'goods/detail';
        linkData.goods_id = this.$route.query.goods_id;
        linkData.pid = typeof(this.$route.query.pid) == 'object'? this.$route.query.pid[0]:this.$route.query.pid;
      } else if (_name == '/album/index') {
        // 专辑
        linkData.page_name = 'goods/detail';
        linkData.goods_id = this.$route.query.goods_id;
      } else if (_name == '/assist/active') {
        // 助力活动
        linkData.page_name = 'assist/index';
        linkData.launch_id = this.$route.query.launch_id;//??
        linkData.activity_id = this.$route.query.activity_id;
      } else if (_name == '/assist/help') {
        // 助力活动
        linkData.page_name = 'assist/index';
        linkData.launch_id = this.$route.query.launch_id;//??
        linkData.activity_id = this.$route.query.activity_id;
      } else if (_name == '/brand/index') {
        // 品牌
        linkData.page_name = 'brand/index';
        linkData.brand_id = this.$route.query.brand_id;
      } else if (_name == '/brand/result') {
        // 搜索结果
        switch (this.$route.query.type) {
          case "mall":
            linkData.page_name = "mall/goods/search";
            if (this.$route.query.goods_type) linkData.goods_type = this.$route.query.goods_type;
            if (this.$route.query.searchContent) linkData.searchContent = this.$route.query.searchContent;
            break;
          case "brand":
            linkData.page_name = "brand/goods/search";
            linkData.brand_id = this.$route.query.brand_id;
            linkData.searchContent = this.$route.query.searchContent;
            break;
          case "index":
            linkData.page_name = "brand/goods/search";
            linkData.brand_id = this.$route.query.brand_id;
            linkData.searchContent = this.$route.query.searchContent;
            break;
          case "all":
            linkData.page_name = "brand/goods/search";
            linkData.brand_id = this.$route.query.brand_id;
            linkData.searchContent = this.$route.query.searchContent;
            break;
        }
      } else if (_name == '/brand/detail/article') {
        // 文章
        linkData.page_name = 'goods/detail';
        linkData.goods_id = this.$route.query.goods_id;
        linkData.album_id = this.$route.query.album_id;
      } else if (_name == '/ebook/detail') {
        // 电子书
        linkData.page_name = 'goods/detail';
        linkData.goods_id = this.$route.query.goods_id;
      } else if (_name == '/ebook/reader') {
        // 电子书
        linkData.page_name = 'goods/detail';
        linkData.goods_id = this.$route.query.goods_id;
      } else if (_name == '/personal/order/detail') {
        // 订单详情
        linkData.page_name = '';
        linkData.order_id = this.$route.query.order_id;
      }

      return linkData;
    }

    // 分享成功后通知后台
    Vue.prototype.$getShareLog = async function (_pageName, _params, _shareType) {
      var tStamp = this.$getTimeStamp();
      let data = {
        page_name: _pageName,
        params: JSON.stringify(_params),
        share_type: _shareType,
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await WX_SHARE_LOG(data);

      console.log('shareLog:', res);
      if (res.hasOwnProperty("response_code")) {
      } else {
        this.$toast(res.error_message);
      }
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
    }

    // 计算时间戳
    Vue.prototype.$getTimeStamp = function () {
      let localTime = new Date().getTime();
      let timeStamp = parseInt((localTime + this.diffTime) / 1000);
      return timeStamp;
    }

    // 全局变量
    // 倒计时
    Vue.prototype.clock = null
    Vue.prototype.audioDuration = null
    Vue.prototype.videoDuration = null
    // 音频实时播放进度
    Vue.prototype.progressClock = null
    //用户支付并购买监测
    Vue.prototype.checkPayTime = null
    Vue.prototype.checkPayCount = 0

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
        }, 1000)
      } else {
        self.$toast('时间格式不正确')
      }
    }


    // 验证码倒计时，刷新保留当前手机倒计时时间
    // Vue.prototype.$countDown2 = function (cdata) {
    //   if (!localStorage.getItem('phone')) {
    //     localStorage.setItem('phone', cdata.phone);
    //   } else {
    //     if (cdata.phone != sessionStorage.getItem('phone') || cdata.time === 0) {
    //       sessionStorage.setItem('phone', cdata.phone)
    //       sessionStorage.setItem('second', 60);
    //       cdata.time = 60;
    //       clearInterval(this.clock)
    //     }
    //   }
    //   if (!localStorage.getItem('second')) {
    //     localStorage.setItem('second', cdata.time);
    //   }
    //
    //   let self = this
    //   let time = cdata.time
    //   if (typeof time === 'number') {
    //     this.clock = window.setInterval(() => {
    //       if (time === 0) {
    //         clearInterval(this.clock)
    //         return false
    //       }
    //       time--
    //       cdata.time = time;
    //       localStorage.setItem('second', cdata.time)
    //     }, 1000)
    //   } else {
    //     self.$toast('时间格式不正确')
    //   }
    // }

    Vue.prototype.$countDown2 = function (cdata) {
      if (!localStorage.getItem('phone')) {
        localStorage.setItem('phone', cdata.phone);
      } else {
        console.log('cdata.phone',cdata.phone);
        if (cdata.phone != localStorage.getItem('phone') || cdata.time === 0) {
          localStorage.setItem('phone', cdata.phone)
          localStorage.setItem('second', 60);
          cdata.time = 60;
          clearInterval(this.clock)
        }
      }
      if (!localStorage.getItem('second')) {
        localStorage.setItem('second', cdata.time);
      }

      let self = this
      let time = cdata.time
      if (typeof time === 'number') {
        this.clock = window.setInterval(() => {
          if (time === 0) {
            // localStorage.setItem('second', 60)
            clearInterval(this.clock)
            return false
          }
          time--
          cdata.time = time;
          localStorage.setItem('second', cdata.time)
          // console.log(cdata.time);
        }, 1000)
      } else {
        self.$toast('时间格式不正确')
      }
    }

    // 时间倒计时
    Vue.prototype.$timeCountDown = function (options) {
      let self = this
      let second = options.time
      let minute = second / 60 / 60 / 24
      console.log(897, options, second)
      if (typeof second === 'number') {
        if (minute > 1) {
          options.date = Math.floor(minute) + '天';
        } else {
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
        }
      } else {
        self.$toast('时间格式不正确')
      }

    }

    // 限时促销计算时间
    Vue.prototype.$countTime = function (endtime) {
      var self = this;
      var time1 = endtime;
      var d = time1 / 60 / 60 / 24;
      console.log('天数1',d)
      if (d >= 1 && d <= 3) {
        self.showDay = true;
        self.showTime = true;
        self.groupshowDay = true;
        self.show_delay = true;
        self.receive_time = Math.ceil(d)+'天'
        d = Math.floor(d);
        self.timeDataDesc = '距活动结束还剩' + d + '天';
        self.timeData = '距结束还剩' + d + '天';
        self.grouptimeData = d;
      } else if (d < 1 && d > 0) {
        self.showDay = false;
        self.showTime = true;
        self.groupshowDay = false;
        self.show_delay = true;
        this.clock = window.setInterval(() => {
          if (time1 === 0) {
            clearInterval(this.clock)
            self.returnPrice();
            // self.getGroupData();
            // self.getData();
            return false
          }
          time1--
          self.receive_time = Math.ceil(time1 / 60 / 60)+'小时'
          let h = Math.floor(time1 / 60 / 60)
          let m = Math.floor((time1 - h * 60 * 60) / 60)
          let s = time1 - (h * 60 * 60) - (m * 60)
          if (h < 10) h = '0' + h
          if (m < 10) m = '0' + m
          if (s < 10) s = '0' + s
          let res = h + ":" + m + ":" + s
          self.timeDataDesc = res;
          self.timeData = '距结束还剩' + res;
          self.timeH = h
          self.timeM = m
          self.timeS = s
        }, 1000)
      } else if (d > 3) {
        self.receive_time = Math.ceil(d)+'天'
        d = Math.floor(d);
        self.showTime = false;
        self.groupshowDay = true;
        self.timeDataDesc = '限时促销'
        self.timeData = '火把拼团'
        self.grouptimeData = d;
      } else if (d < 0) {
        self.timeData = '火把拼团'
      }
      console.log('delay',self.show_delay)
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
      // console.log(222,data);return
      var dataTmp = data;
      var __name = null;
      var dataRes = {};
      var queryTmp = {};

      switch (dataTmp.action) {
        // 商品详情
        case 'goods/detail':
          // 音/视频
          if (dataTmp.params.goods_type == 1 || dataTmp.params.goods_type == 2) {
            __name = 'albumdetail';
          }
          if (dataTmp.params.goods_type == 6) { // 文章
            __name = 'article';
          }
          if (dataTmp.params.goods_type == 9) { // 专辑
            __name = 'album';
          }
          if (dataTmp.params.goods_type == 3) { // 图书
            __name = 'detail';
          }
          if (dataTmp.params.goods_type == 4) { // 电子书
            __name = 'ebookdetail';
          }
          queryTmp.goods_id = parseInt(dataTmp.params.goods_id);
          if (dataTmp.params.album_id) queryTmp.album_id = parseInt(dataTmp.params.album_id);

          break;
        // 公号商品搜索结果页
        case 'brand/goods/search':
          __name = 'brandresult';
          queryTmp.brand_id = parseInt(dataTmp.params.brand_id);
          queryTmp.keywords = dataTmp.params.keywords;
          break;
        // 商城商品搜索结果页
        case 'mall/goods/search':
          __name = 'brandresult';
          queryTmp.supplier_id = parseInt(dataTmp.params.supplier_id);
          if (dataTmp.params.keywords) queryTmp.keywords = dataTmp.params.keywords;
          if (dataTmp.params.goods_type) queryTmp.goods_type = dataTmp.params.goods_type;
          if (dataTmp.params.brand_id) {
            queryTmp.brand_id = dataTmp.params.brand_id
          } else {
            queryTmp.isbrand_id = 'no'
          };
          if (dataTmp.params.tagids) queryTmp.tagids = dataTmp.params.tagids;
          if (dataTmp.params.goods_id) queryTmp.goods_id = dataTmp.params.goods_id;

          break;
        case 'search/result':
          __name = 'brandresult';
          queryTmp.supplier_id = parseInt(dataTmp.params.supplier_id);
          if (dataTmp.params.keywords) queryTmp.keywords = dataTmp.params.keywords;
          if (dataTmp.params.goods_type) queryTmp.goods_type = dataTmp.params.goods_type;
          if (dataTmp.params.cids) queryTmp.cids = dataTmp.params.cids;
          if (dataTmp.params.tagids) queryTmp.tagids = dataTmp.params.tagids;

          break;
        // 供应商商城首页
        case 'mall/index':
          __name = 'custompage';
          queryTmp.supplier_id = parseInt(dataTmp.params.supplier_id);
          queryTmp.type = 'mall';

          break;
        // 公号首页
        case 'brand/index':
          __name = 'brand';
          queryTmp.brand_id = parseInt(dataTmp.params.brand_id);

          break;
        //自定义商城页
        case 'page/get':
          __name = 'custompage';
          queryTmp.page_id = parseInt(dataTmp.params.page_id);
          break;
        //跳转外链
        case 'jump/url':
          __name = 'url'
          queryTmp.url = dataTmp.params.url;
          break;
        // 优惠券详情
        case 'ticket/link/detail':
          __name = 'couponreceive'
          queryTmp.ticket_id = dataTmp.params.ticket_id;
          break;
        default:
          break;
      }

      dataRes = {
        name: __name,
        query: queryTmp
      }
      return dataRes;
    }

    // 微信支付
    Vue.prototype.$onBridgeReady = function (_timestamp, _nonceStr, _package, _paySign, _orderId, _payMoney) {
      var self = this;


      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: self.appid, //公众号名称，由商户传入
          timeStamp: _timestamp.toString(), //时间戳，自1970年以来的秒数
          nonceStr: _nonceStr, //随机串
          package: _package,
          signType: "MD5", //微信签名方式：
          paySign: _paySign //微信签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {

            // 余额充值
            if (localStorage.getItem('routerLink').indexOf('/personal/remain/account') != -1) {
              self.$toast('充值成功~');
              // window.location.reload();
              if (self.$route.query.endAccountTo == 'return') {
                self.$router.replace({
                  name: "payaccount",
                  query: { goods_id: self.goods_id }
                })
              } else {
                self.$router.push({ name: "record" });
              }
            }
            // 商品购买  虚拟 / 实物
            else if (localStorage.getItem('routerLink').indexOf('/pay/account') != -1 || localStorage.getItem('routerLink').indexOf('/pay/index') != -1) {
              self.$toast('支付成功~');
              self.$router.replace({
                name: "paysuccess",
                query: {
                  order_id: _orderId,
                  pay_money: _payMoney,
                  open_id: self.open_id,
                }
              });
            }
            // 电子书余额充值
            else if (localStorage.getItem('routerLink').indexOf('/ebook/reader') != -1) {
              // self.$toast('支付成功~');
              // self.rechargeAddPay();
              setTimeout(function () {
                location.reload();
              }, 200);
              // if (this.checkPayCount < 10) {
              //   self.isLoading = true;
              //   this.checkPayTime = window.setInterval(() => {
              //     console.log("每1s更新");
              //     self.$checkPay(self.payId,self.goods_id,self.chapter_id);
              //     self.checkPayCount++;
              //   }, 1000);
              // } else {
              //   window.clearInterval(this.checkPayTime);
              //   self.isLoading = false;
              // }
            }
            else if (localStorage.getItem('routerLink').indexOf('/ebook/detail') != -1) {
              // self.$toast('支付成功~');
              // self.rechargeAddPay();
              setTimeout(function () {
                location.reload();
              }, 200);

              // if (this.checkPayCount < 10) {
              //   self.isLoading = true;
              //   this.checkPayTime = window.setInterval(() => {
              //     console.log("每1s更新");
              //     self.$checkPay(self.payId,self.goods_id,null);
              //     self.checkPayCount++;
              //   }, 1000);
              // } else {
              //   window.clearInterval(this.checkPayTime);
              //   self.isLoading = false;
              // }
            }
            // console.log(res.err_msg);
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          } else {
            console.log(res);
          }
        }
      );

    }
    // Vue.prototype.$checkcheck = function(){
    //   var self = this
    //   self.rechargeAddPay()
    // }
    //监测购买状态
    Vue.prototype.$checkPay = async function (_payid, _goods_id, _chapter_id) {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0",
        pay_id: _payid,
      };
      data.sign = this.$getSign(data);
      let res = await CASHIER_PAY_CHECK(data);
      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.pay_state == 1) {
          window.clearInterval(this.checkPayTime);
          this.checkPayCount = 0;
          location.reload();
          this.$toast("购买成功");
        } else {
          if (this.checkPayCount >= 10) {
            window.clearInterval(this.checkPayTime);
            this.$toast("购买失败");
            if (localStorage.getItem('routerLink').indexOf('/ebook/detail') != -1) {
              this.$router.push({
                name: "ebookdetail",
                query: {
                  goods_id: _goods_id,
                  isSuccessPay: 'flase'
                }
              })
            } else {
              this.$router.push({
                name: "ebookreader",
                query: {
                  goods_id: _goods_id,
                  chapter_id: _chapter_id,
                  isSuccessPay: 'flase'
                }
              })
            }
            location.reload();
          }
        }
      } else {
        window.clearInterval(this.checkPayTime);
        this.$toast("购买失败");
        if (localStorage.getItem('routerLink').indexOf('/ebook/detail') != -1) {
          this.$router.push({
            name: "ebookdetail",
            query: {
              goods_id: _goods_id,
              isSuccessPay: 'flase'
            }
          })
        } else {
          this.$router.push({
            name: "ebookreader",
            query: {
              goods_id: _goods_id,
              chapter_id: _chapter_id,
              isSuccessPay: 'flase'
            }
          })
        }
        location.reload();
      }
    }
    // 省市区
    Vue.prototype.$getAddressData = async function () {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await ADDRESS(data);
      if (res.hasOwnProperty("response_code")) {
        var pstr = new Array();
        var cstr = new Array();
        var ctstr = new Array();

        if (res.response_data) {
          for (let i = 0; i < res.response_data.length; i++) {
            // console.log('省：', res.response_data[i]);
            pstr +=
              '"' +
              res.response_data[i].id +
              "0000" +
              '"' +
              ":" +
              '"' +
              res.response_data[i].name +
              '"' +
              ",";

            // console.log('省str：', pstr)

            // 市
            if (res.response_data[i].city) {
              for (let j = 0; j < res.response_data[i].city.length; j++) {
                // console.log("市：", res.response_data[i].city[j]);
                cstr +=
                  '"' +
                  res.response_data[i].city[j].id +
                  "00" +
                  '"' +
                  ":" +
                  '"' +
                  res.response_data[i].city[j].name +
                  '"' +
                  ",";

                // console.log('市str：', cstr)

                // 区
                if (res.response_data[i].city[j].county) {
                  for (
                    let k = 0;
                    k < res.response_data[i].city[j].county.length;
                    k++
                  ) {
                    ctstr +=
                      '"' +
                      res.response_data[i].city[j].county[k].id +
                      '"' +
                      ":" +
                      '"' +
                      res.response_data[i].city[j].county[k].name +
                      '"' +
                      ",";
                  }
                }
              }
            }
          }
          // console.log('区str：', ctstr)

          // 省
          this.provinceList = this.$strToJson(pstr);
          // 市
          this.cityList = this.$strToJson(cstr);
          // 区
          this.countyList = this.$strToJson(ctstr);

          this.areaList.province_list = this.provinceList;
          this.areaList.city_list = this.cityList;
          this.areaList.county_list = this.countyList;

          console.log("省市区：", this.areaList.county_list);
        }
      } else {
        this.$toast(res.error_message);
      }
    }

    // 字符串转换成json格式
    Vue.prototype.$strToJson = function (str) {
      var arr1 = new Array();
      var arr2 = new Array();
      var __json = new Array();

      arr1 = str.split(",");
      arr2 = "{" + arr1 + "}";
      __json = eval("(" + arr2 + ")");

      // console.log('__json:', __json);
      return __json;
    }

    // 跳转App链接，微信端引导跳转app下载
    Vue.prototype.$linkToApp = function () {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var _ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      var _android = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      console.log(u, app, _ios, _android);
      if (_ios) {
        window.location.href =
          "https://apps.apple.com/cn/app/%E7%81%AB%E6%8A%8A%E7%9F%A5%E8%AF%86/id1473766311";
        // www.huoba.net://huoba
      } else if (_android) {
        window.location.href =
          "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
      }
    }

    // 获取当前设备信息，微信端第一次访问提示授权
    Vue.prototype.$setLoginData = async function () {
      // 微信授权状态
      localStorage.setItem("gotoLogin", "no");
      // 微信端
      localStorage.setItem("isWxLogin", "no");
      // 针对webview:火把的ios端
      localStorage.setItem("isHuobaIosLogin", "no");
      // 针对webview:火把的Android端
      localStorage.setItem("isHuobaAndroidLogin", "no");
      // 是否设置过头信息
      localStorage.setItem("hasHeader", "no");
      var u = navigator.userAgent;
      var _ios = u.toLowerCase().indexOf("huoba:ios") > -1;
      var _android = u.toLowerCase().indexOf("huoba:android") > -1;
      var _wx = u.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
      var _hasHeader = u.toLowerCase().indexOf("huoba:") > -1;
      if (_hasHeader) localStorage.setItem("hasHeader", "yes");
      if (_ios) {
        // 针对webview:火把的ios端
        localStorage.setItem("isHuobaIosLogin", "yes");
      } else if (_android) {
        // 针对webview:火把的Android端
        localStorage.setItem("isHuobaAndroidLogin", "yes");
      } else if (_wx) {
        // 微信端
        // 未授权时微信端访问授权页面
        localStorage.setItem("isWxLogin", "yes");
        if (
          localStorage.getItem("openid") == "undefined" ||
          localStorage.getItem("openid") == undefined ||
          localStorage.getItem("openid") == "null" ||
          localStorage.getItem("openid") == null ||
          localStorage.getItem("nickname") == "null" ||
          localStorage.getItem("nickname") == null ||
          localStorage.getItem("unionid") == "null" ||
          localStorage.getItem("unionid") == null ||
          localStorage.getItem("headimg") == "null" ||
          localStorage.getItem("headimg") == null
        ) {
          // 微信登录 code
          this.$getWxCode();
          console.log('测试code码',this.wxCodeStr)
          // 微信授权
          if (this.wxCodeStr == "") {
            var this_count = Number(localStorage.getItem("get_count"));
            if (this_count < 2) {
              this_count++;
              localStorage.setItem("get_count", this_count);
              this.$wxLogin();
            } else {
              localStorage.setItem("get_count", 0);
            }
          }
          if (this.wxCodeStr.length > 6) {
            let url =
              window.location.protocol +
              "//" +
              window.location.hostname +
              "/callback/weixin/Userinfo?code=" +
              this.wxCodeStr;
            // 获取 openid，nickname
            var self = this;
            axios
              .get(url)
              .then(function (response) {
                if (
                  response.data.hasOwnProperty("code") &&
                  response.data.code == "1000"
                ) {
                  console.log(response.data.msg);
                } else {
                  localStorage.setItem("openid", response.data.openid);
                  localStorage.setItem("nickname", response.data.nickname);
                  localStorage.setItem("unionid", response.data.unionid);
                  localStorage.setItem("headimg", response.data.headimgurl);
                  self.wxCodeStr = "";
                  window.location.href =
                    window.location.protocol +
                    "//" +
                    window.location.hostname +
                    "/#" +
                    window.location.href.split("#")[1];
                }
              })
              .catch(function (error) {
                self.fetchError = error;
                console.log("error:", error);
              });
          } else {
            console.log("未获取到code号码",this.wxCodeStr);
          }
        }
      }
    }

    // 配合正则，表单字符指定位置添加空格
    Vue.prototype.$inputSpace = function (code, type) {
      // 表单输入监控删除动作
      let self = this;
      $("input").on("keydown", function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 8) {
          self.$store.state.isDel = true;
        }
      });

      var str = "";
      var _bool = false;
      var _len = code.length;
      switch (type) {
        // 八位验证码，第五位加空格
        case 'code':
          Array.from(code, (item, index) => {
            if (index == 3) {
              str += item + " ";
            } else {
              str += item;
            }
          });
          Array.from(str, (item, index) => {
            if (item == " " && index == _len) {
              _bool = true;
            }
          });
          break;
        // 手机号码，第四位以及第八位加空格 150 0000 0000
        case 'tel':
          // 添加空格
          Array.from(code, (item, index) => {
            if (index == 2 || index == 6) {
              str += item + " ";
            } else {
              str += item;
            }
          });
          // 去除空格
          Array.from(str, (item, index) => {
            if (item == " " && (str.length == 4 || str.length == 9)) {
              _bool = true;
            }
          });
          break;
        default:
          break;
      }

      if (_bool && this.$store.state.isDel) {
        str = str.substring(0, str.length - 1);
      }
      return str;
    }

  }
}
