/*
 * author: nancyzeng
 * date:2019/5/17
 */

import req from './http.js'

// 新增虚拟订单
export const ORDER_VIRTUAL_ADD = params => req('post', '/shopping/order/virtual/add', params);

// 订单余额支付手机验证码发送
export const ORDER_VIRTUAL_ADD_SENDCODE = params => req('post', '/shopping/cashier/balance/sendcode', params);

// 订单余额支付手机验证码发送
export const ORDER_VIRTUAL_ADD_PAY = params => req('post', '/shopping/cashier/balance/pay', params);