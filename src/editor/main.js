import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Toasted from "vue-toasted";

import App from "./App.vue";
import router from "./router";
import store from "./store";

// CSS to import
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "../../public/custom.sass";

Vue.config.productionTip = false;
// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(Toasted);


new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
