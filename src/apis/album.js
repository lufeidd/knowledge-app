/*
 * author: nancyzeng
 * date:2019/4/28
 */

import req from './http.js'

// 定义专辑接口
export const ALBUM = query => req('post', '/goods/detail', query);
export const ALBUM_DETAIL = query => req('post', '/goods/album/details', query);
