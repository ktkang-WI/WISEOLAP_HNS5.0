import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  jobCount: 0,
  itemJobCount: 0,
  messageQueue: [],
  itemMessageQueue: []
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
        let count = 0;

        state.messageQueue.forEach((m) => {
          if (msg == m) {
            count ++;
          }
        });

        state.messageQueue = state.messageQueue.filter((m) => m != msg);
        state.jobCount -= count;
        if (state.jobCount < 0) {
          state.jobCount = 0;
        }
      }
    } else {
      if (state.jobCount > 0) {
        state.jobCount = state.jobCount - 1;
      }
    }
  },
  startJobItem(state, actions) {
    const msg = actions.payload;

    if (msg) {
      state.itemMessageQueue.push(msg);
    }

    state.itemJobCount = state.itemJobCount + 1;
  },
  endJobForce() {
    return {
      jobCount: 0,
      itemJobCount: 0,
      messageQueue: [],
      itemMessageQueue: []
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
