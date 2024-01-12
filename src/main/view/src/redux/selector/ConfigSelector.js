import {createSelector} from '@reduxjs/toolkit/dist';

export const selectCurrentReportType = createSelector(
    (state) => state.meta.config,
    (config) => config.reportType
);
