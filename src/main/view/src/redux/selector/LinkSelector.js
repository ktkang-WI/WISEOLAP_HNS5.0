import {createSelector} from 'reselect';

export const selectLinkedReport = createSelector(
    (state) => state.meta.link.linkReport,
    (link) => link
);
