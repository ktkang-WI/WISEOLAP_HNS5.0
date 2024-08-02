import {createSelector} from 'reselect';

export const selectRootConfig = createSelector(
    (state) => state.meta.config,
    (config) => config
);

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

export const selectMyPageDesignerConfig = createSelector(
    (state) => state.meta.config.myPageConfigure,
    (myPageConfigure) => myPageConfigure
);

export const selectUserName = createSelector(
    (state) => state.meta.config.myPageConfigure,
    (myPageConfigure) => myPageConfigure?.userNm
);

