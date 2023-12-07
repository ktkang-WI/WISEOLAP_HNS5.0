import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectCurrentParameters = createSelector(
    selectCurrentReportId,
    (state) => state.meta.parameter,
    (reportId, parameter) => parameter[reportId]
);

export const selectParameter = createSelector(
    selectCurrentReportId,
    (state) => state.meta.parameter,
    (reportId, parameter) => parameter[reportId]
);
