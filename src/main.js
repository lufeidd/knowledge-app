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

// vant
// import 'vant/lib/index.css'

// cookies
import VueCookies from 'vue-cookies'

//  引入接口
import { SERVER_TIME } from "./apis/public";

import {
  Field, Toast, Button, Checkbox, CheckboxGroup, Row, Col, Slider, Uploader,
  Cell, CellGroup,
  Icon, Popup, DatetimePicker, SwipeCell, Dialog, Actionsheet, AddressEdit, Lazyload, SwitchCell, Search, Tag, Circle,
  Tab, Tabs,
  GoodsAction, GoodsActionBigBtn, GoodsActionMiniBtn,
  Step, Steps,
  List, Stepper, SubmitBar,
  Swipe, SwipeItem,
  Area,
  Rate,
  PasswordInput, NumberKeyboard,
  Pagination
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
Vue.use(GoodsAction).use(GoodsActionBigBtn).use(GoodsActionMiniBtn)
Vue.use(Step).use(Steps)
Vue.use(List)
Vue.use(Stepper)
Vue.use(SubmitBar)
Vue.use(Swipe).use(SwipeItem)
Vue.use(Area)
Vue.use(Rate)
Vue.use(PasswordInput).use(NumberKeyboard)
Vue.use(Pagination)

Vue.use(plugin)

// swiper
Vue.use(VueAwesomeSwiper)

// cropper
Vue.use(VueCropper)

// JSEncrypt
// Vue.prototype.$jsEncrypt = JsEncrypt

// 让ajax携带cookie
// axios.defaults.withCredentials = true;

// md5加密
Vue.prototype.$md5 = md5;

// cookies
Vue.use(VueCookies)

Vue.config.productionTip = false

// 注册一个全局前置守卫,确保要调用 next 方法，否则钩子就不会被 resolved
router.beforeEach((to, from, next) => {
  next();

  // //判断该页面有 brand_id
  // if (from.query.brand_id) {
  //   //路由切换时，如果没有就添加，有就跳过执行，添加固定参数
  //   if (!to.query.brand_id) {
  //     //准备一个跳转的query对象
  //     let query = to.query
  //     query.brand_id = from.query.brand_id
  //     next({
  //       path: to.path,
  //       query: query
  //     })
  //   } else {
  //     next()
  //   }
  // } else {
  //   next()
  // }

  /* 路由发生变化修改页面 title */
  if (to.meta.title) {
    document.title = to.meta.title
    next()
  }
  next()

  //如果需要跳转 ，往下走（1）
  if (to.meta.requireAuth) {
     //判断是否登录过，如果有登陆过，说明有token,或者token未过期，可以跳过登录（2）
    if (true) { 
      //判断下一个路由是否为要验证的路由（3）          
      if (to.path === '/login/index') {   
        // 如果是直接跳到首页， 
        next('/brand/index');         
      } else {   
        //如果该路由不需要验证，那么直接往后走          
        next();
      }
    } else {
      //如果没有登陆过，或者token 过期， 那么跳转到登录页
      console.log('没有');      
      next('/login/index');
    }
  } else { 
    //不需要跳转，直接往下走                          
    next();
  }
  next()

  // 重定向功能，为解决ios微信上复制链接功能不能复制到动态路由问题
  // 获取地址前段部分，不算参数
  var replaceUrl = window.location.href.split('#')[0] + '#' + to.path;
  var index = 0; // 索引初始化
  // 给replaceUrl拼接参数
  for (var i in to.query) {
    // 判断是否等于第一个参数
    if (index == 0) {
      // 拼接地址第一个参数，添加“?”号
      replaceUrl += '?' + i + '=' + to.query[i]
    } else {
      // 拼接地址非第一个参数，添加“&”号
      replaceUrl += '&' + i + '=' + to.query[i]
    }
    index++; // 索引++
  }
  //判断该页面有 brand_id
  if (from.query.brand_id) {
    // 路由切换时，如果没有就添加，有就跳过执行，添加固定参数
    if (!to.query.brand_id) {
      if(replaceUrl.indexOf("?") != -1) {
        replaceUrl += '&brand_id=' + from.query.brand_id;
      } else {
        replaceUrl += '?brand_id=' + from.query.brand_id;
      }
      next()
    }
  } else {
    next()
  }
  console.log('routerLink:', replaceUrl);
  window.location.replace(replaceUrl); // 重定向跳转
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
