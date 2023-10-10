import {createSlice} from '@reduxjs/toolkit';
import localizedString from 'config/localization';

const initialState = {
  selectedReportId: 0,
  reports: [{
    reportId: 0,
    selectedItemId: '',
    options: {
      reportNm: localizedString.defaultReportName,
      reportDesc: '',
      reportPath: '', // 해당 경로 비어있을 경우 새 보고서
      order: 0
    },
    datasetQuantity: 0,
    datasets: [],
    items: [] // TODO: 기본값 지정 필요
  }]
};

// TODO: 보고서 객체 생성시 아래와 유사하게 생성
// 보고서 객체 확정시 해당 주석 삭제 예정
// {reportId: 222, option: 보고서 정보,
//   datasets: [{
//   }],
//   items: [{
//     id: "item1",
//     meta: {}, //저장이 되는 데이터
//     temp: {}, //저장이 안되는 데이터
//   }]
// }

const reducers = {
  /* REPORT */
  initReport(state, actions) {
    state.reports = [{
      reportId: 0,
      options: {
        reportNm: localizedString.defaultReportName,
        reportDesc: '',
        reportPath: '', // 해당 경로 비어있을 경우 새 보고서
        order: 0
      },
      datasetQuantity: 0,
      datasets: [],
      items: [] // TODO: 기본값 지정 필요
    }];
  },
  insertReport(state, actions) {
    state.reports = state.concat(actions.payload);
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
  },

  /* DATASET */
  insertDataset(state, actions) {
    const index = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );

    state.reports[index].datasetQuantity++;


    actions.payload.datasetId =
      'dataset' + state.reports[index].datasetQuantity;
    state.reports[index].datasets =
      state.reports[index].datasets.concat(actions.payload);
  },
  updateDataset(state, actions) {
    const selectedReport = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );

    const datasetIndex = state.reports[selectedReport].datasets.findIndex(
        (ds) => ds.reportId == actions.payload.datasetId
    );

    if (datasetIndex > 0) {
      state.reports[selectedReport].datasets[datasetIndex] = actions.payload;
    } else {
      state.reports[selectedReport].datasets =
        state.reports[selectedReport].datasets.concat(actions.payload);
    }
    state.reports[index].datasets =
      state.reports[index].datasets.concat(actions.payload);
  },
  deleteDataset(state, actions) {
    const selectedReport = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );

    state.reports[selectedReport].datasets =
    state.reports[selectedReport].datasets.filter(
        (ds) => ds.datasetId != actions.payload
    );
  },
  deleteAllDataset(state, actions) {
    const selectedReport = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );
    state.reports[selectedReport].datasets = [];
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
