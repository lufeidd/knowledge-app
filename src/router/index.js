import Vue from 'vue'
import Router from 'vue-router'
// 登录/注册
import login from '@/pages/login'
import password from '@/pages/password'
import phone from '@/pages/phone'
import register from '@/pages/register'
// 个人中心
import personal from '@/pages/personal'
import collect from '@/pages/collect'
import focus from '@/pages/focus'
import history from '@/pages/history'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/password',
      name: 'password',
      component: password
    },
    {
      path: '/phone',
      name: 'phone',
      component: phone
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal
    },
    {
      path: '/collect',
      name: 'collect',
      component: collect
    },
    {
      path: '/history',
      name: 'history',
      component: history
    },
    {
      path: '/focus',
      name: 'focus',
      component: focus
    },
  ]
})
