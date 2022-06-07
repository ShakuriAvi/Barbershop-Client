<template>
    <div>
        <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
        <select class="form-select" id="inlineFormSelectPref" v-model="selected_item" :change="selectHairStyles()">
            <option selected :value="null">Choose Hair Style</option>
            <option v-for="hairStyle in names" :key="hairStyle" :value="hairStyle">{{
                    hairStyle
            }}</option>
        </select>
    </div>
</template>
<script>
export default {

    data() {
        return {
            selected_item: null,

        }
    },
    props: {
        names: {
            default() {
                return []
            },
            type: [Array]

        },
        disabled_bool: {
            default() {
                false
            },
            type: Boolean
        }
    },
    methods: {
        selectHairStyles() {
            this.$emit("selectHairStyles", this.selected_item)
        }
    },
    mounted() {
    }
}
</script>
<style scoped>
</style> 