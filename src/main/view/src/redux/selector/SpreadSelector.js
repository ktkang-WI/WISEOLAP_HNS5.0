import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';
import {selectCurrentDataset} from './DatasetSelector';

export const selectSpread = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId]
);

export const selectSpreadMeta = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].meta
);

export const selectBindingInfos = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId]?.meta?.bindingInfos
);

export const selectCurrentBindingInfo = createSelector(
    selectCurrentDataset,
    selectBindingInfos,
    (dataset, bindingInfos) => bindingInfos[dataset.datasetNm]
);

export const selectCurrentSpreadData = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => _.cloneDeep(spread[reportId]?.mart?.spreadData)
);

export const selectSpreadData = createSelector(
    [(state) => state.meta.spread, (state, reportId) => reportId],
    (spread, reportId) => spread[reportId]?.mart?.spreadData
);

