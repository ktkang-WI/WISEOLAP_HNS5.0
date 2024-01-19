import {createSlice} from '@reduxjs/toolkit';
import {DesignerMode} from 'components/config/configType';
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
      path: '', // 해당 경로 비어있을 경우 새 보고서 다시 확인
      reportType: DesignerMode['DASHBOARD']
    }
  }]
};

const reducers = {
  getInitialState: () => initialState,
  /* REPORT */
  initReport: (state, actions) => {
    const designerMode = actions.payload;
    const cloneState = _.cloneDeep(state);
    cloneState.reports[0].reportType = designerMode;
    return cloneState;
  },
  insertReport(state, actions) {
    state.selectedReportId = actions.payload.selectedReportId;
    state.reports = state.reports.concat(actions.payload.reports);
  },
  setReports(state, actions) {
    state.reports = actions.payload;
  },
  selectReport(state, actions) {
    state.selectedReportId = actions.payload;
  },
  updateReport(state, actions) {
    const updateId = actions.payload.reports[0].reportId;

    state.selectedReportId = actions.payload.selectedReportId;
    state.reports.find((report) => report.reportId === updateId)
        .options = actions.payload.reports[0].options;
  },
  deleteReport(state, actions) {
    const deleteReportId = actions.payload.reports[0].reportId;
    const lastIndex = state.reports.length - 2;
    state.selectedReportId = state.reports[lastIndex].reportId;
    state.reports = state.reports.filter(
        (report) => report.reportId != deleteReportId);
  },
  deleteAllReport(state, actions) {
    state.reports = [];
  },
  updateSelectedReportId(state, actions) {
    state.selectedReportId = actions.payload.reportId;
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
