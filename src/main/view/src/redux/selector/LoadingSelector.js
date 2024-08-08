import {createSelector} from 'reselect';

export const selectJobQuantity = createSelector(
    (state) => state.system.loading,
    (loading) => loading.jobCount
);

export const selectCurrentJobMessage = createSelector(
    (state) => state.system.loading,
    (loading) => loading.messageQueue.length > 0 ?
      loading.messageQueue[0] : ''
);
