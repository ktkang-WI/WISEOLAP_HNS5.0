import {createSelector} from 'reselect';

export const selectCurrentConfigure = createSelector(
    (state) => state.meta.config.configure,
    (configure) => configure
);

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

