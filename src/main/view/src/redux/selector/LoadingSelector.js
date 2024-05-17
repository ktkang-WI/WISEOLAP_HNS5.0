import {createSelector} from 'reselect';

export const selectJobQuantity = createSelector(
    (state) => state.system.loading,
    (loading) => loading
);
