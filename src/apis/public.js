/*
 * author: nancyzeng
 * date:2019/4/28
 */

import req from './http.js'
// 微信分享sdk
import wx from 'weixin-js-sdk'
import axios from 'axios'

// 定义公用接口

// 时间戳
export const SERVER_TIME = query => req('post', '/timestamp', query);

// 收藏
export const COLLECT = query => req('post', '/user/collect/gets', query);
export const COLLECT_ADD = query => req('post', '/user/collect/add', query);
export const COLLECT_CANCEL = query => req('post', '/user/collect/cancel', query);

// 关注公众号
export const FOCUS = query => req('post', '/user/attention/gets', query);
export const FOCUS_ADD = query => req('post', '/user/attention/add', query);
export const FOCUS_CANCEL = query => req('post', '/user/attention/cancel', query);

// 评论
export const COMMENT = query => req('post', '/goods/comment/gets', query);
export const COMMENT_ADD = query => req('post', '/goods/comment/add', query);

//上传图片
export const COMMON_UPLOAD = query => req('post', '/common/upload', query);

//商品点赞
export const GOODS_PRAISE_ADD = query => req('post', '/goods/praise/add', query);
export const GOODS_PRAISE_DELETE = query => req('post', '/goods/praise/delete', query);


//获取商品热搜
export const SEARCH_HOTKEY_GETS = query => req('post', '/search/hotkey/gets', query);

// 推荐
export const RECOMMEND = query => req('post', '/goods/recommend/gets', query);

// 地址
export const ADDRESS = query => req('post', '/common/area/gets', query);

//词条建议
export const SEARCH_SUGGEST = query => req('post', '/search/goods/suggest', query);

// 微信公众号分享基础配置信息获取
// export const WX_SHARE = query => req('post', '/weixin/jssdk', query);

