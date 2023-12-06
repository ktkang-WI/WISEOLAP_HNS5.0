import {createSelector} from 'reselect';

export const selectOpenedPopover = createSelector(
    (state) => state.system.popover.openedPopover,
    (popover) => popover
);
