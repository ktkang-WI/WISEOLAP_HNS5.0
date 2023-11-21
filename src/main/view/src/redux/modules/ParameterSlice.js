import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  0: {
    informations: [],
    values: {},
    filterSearchComplete: 0
  }
};

const reducers = {
  // 파라미터로 reportId, informations
  setParameterInformation(state, actions) {
    const reportId = actions.payload.reportId;
    const informations = actions.payload.informations;

    state[reportId].informations = informations;
    state[reportId].filterSearchComplete = 0;
  },
  // 파라미터로 reportId, values
  setParameterValues(state, actions) {
    const reportId = actions.payload.reportId;
    const values = actions.payload.values;
    state[reportId].values = Object.assign(state[reportId].values, values);
  },
  // 파라미터로 reportId
  initParameter(state, actions) {
    state[actions.payload] = {
      informations: [],
      values: {},
      filterSearchComplete: 0
    };
  },
  filterSearchComplete(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].filterSearchComplete++;
  }
};

const extraReducers = {};

const ParameterSlice = createSlice({
  name: 'Parameter',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ParameterSlice;
