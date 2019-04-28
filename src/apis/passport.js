/*
 * author: nancyzeng
 * date:2019/4/26
 */

import req from './http.js'

// 定义接口  
// 在这里定义接口，把接口暴露出去给组件使用
// 这里使用了箭头函数，转换一下写法：
// export const XX = function (req) {
//     return req('post', '/XXX', params)
// }

// 定义注册接口
export const REG = params => req('post', '/passport/regist', params);

// 定义验证码发送接口
export const SMS = params => req('post', '/common/sendsms', params);

// 定义登录接口
export const LOG = params => req('post', '/passport/login', params);

// 定义忘记密码接口
export const FIND = params => req('post', '/passport/findpwd', params);


