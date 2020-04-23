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
                                :active="html_tab"
                                @click="toggleEditor(true)"
                            >
                                HTML
                            </b-nav-item>
                            <b-nav-item
                                :active="!html_tab"
                                @click="toggleEditor(false)"
                            >
                                CSS
                            </b-nav-item>
                        </b-nav>

                        <codemirror
                            v-model="template.content_img"
                            :options="htmlOps"
                            v-show="html_tab"
                        />
                        <codemirror
                            v-model="template.styling_img"
                            :options="cssOps"
                            v-show="!html_tab"
                            v-if="css_mode_loaded"
                        />
                    </div>
                </b-col>
                <b-col id="preview-wrapper" sm="6">
                    <div class="action-wrapper">
                        <b-button pill class="action" variant="success">
                            <b-icon-cloud-upload/>
                            Success
                        </b-button>
                        <b-button
                            pill class="action"
                            variant="outline-danger"
                            v-b-modal.delete-template
                        >
                            <b-icon-exclamation-triangle-fill/>
                            delete...
                        </b-button>

                        <b-modal ref="delete-template" id="delete-template"
                             centered title="Destroy template"
                             @close="delete_confirmation = ''"
                             hide-footer
                        >
                            <b-icon-trash/>
                            Type the template name <code>{{templateName}}</code>
                            to confirm destruction.
                            <b-form-input
                                id="input-1"
                                v-model="delete_confirmation"
                                type="text"
                                required
                                placeholder="Template name"
                            />
                            <br>
                            <b-button squared
                                variant="outline-danger"
                                @click="destroyTemplate"
                                :disabled="templateName !== delete_confirmation"
                            >
                                !!! DESTROY !!!
                            </b-button>
                        </b-modal>
                    </div>

                    <live-frame
                        id="preview"
                        class="my-frame"
                        scrolling="auto"
                        :editedStyles="template.styling_img"
                    >
                        <live-frame-child v-html="inkedHtml"/>
                    </live-frame>
                </b-col>
            </b-row>
        </div>

        <div v-else>
            <h1>{{ title }}</h1>
            <b-icon-arrow-bar-left/>
            <i>select a template</i>
        </div>
    </section>
</template>

<script>
import { codemirror } from "vue-codemirror";
import LiveFrame from "./LiveFrame.vue";
import LiveFrameChild from "./LiveFrameChild.vue";
import serverApi from "../lib/serve_interface";
import {notifyError, notifySuccess} from "../lib/ToastNotification";
// codemirror dependencies
import "codemirror/lib/codemirror.css";
// language
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
// theme css
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/paraiso-light.css";
// require active-line.js
import "codemirror/addon/selection/active-line";

const Inky = require("inky/lib/inky.js");

export default {
    name: "TemplateEditor",
    data() {
        return {
            template: null,
            html_tab: true,
            css_mode_loaded: false, // lazy load and work around a glitch
            delete_confirmation: "",
        };
    },
    components: {
        codemirror,
        LiveFrame,
        LiveFrameChild,
    },
    computed: {
        title() {
            return `wAPI Lite for ${process.env.VUE_APP_CLIENT}`;
        },
        templateName() {
            return this.$store.state.current_template;
        },
        inkedHtml() {
            const inky = new Inky();

            return inky.releaseTheKraken(this.template.content_img);
        },
        htmlOps() {
            return {
                tabSize: 3,
                styleActiveLine: true,
                lineNumbers: true,
                autoCloseTags: true,
                line: true,
                connect: "align",
            };
        },
        cssOps() {
            return {
                tabSize: 2,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                lineWrapping: true,
                mode: "text/css",
                theme: "paraiso-light",
            };
        },
    },
    methods: {
        toggleEditor(mode) {
            this.html_tab = mode;
            // lazy load and work around a glitch. Otherwise CSS loads weirdly.
            if (this.css_mode_loaded !== true) this.css_mode_loaded = true;
        },
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
        async destroyTemplate() {
            if (this.delete_confirmation === this.templateName) {
                try {
                    const { data: { success } } = await serverApi(
                        "delete",
                        `templates/${this.templateName}`,
                    );

                    this.template = null;
                    this.html_tab = false;
                    this.css_mode_loaded = false;
                    this.$store.commit("setCurrentTemplate", "");

                    await this.$store.dispatch("fetchTemplates");
                    this.delete_confirmation = "";
                    notifySuccess("Template deleted!");
                    return success;

                } catch (e) {
                    notifyError(e.message);
                }
            }
            return false;
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

<style lang="sass">
#editor-container
    width: 100%
.vue-codemirror
    height: 75vh
    overflow: auto
    border: 1px solid #d3d3d3
.CodeMirror
    height: 74vh !important

.action-wrapper
    margin: 25px
.action
    margin-right: 15px

.my-frame
    border: 1px dashed #CCC
    height: 75vh
    width: 100%
</style>
