import {createSlice} from '@reduxjs/toolkit';
import localizedString from 'config/localization';

const initialState = {
  selectedReportId: 0,
  reports: [{
    reportId: 0,
    options: {
      reportNm: localizedString.defaultReportName,
      reportSubTitle: '',
      fldId: 0,
      fldName: '',
      fldType: '',
      reportOrdinal: 0,
      reportTag: '',
      reportDesc: '',
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
  initReport: () => initialState,
  insertReport(state, actions) {
    state.reports = state.reports.concat(actions.payload);
    state.selectedReportId = actions.payload.reportId;
  },
  updateReport(state, actions) {
    const index = state.reports.findIndex(
        (report) => report.reportId == actions.payload.reportId
    );
    if (index >= 0) {
      state.reports[index] = actions.payload;
    } else {
      if (state.selectedReportId == 0) {
        state.reports = state.reports.filter(
            (report) => report.reportId != 0);
      }
      state.reports = state.reports.concat(actions.payload);
    }
  },
  deleteReport(state, actions) {
    state.reports = state.reports.filter(
        (report) => report.reportId != actions.payload);
  },
  deleteAllReport(state, actions) {
    state.reports = [];
  },
  updateSelectedReportId(state, actions) {
    state.selectedReportId = actions.payload.reportId;
  },
  deleteReportForDesigner(state, actions) {
    state.reports = state.reports.filter(
        (report) => report.reportId != actions.payload);
    if (state.reports.length == 0) {
      state.reports = initialState.reports;
      // state.selectedReportId = 0;
    }
    // 보고서를 닫은 후에도 보고서가 남아있을 경우 가장 앞에 있는 보고서 선택 (뷰어 일때)
    // else {
    // state.selectedReportId = state.reports[0].reportId;
    // }
    state.selectedReportId = 0;
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
