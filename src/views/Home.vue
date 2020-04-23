<template>
    <section>
        <div class="container row">
            <div class="is-2">
                <TemplateNavigator/>
            </div>
            <div class="is-10">
                <TemplateEditor />
            </div>
        </div>
    </section>
</template>

<script>
// @ is an alias to /src
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
