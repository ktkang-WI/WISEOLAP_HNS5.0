import {createSelector} from 'reselect';

export const checkLinkReport = createSelector(
    (state) => state.meta.link.informations,
    (link) => link
);
