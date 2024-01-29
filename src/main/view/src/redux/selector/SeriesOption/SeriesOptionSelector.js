import {createSelector} from 'reselect';
import {selectCurrentDataField} from '../ItemSelector';

export const selectSeriesOption = createSelector(
    selectCurrentDataField,
    (selectedDataField) => selectedDataField.seriesOptions
);
