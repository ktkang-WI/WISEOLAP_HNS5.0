import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

/**
 * flexLayout
 */
export const selectFlexLayoutConfig = createSelector(
    selectCurrentReportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId].layoutConfig
);
