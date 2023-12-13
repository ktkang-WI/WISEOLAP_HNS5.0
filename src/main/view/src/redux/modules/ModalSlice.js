import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  openedModals: [],
  highLightList: []
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
  },
  setHighLight(state, actions) {
    state.highLightList = state.highLightList.concat(actions.payload);
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
