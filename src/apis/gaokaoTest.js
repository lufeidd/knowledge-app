/*
 * author: lrf
 * date:2020/05/26
 */

import req from './http.js';

// 首页
export const GAOKAO_TEST_INDEX = query => req('post', '/activity/nemt/index', query);

// 填写用户性别年龄
export const GAOKAO_TEST_ADD_INFO = query => req('post', '/activity/nemt/add', query);

// 提交测试选项
export const GAOKAO_TEST_SUBMIT= query => req('post', '/activity/nemt/edit', query);

// 测试结果
export const GAOKAO_TEST_RESULT= query => req('post', '/activity/nemt/result', query);

