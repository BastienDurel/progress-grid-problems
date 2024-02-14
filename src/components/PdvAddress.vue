<template>
    <div v-if="singleLine" class="single">
        <div class="client" v-if="isPdv">
            {{ contrat.enseigne || contrat.pdv }} {{ contrat.addresse?.join(' ; ') }} {{ contrat.cp }} {{ contrat.commune }}
        </div>
        <div class="client" v-else-if="isTournee">TODO</div>
        <div class="client" v-else>Un secteur géographique d’intervention</div>
    </div>
    <div v-else class="multi">
        <div class="client" v-if="isPdv">
            <div>
                <p>{{ contrat.enseigne || contrat.pdv }}</p>
                <p>{{ contrat.addresse?.join('\n') }}</p>
                <p>{{ contrat.cp }} {{ contrat.commune }}</p>
            </div>
        </div>
        <div class="client" v-else-if="isTournee">
            <div>TODO</div>
        </div>
        <div class="client" v-else>
            <div>Un secteur géographique d’intervention</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const p = defineProps<{
    contrat: any,
    singleLine?: boolean
}>();
const isTournee = ref(false);// TODO
const isPdv = ref(true);// TODO
</script>

<style scoped lang="scss">
.multi .client {
    flex: 1;
    display: flex;
    align-items: center;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;

    >div {
        border: 1px solid black;
        padding: 0.5em 1em;
        width: 100%;

        p {
            white-space: pre-wrap;
        }
    }
}

.single {
    .client {
        font-weight: bold;
    }

    margin-bottom: 0.2em;
}</style>