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

//退款记录列表
export const ORDER_REFUND_LOG_GETS = query => req('post', '/shopping/order/refund/log/gets', query);

//撤销退款申请
export const ORDER_REFUND_CANCLE = query => req('post', '/shopping/order/refund/cancle', query);

//填写退款物流信息
export const ORDER_REFUND_DISPATCH_EDIT = query => req('post', '/shopping/order/dispatch/edit', query);

//订单物流信息查询
export const ORDER_EXPRESS_GET = query => req('post', '/shopping/order/express/get', query);

//退货物流公司列表
export const ORDER_REFUND_DISPATCH_COMPANY = query => req('post', '/shopping/order/refund/dispatch/company', query);

//订单确认收货
export const ORDER_RECEIVE = query => req('post', '/shopping/order/RECEIVE', query);
