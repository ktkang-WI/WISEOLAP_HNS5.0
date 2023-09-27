import {createSelector} from 'reselect';

export const selectReports = createSelector(
    (state) => state.meta.report.reports,
    (reports) => reports
);

export const selectCurrentReport = createSelector(
    selectReports,
    (state) => state.meta.report.selectedReportId,
    (reports, reportId) => {
      return reports.find((report) => report.reportId == reportId);
    }
);

export const selectCurrentReportDatasets = createSelector(
    selectReports,
    (state) => state.meta.report.selectedReportId,
    (reports, reportId) => {
      return reports.find((report) => report.reportId == reportId).datasets;
    }
);

