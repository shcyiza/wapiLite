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

        <b-modal id="new-template"
            ref="modal_new_template"
            centered title="New Template"
            @close="clearTemplateForm"
            hide-footer
        >
            <b-form-group
                label="Template name:"
                label-for="new-t-name"
            >
                <b-form-input
                    id="new-t-name"
                    v-model="new_template_name"
                    type="text"
                    required
                    placeholder="Template name"
                />
            </b-form-group>

            <b-form-group
                label="Mail subject:"
                label-for="new-t-subj"
                description="(Interpolation supported)"
            >
                <b-form-input
                    id="new-t-subj"
                    v-model="new_template_subj"
                    type="text"
                    required
                    placeholder="Subject of the important mail"
                />
            </b-form-group>
            <br>
            <b-button
                variant="outline-success"
                :disabled="!(new_template_subj || new_template_name)"
                @click="addTemplate"
            >
                <b-icon icon="cloud-upload" aria-hidden="true"></b-icon>
                Create template
            </b-button>
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
            new_template_subj: "",
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
            this.new_template_subj = "";
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
                    {
                        name: this.new_template_name,
                        mail_subj: this.new_template_subj,
                    },
                );

                this.$store.commit("addTemplate", data);
                this.clearTemplateForm();

                this.$refs.modal_new_template.hide();
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
