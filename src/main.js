// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'

// 自定义插件
import plugin from './plugin/index'

// vant
// import 'vant/lib/index.css'
import { Field, NavBar, Toast, Button, Checkbox, CheckboxGroup, Row, Col } from 'vant'
Vue.use(Field)
Vue.use(NavBar)
Vue.use(Toast)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Row)
Vue.use(Col)

Vue.use(plugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
