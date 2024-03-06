import {createSelector} from 'reselect';

export const selectCurrentDesignerMode = createSelector(
    (state) => state.meta.config.designerMode,
    (designerMode) => designerMode
);

export const selectEditMode = createSelector(
    (state) => state.meta.config.editMode,
    (editMode) => editMode
);

export const selectInitialDisplay = createSelector(
    (state) => state.meta.config.initialDisplay,
    (initialDisplay) => initialDisplay
);

