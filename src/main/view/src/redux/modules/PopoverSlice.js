import {createSlice} from '@reduxjs/toolkit';
import {isEmpty} from 'lodash';

const initialState = {
  openedPopover: {}
};

const reducers = {
  onAndOffPopover(state, actions) {
    if (isEmpty(state.openedPopover)) {
      state.openedPopover = {
        ...state.openedPopover,
        isOpen: true
      };
    } else {
      state.openedPopover = {};
    }
  },
  openPopover(state, actions) {
    const target = actions.payload.target;
    const content = actions.payload.content;

    state.openedPopover = {
      ...state.openedPopover,
      target: target,
      content: content
    };
  },
  openPopover2(state, actions) {
    state.openedPopover = {
      ...state.openedPopover,
      isOpen: true,
      target: actions.payload
    };
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
