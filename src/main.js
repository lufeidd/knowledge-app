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

// vant
// import 'vant/lib/index.css'
import { Field, NavBar, Toast, Button, Checkbox, CheckboxGroup, Row, Col, Slider, Uploader } from 'vant'
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

Vue.use(_plugin)
// Vue.use(api)
// 挂载，调用全局变量
Vue.prototype.api = _api

// swiper
Vue.use(VueAwesomeSwiper)

// cropper
Vue.use(VueCropper)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
