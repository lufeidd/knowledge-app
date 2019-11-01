/*
 * author: lufei
 * date:2019/4/30
 */
import req from './http.js'

//品牌首页
export const BRAND_INFO = query => req('post', '/brand/info', query);
export const BRAND_COLUMN_GETS = query => req('post', '/brand/column/gets', query);

//商品搜索
export const BRAND_SEARCH_GOODS_GETS = query => req('post', '/search/goods/gets', query);

//品牌商城
export const BRAND_PAGE_MALL_INDEX = query => req('post', '/page/mall/index', query);

//自定义商城
export const PAGE_GET = query => req('post', '/page/get', query);
