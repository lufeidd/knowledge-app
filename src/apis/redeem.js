/*
 * author: lrf
 * date:2019/12/04
 */

import req from './http.js';

// // 验证码
// export const Validate_CODE = query => req('post', '/activity/redeem/code/get', query);

// 兑换码详情
export const REDEEM_CODE_GET = query => req('post', '/activity/redeem/code/get', query);

// 兑换物品（实物/虚拟/优惠券）详情

export const REDEEM_ITEM_GET = query => req('post', '/activity/redeem/get', query)
