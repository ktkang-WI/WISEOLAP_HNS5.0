import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  openedPopover: {}
};

const reducers = {
  openPopover(state, actions) {
    state.openedPopover = {
      Component: actions.payload.component,
      props: actions.payload.props
    };
  },
  closePopover(state, actions) {
    state.openedPopover = {};
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
