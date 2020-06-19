// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router/index'
import axios from 'axios'

// 自定义插件
import plugin from './plugin/index'

// swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// cropper
import VueCropper from 'vue-cropper'

//clipboard
import VueClipboard from 'vue-clipboard2'

// 加密方式
import JsEncrypt from 'jsencrypt'

// jquery
// import $ from 'jquery'

// 字体图标
import './style/iconfont/iconfont'

// 支持await async
import regeneratorRuntime from './regenerator-runtime/runtime';

// md5加密
import md5 from 'js-md5';

// cookies
import VueCookies from 'vue-cookies'

// 引入 store
import store from './store'

// 下载app
import download from './components/index'
// 快速导航
import nav from './components/index'
// 加载中
import loading from './components/index'
//版权
import copyRight from './components/index'

Vue.use(download)
Vue.use(nav)
Vue.use(loading)
Vue.use(copyRight)

// vant
// import Vant from 'vant';
// import 'vant/lib/index.css';

// Vue.use(Vant);

import {
  Field, Toast, Button, Checkbox, CheckboxGroup, Row, Col, Slider, Uploader,
  Cell, CellGroup,
  Icon, Popup, DatetimePicker, SwipeCell, Dialog,
  Actionsheet,
  AddressEdit, Lazyload, SwitchCell, Search, Tag, Circle,
  Tab, Tabs,
  GoodsAction,
  GoodsActionBigBtn,
  GoodsActionMiniBtn,
  Step, Steps,
  List, Stepper, SubmitBar,
  Swipe, SwipeItem,
  Area,
  Rate,
  PasswordInput, NumberKeyboard,
  Loading,
  Pagination, RadioGroup, Radio, Picker,
} from 'vant'
Vue.use(Field)
Vue.use(Toast)
Vue.use(Button)
Vue.use(Checkbox).use(CheckboxGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Slider)
Vue.use(Uploader)
Vue.use(Cell).use(CellGroup)
Vue.use(Icon)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(SwipeCell)
Vue.use(Dialog)
Vue.use(Actionsheet)
Vue.use(AddressEdit)
Vue.use(Lazyload)
Vue.use(SwitchCell)
Vue.use(Search)
Vue.use(Tag)
Vue.use(Tab).use(Tabs)
Vue.use(Circle)
Vue.use(GoodsAction)
Vue.use(GoodsActionBigBtn).use(GoodsActionMiniBtn)
Vue.use(Step).use(Steps)
Vue.use(List)
Vue.use(Stepper)
Vue.use(SubmitBar)
Vue.use(Swipe).use(SwipeItem)
Vue.use(Area)
Vue.use(Rate)
Vue.use(PasswordInput).use(NumberKeyboard)
Vue.use(Pagination)
Vue.use(Loading)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Picker)

// 插件
Vue.use(plugin)

// swiper
Vue.use(VueAwesomeSwiper)

// cropper
Vue.use(VueCropper)

// clipboard
Vue.use(VueClipboard)

// JSEncrypt
// Vue.prototype.$jsEncrypt = JsEncrypt

// 让ajax携带cookie
// axios.defaults.withCredentials = true;

// md5加密
Vue.prototype.$md5 = md5;

// cookies
Vue.use(VueCookies)

Vue.config.productionTip = false


/*

全局路由特殊情况处理

1、只能在微信端打开的页面
  meta: {
    isWxLogin: true
  }

2、只能在app端打开的页面
  meta: {
    isAppLogin: true
  }

3、必须登录才能访问的页面
  meta: {
    requireAuth: true
  }

4、不需要登录进入的页面，未登录状态，有触发到需要登录的动作，需要回退到原路径
  localStorage.getItem("defaultLink")


5、当前页跳转不需要刷新，默认刷新
  meta: {
    unreload: true
  }

本地数据存储

A、localStorage
  1、defaultLink：记录需要登录的页面路径（引导登录后回退到指定页面）
  2、routerLink：记录当前页面路径
  3、fromLink：记录来源路径
  4、miniAudio：记录迷你音频当前播放
  5、audioProgress：记录音频播放进度
  6、loginState：记录当前登录状态
  7、closeAudio：记录迷你音频展示状态
  8、cmts：记录历史搜索内容
  9、get_count：记录授权次数，最多3次
  10、linkFrom：记录页面进入方式，gzh：来自公众号
  11、home_id：记录原始页面，放置到快速导航入口
  12、isHuobaAndroidLogin：记录当前是针对webview:火把的Android端
  13、isHuobaIosLogin：记录当前是针对webview:火把的ios端
  14、isWxLogin：记录当前是微信端
  15、hasHeader：记录是否已经设置过头信息
  16、gotoLogin：记录是否允许微信第三方登录
  17、phone：记录验证码手机号
  18、second：记录验证码手机号对应倒计时
  19、isReload: 1為true，0為false
  20、orderCmts：记录订单历史搜索内容

路由参数

  1、nullPage=1：引导微信  2：app登录
  2、home_id=all/公号id，携带原始公号
  3、linkFrom=gzh链接来自公众号

*/

