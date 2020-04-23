/* eslint-disable no-param-reassign */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        templates: [],
    },
    mutations: {
        setTemplates(state, payload) {
            state.templates = payload;
        },
    },
    actions: {},
    modules: {},
});
