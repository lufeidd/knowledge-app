/*
 * author: 朱博宇
 * date:2019/10/30
 */

import req from './http.js'

//获取助力活动页初始化详情信息
export const ASSISTANCE_DETAIL = query => req('post', '/activity/assistance/detail', query);
//助力名单
export const ASSISTANCE_SUPPORTER = query => req('post', '/activity/assistance/supporter', query);
//助力页初始化详情信息
export const ASSISTANCE_INVITEDETAIL = query => req('post', '/activity/assistance/invitedetail', query);
//助力是否可以参与检查信息
export const ASSISTANCE_SUPPORTCHECK = query => req('post', '/activity/assistance/supportcheck', query);
//助力活动领取奖励
export const ASSISTANCE_TAKEPRIZE = query => req('post', '/activity/assistance/takeprize', query);
//生成海报接口【助力】
export const ASSISTANCE_POSTER = query => req('post', '/activity/assistance/poster', query);
//页面分享信息获取
export const PAGE_SHARE_INFO = query => req('post', '/page/share/info', query);
