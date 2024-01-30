import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  openedModals: [],
  modalNumber: 0
};

const reducers = {
  open(state, actions) {
    const Component = actions.payload.Component;
    const props = actions.payload.props;
    const modalNumber = state.modalNumber++;
    state.openedModals = [...state.openedModals, {
      Component, props, id: modalNumber
    }];
  },
  close(state, actions) {
    state.openedModals = state.openedModals.filter((modal, index) => {
      return modal.id != actions.payload;
    });
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
