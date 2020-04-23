<template>
    <section id="template-editor">
        <div v-if="getCurrentTemplate">
            <h1>
                Editing > <strong>{{getCurrentTemplate}}</strong>
            </h1>
        </div>

        <div v-else>
            <h1>TemplateEditor</h1>
        </div>
    </section>
</template>

<script>
export default {
    name: "TemplateEditor",
    data() {
        return {};
    },
    computed: {
        getCurrentTemplate() {
            return this.$store.state.current_template;
        },
    },
};
</script>

<style scoped lang="sass">
#template-editor
    padding: 15px
    width: 100%
</style>
