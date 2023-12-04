import {createSelector} from 'reselect';
import {selectCurrentReportId} from './ReportSelector';

export const selectCurrentDataset = createSelector(
    selectCurrentReportId,
    (state) => state.meta.dataset,
    (reportId, dataset) =>
      dataset[reportId].datasets.find((item) =>
        item.datasetId == dataset[reportId].selectedDatasetId)
);

export const selectCurrentDatasets = createSelector(
    selectCurrentReportId,
    (state) => state.meta.dataset,
    (reportId, dataset) => dataset[reportId].datasets
);

export const selectDatasetQuantity = createSelector(
    selectCurrentReportId,
    (state) => state.meta.dataset,
    (reportId, dataset) => dataset[reportId].datasetQuantity
);
