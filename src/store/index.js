// 集中式存储和管理应用程序中所有组件的状态
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
    isDel: false,   // 判断表单是否触发删除动作
}
const getters = {   // 实时监听state值的变化(最新状态)
    getState(state) {  //方法名随意,主要是来承载变化的showFooter的值
        return state.isDel
    },
};
const mutations = {
    changeState(state, newState) {
        state.isDel = newState;
    }
}
const actions = {
    getNewState(context, newState) {
    }
}
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
export default store