<template>
    <section id="template-nav">
        <div class="template-list">
            <b-button block variant="outline-success"
                v-b-modal.new-template
            >
                New Template +
            </b-button>

            <b-button block variant="primary" class="template"
                  v-for="(template, i) in getTemplates"
                  :key="i"
                  @click="setCurrentTemplate(template.name)"
                  v-bind:class="{ 'active': template.name === getCurrentTemplate }"
            >
                <strong class="title">{{ template.name }}</strong>
                <br>
                <span class="subtext">
                    created at: {{ template.meta_data.birthtime }}
                </span>
                <br>
                <span class="subtext">
                    modified at: {{ template.meta_data.mtime }}
                </span>
            </b-button>
        </div>

        <b-modal id="new-template" centered title="New Template"
            @close="clearTemplateForm"
            @cancel="clearTemplateForm"
            @ok="addTemplate"
        >
                <b-form-input
                    id="input-1"
                    v-model="new_template_name"
                    type="text"
                    required
                    placeholder="Template name"
                />
        </b-modal>
    </section>
</template>

<script>
import serverApi from "../lib/serve_interface";
import { notifyError } from "../lib/ToastNotification";

export default {
    name: "TemplateNavigator",
    data() {
        return {
            new_template_name: "",
        };
    },
    computed: {
        getTemplates() {
            return this.$store.state.templates;
        },
        getCurrentTemplate() {
            return this.$store.state.current_template;
        },
    },
    methods: {
        clearTemplateForm() {
            this.new_template_name = "";
        },
        setCurrentTemplate(name) {
            this.$store.commit("setCurrentTemplate", name);
        },
        async fetchTemplates() {
            this.$store.dispatch("fetchTemplates");
        },
        async addTemplate() {
            try {
                const { data } = await serverApi(
                    "post",
                    "templates/new",
                    { name: this.new_template_name },
                );

                this.$store.commit("addTemplate", data);
                this.new_template_name = "";
            } catch (e) {
                notifyError(e.message);
            }
        },
    },
    created() {
        this.fetchTemplates();
    },
};
</script>

<style scoped lang="sass">
#template-nav
    height: 100vh
    background-color: rgba(64, 186, 213, 0.2)
    padding: 5px
    overflow-y: auto

.template
    .subtext
        font-size: smaller
    .title
        font-size: larger

.active
    background-color: #005a78 !important
</style>
