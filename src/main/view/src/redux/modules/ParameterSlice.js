import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  0: {
    informations: [],
    values: {},
    filterSearchComplete: []
  }
};

const reducers = {
  // 파라미터로 reportId, informations
  setParameterInformation(state, actions) {
    const reportId = actions.payload.reportId;
    const informations = actions.payload.informations;

    state[reportId].informations = informations;
    state[reportId].values = {};
    state[reportId].filterSearchComplete = [];
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
      filterSearchComplete: []
    };
  },
  filterSearchComplete(state, actions) {
    const reportId = actions.payload.reportId;
    const filterId = actions.payload.id;
    state[reportId].filterSearchComplete =
        state[reportId].filterSearchComplete.concat([filterId]);
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
