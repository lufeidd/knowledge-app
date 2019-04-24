// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import qs from 'Qs'

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
import $ from 'jquery'

// 字体图标
import './style/iconfont/iconfont'

// vant
// import 'vant/lib/index.css'
import {
  Field, Toast, Button, Checkbox, CheckboxGroup, Row, Col, Slider, Uploader, Cell, CellGroup, SwipeCell, Dialog, Icon, Popup, DatetimePicker, Actionsheet, AddressEdit, Lazyload, SwitchCell, Search, Tag, Circle, Tab, Tabs, GoodsAction,
  GoodsActionBigBtn, GoodsActionMiniBtn, List, Stepper, SubmitBar, Swipe, SwipeItem
} from 'vant'
Vue.use(Field)
Vue.use(Toast)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Slider)
Vue.use(Uploader)
Vue.use(Cell)
Vue.use(CellGroup)
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
Vue.use(Circle)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(GoodsAction)
Vue.use(GoodsActionBigBtn)
Vue.use(GoodsActionMiniBtn)
Vue.use(List)
Vue.use(Stepper)
Vue.use(SubmitBar)
Vue.use(Swipe)
Vue.use(SwipeItem)

Vue.use(plugin)

// swiper
Vue.use(VueAwesomeSwiper)

// cropper
Vue.use(VueCropper)

// JSEncrypt
Vue.prototype.$jsEncrypt = JsEncrypt

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
