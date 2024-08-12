import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  jobCount: 0,
  messageQueue: []
};

const reducers = {
  startJob(state, actions) {
    const msg = actions.payload;

    if (msg) {
      state.messageQueue.push(msg);
    }

    state.jobCount = state.jobCount + 1;
  },
  endJob(state, actions) {
    const msg = actions.payload;

    if (msg) {
      const idx = state.messageQueue.indexOf(msg);
      if (idx >= 0) {
        state.messageQueue = state.messageQueue.filter((v) => msg != v);
        state.jobCount = state.jobCount - 1;
      }
    } else {
      if (state.jobCount > 0) {
        state.jobCount = state.jobCount - 1;
      }
    }
  },
  endJobForce() {
    return {
      jobCount: 0,
      messageQueue: []
    };
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
