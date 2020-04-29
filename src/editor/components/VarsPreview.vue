<template>
    <section>
        <h3> Variables preview</h3>
        <code>
            {<br/>
                <span class="json-elm" v-for="variable of varsList" :key="variable">
                    &ensp;&ensp;<b>"{{variable}}"</b>: "",
                    <br/>
                </span>

                <span class="json-elm"
                      v-for="[iterator_key, iterations] of iteratorList"
                      :key="iterator_key"
                >
                    &ensp;&ensp;<b>"{{iterator_key}}"</b>:[
                    <br/>&ensp;&ensp;&ensp;&ensp;{<br/>
                        <span class="json-elm" v-for="(key, i) of iterations" :key="`${key}_${i}`">
                            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<b>"{{key}}"</b>: "",
                            <br/>
                        </span>
                    &ensp;&ensp;&ensp;&ensp;}<br/>
                    &ensp;&ensp;]
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
            const vars_exp = /%{+\w+}/g;

            const content_vars = this.arrayOfMatches(this.content, vars_exp, /[%{} ]/g);
            const subj_vars = this.arrayOfMatches(this.subject, vars_exp, /[%{} ]/g);

            const merged_vars = subj_vars.concat(content_vars);

            return Array.from(new Set(merged_vars));
        },
        iteratorList() {
            const subImgExp = (iterator_key) => new RegExp(`<\\s*iterate_+\\s+\\b${iterator_key}+>([^$]+?)<\\/iterate_>`, "gi");

            const iterator_key_list = this.arrayOfMatches(this.content, /<\s*iterate_+\s+\w+/g, "<iterate_ ");
            const iterator_map = new Map();

            iterator_key_list.forEach((iterator_key) => {
                const sub_img = this.content.match(subImgExp(iterator_key))[0];
                const iterators_vars = this.arrayOfMatches(sub_img, /%{i\.+\w+}/gi, /i+\.|[%{} ]/g);

                iterator_map.set(iterator_key, iterators_vars);
            });

            return Array.from(iterator_map);
        },
    },
    methods: {
        arrayOfMatches(
            img,
            match_exp,
            cleanup_exp,
        ) {
            const matches = img.match(match_exp);

            return matches
                ? matches.map((_var) => _var.replace(cleanup_exp, ""))
                : [];
        },
    },
};
</script>

<style scoped lang="sass">

</style>
