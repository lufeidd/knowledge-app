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
  GoodsActionBigBtn, GoodsActionMiniBtn,
  Step, Steps,
  List, Stepper, SubmitBar,
  Swipe, SwipeItem,
  Area,
  Rate,
  PasswordInput, NumberKeyboard,
  Loading,
  Pagination, RadioGroup, Radio, Picker
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

B、sessionStorage
  1、isHuobaAndroidLogin：记录当前是针对webview:火把的Android端
  2、isHuobaIosLogin：记录当前是针对webview:火把的ios端
  3、isWxLogin：记录当前是微信端
  4、hasHeader：记录是否已经设置过头信息
  5、gotoLogin：记录是否允许微信授权

*/


// 注册一个全局前置守卫,确保要调用 next 方法，否则钩子就不会被 resolved
router.beforeEach((to, from, next) => {
  next();
  // 记录页面进入方式，gzh：来自公众号
  if(localStorage.getItem('routerLink').indexOf('linkFrom=gzh')) {
    localStorage.setItem('linkFrom', 'gzh');
    next();
  }
  next()
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
  // 自定义页面跳自定义页面执行刷新动作
  if (from.path.toLocaleLowerCase() == '/custompage' && from.path.toLocaleLowerCase() == to.path.toLocaleLowerCase()) {
    window.location.reload();
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
  // 给replaceUrl拼接参数
  for (var i in to.query) {
    // 判断是否等于第一个参数
    if (index == 0) {
      // 拼接地址第一个参数，添加“?”号
      replaceUrl += '?' + i + '=' + to.query[i];
    } else {
      // 拼接地址非第一个参数，添加“&”号
      replaceUrl += '&' + i + '=' + to.query[i];
    }
    index++; // 索引++
  }
  next()
  //判断该页面有 brand_id
  if (from.query.brand_id) {
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

  // 针对未调用接口页面引导app端打开
  // 网页端跳转 404 页面
  next();

  // 需要微信端打开，引导微信内打开
  if (sessionStorage.getItem("isWxLogin") == "no") {
    if (to.meta.isWxLogin) {
      replaceUrl = window.location.href.split('#')[0] + '#/404?msg=请在微信端打开~';
      next();
    }
    next();
  }
  next();

  // 引导app端打开
  if (sessionStorage.getItem("isHuobaIosLogin") == "no" && sessionStorage.getItem("isHuobaAndroidLogin") == "no") {
    next();
    if (to.meta.isAppLogin) {
      replaceUrl = window.location.href.split('#')[0] + '#/404?msg=请在app端打开~';
      next();
    }

    next();
  }

  next()
  window.location.replace(replaceUrl); // 重定向跳转

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,  // 使用store
  components: { App },
  template: '<App/>'
})
