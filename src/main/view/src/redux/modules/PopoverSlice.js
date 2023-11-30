import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  openedPopover: {isOpen: false}
};

const reducers = {
  openPopover(state, actions) {
    if (!state.openedPopover.isOpen) {
      state.openedPopover = {
        ...state.openedPopover,
        isOpen: true,
        targetRef: actions.payload.targetRef,
        Component: actions.payload.component,
        props: actions.payload.props
      };
    } else {
      state.openedPopover = {isOpen: false};
    }
  },
  closePopover(state, actions) {
    state.openedPopover = {isOpen: false};
  }
};

const extraReducers = {};

const PopoverSlice = createSlice({
  name: 'Popover',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default PopoverSlice;
