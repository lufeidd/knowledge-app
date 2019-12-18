import Vue from 'vue'
import Router from 'vue-router'

// 首页
import index from '@/pages/index'

// 登录/注册
import login from '@/pages/login/index'
import password from '@/pages/login/password'
import register from '@/pages/login/register'
import prototype from '@/pages/login/prototype'
import bindphone from '@/pages/login/bindphone'

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
import cropper from '@/pages/personal/set/cropper'
import bind from '@/pages/personal/set/bind'
// import cancel from '@/pages/personal/set/cancel'
import setpassword from '@/pages/personal/set/password'
import setphone from '@/pages/personal/set/phone'

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
import albumlist from '@/pages/album/list'

//电子书
import ebookreader from '@/pages/ebook/reader'
import ebookcatalog from '@/pages/ebook/catalog'
import ebookcomment from '@/pages/ebook/comment'
import ebookdetail from '@/pages/ebook/detail'
import ebookshelf from '@/pages/ebook/shelf'
import ebookpay from '@/pages/ebook/pay'
import ebookrecharge from '@/pages/ebook/recharge'

// 品牌
import mall from '@/pages/brand/mall'
import article from '@/pages/brand/detail/article'
import book from '@/pages/brand/detail/book'
import brandresult from '@/pages/brand/result'
import brand from '@/pages/brand/index'

//优惠券
import couponreceive from '@/pages/coupon/receive'
import couponmine from '@/pages/coupon/mine'
import couponresult from '@/pages/coupon/result'

// 购物车
import cart from '@/pages/cart'

// 商品详情
import detail from '@/pages/detail'

//拼团详情
import groupdetail from '@/pages/groupDetail'
// 我的订单
import orderconfirm from '@/pages/order/confirm'
import orderconfirmdetail from '@/pages/order/detail'

// 支付
import pay from '@/pages/pay/index'
import payaccount from '@/pages/pay/account'
import paysuccess from '@/pages/pay/success'

// 自定义装修商城页面
import custompage from '@/pages/customPage'

//实物商品拼团页面
import groupgoods from '@/pages/groupGoods'

// 404
import nullpage from '@/pages/404'

// 访问超时
import timeout from '@/pages/timeout'

// 助力活动
import assistactive from '@/pages/assist/active'
import assisthelp from '@/pages/assist/help'

//满减满折商品列表页
import multiresult from '@/pages/multiResult'

// 资源图书
import libraryindex from '@/pages/library/index'
import librarydetail from '@/pages/library/detail'

// 兑换活动
import codeIndex from '@/pages/redeem/codeIndex'
import codeInput from '@/pages/redeem/code/codeInput'
import appSuccess from '@/pages/redeem/result/appSuccess'
import wapSuccess from '@/pages/redeem/result/wapSuccess'
import appFail from '@/pages/redeem/result/appFail'
import wapFail from '@/pages/redeem/result/wapFail'
import redeemLogin from '@/pages/redeem/login'
import redeemGoods from '@/pages/redeem/goods'
import redeemCoupons from '@/pages/redeem/coupons'
import straightLinkIndex from '@/pages/redeem/straightLinkIndex'

Vue.use(Router)

