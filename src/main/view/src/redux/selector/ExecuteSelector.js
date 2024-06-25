import {createSelector} from 'reselect';

export const currentDesignerExecution = createSelector(
    (state) => state.system.execute.desinerIsExecute,
    (isExecute) => isExecute
);

export const currentViewerExecution = createSelector(
    (state) => state.system.execute.viewerIsExecute,
    (isExecute) => isExecute
);
