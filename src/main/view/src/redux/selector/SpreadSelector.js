import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectSheets = createSelector(
    (state) => state.meta.spread.Sheets,
    (Sheets) => Sheets
);

export const selectExcelIO = createSelector(
    (state) => state.meta.spread.excelIO,
    (excelIO ) => excelIO
);

export const selectCurrentSpreadJS = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].spreadJS
);

export const selectCurrentDataPosition = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].dataPosition
);

export const selectCurrentUseHeader = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].useHeader
);

export const selectCurrentUseBoarder = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].useBoarder
);
