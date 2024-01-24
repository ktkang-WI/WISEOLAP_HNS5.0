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
    const cloneState = _.cloneDeep(initialState);
    cloneState.reports[0].reportType = designerMode;
    return cloneState;
  },
  /*
   * 보고서 추가
   * param {JSON} actions.payload initialState 의 reports 의 하나의 객체
   */
  insertReport(state, actions) {
    state.selectedReportId = actions.payload.reportId;
    state.reports = state.reports.concat(actions.payload);
  },
  setReports(state, actions) {
    state.reports = actions.payload;
  },
  selectReport(state, actions) {
    state.selectedReportId = actions.payload;
  },
  /*
   * 보고서 수정
   * param {JSON} actions.payload initialState 의 reports 의 하나의 객체
   */
  updateReport(state, actions) {
    const updateId = actions.payload.reportId;

    state.selectedReportId = updateId;
    state.reports.find((report) => report.reportId === updateId)
        .options = actions.payload.options;
  },
  /*
   * 보고서 삭제
   * param {JSON} actions.payload initialState 의 reports 의 하나의 객체
   */
  deleteReport(state, actions) {
    const deleteReportId = actions.payload.reportId;
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
