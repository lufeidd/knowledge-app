import Vue from 'vue'
import Router from 'vue-router'

// 登录/注册
import login from '@/pages/login/index'
import password from '@/pages/login/password'
import phone from '@/pages/login/phone'
import register from '@/pages/login/register'
import prototype from '@/pages/login/prototype'

// 个人中心 - 我的余额
import remain from '@/pages/personal/remain/index'
import record from '@/pages/personal/remain/record'
import account from '@/pages/personal/remain/account'
import remaindetail from '@/pages/personal/remain/detail'

// 个人中心 - 首页
import personal from '@/pages/personal/index'
import collect from '@/pages/personal/collect'
import focus from '@/pages/personal/focus'
import history from '@/pages/personal/history'

// 个人中心 - 我的购买
// 下单
import orderlist from '@/pages/personal/order/list'
import orderdetail from '@/pages/personal/order/detail'
import orderinvoice from '@/pages/personal/order/invoice'
import orderresult from '@/pages/personal/order/result'
// 退款
import refundedit from '@/pages/personal/order/edit'
import logistics from '@/pages/personal/order/logistics'
import ongoing from '@/pages/personal/order/ongoing'
import refundtype from '@/pages/personal/order/type'
import refundone from '@/pages/personal/order/refund/one'
import refundtwo from '@/pages/personal/order/refund/two'
import refundthree from '@/pages/personal/order/refund/three'
// 评价
import ordercomment from '@/pages/personal/order/comment/index'
import commentpunish from '@/pages/personal/order/comment/punish'
import commentsuccess from '@/pages/personal/order/comment/success'

// 个人中心 - 设置
import set from '@/pages/personal/set/index'
import address from '@/pages/personal/set/address'
import addresslist from '@/pages/personal/set/list'
import info from '@/pages/personal/set/info'
import safe from '@/pages/personal/set/safe'
import send from '@/pages/personal/set/send'
import about from '@/pages/personal/set/about'
import cropper from '@/pages/personal/set/cropper'
import bind from '@/pages/personal/set/bind'
import cancel from '@/pages/personal/set/cancel'

// 个人中心 - 帮助与反馈
import help from '@/pages/personal/help/index'
import helpdetail from '@/pages/personal/help/detail'
import feedback from '@/pages/personal/help/feedback'

// 个人中心 - 我的评论
import comment from '@/pages/personal/comment/index'

// 搜索
import search from '@/pages/search'

// 专辑
import album from '@/pages/album/index'
import albumdetail from '@/pages/album/detail'
import player from '@/pages/album/player'

// 品牌
import mall from '@/pages/brand/mall'
import article from '@/pages/brand/detail/article'
import book from '@/pages/brand/detail/book'
import brandresult from '@/pages/brand/result'
import brand from '@/pages/brand/index'

// 购物车
import cart from '@/pages/cart'

// 商品详情
import detail from '@/pages/detail'

// 我的订单
import orderconfirm from '@/pages/order/confirm'
import orderconfirmdetail from '@/pages/order/detail'

// 支付
import pay from '@/pages/pay/index'
import payaccount from '@/pages/pay/account'
import paysuccess from '@/pages/pay/success'

Vue.use(Router)

export default new Router({
  routes: [
    // 登录/注册
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
      path: '/login/prototype',
      name: 'prototype',
      component: prototype
    },
    // 个人中心 - 首页
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
    // 个人中心 - 我的余额
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
      name: 'remaindetail',
      component: remaindetail
    },
    // 个人中心 - 我的购买 - 下单
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
      path:'/personal/order/result',
      name:'orderresult',
      component: orderresult
    },
    // 个人中心 - 我的购买 - 评价
    {
      path: '/personal/order/comment/index',
      name: 'ordercomment',
      component: ordercomment
    },
    {
      path: '/personal/order/comment/punish',
      name: 'commentpunish',
      component: commentpunish
    },
    {
      path: '/personal/order/comment/success',
      name: 'commentsuccess',
      component: commentsuccess
    },
    // 个人中心 - 我的购买 - 退款
    {
      path: '/personal/order/edit',
      name: 'refundedit',
      component: refundedit
    },
    {
      path: '/personal/order/logistics',
      name: 'logistics',
      component: logistics
    },
    {
      path: '/personal/order/ongoing',
      name: 'ongoing',
      component: ongoing
    },
    {
      path: '/personal/order/type',
      name: 'refundtype',
      component: refundtype
    },
    {
      path: '/personal/order/refund/one',
      name: 'refundone',
      component: refundone
    },
    {
      path: '/personal/order/refund/two',
      name: 'refundtwo',
      component: refundtwo
    },
    {
      path: '/personal/order/refund/three',
      name: 'refundthree',
      component: refundthree
    },
    // 个人中心 - 设置
    {
      path: '/personal/set/index',
      name: 'set',
      component: set
    },
    {
      path: '/personal/set/address',
      name: 'address',
      component: address
    },
    {
      path: '/personal/set/list',
      name: 'addresslist',
      component: addresslist
    },
    {
      path: '/personal/set/info',
      name: 'info',
      component: info
    },
    {
      path: '/personal/set/safe',
      name: 'safe',
      component: safe
    },
    {
      path: '/personal/set/send',
      name: 'send',
      component: send
    },
    {
      path: '/personal/set/about',
      name: 'about',
      component: about
    },
    {
      path: '/personal/set/cropper',
      name: 'cropper',
      component: cropper
    },
    {
      path: '/personal/set/bind',
      name: 'bind',
      component: bind
    },
    {
      path: '/personal/set/cancel',
      name: 'cancel',
      component: cancel
    },
    // 个人中心 - 帮助与反馈
    {
      path: '/personal/help/index',
      name: 'help',
      component: help
    },
    {
      path: '/personal/help/detail',
      name: 'helpdetail',
      component: helpdetail
    },
    {
      path: '/personal/help/feedback',
      name: 'feedback',
      component: feedback
    },
    // 个人中心 - 我的评论
    {
      path: '/personal/comment/index',
      name: 'comment',
      component: comment
    },
    // 搜索
    {
      path: '/search',
      name: 'search',
      component: search
    },
    // 专辑
    {
      path: '/album/index',
      name: 'album',
      component: album
    },
    {
      path: '/album/detail',
      name: 'albumdetail',
      component: albumdetail
    },
    {
      path: '/album/player',
      name: 'player',
      component: player
    },
    // 品牌
    {
      path: '/brand/mall',
      name: 'mall',
      component: mall
    },
    {
      path: '/brand/detail/article',
      name: 'article',
      component: article
    },
    {
      path: '/brand/detail/book',
      name: 'book',
      component: book
    },
    {
      path: '/brand/result',
      name: 'brandresult',
      component: brandresult
    },
    {
      path: '/brand/index',
      name: 'brand',
      component: brand
    },
    // 购物车
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    // 商品详情
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },

    // 我的订单
    {
      path: '/order/confirm',
      name: 'orderconfirm',
      component: orderconfirm
    },
    {
      path: '/order/detail',
      name: 'orderconfirmdetail',
      component: orderconfirmdetail
    },

    // 支付
    {
      path: '/pay/index',
      name: 'pay',
      component: pay
    },
    {
      path: '/pay/account',
      name: 'payaccount',
      component: payaccount
    },
    {
      path: '/pay/success',
      name: 'paysuccess',
      component: paysuccess
    }
  ]
})
