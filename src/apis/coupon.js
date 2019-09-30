/*
 * author: lufei
 * date:2019/9/24
 */

import req from './http.js'

//优惠券详情
export const TICKET_GET = query => req('post', '/ticket/get', query);

//优惠券商城列表获取
export const TICKET_MALL = query => req('post', '/ticket/mall', query);

//领取优惠券
export const TICKET_LINK = query => req('post', '/ticket/link', query);
