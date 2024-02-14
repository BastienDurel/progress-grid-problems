<script lang="ts">
import { SvgIcon } from "@progress/kendo-vue-common";
import { Button } from "@progress/kendo-vue-buttons";
import { clearCssIcon, eyeIcon, eyeSlashIcon } from "@progress/kendo-svg-icons";
import { mergeColumns } from './grid';
import { GridColumnPropsT } from '../stores/state';
</script>

<script setup lang="ts">
const props = defineProps<{
    columns: GridColumnPropsT[] | null,
    defaultColumns: GridColumnPropsT[],
    keepMargin?: boolean,
}>();
const emits = defineEmits<{
    (e: 'toggle', columnTitle: string): void,
    (e: 'reset-columns'): void
}>()
function toggleColumn(event: any) {
    let data = event.target.getAttribute('data') ||
        event.target.parentNode?.getAttribute('data') ||
        event.target.parentNode?.parentNode?.getAttribute('data');
    if (data) {
        emits('toggle', data);
    }
}
const columns = () => mergeColumns(props.defaultColumns, props.columns);
</script>

<template style="width: 100%">
    <div class="button-wrapper"><Button type="button" @click="$emit('reset-columns')"
            :svg-icon="clearCssIcon">Ré-initialiser les colonnes</Button></div>
    <ul class="k-list-ul">
        <li v-for="col in columns().filter(c => !c.locked)" @click="toggleColumn" class="k-list-item" :data="col.title">
            {{ col.title }}
            <span :class="{ toggle: true, keepMargin: keepMargin }" :data="col.title">
                <SvgIcon v-if="!col.hidden" :icon="eyeIcon" :data="col.title" />
                <SvgIcon v-else :icon="eyeSlashIcon" :data="col.title" />
            </span>
        </li>
    </ul>
</template>

<style scoped lang="scss">
.button-wrapper {
    margin: 0.5em;
}

ul {
    padding: 0;
    margin: 0.5em;
    width: 100%;
}

li {
    display: block;
    margin: 0 -0.5em;
    padding: 0 0.5em;

    .toggle>span {
        float: right;
        margin-right: 0em;
    }

    .keepMargin.toggle>span {
        margin-right: 1em;
    }
}
</style>