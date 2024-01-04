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

export const selectCurrentWorkbook = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].workbook
);

export const selectCurrentBindingInfos = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].bindingInfos
);
