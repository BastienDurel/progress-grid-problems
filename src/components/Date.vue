<template>
    <span v-if="makeDate(date)"><span v-if="words">le </span>{{ makeDate(date)!.toLocaleDateString() }} <span
            v-if="forceTime || hasTime(date)"><span v-if="words">
                à
            </span>{{
                makeDate(date)!.toLocaleTimeString(undefined, opts) }}</span></span>
</template>

<script setup lang="ts">
defineProps<{
    date?: Date | string,
    words?: boolean,
    forceTime?: boolean
}>();

const makeDate = (date?: Date | string): Date | null => {
    if (typeof date === 'string')
        return new Date(date);
    if (typeof date === 'object')
        return date;
    return null;
}
const hasTime = (date?: Date | string): boolean => {
    const d = makeDate(date);
    if (d && d.getHours() != 0 && d.getMinutes() != 0) return true;
    return false;
}
const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
};
</script>