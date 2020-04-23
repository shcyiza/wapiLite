// vue.config.js
module.exports = {
    devServer: {
        proxy: process.env.VUE_APP_API_HOST,
    },
    lintOnSave: true,
    configureWebpack: {
        entry: {
            app: "./api/editor/main.js",
        },
    },
};
