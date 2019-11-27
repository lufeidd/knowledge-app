/*
 * author: 朱博宇
 * date:2019/10/30
 */

import req from './http.js'

// 图书资源接口
export const RESOURCE_GET = query => req('post', '/goods/book/resource/get', query);

// 文件包邮件发送接口
export const FILEPACKAGE_SEND = query => req('post', '/goods/filepackage/send', query);

// 文件包链接隐藏接口
export const FILEPACKAGE_GETURL = query => req('post', '/goods/filepackage/geturl', query);
