import {createSlice} from '@reduxjs/toolkit';

const initialState = {
};

const reducers = {
  updateConfig(state, actions) {
    Object.assign(state, actions.payload);
  }
};

const extraReducers = {};

const ConfigSlice = createSlice({
  name: 'Config',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ConfigSlice;
