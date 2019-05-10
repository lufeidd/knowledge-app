/*
 * author: lufei
 * date:2019/4/30
 */
import req from './http.js'

//品牌首页
export const BRAND_INFO = params => req('post', '/brand/info', params);
export const BRAND_COLUMN_GETS = params => req('post', '/brand/column/gets', params);
//相关推荐
export const GOODS_RECOMMEND_GETS = params => req('post', '/goods/recommend/gets', params);
