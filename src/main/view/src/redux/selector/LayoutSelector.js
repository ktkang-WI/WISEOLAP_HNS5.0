import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

/**
 * flexLayout
 */
export const flexLayoutConfig = createSelector(
    selectCurrentReportId,
    (state) => state.meta.layout,
    (reportId, layout) => layout[reportId].layoutConfig
);
