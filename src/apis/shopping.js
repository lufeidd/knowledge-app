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

// 加入购物车
export const CART_ADD = query => req('post', '/shopping/cart/add', query);

// 删除购物车中的商品品种
export const CART_DELETE = query => req('post', '/shopping/cart/delete', query);

// 更改商品在购物车的数量
export const CART_EDIT = query => req('post', '/shopping/cart/edit', query);

// 获取购物车信息
export const CART_INFO = query => req('post', '/shopping/cart/gets', query);

// 新增实物订单
export const ORDER_PHYSICAL_ADDINFO = query => req('post', '/shopping/order/physical/addinfo', query);

// 新增实物订单 支付
export const ORDER_PHYSICAL_ADD = query => req('post', '/shopping/order/physical/add', query);

// 实物支付信息获取
export const ORDER_PHYSICAL_PAYINFO = query => req('post', '/shopping/order/physical/payinfo', query);
