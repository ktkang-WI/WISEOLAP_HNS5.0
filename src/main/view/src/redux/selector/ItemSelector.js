import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectSelectedItemId = createSelector(
    selectCurrentReportId,
    (state) => state.meta.item,
    (reportId, item) => item[reportId].selectedItemId
);

export const selectCurrentItem = createSelector(
    selectCurrentReportId,
    (state) => state.meta.item,
    (reportId, item) =>
      item[reportId].items.find((i) => i.id == item[reportId].selectedItemId)
);

export const selectCurrentItems = createSelector(
    selectCurrentReportId,
    (state) => state.meta.item,
    (reportId, item) => item[reportId].items
);

export const selectCurrentDataField = createSelector(
    selectCurrentItem,
    (selectedItem) => selectedItem.meta.dataField
);

export const selectCurrentDataFieldOption = createSelector(
    selectCurrentItem,
    (selectedItem) => selectedItem ? selectedItem.mart.dataFieldOption : []
);
