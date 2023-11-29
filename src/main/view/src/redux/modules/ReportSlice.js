import {createSlice} from '@reduxjs/toolkit';
import localizedString from 'config/localization';

const initialState = {
  selectedReportId: 0,
  reports: [{
    reportId: 0,
    options: {
      name: localizedString.defaultReportName,
      subName: '',
      fldId: 0,
      fldName: '',
      fldType: '',
      order: 0,
      tag: '',
      description: '',
      path: '', // 해당 경로 비어있을 경우 새 보고서
      chartXML: '',
      datasetXML: '',
      layoutXML: '',
      reportXML: '',
      paramXML: '',
      regDt: '',
      regUserNo: '',
      reportType: ''
    }
  }]
};

const reducers = {
  /* REPORT */
  initReport(state, actions) {
    state.reports = initialState.reports;
  },
  insertReport(state, actions) {
    state.reports = state.reports.concat(actions.payload);
    // state.selectedReportId = actions.payload.reportId;
  },
  updateReport(state, actions) {
    const index = state.reports.findIndex(
        (report) => report.reportId == actions.payload.reportId
    );
    if (index > 0) {
      state.reports[index] = actions.payload;
    } else {
      state.reports = state.reports.concat(actions.payload);
    }
  },
  deleteReport(state, actions) {
    state.reports = state.reports.filter(
        (report) => report.reportId != actions.payload);
  },
  deleteAllReport(state, actions) {
    state.reports = [];
  }
};

const extraReducers = {};

const ReportSlice = createSlice({
  name: 'Report',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ReportSlice;
