<template>
    <section id="editor-container">
        <div v-if="templateName">
            <h1>
                Editing > <strong>{{templateName}}</strong>
            </h1>

            <b-row v-if="template" id="template-editor">
                <b-col id="ide" sm="6">
                    <b-form-group
                        id="input-group-1"
                        label="Subject:"
                        label-for="subj_field"
                        description="Subject of the mail. Interpolation supported"
                    >
                        <b-form-input
                            id="subj_field"
                            v-model="template.subject"
                            type="text"
                        ></b-form-input>
                    </b-form-group>

                    <div>
                        <b-nav tabs>
                            <b-nav-item
                                :active="show_html"
                                @click="show_html = true"
                            >
                                HTML
                            </b-nav-item>
                            <b-nav-item
                                :active="!show_html"
                                @click="show_html = false"
                            >CSS</b-nav-item>
                        </b-nav>
                    </div>
                </b-col>
                <b-col id="preview" sm="6">
                    preview
                </b-col>
            </b-row>
        </div>

        <div v-else>
            <h1>TemplateEditor</h1>
        </div>
    </section>
</template>

<script>
import serverApi from "../lib/serve_interface";
import { notifyError } from "../lib/ToastNotification";

export default {
    name: "TemplateEditor",
    data() {
        return {
            template: null,
            show_html: true,
        };
    },
    computed: {
        templateName() {
            return this.$store.state.current_template;
        },
    },
    methods: {
        async getTemplate() {
            try {
                const { data } = await serverApi(
                    "get",
                    `templates/${this.templateName}`,
                );

                this.template = data;
            } catch (e) {
                notifyError(e.message);
            }
        },
    },
    created() {
        if (this.templateName) {
            this.getTemplate();
        }
    },
    watch: {
        templateName() {
            this.getTemplate();
        },
    },
};
</script>

<style scoped lang="sass">
#editor-container
    padding: 15px
    width: 100%
</style>
