import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  openedModals: [],
  data: {}
};

const reducers = {
  open(state, actions) {
    const Component = actions.payload.Component;
    const props = actions.payload.props;
    state.openedModals = [...state.openedModals, {Component, props}];
  },
  close(state, actions) {
    state.openedModals = state.openedModals.filter((modal, index) => {
      return index !== actions.payload;
    });
    state.data = {};
  },
  setData(state, actions) {
    state.data = actions.payload;
  }
};

const extraReducers = {};

const ConfigSlice = createSlice({
  name: 'Modal',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ConfigSlice;
