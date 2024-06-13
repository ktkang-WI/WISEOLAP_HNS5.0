import {createSlice} from '@reduxjs/toolkit';

const initialState = 0;

const reducers = {
  startJob(state) {
    return state + 1;
  },
  endJob(state, actions) {
    if (state > 0) {
      return state - 1;
    }
    return 0;
  },
  endJobForce() {
    return 0;
  }
};

const extraReducers = {};

const LoadingSlice = createSlice({
  name: 'Loading',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default LoadingSlice;