// 注册一个全局前置守卫,确保要调用 next 方法，否则钩子就不会被 resolved
router.beforeEach((to, from, next) => {
  next();
  // 存放页面来源地址
  if (from.path != to.path) {
    next();
    if (from.path == '/') {
      localStorage.setItem('fromLink', to.path); next();
    } else {
      localStorage.setItem('fromLink', from.path); next();
    }
    next();
  }
  next();
  /* 路由发生变化修改页面 title */
  if (to.meta.title) {
    document.title = to.meta.title;
    next()
  }
  next()

  // 重定向功能，为解决ios微信上复制链接功能不能复制到动态路由问题
  // 获取地址前段部分，不算参数
  var replaceUrl = window.location.href.split('#')[0] + '#' + to.path;

  // var _routeUrlSet = false;
  // let _url = window.location.href.split('#')[0]
  // if(_url.indexOf('?from=') > -1 && _url.indexOf('&isappinstalled=') > -1){
  //   replaceUrl = _url.split('?')[0] + '#' + to.path;
  // }
  // console.log('试试',replaceUrl)

  // 存放来源地址，如果未登录，进入登录页或者第三方绑定页不修改fromLink，回退到指定页面
  var index = 0; // 索引初始化

  // loginState 1: 已登录，0：未登录
  if (!localStorage.getItem('loginState')) localStorage.setItem('loginState', 0)
  var token = parseInt(localStorage.getItem('loginState'));
  next()
  // 判断页面是否需要登录，未登录则引导跳转到登录页
  if (to.meta.requireAuth) {
    next();
    // 非当前页面刷新，判断是否登录，未登录跳转到登录页面
    // 个人中心页面除个人中心首页其他页面当前刷新未登录都需要跳转到登录页面
    if (from.name != null || (from.name == null && to.name != 'personalIndex')) {
      // 判断是否登录过，如果有登陆过，说明有token,或者token未过期，可以跳过登录（2）
      // 未登录跳转到登录页面
      if (token != 1) {
        replaceUrl = window.location.href.split('#')[0] + '#' + '/login/index';
        next();
      } else {
        //如果该路由已登录，那么直接往后走     
        next();
      }
      next();
    }
    next();
  }
  next()

  // 记录原始店铺，放置到快速导航入口
  if (to.query.home_id) {
    localStorage.setItem('home_id', to.query.home_id);
    next();
  } else {
    next();
    if (!localStorage.getItem('home_id')) {
      next();
      if (to.query.brand_id) {
        localStorage.setItem('home_id', to.query.brand_id);
        next();
      } else {
        localStorage.setItem('home_id', 'all');
        next();
      }
      next();
    }
    next();
  }
  next()

  // 过滤路由参数
  for (var i in to.query) {
    var _bool = true;
    // route_arr.push({i:to.query[i]})
    if (i == 'home_id') {
      _bool = false;
      next()
    }
    next()
    // 记录完原始公号后路由去除home_id
    if (localStorage.getItem('isWxLogin') == 'yes') {
      next()
      // 微信端，将参数nullPage屏蔽
      // 非微信端，不用屏蔽nullPage
      if (i == 'nullPage') {
        _bool = false;
        next()
      }
      next()
    }
    next()
    if (_bool) {
      next()
      // 判断是否等于第一个参数
      if (index > 0) {
        // 拼接地址非第一个参数，添加“&”号
        replaceUrl += '&' + i + '=' + to.query[i];
        next()
      } else {
        replaceUrl += '?' + i + '=' + to.query[i];
        next()
      }
      index++; // 索引++
      next()
    }

    next()
  }
  // console.log('87',route_arr)
  next()
  //判断该页面有 brand_id
  if (from.query.brand_id) {
    next();
    // 路由切换时，如果没有就添加，有就跳过执行，添加固定参数
    if (!to.query.brand_id) {
      next()
      // 朋友圈   from=timeline&isappinstalled=0
      // 微信群   from=groupmessage&isappinstalled=0
      // 好友分享 from=singlemessage&isappinstalled=0
      if (replaceUrl.indexOf('timeline') != -1 || replaceUrl.indexOf('groupmessage') != -1 || replaceUrl.indexOf('singlemessage') != -1) {
        next()
        if (replaceUrl.split('#')[1].indexOf("?") != -1) {
          replaceUrl += '&brand_id=' + from.query.brand_id;
          next()
        } else {
          replaceUrl += '?brand_id=' + from.query.brand_id;
          next()
        }
      } else {
        next()
        if (replaceUrl.indexOf("?") != -1) {
          replaceUrl += '&brand_id=' + from.query.brand_id;
          next()
        } else {
          replaceUrl += '?brand_id=' + from.query.brand_id;
          next()
        }
      }
      next()
    }
  } else {
    next()
  }
  next()

  // 记录当前路由
  localStorage.setItem('routerLink', replaceUrl);
  next();
  // 记录页面进入方式，gzh：来自公众号
  if (localStorage.getItem('routerLink').indexOf('linkFrom=gzh') != -1) {
    localStorage.setItem('linkFrom', 'gzh');
    next();
  } else {
    next();
    localStorage.setItem('linkFrom', '');
    next();
  }
  next();

  // 不需要登录的页面，如果未登录，进入登录页或者第三方绑定页不修改defaultLink，回退到指定页面
  if (!localStorage.getItem('defaultLink')) {
    // 默认跳转到个人中心
    localStorage.setItem('defaultLink', window.location.href.split('#')[0] + '#' + '/personal/index');
    next();
  }
  next();
  if (!to.meta.requireAuth && token != 1 && !to.meta.noDefaultLink) {
    // defaultLink记录未登录跳转到登录页原页面，用来登录后回退
    localStorage.setItem('defaultLink', localStorage.getItem('routerLink'));
    next();
  }
  next();

  // 需要微信端打开，引导微信内打开
  if (to.meta.isWxLogin) {
    next();
    if (localStorage.getItem("isWxLogin") == "no") {
      next();
      if (replaceUrl.indexOf("nullPage") == -1) {
        next();
        if (replaceUrl.indexOf("?") == -1) {
          replaceUrl += '?nullPage=1';
          next();
        } else {
          replaceUrl += '&nullPage=1';
          next();
        }

        next();
      }
      next();
    }
    next();
  }
  next();
  // 引导app端打开
  if (to.meta.isAppLogin) {
    next();
    if (localStorage.getItem("isHuobaIosLogin") == "no" && localStorage.getItem("isHuobaAndroidLogin") == "no") {
      next();
      if (replaceUrl.indexOf("nullPage") == -1) {
        next();
        if (replaceUrl.indexOf("?") == -1) {
          replaceUrl += '?nullPage=2';
          next();
        } else {
          replaceUrl += '&nullPage=2';
          next();
        }

        next();
      }
      next();
    }
  }
  next();

  window.location.replace(replaceUrl); // 重定向跳转

  // 相同页面跳转刷新，除个别不需要刷新的页面外，比如brand/index
  // 从引导页回退需要刷新
  // 引导微信页复制链接在微信中打开链接需要刷新
  // from.path == to.path && !to.meta.unreload || !localStorage.getItem("isWxLogin") || from.fullPath.indexOf("nullPage=1") != -1

  // from.path == '/'  // 当前页刷新
  // from.path == to.path, from.path != to.path,不同页面跳转
  // from.path == to.path == /custompage 同类页面之间跳转，比如自定义页面跳自定义页面
  // /login/verification 解决手机文本域未收起跳转造成页面错位的问题
  next()
  // 當前頁刷新
  if(from.path == '/') {
    localStorage.setItem('isReload', '1');
    next();
  }
  next();
  if((from.path == '/custompage' && to.path == '/custompage') || (to.fullPath.indexOf("nullPage") != -1 && from.path != '/') || (to.path == '/login/verification' && from.path != '/') || (from.fullPath.indexOf("nullPage") != -1)){
    location.reload();
    next();
  }
  next();

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,  // 使用store
  components: { App },
  template: '<App/>'
})
