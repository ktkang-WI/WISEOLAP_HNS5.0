import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';
import {selectCurrentDataset} from './DatasetSelector';

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
