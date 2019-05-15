/*
 * author: nancyzeng
 * date:2019/4/28
 */

import req from './http.js'

// 定义公用接口

// 时间戳
export const SERVER_TIME = params => req('post', '/timestamp', params);

// 收藏
export const COLLECT = params => req('post', '/user/collect/gets', params);
export const COLLECT_ADD = params => req('post', '/user/collect/add', params);
export const COLLECT_CANCEL = params => req('post', '/user/collect/cancel', params);

// 关注公众号
export const FOCUS = params => req('post', '/user/attention/gets', params);
export const FOCUS_ADD = params => req('post', '/user/attention/add', params);
export const FOCUS_CANCEL = params => req('post', '/user/attention/cancel', params);

// 评论
export const COMMENT = params => req('post', '/goods/comment/gets', params);
export const COMMENT_ADD = params => req('post', '/goods/comment/add', params);

//上传图片
export const COMMON_UPLOAD = params => req('post', '/common/upload', params);

//商品点赞
export const GOODS_PRAISE_ADD = params => req('post', '/goods/praise/add', params);
export const GOODS_PRAISE_DELETE = params => req('post', '/goods/praise/delete', params);

//获取商品热搜
export const SEARCH_HOTKEY_GETS = params => req('post', '/search/hotkey/gets', params);
// 推荐
export const RECOMMEND = params => req('post', '/goods/recommend/gets', params);

// 地址
export const ADDRESS = params => req('post', '/common/area/gets', params);
