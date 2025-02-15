import {createSelector} from 'reselect';

/**
 * ROOT 보고서 선택
 */
export const selectRootReport = createSelector(
    (state) => state.meta.report,
    (report) => report
);


/**
 * 보고서 목록 선택
 */
export const selectReports = createSelector(
    (state) => state.meta.report.reports,
    (reports) => reports
);

export const selectReport = createSelector(
    (state, reportId) => reportId,
    selectReports,
    (reportId, reports) => reports.find((report) => report.reportId == reportId)
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
