/*
 * author: nancyzeng
 * date:2020/4/10
 */

import req from './http.js'

// 活动 - 问卷调查
export const ACTIVITY_INTEREST_INDEX = query => req('post', '/activity/interest/index', query);
export const ACTIVITY_INTEREST_JOIN = query => req('post', '/activity/interest/join', query);
