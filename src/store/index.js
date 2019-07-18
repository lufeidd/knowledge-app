// 集中式存储和管理应用程序中所有组件的状态
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
    isLogin: 100,   // 100未登录，1已登录
}
const getters = {   //实时监听state值的变化(最新状态)
    getLoginState(state) {  //方法名随意,主要是来承载变化的showFooter的值
        return state.isLogin
    },
};
const mutations = {
    changeLoginState(state, newState) {
        state.isLogin = newState;
        localStorage.setItem("loginState", newState);
    }
}
const actions = {
    getNewState(context, newState) {
        context.commit('getLoginState', newState)
    }
}
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
})
export default store