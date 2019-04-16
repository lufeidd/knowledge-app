import Vue from 'vue'
import Router from 'vue-router'
// 登录/注册
import login from '@/pages/login/index'
import password from '@/pages/login/password'
import phone from '@/pages/login/phone'
import register from '@/pages/login/register'

// 个人中心

//我的余额
import remain from '@/pages/remain/index'
import record from '@/pages/remain/record'
import account from '@/pages/remain/account'
import detail from '@/pages/remain/detail'

import personal from '@/pages/personal/index'
import collect from '@/pages/personal/collect'
import focus from '@/pages/personal/focus'
import history from '@/pages/personal/history'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login/index',
      name: 'login',
      component: login
    },
    {
      path: '/login/password',
      name: 'password',
      component: password
    },
    {
      path: '/login/phone',
      name: 'phone',
      component: phone
    },
    {
      path: '/login/register',
      name: 'register',
      component: register
    },
    {
      path: '/personal/index',
      name: 'personal/index',
      component: personal
    },
    {
      path: '/personal/collect',
      name: 'collect',
      component: collect
    },
    {
      path: '/personal/history',
      name: 'history',
      component: history
    },
    {
      path: '/personal/focus',
      name: 'focus',
      component: focus
    },
    {
      path: '/remain/index',
      name: 'remain',
      component: remain
    },
    {
      path: '/remain/record',
      name: 'record',
      component: record
    },
    {
      path: '/remain/account',
      name: 'account',
      component: account
    },
    {
      path: '/remain/detail',
      name: 'detail',
      component: detail
    }
  ]
})
