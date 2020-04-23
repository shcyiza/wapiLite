/* eslint-disable no-param-reassign,no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";
import serverApi from "../lib/serve_interface";
import { notifyError } from "../lib/ToastNotification";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        templates: [],
        current_template: "",
    },
    mutations: {
        setTemplates(state, payload) {
            state.templates = payload;
        },
        addTemplate(state, payload) {
            // put new element as first
            const new_arr = [payload];
            state.templates = new_arr.concat(state.templates);
        },
        setCurrentTemplate(state, payload) {
            state.current_template = payload;
        },
    },
    actions: {
        async fetchTemplates({ commit }) {
            try {
                const { data: { templates } } = await serverApi("get", "templates");

                commit("setTemplates", templates);
            } catch (e) {
                notifyError(e.message);
            }
        },
    },
    modules: {},
});
