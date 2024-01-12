import {createSelector} from 'reselect';

export const selectCurrentDesignerMode = createSelector(
    (state) => state.meta.config.designerMode,
    (designerMode) => designerMode
);
