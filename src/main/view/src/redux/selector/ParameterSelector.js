import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectRootParameter = createSelector(
    selectCurrentReportId,
    (state) => state.meta.parameter,
    (reportId, parameter) => parameter[reportId]
);

export const selectCurrentInformationas = createSelector(
    selectCurrentReportId,
    (state) => state.meta.parameter,
    (reportId, parameter) => parameter[reportId].informations
);
