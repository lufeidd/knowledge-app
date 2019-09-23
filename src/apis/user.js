/*
 * author: nancyzeng
 * date:2019/4/26
 */

import req from './http.js'

// 个人中心首页
export const USER_HOMEPAGE = query => req('post', '/user/homepage', query);

// 获取用户基本信息
export const USER_INFO = query => req('post', '/user/info/get', query);
export const USER_INFO_EDIT = query => req('post', '/user/info/edit', query);

//获取用户余额充值信息
export const USER_WALLET_RECHARGE_INFO = query => req('post', '/user/wallet/recharge/info', query);

// 用户余额充值申请创建
export const USER_WALLET_RECHARGE_ADD = query => req('post', '/user/wallet/recharge/add', query);

// 定义我的评论接口
export const USER_COMMENT = query => req('post', '/user/comment/gets', query);

//删除评论接口
export const GOODS_COMMENT_DEL = query => req('post', '/goods/comment/del', query);

// 历史
export const USER_HISTORY = query => req('post', '/user/history/gets', query);
export const USER_HISTORY_CANCEL = query => req('post', '/user/history/delete', query);

//我的余额
export const USER_REMAIN_INFO = query => req('post', '/user/wallet/info', query);
// 我的余额-明细
export const USER_REMAIN_DETAILS = query => req('post', '/user/wallet/details', query);

//帮助与反馈
export const USER_HELPER_GETS = query => req('post', '/helper/gets', query);
export const USER_HELPER_DETAIL = query => req('post', '/helper/detail', query);
export const USER_FEEDBACK_ADD = query => req('post', '/user/feedback/add', query);

//我的购买--订单
export const USER_ORDER_INVOICE_ADD = query => req('post', '/shopping/order/invoice/add', query);
export const USER_ORDER_DETAIL_GET = query => req('post', '/shopping/order/get', query);
export const USER_ORDER_DETAIL_GETS = query => req('post', '/shopping/order/gets', query);
//订单评价
export const USER_ORDER_ORDER_COMMENT_ADD = query => req('post', '/shopping/order/comment/add', query);
export const USER_ORDER_COMMENT_UNDO_GETS = query => req('post', '/shopping/order/comment/undo/gets', query);

// 获取用户地址列表
export const USER_ADDRESS_LIST = query => req('post', '/user/address/gets', query);
export const USER_ADDRESS_ADD = query => req('post', '/user/address/add', query);
export const USER_ADDRESS_DEL = query => req('post', '/user/address/delete', query);
export const USER_ADDRESS_EDIT = query => req('post', '/user/address/edit', query);
export const USER_ADDRESS = query => req('post', '/user/address/get', query);

// 手机绑定
export const USER_PHONE_RESET = query => req('post', '/user/info/mobile/reset', query);
export const USER_PHONE_RESETSAVE = query => req('post', '/user/info/mobile/resetsave', query);

// 用户播放进度记录
export const USER_PLAYED_RECORD = query => req('post', '/user/played/record', query);
