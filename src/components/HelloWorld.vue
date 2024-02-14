<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { Button } from '@progress/kendo-vue-buttons';
import { Grid, GridSortChangeEvent } from '@progress/kendo-vue-grid';
import { Tooltip } from '@progress/kendo-vue-tooltip';
import { SortDescriptor } from '@progress/kendo-data-query';
import { arrowRotateCwIcon, chevronLeftIcon, filterClearIcon, gearIcon, gridLayoutIcon, saveIcon } from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-vue-common";
import axios from 'axios';
import getState, { GridColumnPropsT } from '../stores/state';
import { mergeColumns, pageChangeHandler, reorderColumns, resizeColumns } from './grid';
import PdvAddress from "../components/PdvAddress.vue";
import DateStr from "../components/Date.vue";
import ColumnsGridMenu from '../components/ColumnsGridMenu.vue';

const state = getState();
const sort = ref<SortDescriptor[]>([]);
const data = ref([]);
const loader = ref<boolean>(false);

const reportIcons = [arrowRotateCwIcon, chevronLeftIcon, filterClearIcon, gearIcon];
const DEFAULT_COLUMNS: GridColumnPropsT[] = [
  { tid: 1, field: "numCmde", title: "N⁰ de Cde", columnMenu: 'columnsMenuTemplate', reorderable: false },
  { tid: 2, field: "client", title: "Client" },
  { tid: 3, field: "campagne", title: "Campagne" },
  { tid: 4, field: "poste", title: "Poste" },
  { tid: 5, field: "salarie", title: "Salarié" },
  { tid: 6, cell: "tel", field: "numMobile", title: "N⁰ mob" },
  { tid: 7, field: "numContrat", title: "N⁰ Contrat" },
  { tid: 8, cell: "formation", title: "Formation", width: 60, sortable: false },
  { tid: 9, cell: "etatTemplate", field: "etatContrat", title: "État Contrat", sortable: false },
  { tid: 10, cell: "dateContratTemplate", field: "dateContrat", title: "Date Contrat", sortable: false },
  { tid: 11, cell: "pdv", field: "pdv", title: "PDV" },
  { tid: 12, field: "hDeb", title: "H Deb", width: 40 },
  { tid: 13, field: "hFin", title: "H Fin", width: 40 },
  { tid: 14, cell: "date", field: "datePassage", title: "Date Interv" },
  { tid: 15, cell: "presence", field: "etat", title: "Suivi prés." },
  { tid: 16, cell: "suiviRR", title: "Suivi RR", width: 50, sortable: false },
  { tid: 17, cell: "reporting", title: "Reporting", width: 100, sortable: false },
];
function refreshData() {
  loader.value = true;
  axios.get("https://neroli.tests.data.fr/Commandes", {
    params: { skip: state.skip, count: state.take }
  }).then(r => data.value = r.data)
    .catch(e => { console.error(e); alert(`Error: ${e}`); })
    .finally(() => loader.value = false);
}
function sortChangeHandler(event: GridSortChangeEvent) {
  console.log(event);
  sort.value = event.sort;
  refreshData();
}
nextTick(refreshData);

function toggleColumn(title: string) {
  if (!state.columns) {
    state.columns = DEFAULT_COLUMNS;
  }
  const col = state.columns.find(c => c.title == title);
  if (col) col.hidden = !col.hidden;
}

function resetColumns() {
  state.columns = null;
  state.key = (state.key || 1) + 1;
}

const reportingTitle = (data: any, report: number) => {
  switch ((_state(data) + report) % 3) {
    case 0: return undefined;
    case 1: return "OK";
    case 2: return "Bad !";
    default: return undefined;
  }
}

const _state = (data: any): number => (data.numCmde || 1) + (data.etat || 0);
const _class = (num: number) => {
  switch (num % 3) {
    case 0: return "secondary";
    case 1: return "success";
    case 2: return "error";
    default: return "secondary";
  }
}
const reportingTheme = (data: any, report: number) => _class(_state(data) + report);
const reportingClass = (data: any, report: number) => _class(_state(data) + report);
const formationClass = (data: any) => "formation " + _class(_state(data) + 1);
const suiviRRClass = (data: any) => "suivi-rr " + _class(_state(data) + 2);

const reportingClick = (_data: any, _report: number) => 0;
const formationClick = (_data: any) => 0;
const suiviRRClick = (_data: any) => 0;
</script>

