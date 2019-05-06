// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'

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
Vue.prototype.$jsEncrypt = JsEncrypt

// md5加密
Vue.prototype.$md5 = md5;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
