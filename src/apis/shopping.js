/*
 * author: nancyzeng
 * date:2019/5/17
 */

import req from './http.js'

// 新增虚拟订单
export const ORDER_VIRTUAL_ADD = query => req('post', '/shopping/order/virtual/add', query);

// 订单余额支付手机验证码发送
export const ORDER_VIRTUAL_ADD_SENDCODE = query => req('post', '/shopping/cashier/balance/sendcode', query);

// 订单支付
export const ORDER_VIRTUAL_ADD_PAY = query => req('post', '/shopping/cashier/balance/pay', query);

// 新增虚拟订单
export const ORDER_VIRTUAL_ADDINFO = query => req('post', '/shopping/order/virtual/addinfo', query);

//退款申请
export const ORDER_REFUND_ADD = query => req('post', '/shopping/order/refund/add', query);

//获取退款申请信息
export const ORDER_REFUND_ADDINFO = query => req('post', '/shopping/order/refund/addinfo', query);
