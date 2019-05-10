/*
 * author: nancyzeng
 * date:2019/4/26
 */

import req from './http.js'

// 个人中心首页
export const USER_HOMEPAGE = params => req('post', '/user/homepage', params);

// 获取用户基本信息
export const USER_INFO = params => req('post', '/user/info/get', params);
export const USER_INFO_EDIT = params => req('post', '/user/info/edit', params);

// 定义我的评论接口
export const USER_COMMENT = params => req('post', '/user/comment/gets', params);

// 历史
export const USER_HISTORY = params => req('post', '/user/history/gets', params);
export const USER_HISTORY_CANCEL = params => req('post', '/user/history/delete', params);

//我的余额
export const USER_REMAIN_INFO = params => req('post', '/user/wallet/info', params);
// 我的余额-明细
export const USER_REMAIN_DETAILS = params => req('post', '/user/wallet/details', params);


//帮助与反馈
export const USER_HELPER_GETS = params => req('post', '/helper/gets', params);
export const USER_HELPER_DETAIL = params => req('post', '/helper/detail', params);
export const USER_FEEDBACK_ADD = params => req('post', '/user/feedback/add', params);

//公共
export const COMMON_UPLOAD = params => req('post', '/common/upload', params);

// 我的收货地址
export const USER_ADDRESS = params => req('post', '/user/address/gets', params);
