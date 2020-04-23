<script>
import { toast } from "./lib/ToastNotification";

export default {
    name: "App",
    methods: {
        handleToastNotification(e) {
            toast(this.$toasted, e.detail.message, e.detail.type);
        },
    },
    created() {
        document.addEventListener(
            "toast-notification",
            this.handleToastNotification,
        );
    },
    beforeDestroy() {
        document.removeEventListener(
            "toast-notification",
            this.handleToastNotification,
        );
    },
};
</script>

<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
          color: #42b983;
        }
    }
}
</style>
