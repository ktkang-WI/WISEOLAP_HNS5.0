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
    (reportId, item) => item[reportId]?.selectedItemId
);

export const selectCurrentItem = createSelector(
    selectCurrentReportId,
    (state) => state.meta.item,
    (reportId, item) =>
      item[reportId]?.items.find((i) => i.id == item[reportId]?.selectedItemId)
);

export const selectCurrentItems = createSelector(
    selectCurrentReportId,
    (state) => state.meta.item,
    (reportId, item) => item[reportId]?.items
);

export const selectCurrentAdHocOption = createSelector(
    selectCurrentReportId,
    (state) => state.meta.item,
    (reportId, item) => item[reportId].adHocOption
);

export const selectCurrentDataField = createSelector(
    selectCurrentItem,
    selectCurrentReportId,
    (state) => state.meta.item,
    (selectedItem, reportId, item) => {
      if (item[reportId].adHocOption) {
        return item[reportId].adHocOption.dataField;
      }
      return selectedItem?.meta?.dataField;
    }
);

export const selectCurrentItemType = createSelector(
    selectCurrentItem,
    (selectedItem) => {
      return selectedItem?.type;
    }
);

export const selectCurrentDataMeasure = createSelector(
    selectCurrentItem,
    (selectedItem) => selectedItem.meta.dataField.measure
);

export const selectCurrentDataFieldOption = createSelector(
    selectCurrentItem,
    selectCurrentReportId,
    (state) => state.meta.item,
    (selectedItem, reportId, item) => {
      if (item[reportId].adHocOption) {
        return item[reportId].adHocOption.dataFieldOption;
      }
      return selectedItem ? selectedItem.mart.dataFieldOption : [];
    }
);
