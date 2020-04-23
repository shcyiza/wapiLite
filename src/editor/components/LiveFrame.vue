<script>
// tutorial https://forum.vuejs.org/t/render-inside-iframe/6419
import Vue from "vue";

export default {
    name: "LiveFrame",
    props: {
        editedStyles: {
            type: String,
            required: true,
        },
    },
    render(h) {
        return h("iframe", {
            on: { load: this.renderChildren },
        });
    },
    beforeUpdate() {
    // freezing to prevent unnessessary Reactifiation of vNodes
        this.setCustomStyle();
        this.iApp.children = Object.freeze(this.$slots.default);
    },
    methods: {
        mountBodyComponent(component) {
            const { body } = this.$el.contentDocument;
            const el = document.createElement("DIV"); // we will mount or nested app to this element
            body.appendChild(el);

            component.$mount(body);
        },
        loadStyles() {
            const { head } = this.$el.contentDocument;
            this.montInkyStyle(head);
            this.montCustomStyle(head);
            this.setCustomStyle();
        },
        montInkyStyle(monter) {
            const css_link = document.createElement("link");
            css_link.rel = "stylesheet";
            css_link.type = "text/css";
            css_link.href = "/foundation_emails.css";
            css_link.media = "all";

            monter.appendChild(css_link);
        },
        montCustomStyle(monter) {
            const css = document.createElement("style");
            css.type = "text/css";
            css.id = "custom-style";

            monter.appendChild(css);
        },
        setCustomStyle() {
            const css = document.querySelector("iframe#preview").contentWindow.document.head.querySelector("#custom-style");
            css.innerHTML = this.editedStyles;
        },
        renderChildren() {
            this.loadStyles();
            const children = this.$slots.default;

            const iApp = new Vue({
                name: "iApp",
                // freezing to prevent unnessessary Reactifiation of vNodes
                data: { children: Object.freeze(children) },
                method: {
                    createHeadTag() {
                        return document.createElement("head");
                    },
                },
                render(h) {
                    return h("body", this.children);
                },
            });

            this.mountBodyComponent(iApp); // mount into iframe

            this.iApp = iApp; // cache instance for later updates
        },
    },
};
</script>
