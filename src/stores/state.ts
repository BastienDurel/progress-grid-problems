const LOCAL_STORAGE_KEY = 'states_commandes_v6'

import { defineStore } from 'pinia'
import { useLocalStorage, UseStorageOptions } from "@vueuse/core"
import hash from 'object-hash'
import { GridColumnProps } from '@progress/kendo-vue-grid';


export interface GridColumnPropsT extends GridColumnProps {
    tid: number;
}

export interface GridStateStore {
    resizable: boolean;
    reorderable: boolean;
    sortable: boolean;
    skip: number;
    take: number;
    filters: any;
    filtersHash?: string;
    columns: GridColumnPropsT[] | null;
    total: number;
    key: number;
    data?: any[];
  }

const EMPTY_FILTERS: any = {
  inactiveClients: false, currentCmd: false, uneditedCmd: false, nearbyPDV: false, currentCamp: false, salAutobooked: false
};
const DEFAULT_FILTERS: any = Object.assign({
    cmdAffecte: { id: "non_part", text: "Non affectée(s)" },
  }, EMPTY_FILTERS);
export const default_: GridStateStore = {
  sortable: true,
  reorderable: true,
  resizable: true,
  skip: 0,
  take: 10,
  total: 0,
  key: 1,
  columns: null,
  filters: DEFAULT_FILTERS,
  filtersHash: hash(DEFAULT_FILTERS)
};

export const stringFilters: any = { salarie: true, numCmd: true };
export const arrayFilters: any = { clientDenom: true, metier: true, pdvRegion: true, pdvDept: true };
export const booleanFilters: any = { inactiveClients: true, currentCmd: true, uneditedCmd: true, nearbyPDV: true, currentCamp: true, salAutobooked: true };

export const workaround: any = {
  region: null,
  clientDenom: [], clientCentralisateur: null, /* unused: */ clientContact: null, cmdDelaiMax: null,
  pdvRegion: [], pdvDenom: null, pdvDept: [], pdvCommune: null,
  cmdRobot: null, cmdAffecte: null, etatContrat: null,
  metier: [], numCmd: '', cmdFrom: null, cmdTo: null, /* unused: */ cmdType: null, cmdPassage: null, cmdActif: null,
  campFamille: null, campDenom: null, /* unused: */ campType: null,
  salarie: '', salAutobookFrom: null,
};

export function loadFromJson(v?: string): GridStateStore {
  const ret: GridStateStore = (v ? JSON.parse(v) : null);
  if (ret) {
    // Convert serialized dates in Date
    const dt = (k: string) => {
      const _k = k as keyof any;
      if (ret.filters[_k] && typeof ret.filters[_k] == 'string')
        ((ret.filters[_k]) as Date) = new Date(ret.filters[_k] as string);
    };
    dt('cmdTo');
    dt('cmdFrom');
    dt('presenceFrom');
    dt('salAutobookFrom');
    dt('presenceFrom');
    dt('presenceTo');
    if (!ret.key) ret.key = 1;
  }
  return ret;
}

export const gridStateStore = defineStore('states_commandes', {
  state: () => {
    return useLocalStorage(LOCAL_STORAGE_KEY, default_, {
      serializer: {
        read: loadFromJson,
        write: (v: GridStateStore) => JSON.stringify(v),
      }
    } as UseStorageOptions<GridStateStore>);
  },
  actions: {
    clearFilters() {
      this.filters = Object.assign({ database: this.filters.database }, workaround, EMPTY_FILTERS);
      console.debug('filters cleared');
    },
    loginClearFilters() {
      const nf = Object.assign({ database: this.filters.database }, workaround, EMPTY_FILTERS);
      if (this.filters.region)// Keep Région/agenceRegion/Dir-Resp Région
        nf.region = this.filters.region;
      if (this.filters.cmdFrom)// Keep dates
        nf.cmdFrom = this.filters.cmdFrom;
      if (this.filters.cmdTo)// Keep dates
        nf.cmdTo = this.filters.cmdTo;
      if (this.filters.cmdAffecte)// Keep affectation
        nf.cmdAffecte = this.filters.cmdAffecte;
      this.filters = nf;
    }
  }
})

export default gridStateStore;