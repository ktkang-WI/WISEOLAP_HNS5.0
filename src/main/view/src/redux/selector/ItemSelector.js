import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectRootItem = createSelector(
    selectCurrentReportId,
    (state) => state.meta.item,
    (reportId, item) => item[reportId]
);

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
    selectCurrentReportId,
    (state) => state.meta.item,
    (selectedItem, reportId, item) => {
      if (item[reportId].adhocOption) {
        return item[reportId].adhocOption.dataField;
      }
      return selectedItem.meta.dataField;
    }
);

export const selectCurrentDataFieldOption = createSelector(
    selectCurrentItem,
    selectCurrentReportId,
    (state) => state.meta.item,
    (selectedItem, reportId, item) => {
      if (item[reportId].adhocOption) {
        return item[reportId].adhocOption.dataFieldOption;
      }
      return selectedItem ? selectedItem.mart.dataFieldOption : [];
    }
);
