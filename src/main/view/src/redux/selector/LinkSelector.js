import {createSelector} from 'reselect';

export const selectLinkedReport = createSelector(
    (state) => state.meta.link.linkReport,
    (link) => link
);

export const selectNewLinkParamInfo = createSelector(
    (state) => state.meta.link.newLinkParamInfo,
    (link) => link
);

export const selectNewLinkCnt = createSelector(
    (state) => state.meta.link.newLinkCnt,
    (link) => link
);
