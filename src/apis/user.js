/*
 * author: nancyzeng
 * date:2019/4/26
 */

import req from './http.js'


// 定义我的评论接口
export const USER_COMMENT = params => req('post', '/user/comment/gets', params);

//我的余额
export const USER_REMAIN_INFO = params => req('post', '/user/wallet/info', params);
// 我的余额-明细
export const USER_REMAIN_DETAILS = params => req('post', '/user/wallet/details', params);

