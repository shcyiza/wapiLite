<template>
    <section>
        <b-row class="container">
            <b-col class="fullcolumns" sm="2">
                <TemplateNavigator/>
            </b-col>
            <b-col class="fullcolumns" sm="10">
                <TemplateEditor />
            </b-col>
        </b-row>
    </section>
</template>

<script>
// @ is an alias to /api
import TemplateEditor from "../components/TemplateEditor.vue";
import TemplateNavigator from "../components/TemplateNavigator.vue";

export default {
    name: "Home",
    components: {
        TemplateEditor,
        TemplateNavigator,
    },
};
</script>

<style lang="sass">
.fullcolumns
    padding: unset !important
</style>
