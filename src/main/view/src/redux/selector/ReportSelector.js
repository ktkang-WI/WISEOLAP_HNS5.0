import {createSelector} from 'reselect';

/**
 * 보고서 목록 선택
 */
export const selectReports = createSelector(
    (state) => state.meta.report.reports,
    (reports) => reports
);

/**
 * 현재 보고서 state 선택
 */
export const selectCurrentReport = createSelector(
    selectReports,
    (state) => state.meta.report.selectedReportId,
    (reports, reportId) => {
      return reports.find((report) => report.reportId == reportId);
    }
);

export const selectCurrentReportId = createSelector(
    (state) => state.meta.report.selectedReportId,
    (selectedReportId) => selectedReportId
);

