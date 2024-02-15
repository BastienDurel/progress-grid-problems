import { GridColumnProps, GridPageChangeEvent, GridColumnReorderEvent, GridColumnResizeEvent } from '@progress/kendo-vue-grid';
import { GridStateStore, GridColumnPropsT } from '../stores/state'

export const extractColumns = (data: any): Array<GridColumnProps> => {
    if (data?.length > 0) {
        console.log(Object.keys(data[0]))
        return Object.keys(data[0]).map(c => { return { field: c } });
    }
    return [{}];
}
export const rowClass = (row: any) => {
    const tek = row?.dataItem?.tek || 0;
    let klass = '';
    if (row?.dataItem?.loading) klass += ' api-in-progress';
    if (row?.dataItem?.currentlyModified && !(row?.dataItem?.statutAPI === 'APPELENCOURS')) klass += ' lock';
    if (row?.dataItem?.bloque) klass += ' bloque';
    if (tek & 1 && row.dataIndex > 1) klass += ' first-in-group';
    if (tek & 2) klass += ' last-in-group';
    return klass;
}

export function mergeColumns(defaults: GridColumnPropsT[], stored?: GridColumnPropsT[] | null): GridColumnProps[] {
    if (!stored) {
        //console.log("defaults");
        return defaults;
    }
    const ret = defaults.map((c, i) => {
        const n: any = { orderIndex: i };
        const st = stored.find(d => d.tid === c.tid || (c.tid === undefined && c.field == d.field));
        if (st) {
            if (st.width) n.width = st.width;
            if (st.orderIndex) n.orderIndex = st.orderIndex;
            if (st.hidden) n.hidden = st.hidden;
        }
        return Object.assign({}, c, n);
    });
    if (ret[0].hidden && ret[0].columnMenu) {
        // Make sure column menu is accessible
        ret.find(x => !x.hidden).columnMenu = ret[0].columnMenu;
    }
    //console.log(ret);
    return ret;
}

interface refreshCb { (): void };
export function pageChangeHandler(event: GridPageChangeEvent, state: GridStateStore, refreshCb?: refreshCb) {
    //if (state.filters.database) {
        state.take = event.page.take;
        state.skip = event.page.skip;
        if (refreshCb) refreshCb();
    //}
}

export function reorderColumns(event: GridColumnReorderEvent, state: GridStateStore, defaultColumns: GridColumnPropsT[]) {
    if (!state.columns) state.columns = defaultColumns.map(c => Object.assign({}, c));
    for (let i = 1; i < state.columns.length; ++i) {
        const item = state.columns[i];
        if (item.orderIndex === undefined)
            item.orderIndex = i;
    }
    const prev = state.columns[event.prev];
    const next = state.columns[event.next];
    const swap = prev.orderIndex;
    prev.orderIndex = next.orderIndex;
    next.orderIndex = swap;
}

export function resizeColumns(event: GridColumnResizeEvent, state: GridStateStore) {
    if (!event.end) return;
    event.columns[event.index].width = event.newWidth;
    if (!state.columns) state.columns = event.columns.map(c => Object.assign({}, c) as GridColumnPropsT);
    else state.columns[event.index].width = event.newWidth;
}

export function toggleColumn(title: string, state: GridStateStore, defaultColumns: GridColumnPropsT[]) {
    if (!state.columns)
        state.columns = defaultColumns.map(c => Object.assign({}, c));
    const col = state.columns.find(c => c.title == title);
    if (col) col.hidden = !col.hidden;
}

export function resetColumns(state: GridStateStore) {
    state.columns = null;
    state.key = (state.key || 1) + 1;
}
