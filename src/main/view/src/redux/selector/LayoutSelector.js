import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectRootLayout = createSelector(
    selectCurrentReportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId]
);
/**
 * flexLayout
 */
export const selectFlexLayoutConfig = createSelector(
    selectCurrentReportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId].layoutConfig
);
