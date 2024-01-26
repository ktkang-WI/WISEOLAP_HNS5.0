import {createSelector} from 'reselect';

export const selectOpenedModals = createSelector(
    (state) => state.system.modal.openedModals,
    (modals) => modals
);

export const selectHighLightList = createSelector(
    (state) => state.system.modal.highLightList,
    (highLight) => highLight
);
