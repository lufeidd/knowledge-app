
// 下载app
import downloadApp from './downloadApp.vue';
// 快速导航
import eazyNav from './easyNav.vue';
// 加载中
import loading from './loading.vue';

export default {
    install: function (Vue, options) {
        Vue.component('Download', downloadApp);
        Vue.component('EazyNav', eazyNav);
        Vue.component('Loading', loading);
    }
}
