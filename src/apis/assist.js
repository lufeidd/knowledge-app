/*
 * author: 朱博宇
 * date:2019/10/30
 */

import req from './http.js'

//助力
export const ASSISTANCE_DETAIL = query => req('post', '/activity/assistance/detail', query);
//活动
export const ASSISTANCE_SUPPORTER = query => req('post', '/activity/assistance/supporter', query);
