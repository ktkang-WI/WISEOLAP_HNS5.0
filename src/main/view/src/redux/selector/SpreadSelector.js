import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';
import {selectCurrentDataset} from './DatasetSelector';

export const selectBindingInfos = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId]?.bindingInfos
);

export const selectCurrentBindingInfo = createSelector(
    selectCurrentDataset,
    selectBindingInfos,
    (dataset, bindingInfos) => bindingInfos[dataset.datasetNm]
);

// 사용할 것들

export const selectCurrentData = createSelector(
    selectCurrentReportId,
    (state) => state.meta.spread,
    (reportId, spread) => spread[reportId].mart.data
);
