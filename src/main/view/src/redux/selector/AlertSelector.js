import {createSelector} from 'reselect';

export const selectAlert = createSelector(
    (state) => state.meta.alert.isAlertShown,
    (alert) => alert
);
