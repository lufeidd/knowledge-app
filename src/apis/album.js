/*
 * author: nancyzeng
 * date:2019/4/28
 */

import req from './http.js'

// 定义专辑接口
export const ALBUM = params => req('post', '/goods/detail', params);
export const ALBUM_DETAIL = params => req('post', '/album/details', params);
export const ALBUM_LIST = params => req('post', 'goods/album/details', params);