export default new Router({
  // mode: 'history',  //把Router的mode修改为history模式,VueRouter默认的模式为HASH模式
  mode: 'hash',  //把Router的mode修改为history模式,VueRouter默认的模式为HASH模式
  // linkActiveClass: 'active',
  routes: [
    // 自定义装修商城页面
    {
      path: '/custompage',
      name: 'custompage',
      component: custompage,
    },
    // 404
    {
      path: '/404',
      name: 'nullpage',
      component: nullpage,
      meta: {
        title: '页面不见了',
      }
    },
    // 访问超时
    {
      path: '/timeout',
      name: 'timeout',
      component: timeout,
      meta: {
        title: '访问超时',
      }
    },
    // 根目录
    {
      path: '/',
      redirect: '/brand/index',
    },
    // 首页
    {
      path: '/index',
      name: 'index',
      component: index,
      meta: {
        title: '',
      },
    },
    // 登录/注册
    {
      path: '/login/index',
      name: 'login',
      component: login,
      meta: {
        title: '登录',
        noDefaultLink: true,  // 不记录在defaultLink中
        // requireAuth: true
      }
    },
    {
      path: '/login/password',
      name: 'password',
      component: password,
      meta: {
        title: '找回密码',
        noDefaultLink: true,  // 不记录在defaultLink中
        // requireAuth: true
      }
    },
    {
      path: '/login/register',
      name: 'register',
      component: register,
      meta: {
        title: '注册',
        noDefaultLink: true,  // 不记录在defaultLink中
        // requireAuth: true
      }
    },
    {
      path: '/login/prototype',
      name: 'prototype',
      component: prototype,
      meta: {
        title: '协议',
        noDefaultLink: true,  // 不记录在defaultLink中
      }
    },
    {
      path: '/login/bindphone',
      name: 'bindphone',
      component: bindphone,
      meta: {
        title: '绑定手机号',
        noDefaultLink: true,  // 不记录在defaultLink中
        // requireAuth: false
      }
    },
    // 个人中心 - 首页
    {
      path: '/personal/index',
      name: 'personalIndex',
      component: personal,
      meta: {
        title: '个人中心',
        requireAuth: false // 需要登录才能进入的页面可以增加一个meta属性
      },
      beforeEnter: (to, from, next) => {
        // ...
        next();
      },
      beforeLeave: (to, from, next) => {
        // ...
        next();
      }
    },
    {
      path: '/personal/collect',
      name: 'collect',
      component: collect,
      meta: {
        title: '收藏',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/history',
      name: 'history',
      component: history,
      meta: {
        title: '历史',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/focus',
      name: 'focus',
      component: focus,
      meta: {
        title: '关注',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // 个人中心 - 我的余额
    {
      path: '/personal/remain/index',
      name: 'remain',
      component: remain,
      meta: {
        keepAlive: false,
        title: '我的余额',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/remain/record',
      name: 'record',
      component: record,
      meta: {
        title: '充值记录',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/remain/account',
      name: 'account',
      component: account,
      meta: {
        title: '充值',
        requireAuth: true, // 需要登录才能进入的页面可以增加一个meta属性
        isWxLogin: true,   // 必须在微信端打开
      }
    },
    {
      path: '/personal/remain/detail',
      name: 'remaindetail',
      component: remaindetail,
      meta: {
        title: '账单明细',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // 个人中心 - 我的购买 - 下单
    {
      path: '/personal/order/detail',
      name: 'orderdetail',
      component: orderdetail,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '我的订单',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      },
    },
    {
      path: '/personal/order/list',
      name: 'orderlist',
      component: orderlist,
      meta: {
        title: '我的购买',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/invoice',
      name: 'orderinvoice',
      component: orderinvoice
    },
    {
      path: '/personal/order/result',
      name: 'orderresult',
      component: orderresult,
    },
    // 个人中心 - 我的购买 - 评价
    {
      path: '/personal/order/comment/index',
      name: 'ordercomment',
      component: ordercomment,
      meta: {
        title: '评价',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/comment/punish',
      name: 'commentpunish',
      component: commentpunish,
      meta: {
        title: '发布评价',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/comment/success',
      name: 'commentsuccess',
      component: commentsuccess,
      //beforeEnter 在进入这个路由之前，先判断是从哪个路由跳转的
      // beforeEnter: (to, from, next) => {
      //   console.log(from.path)
      //   from.path == '/personal/order/comment/punish' ? next('/personal/order/comment/index') : next();
      // },
      meta: {
        title: '评价成功',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // 个人中心 - 我的购买 - 退款
    {
      path: '/personal/order/edit',
      name: 'refundedit',
      component: refundedit,
      meta: {
        title: '填写物流信息',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/logistics',
      name: 'logistics',
      component: logistics,
      meta: {
        title: '订单跟踪',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/ongoing',
      name: 'ongoing',
      component: ongoing,
      meta: {
        title: '退款',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/type',
      name: 'refundtype',
      component: refundtype,
      meta: {
        title: '选择服务类型',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/refund/one',
      name: 'refundone',
      component: refundone,
      meta: {
        title: '退款',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/refund/two',
      name: 'refundtwo',
      component: refundtwo,
      meta: {
        title: '仅退款',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/order/refund/three',
      name: 'refundthree',
      component: refundthree,
      meta: {
        title: '退款退货',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // 个人中心 - 设置
    {
      path: '/personal/set/index',
      name: 'set',
      component: set,
      //beforeEnter 在进入这个路由之前，先判断是从哪个路由跳转的
      // beforeEnter: (to, from, next) => {
      //   from.path == '/personal/set/info' ? next('/personal/index') : next();
      //   from.path == '/personal/set/phone' ? next('/personal/index') : next();
      // },
      meta: {
        title: '设置',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/set/address',
      name: 'address',
      component: address,
      //beforeEnter 在进入这个路由之前，先判断是从哪个路由跳转的
      // beforeEnter: (to, from, next) => {
      //   from.path == '/personal/set/index' ? next('/personal/index') : next();
      // },
      meta: {
        title: '我的收货地址',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/set/list',
      name: 'addresslist',
      component: addresslist,
      meta: {
        title: '我的收货地址',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/set/info',
      name: 'info',
      component: info,
      meta: {
        title: '个人资料',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/set/safe',
      name: 'safe',
      component: safe,
      meta: {
        title: '账号和安全',
        requireAuth: false // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/set/cropper',
      name: 'cropper',
      component: cropper,
      meta: {
        title: '头像裁切',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/set/bind',
      name: 'bind',
      component: bind,
      meta: {
        title: '账号绑定',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // {
    //   path: '/personal/set/cancel',
    //   name: 'cancel',
    //   component: cancel,
    // },
    {
      path: '/personal/set/password',
      name: 'setpassword',
      component: setpassword,
      //beforeEnter 在进入这个路由之前，先判断是从哪个路由跳转的
      // beforeEnter: (to, from, next) => {
      //   from.path == '/login/index' ? next('/personal/index') : next();
      // },
      meta: {
        title: '',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/set/phone',
      name: 'setphone',
      component: setphone,
      meta: {
        title: '手机绑定',
        noDefaultLink: true,  // 不记录在defaultLink中
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // 个人中心 - 帮助与反馈
    {
      path: '/personal/help/index',
      name: 'help',
      component: help,
      meta: {
        title: '帮助与反馈',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/help/detail',
      name: 'helpdetail',
      component: helpdetail,
      meta: {
        title: '帮助与反馈',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    {
      path: '/personal/help/feedback',
      name: 'feedback',
      component: feedback,
      meta: {
        title: '我要反馈',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // 个人中心 - 我的评论
    {
      path: '/personal/comment/index',
      name: 'comment',
      component: comment,
      meta: {
        title: '我的评论',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      }
    },
    // 搜索
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '搜索'
      },
    },
    // 专辑
    {
      path: '/album/index',
      name: 'album',
      component: album,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '专辑详情'
      }
    },
    {
      path: '/album/detail',
      name: 'albumdetail',
      component: albumdetail,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '节目详情'
      },
    },
    {
      path: '/album/player',
      name: 'player',
      component: player,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '正在播放'
      },
    },
    {
      path: '/album/list',
      name: 'albumlist',
      component: albumlist
    },
    //电子书
    {
      path: '/ebook/reader',
      name: 'ebookreader',
      component: ebookreader
    },
    {
      path: '/ebook/catalog',
      name: 'ebookcatalog',
      component: ebookcatalog
    },
    {
      path: '/ebook/comment',
      name: 'ebookcomment',
      component: ebookcomment
    },
    {
      path: '/ebook/detail',
      name: 'ebookdetail',
      component: ebookdetail
    },
    {
      path: '/ebook/shelf',
      name: 'ebookshelf',
      component: ebookshelf,
      meta: {
        title: '我的书架',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      },
    },
    {
      path: '/ebook/pay',
      name: 'ebookpay',
      component: ebookpay
    },
    {
      path: '/ebook/recharge',
      name: 'ebookrecharge',
      component: ebookrecharge
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
      component: article,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '文章详情'
      },
    },
    {
      path: '/brand/detail/book',
      name: 'book',
      component: book,
    },
    {
      path: '/brand/result',
      name: 'brandresult',
      component: brandresult
    },
    {
      path: '/brand/index',
      name: 'brand',
      component: brand,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
      },
    },
    //优惠券
    {
      path: '/coupon/receive',
      name: 'couponreceive',
      component: couponreceive,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '领取优惠券'
      },
    },
    {
      path: '/coupon/mine',
      name: 'couponmine',
      component: couponmine,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '我的优惠券',
        requireAuth: true
      },
    },
    {
      path: '/coupon/result',
      name: 'couponresult',
      component: couponresult,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '搜索结果'
      },
    },
    // 购物车
    {
      path: '/cart',
      name: 'cart',
      component: cart,
      meta: {
        title: '购物车',
        requireAuth: true,
      }
    },
    // 商品详情
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    // 实物商品拼团页
    {
      path: '/groupgoods',
      name: 'groupgoods',
      component: groupgoods
    },
    // 拼团详情页
    {
      path: '/groupdetail',
      name: 'groupdetail',
      component: groupdetail,
      meta: {
        title: '拼团详情',
        requireAuth: true
      }
    },
    // 订单确认
    {
      path: '/order/confirm',
      name: 'orderconfirm',
      component: orderconfirm,
      meta: {
        title: '订单确认',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      },
      // beforeEnter: (to, from, next) => {
      //   from.path == '/pay/index' ? next('/personal/index') : next();
      // },
    },
    // 订单商品确认
    {
      path: '/order/detail',
      name: 'orderconfirmdetail',
      component: orderconfirmdetail,
      meta: {
        title: '订单商品确认',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      },
    },

    // 去支付 实物
    {
      path: '/pay/index',
      name: 'pay',
      component: pay,
      meta: {
        requireAuth: true, // 需要登录才能进入的页面可以增加一个meta属性
        isWxLogin: true,   // 必须在微信端打开
      },
      //beforeEnter 在进入这个路由之前，先判断是从哪个路由跳转的
    },
    {
      path: '/pay/account',
      name: 'payaccount',
      component: payaccount,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '结算',
        requireAuth: true, // 需要登录才能进入的页面可以增加一个meta属性
        isWxLogin: true,   // 必须在微信端打开
      },
      //beforeEnter 在进入这个路由之前，先判断是从哪个路由跳转的
      // beforeEnter: (to, from, next) => {
      //   from.path == '/pay/success' ? next('/personal/index') : next();
      // },
    },
    {
      path: '/pay/success',
      name: 'paysuccess',
      component: paysuccess,
      meta: {
        keepAlive: false,  // false不需要被缓存，true需要缓存
        title: '支付成功',
        requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
      },
    },
    // 助力活动
    {
      path: '/assist/active',
      name: 'assistactive',
      component: assistactive
    },
    {
      path: '/assist/help',
      name: 'assisthelp',
      component: assisthelp
    },
    {
      path: '/multiresult',
      name: 'multiresult',
      component: multiresult,
      meta: {
        title: '活动列表'
      }
    },
    {
      path: '/library/index',
      name: 'libraryindex',
      component: libraryindex
    },
    {
      path: '/library/detail',
      name: 'librarydetail',
      component: librarydetail,
      meta: {
        //   requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
        isWxLogin: true,        // 必须在微信端打开
      },
    },
    // 兑换活动
    {
      path: '/redeem/codeIndex',
      name: 'codeIndex',
      component: codeIndex,
      meta: {
        title: '火把知识'
      }
    },
    {
      path: '/redeem/codeInput',
      name: 'codeInput',
      component: codeInput,
      meta: {
        title: '兑换码',
        //   requireAuth: true // 需要登录才能进入的页面可以增加一个meta属性
        isAppLogin: true,       // 必须在app内打开
      },
    },
    {
      path: '/redeem/straightLinkIndex',
      name: 'linkIndex',
      component: straightLinkIndex
    },
    {
      path: '/redeem/appSuccess',
      name: 'appSuccess',
      component: appSuccess
    },
    {
      path: '/redeem/wapSuccess',
      name: 'wapSuccess',
      component: wapSuccess
    },
    {
      path: '/redeem/appFail',
      name: 'appFail',
      component: appFail
    },
    {
      path: '/redeem/wapFail',
      name: 'wapFail',
      component: wapFail
    },
    {
      path: '/redeem/login',
      name: 'redeemLogin',
      component: redeemLogin,
      meta: {
        title: '登录火把知识'
      }
    },
    {
      path: '/redeem/goods',
      name: 'redeemGoods',
      component: redeemGoods
    },
    {
      path: '/redeem/coupons',
      name: 'redeemCoupons',
      component: redeemCoupons
    }
  ]
})
