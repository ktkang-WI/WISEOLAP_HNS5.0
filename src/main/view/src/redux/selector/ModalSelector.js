import {createSelector} from 'reselect';

export const selectOpenedModals = createSelector(
    (state) => state.system.modal.openedModals,
    (modals) => modals
);

export const selectQueryDataset = createSelector(
    (state) => state.system.modal.data,
    (data) => data
);