<template>
  <Button @click="refreshData" :svg-icon="arrowRotateCwIcon">Recharger</Button>
  <Grid :data-items="data" :key="state.key" :columns="mergeColumns(DEFAULT_COLUMNS, state.columns)" :size="'small'"
    :resizable="state.resizable" :sort="sort" :reorderable="state.reorderable" :sortable="state.sortable" :pageable="{
      info: true,
      pageSizes: [10, 15, 20, 50, 100],
      pageSizeValue: state.take,
      buttonCount: 10,
    }" :skip="state.skip" :take="state.take" :total="state.total" :page-size="state.take" :loader="loader"
    @pagechange="e => pageChangeHandler(e, state, refreshData)" @sortchange="sortChangeHandler"
    @columnreorder="e => reorderColumns(e, state, DEFAULT_COLUMNS)" @columnresize="e => resizeColumns(e, state)">
    <template v-slot:etatTemplate="{ props }">
      <td :class="props.class + ' date'" role="gridcell">
        baz
      </td>
    </template>
    <template v-slot:dateContratTemplate="{ props }">
      <td :class="props.class + ' date'" role="gridcell">
        bar
      </td>
    </template>
    <template v-slot:date="{ props }">
      <td :class="props.class + ' date'" role="gridcell">
        <DateStr :date="props.dataItem[props.field]" />
      </td>
    </template>
    <template v-slot:pdv="{ props }">
      <td :class="props.class" role="gridcell">
        <Tooltip content="addr" tooltip-class-name="neroli-tooltip-template" :show-callout="false">
          <span title="x">{{ props.dataItem.pdv }}</span>
          <template v-slot:addr>
            <PdvAddress :contrat="props.dataItem" />
          </template>
        </Tooltip>
      </td>
    </template>
    <template v-slot:presence="{ props }">
      <td :class="props.class" role="gridcell">
        foo
      </td>
    </template>
    <template v-slot:formation="{ props }">
      <td :class="props.class" role="gridcell">
        <Tooltip content="tt" tooltip-class-name="neroli-tooltip-template" :parent-title="true" :show-callout="false">
          <div :class="formationClass(props.dataItem)" title="Formation">
            <SvgIcon :icon="gridLayoutIcon" :size="'xl'" @click="formationClick(props.dataItem)" />
          </div>
          <template v-slot:tt>
            <p>Formation&nbsp;:
              <span v-if="!props.dataItem.formation">Non Applicable</span>
              <span v-else-if="!props.dataItem.formationDate">Non Faite</span>
              <span v-else-if="props.dataItem.formationValidee">Ok</span>
              <span v-else>Incomplète</span>
            </p>
            <p v-if="props.dataItem.formationDate">
              <DateStr :date="props.dataItem.formationDate" />
            </p>
            <p v-if="props.dataItem.formationDate && props.dataItem.formationNote !== null">Note: {{
              props.dataItem.formationNote }}</p>
          </template>
        </Tooltip>
      </td>
    </template>
    <template v-slot:suiviRR="{ props }">
      <td :class="props.class" role="gridcell">
        <Tooltip tooltip-class-name="neroli-tooltip-template" :parent-title="true" :show-callout="false">
          <div :class="suiviRRClass(props.dataItem)" title="Rapport du Responsable de Région">
            <SvgIcon :icon="saveIcon" :size="'xl'" @click="suiviRRClick(props.dataItem)" />
          </div>
        </Tooltip>
      </td>
    </template>
    <template v-slot:reporting="{ props }">
      <td :class="props.class" role="gridcell">
        <div class="reporting">
          <Tooltip v-for="report in [1, 2, 3]" tooltip-class-name="neroli-tooltip-br" class-name="over-badge"
            :parent-title="true" :show-callout="false">
            <SvgIcon :icon="reportIcons[report]" :size="'xl'" :class="reportingClass(props.dataItem, report)"
              @click="reportingClick(props.dataItem, report)" :themeColor="reportingTheme(props.dataItem, report)"
              :title="reportingTitle(props.dataItem, report)" />
            <template v-slot:content>{{ report }}</template>
            <span :class="`spacer spacer-${report}`"></span>
          </Tooltip>
        </div>
      </td>
    </template>
    <template v-slot:tel="{ props }">
      <td :class="props.class" role="gridcell">
        {{ props.dataItem.numMobile }}
      </td>
    </template>
    <template v-slot:columnsMenuTemplate>
      <div class="k-list-content">
        <ColumnsGridMenu :columns="state.columns" :default-columns="DEFAULT_COLUMNS" @toggle="toggleColumn"
          @reset-columns="resetColumns" :keep-margin="true"></ColumnsGridMenu>
      </div>
    </template>
  </Grid>
</template>

<style scoped lang="scss">
.k-grid {
  height: calc(100vh - 84px)
}

.k-button {
  margin-bottom: 1em;
}

.formation,
.reporting,
.suivi-rr {
  text-align: center;

  .spacer {
    width: 0.5em;
    display: inline-block;
  }

  .spacer.spacer-3 {
    display: none;
  }
}

.reporting>div {
  display: inline;
}

td {

  div.secondary,
  .na,
  .presence.N {
    color: #6c757d;
  }

  div.success,
  .complete,
  .presence.P {
    color: #198754;
  }

  .incomplete,
  .presence.D,
  .presence.X,
  .presence.L,
  .presence.R {
    color: orange;
  }

  div.error,
  .not-done,
  .presence.A {
    color: #dc3545;
  }

  .incomplete,
  .not-done {
    cursor: pointer;
  }
}
</style>
