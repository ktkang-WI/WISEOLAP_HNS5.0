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
   * 보고서 추가 시 보고서 변경 (덮어쓰기) -> 대시보드에서 reports 추가되지 않고 덮어쓰기 해야함
   * param {JSON} actions.payload initialState
   */
  changeReport(state, actions) {
    return actions.payload;
  },
  /*
   * 뷰어용 보고서 변경 :
   * 뷰어는 보고서 추가 시 보고서 변경 (덮어쓰기)가 아닌 해당 reportId에 맞는 보고서 내용을 변경 해줘야 함.
   */
  changeReportViewer(state, actions) {
    const prevId = actions.payload.prevId;
    const newId = actions.payload.newId;
    const report = actions.payload.report;

    if (prevId != newId) {
      const idx =
        state.reports.findIndex((report) => report.reportId == prevId);
      state.selectedReportId = newId;
      state.reports[idx] = report.reports[0];
    }
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
    const report = actions.payload;
    const updateId = report.reports[0].reportId;

    state.selectedReportId = updateId;
    state.reports.find((report) => report.reportId == updateId)
        .options = report.reports[0].options;
  },
  /*
   * 보고서 삭제
   * param {JSON} actions.payload initialState 의 reports 의 하나의 객체
   */
  deleteReport(state, actions) {
    const deleteReportId = actions.payload.reportId;
    const idx = state.reports.findIndex(
        (report) => report.reportId == deleteReportId);

    state.reports.splice(idx, 1);

    if (deleteReportId == state.selectedReportId) {
      state.selectedReportId =
        (state.reports[idx] || state.reports[idx - 1]).reportId;
    }
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
