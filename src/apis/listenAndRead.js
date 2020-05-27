/*
 * author: lrf
 * date:2020/05/26
 */

import req from './http.js';

// 首页
export const ListenAndRead_INFO = query => req('post', '/page/reading/info', query);
export const ListenAndRead_RECOMMEND = query => req('post', '/page/reading/recommend', query);
export const ListenAndRead_LIST = query => req('post', '/page/reading/lists', query);
export const ListenAndRead_TOPADD = query => req('post', '/user/collect/top/add', query);
export const ListenAndRead_TOPCANCEL = query => req('post', '/user/collect/top/cancel', query);
