import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectSheets = createSelector(
    (state) => state.meta.spread.sheets,
    (sheets) => sheets
);

export const selectExcelIO = createSelector(
    (state) => state.meta.spread.excelIO,
    (excelIO ) => excelIO
);

export const selectCurrentDesigner = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].designer
);

export const selectBindingInfos = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].bindingInfos
);
