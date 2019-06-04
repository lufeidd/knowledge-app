/*
 * author: nancyzeng
 * date:2019/4/26
 */

import req from './http.js'

// 定义接口  
// 在这里定义接口，把接口暴露出去给组件使用
// 这里使用了箭头函数，转换一下写法：
// export const XX = function (req) {
//     return req('post', '/XXX', query)
// }

// 定义注册接口
export const REG = query => req('post', '/passport/regist', query);

// 定义验证码发送接口
export const SMS = query => req('post', '/common/sendsms', query);

// 定义登录接口
export const LOG = query => req('post', '/passport/login', query);

// 定义忘记密码接口
export const FIND = query => req('post', '/passport/findpwd', query);

// 用户登出接口
export const LOGOUT = query => req('post', '/passport/logout', query);

// 修改密码
export const EDIT_PASSWORD = query => req('post', '/passport/editpwd', query);