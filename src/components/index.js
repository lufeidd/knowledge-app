
// 下载app
import downloadApp from './downloadApp.vue';
// 快速导航
import eazyNav from './easyNav.vue';
// 加载中
import loading from './loading.vue';
// 版权
import copyRight from './copyRight.vue';
// 打开app对应页面
import openAppPage from './openAppPage.vue';
// 公共弹窗
import publicPopup from './publicPopup.vue';


export default {
    install: function (Vue, options) {
        Vue.component('Download', downloadApp);
        Vue.component('EazyNav', eazyNav);
        Vue.component('Loading', loading);
        Vue.component('CopyRight', copyRight);
        Vue.component('OpenAppPage', openAppPage);
        Vue.component('PublicPopup', publicPopup);
    }
}
