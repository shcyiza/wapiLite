<template>
    <section>
        <h3> Variables preview</h3>
        <code>
            {<br/>
                <span class="json-elm" v-for="(variable, i) of varsList" :key="i">
                    <b>"{{variable}}"</b>: "",
                    <br/>
                </span>
            }
        </code>
    </section>

</template>

<script>
export default {
    name: "VarsPreview",
    props: {
        content: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
    },
    computed: {
        varsList() {
            const regex = /%{+\w+}/g;

            const content_matches = this.content.match(regex);
            const subj_matches = this.subject.match(regex);

            const content_vars = content_matches
                ? content_matches.map((_var) => _var.replace(/[%{} ]/g, ""))
                : [];

            const subj_vars = subj_matches
                ? subj_matches.map((_var) => _var.replace(/[%{} ]/g, ""))
                : [];

            const merged_vars = subj_vars.concat(content_vars);

            return Array.from(new Set(merged_vars));
        },
    },
};
</script>

<style scoped lang="sass">

</style>
