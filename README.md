# About knowledge-app

> 博库-知识内容服务平台-移动端，此项目是 vue + vant 构建的移动端项目，解释权归博库网络传媒集团所有。

# 技术栈

> vue + vant + vue-router + webpack + ES6/7 + sass + gulp

# 功能组件

``` bash
音频

视频

上传图片
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

cnpm install

cnpm run dev

cnpm run build（本地代码run build请先修改path再将dist文件夹放到服务器查看效果,配置webpack.prod.conf.js - util.js - config/index.js）
```