import {createSlice} from '@reduxjs/toolkit';
import ReportType from 'components/designer/util/ReportType';

const initialState = {
  reportType: ReportType.DASH_ANY
};

const reducers = {
  updateConfig(state, actions) {
    Object.assign(state, actions.payload);
  },
  setReportType(state, actions) {
    state.reportType = actions.payload;
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
