/*
 * author: nancyzeng
 * date:2019/4/26
 */

import axios from 'axios'
import qs from "Qs";
import Vue from 'vue';

// 创建axios的一个实例
var app_version = sessionStorage.getItem("isWxLogin") == "yes" ? 'weixin' : 'wap';
var open_id = localStorage.getItem('openid');
var instance = axios.create({
    // dev
    // baseURL: window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + '/apis',

    // run build
    baseURL: window.location.protocol + "//" + window.location.hostname + '/apis',

    headers: { 'App-version': app_version, 'unique-code': open_id },
    // responseType: 'blob',    // 测试发票下载
    timeout: 15000,
})

// 一、请求拦截器 忽略
instance.interceptors.request.use(function (config) {
    config.credentials = true;

    // 网页端跳转 404 页面
    if (sessionStorage.getItem("isWxLogin") == "no" && (localStorage.getItem('routerLink').indexOf('/personal/remain/account') != -1 || localStorage.getItem('routerLink').indexOf('/pay/account') != -1 || localStorage.getItem('routerLink').indexOf('/pay/index') != -1  || localStorage.getItem('routerLink').indexOf('/library/detail') != -1 )) {
        window.location.href = window.location.href.split('#')[0] + '#/404';
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    // console.log('request error');
    return Promise.reject(error);
});

// 二、响应拦截器 忽略
instance.interceptors.response.use(function (response) {
    if (response.status === 200) {
        // console.log(200);
        // $('#loadingPage').remove();

        // console.log(localStorage.getItem('routerLink'));
        // 处理请求成功的逻辑
        return response.data; // 必须返回，后面的接口的then，才能获取response
    } else {
        if (response.status >= 500) {
            // 错误处理
        } else if (response.status === 404) {
            // ...
        }
        return response.data; // 必须返回
    }
}, function (error) {

    // 网络响应超时，调整到超时页面
    var routerLink = localStorage.getItem('routerLink');
    var replaceUrl = window.location.href.split('#')[0] + '#/timeout';

    var brandId;

    if (routerLink.match(/brand_id/)) {
        var sIndex = routerLink.indexOf('brand_id=') + 9;
        brandId = routerLink.substring(sIndex, routerLink.length);
        // console.log(routerLink.substring(sIndex, routerLink.length));
    }

    // 朋友圈   from=timeline&isappinstalled=0
    // 微信群   from=groupmessage&isappinstalled=0
    // 好友分享 from=singlemessage&isappinstalled=0
    if (routerLink.indexOf('timeline') != -1 || routerLink.indexOf('groupmessage') != -1 || routerLink.indexOf('singlemessage') != -1) {
        if (routerLink.split('#')[1].indexOf("?") != -1) {
            routerLink += '&brand_id=' + brandId;
        } else {
            routerLink += '?brand_id=' + brandId;
        }
    } else {
        if (routerLink.indexOf("?") != -1) {
            routerLink += '&brand_id=' + brandId;
        } else {
            routerLink += '?brand_id=' + brandId;
        }
    }

    console.log('网络请求超时:', replaceUrl);
    window.location.href = replaceUrl;

    return Promise.reject(error);
});

// 添加读取build之后的代码
// axios.get('./../../dist/static/serverConfig.json').then((result) => {
// axios.get('serverConfig.json').then((result)=>{
// result.baseURL
// }).catch((error) => {
//     console.log(error)
// })

/**
* 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
* 函数的参数及返回值如下：
* @param {String} method  请求的方法：get、post、delete、put
* @param {String} url     请求的url:
* @param {Object} data    请求的参数
* @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
*/

export default function (method, url, data = null) {
    method = method.toLowerCase();
    if (method === 'post') {
        return instance.post(url, qs.stringify(data));
    } else if (method === 'get') {
        return instance.get(url, qs.stringify(data));
    } else if (method === 'delete') {
        return instance.delete(url, qs.stringify(data));
    } else if (method === 'put') {
        return instance.put(url, qs.stringify(data));
    } else {
        console.error('未知的method' + method);
        return false;
    }
}
