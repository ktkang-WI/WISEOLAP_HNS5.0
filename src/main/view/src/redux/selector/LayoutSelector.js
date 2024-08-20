import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectRootLayout = createSelector(
    selectCurrentReportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId]
);

export const selectReportLayout = createSelector(
    (state, reportId) => reportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId]
);

export const selectSelectedTab = createSelector(
    selectCurrentReportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId].selectedTab || 0
);

export const selectFlexLayoutConfig = createSelector(
    selectCurrentReportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId]?.layoutConfig
);
