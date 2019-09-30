/*
 * author: lufei
 * date:2019/9/12
 */

import req from './http.js'

// 定义电子书接口
export const EBOOK_CHAPTER = query => req('post', '/goods/ebook/chapter', query);

//电子书目录信息
export const EBOOK_CATALOG = query => req('post', '/goods/ebook/catalog', query);

// 电子书详情
export const EBOOK_INFO = query => req('post', '/goods/ebook/info', query);

// 电子书相关推荐
export const EBOOK_RECOMMEND = query => req('post', '/goods/ebook/recommend', query);

// 电子书我的书架
export const EBOOK_SHELF_GETS = query => req('post', '/user/bookshelf/gets', query);

//加入书架
export const EBOOK_SHELF_ADD = query => req('post', '/user/bookshelf/add', query);

//移出书架
export const EBOOK_SHELF_CANCEL = query => req('post', '/user/bookshelf/cancel', query);

//用户阅读时长
export const USER_READ_RECORD = query => req('post', '/user/read/record', query);

//电子书阅读时长记录
export const EBOOK_READING = query => req('post', '/goods/ebook/reading', query);

//电子书样式文件
export const EBOOK_STYLE = query => req('post', '/goods/ebook/styles', query);
