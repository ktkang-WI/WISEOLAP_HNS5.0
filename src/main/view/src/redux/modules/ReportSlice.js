import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedReportId: 0,
  reports: []
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
    state = state.reports.filter(
        (report) => report.reportId != actions.payload);
  },
  setTestData(state, actions) {
    state.reports = [{
      reportId: 3532, option: {},
      datasets: [{
        id: 'dataSource1',
        fields: [],
        parameters: []
      }]
    }];
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
