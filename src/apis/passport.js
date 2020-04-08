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

// 设置密码
export const ADD_PASSWORD = query => req('post', '/passport/installpwd', query);

// 用户账号和安全列表接口
export const ACCOUNTS = query => req('post', '/passport/accounts', query);

// 第三方用户登录接口
export const LOGIN_PARTERNER = query => req('post', '/passport/parterner', query);

// 第三方绑定手机号接口
export const LOGIN_BIND_PARTERNER = query => req('post', '/passport/bindparterner', query);

// 取消绑定接口
export const LOGIN_BIND_DELETE = query => req('post', '/passport/binding/delete', query);

// 用户第三方绑定列表接口
export const LOGIN_BIND_LIST = query => req('post', '/passport/binding/gets', query);

//判断手机号是否已注册
export const PASSPORT_CHECKPHONE = query => req('post', '/passport/checkphone', query);

/*
 * added by lrf
 * date:2020/1/17
 */

// 登录注册2.0新增接口

//判断手机号是否已注册
export const PHONE_CHECK = query => req('post', '/passport/checkphone', query);

// 是否弹注册条款
export const REGISTER_ITEMS = query => req('post', '/passport/privates', query);

// 手机号登录
export const PHONE_LOGIN = query => req('post', '/passport/login', query);

// 校验手机验证码
export const CHECK_CODE = query => req('post', '/passport/checkcode', query);
