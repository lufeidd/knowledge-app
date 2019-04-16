// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'

// 自定义插件
import _plugin from './plugin/index'

// api
import _api from './api/index'

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
import { Field, NavBar, Toast, Button, Checkbox, CheckboxGroup, Row, Col, Slider, Uploader, Cell, CellGroup, SwipeCell, Dialog, Icon, Popup, DatetimePicker } from 'vant'
Vue.use(Field)
Vue.use(NavBar)
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

Vue.use(_plugin)
// Vue.use(api)
// 挂载，调用全局变量
Vue.prototype.api = _api

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
