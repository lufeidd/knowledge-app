# About knowledge-app  测试......

> 博库-知识内容服务平台-移动端，此项目是 vue + vant 构建的移动端项目，解释权归博库网络传媒集团所有。

# 技术栈

> vue + vant + vue-router + webpack + ES6/7 + sass + gulp

# 功能组件

``` bash
音频

视频

上传图片

迷你音频

快捷导航

词条搜索
```

# 功能插件

``` bash
countDown

swiper
https://github.com/surmon-china/vue-awesome-swiper

cropper
https://github.com/xyxiao001/vue-cropper
```

# 项目模块

``` bash
1、登录/注册

2、个人中心

3、专辑

4、品牌商城

5、下单
```

# 项目运行

``` bash
git clone https://github.com/nancyzeng/knowledge-app

cd knowledge-app

// vant
cnpm i vant -S

// swiper
cnpm install vue-awesome-swiper --save

// cropper
cnpm install vue-cropper --save-dev

// jquery
cnpm install jquery --save, 配置webpack.base.conf.js

// qs
cnpm install --save axios vue-axios qs 

// 支持async/await
cnpm install -g regenerator

// js encrypt加密
cnpm i jsencrypt -s

// clipboard
cnpm install clipboard --save

// md5加密
cnpm install --save js-md5

// cookies
cnpm install vue-cookies --save

// Critical dependency: the request of a dependency is an expression
cnpm i webpack-node-externals

// vue+webpack实现vue打包后生成配置文件用以外部修改公共路径
cnpm install --save-dev generate-asset-webpack-plugin

// 微信分享，引入sdk
cnpm install weixin-js-sdk --save-dev

// vue 集中式存储和管理应用程序中所有组件的状态
cnpm install vuex --save

cnpm install

cnpm run dev

cnpm run build（本地代码run build请先修改path再将dist文件夹放到服务器查看效果,配置webpack.prod.conf.js - util.js - config/index.js）
```
