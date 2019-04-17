import Vue from 'vue'
import Router from 'vue-router'
// 登录/注册
import login from '@/pages/login/index'
import password from '@/pages/login/password'
import phone from '@/pages/login/phone'
import register from '@/pages/login/register'

// 个人中心

// 我的余额
import remain from '@/pages/personal/remain/index'
import record from '@/pages/personal/remain/record'
import account from '@/pages/personal/remain/account'
import detail from '@/pages/personal/remain/detail'

// 首页
import personal from '@/pages/personal/index'
import collect from '@/pages/personal/collect'
import focus from '@/pages/personal/focus'
import history from '@/pages/personal/history'

// 我的购买
import orderlist from '@/pages/personal/order/list'
import orderdetail from '@/pages/personal/order/detail'
import orderinvoice from '@/pages/personal/order/invoice'

import loginbf from '@/pages/loginBF'

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
      path: '/personal/remain/index',
      name: 'remain',
      component: remain
    },
    {
      path: '/personal/remain/record',
      name: 'record',
      component: record
    },
    {
      path: '/personal/remain/account',
      name: 'account',
      component: account
    },
    {
      path: '/personal/remain/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/personal/order/detail',
      name: 'orderdetail',
      component: orderdetail
    },
    {
      path: '/personal/order/list',
      name: 'orderlist',
      component: orderlist
    },
    {
      path: '/personal/order/invoice',
      name: 'orderinvoice',
      component: orderinvoice
    },
    {
      path: '/loginBF',
      name: 'loginbf',
      component: loginbf
    }
  ]
})
