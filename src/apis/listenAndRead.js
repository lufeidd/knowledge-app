/*
 * author: lrf
 * date:2020/05/26
 */

import req from './http.js';

// 首页
export const ListenAndRead_INFO = query => req('post', '/page/reading/info', query);

// 获取推荐列表
export const ListenAndRead_RECOMMEND = query => req('post', '/page/reading/recommend', query);

// 获取专辑或电子书列表
export const ListenAndRead_LIST = query => req('post', '/page/reading/lists', query);

// 置顶
export const ListenAndRead_TOPADD = query => req('post', '/user/collect/top/add', query);

// 取消置顶
export const ListenAndRead_TOPCANCEL = query => req('post', '/user/collect/top/cancel', query);

// 取消收藏
export const COLLECT_CANCEL = query => req('post', '/user/collect/cancel', query);
