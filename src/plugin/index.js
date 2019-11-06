import crypto from "crypto";
import axios from 'axios'
import qs from "Qs";

// 微信分享，引入sdk
import wx from 'weixin-js-sdk';

//  引入时间戳接口
// import req from "./../apis/http.js";
import { SERVER_TIME, WX_SHARE, WX_SHARE_LOG, ADDRESS, CASHIER_PAY_CHECK } from "./../apis/public.js";
import { LOGIN_PARTERNER } from "./../apis/passport.js";

// 支持await async
// import regeneratorRuntime from './../regenerator-runtime/runtime.js';

// 时间戳
// export const SERVER_TIME = params => req('post', '/timestamp', params);

export default {
  install: function (Vue, options) {

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

    // 存储第三方登录
    Vue.prototype.wxCodeStr = '';
    Vue.prototype.appid = "wx0980638eef192092";

    // 获取第三方微信登录
    Vue.prototype.$getWxCode = async function () {
      // 获取微信登录授权code
      var str = window.location.href;
      console.log('str', str)
      str = str.split("#")[0];
      if (str.indexOf('code=') != -1) {
        var sIndex = str.split("#")[0].indexOf("code=") + 5;
        var eIndex = str.split("#")[0].indexOf("code=") + 37;

        // 存储第三方登录code
        this.wxCodeStr = str.substring(sIndex, eIndex);
        console.log('code:', this.wxCodeStr);
      }
    }
    Vue.prototype.$getWxLoginData = async function () {
      let url = window.location.protocol + "//" + window.location.hostname + "/callback/weixin/Userinfo?code=" + this.wxCodeStr;
      var self = this;
      // console.log('url:', url)
      axios
        .get(url)
        .then(function (response) {
          // console.log(response);
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
    Vue.prototype.$getLoginParterner = async function (_headimg, _unionid, _outerName, _type) {
      var tStamp = this.$getTimeStamp();
      let data = {
        outer_id: _unionid,
        outer_name: _outerName,
        header_pic: _headimg,
        timestamp: tStamp,
        type: _type,
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
          this.$router.replace({
            name: "bindphone",
            query: { bindtype: _type, outerId: _unionid }
          });
        }
        if (res.response_data.exist == 1) {
          // brand_id等信息
          var route = window.location.href.split('#')[1];
          var query = '';
          if (route.indexOf('?') != -1) {
            query = '?' + route.split('?')[1];
          }
          window.location.href = window.location.protocol + "//" + window.location.hostname + '/#/personal/index' + query;
          this.wxCodeStr = '';
          // console.log('from:', replaceUrl);
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
          // 分享成功后通知后台
          self.$getShareLog(_pageName, _params);

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
            console.log('111', res);
            console.log('shareData111:', shareData);

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
    Vue.prototype.$getWxShareData = async function (_pageName, _params) {
      var tStamp = this.$getTimeStamp();
      let data = {
        page_name: _pageName,
        params: _params,
        timestamp: tStamp,
        version: "1.1"
      };
      data.sign = this.$getSign(data);
      let res = await WX_SHARE(data);
      if (res.hasOwnProperty("response_code")) {
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

    }

    // 分享成功后通知后台
    Vue.prototype.$getShareLog = async function (_pageName, _params) {
      var tStamp = this.$getTimeStamp();
      let data = {
        page_name: _pageName,
        params: _params,
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
      // console.log('时间差：', this.diffTime);
    }

    // 计算时间戳
    Vue.prototype.$getTimeStamp = function () {
      let localTime = new Date().getTime();
      let timeStamp = parseInt((localTime + this.diffTime) / 1000);
      // console.log("时间戳:", timeStamp);
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
      let minute = second/60/60/24
      console.log(897,options,second)
      if (typeof second === 'number') {
        if(minute > 1){
          options.date = Math.floor(minute)+'天';
        }else{
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
    Vue.prototype.$countTime = function(endtime){
      var self = this;
      var time1 = endtime;
      var d = time1/60/60/24;
      if(d>=1 && d<=3){
        self.showDay = true;
        self.showTime = true;
        self.groupshowDay = true;
        d = Math.floor(d);
        self.timeDataDesc = '距活动结束还剩'+d+'天';
        self.timeData = '距结束还剩'+d+'天';
        self.grouptimeData = d;
      }else if(d < 1){
        self.showDay = false;
        self.showTime = true;
        self.groupshowDay = false;
        this.clock = window.setInterval(() => {
          if (time1 === 0) {
            clearInterval(this.clock)
            self.returnPrice();
            // self.getGroupData();
            // self.getData();
            return false
          }
          time1--
          let h = Math.floor(time1 / 60 / 60)
          let m = Math.floor((time1 - h * 60 * 60) / 60)
          let s = time1 - (h * 60 * 60) - (m * 60)
          if (h < 10) h = '0' + h
          if (m < 10) m = '0' + m
          if (s < 10) s = '0' + s
          let res = h + ":" + m + ":" + s
          self.timeDataDesc = res;
          self.timeData = res;
          self.timeH = h
          self.timeM = m
          self.timeS = s
        }, 1000)
      }else if(d > 3){
        d = Math.floor(d);
        self.showTime = false;
        self.groupshowDay = true;
        self.timeDataDesc = '限时促销'
        self.timeData = '火把拼团'
        self.grouptimeData = d;
      }
      // console.log(d,self.clock)
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
          if (dataTmp.params.brand_id){
            queryTmp.brand_id = dataTmp.params.brand_id
          }else{
            queryTmp.isbrand_id = 'no'
          } ;
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
          __name = 'mall';
          queryTmp.supplier_id = parseInt(dataTmp.params.supplier_id);

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
                  pay_money: _payMoney
                }
              });
            }
            // 电子书余额充值
            else if (localStorage.getItem('routerLink').indexOf('/ebook/reader') != -1) {
              // self.$toast('支付成功~');
              // self.rechargeAddPay();
              setTimeout(function() {
                location.reload();
              },200);
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
              setTimeout(function() {
                location.reload();
              },200);

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
    Vue.prototype.$checkPay = async function (_payid,_goods_id,_chapter_id) {
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
            if(localStorage.getItem('routerLink').indexOf('/ebook/detail') != -1){
              this.$router.push({
                name:"ebookdetail",
                query:{
                  goods_id:_goods_id,
                  isSuccessPay:'flase'
                }
              })
            }else{
              this.$router.push({
                name:"ebookreader",
                query:{
                  goods_id:_goods_id,
                  chapter_id:_chapter_id,
                  isSuccessPay:'flase'
                }
              })
            }
            location.reload();
          }
        }
      } else {
        // this.$toast(res.error_message);
        window.clearInterval(this.checkPayTime);
        this.$toast("购买失败");
        if(localStorage.getItem('routerLink').indexOf('/ebook/detail') != -1){
          this.$router.push({
            name:"ebookdetail",
            query:{
              goods_id:_goods_id,
              isSuccessPay:'flase'
            }
          })
        }else{
          this.$router.push({
            name:"ebookreader",
            query:{
              goods_id:_goods_id,
              chapter_id:_chapter_id,
              isSuccessPay:'flase'
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
                    // console.log("区：", res.response_data[i].city[j].county[k]);
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
                  // console.log('区str：', ctstr)
                }
              }
            }
          }

          // 省
          this.provinceList = this.$strToJson(pstr);
          // 市
          this.cityList = this.$strToJson(cstr);
          // 区
          this.countyList = this.$strToJson(ctstr);

          this.areaList.province_list = this.provinceList;
          this.areaList.city_list = this.cityList;
          this.areaList.county_list = this.countyList;
          console.log("省市区：", this.provinceList, this.cityList, this.countyList);
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

  }
}
