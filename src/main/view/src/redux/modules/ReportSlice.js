import {createSlice} from '@reduxjs/toolkit';
import localizedString from 'config/localization';
import chartSeriesButtonIcon
  from 'assets/image/icon/item/chart_bar.png';
import dimensionIcon
  from 'assets/image/icon/dataSource/dimension.png';
import measureIcon from 'assets/image/icon/dataSource/measure.png';

const initialState = {
  selectedReportId: 0,
  reports: [{
    reportId: 0,
    selectedItemId: 'item1',
    options: {
      reportNm: localizedString.defaultReportName,
      reportDesc: '',
      reportPath: '', // 해당 경로 비어있을 경우 새 보고서
      order: 0
    },
    itemQuantity: 0,
    items: [{
      id: 'item1',
      meta: {
        dataField: {
          dataFieldQuantity: 0,
          measure: [],
          dimension: []
        }
      },
      temp: {
        dataFieldOption: {
          measure: {
            label: localizedString.measure,
            icon: measureIcon,
            placeholder: localizedString.measurePlaceholder,
            type: 'MEA',
            useButton: true,
            // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
            buttonIcon: chartSeriesButtonIcon,
            buttonEvent: function(e) {
              console.log(e);
            }
          },
          dimension: {
            label: localizedString.dimension,
            icon: dimensionIcon,
            placeholder: localizedString.dimensionPlaceholder,
            type: 'DIM' // 타입은 DIM 또는 MEA. 조회시 MEA와 DIM 구분하기 위함.
          }
        }
      }
    }] // TODO: 기본값 지정 필요
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
    state.reports = initialState.reports;
  },
  insertReport(state, actions) {
    state.reports = state.reports.concat(actions.payload);
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
  /* Item */
  insertItem(state, actions) {
    const index = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );

    state.reports[index].itemQuantity++;

    actions.payload.id =
      'item' + state.reports[index].itemQuantity;
    state.reports[index].items =
      state.reports[index].items.concat(actions.payload);

    state.reports[index].selectedItemId =
      'item' + state.reports[index].itemQuantity;
  },
  updateItem(state, actions) {
    const selectedReport = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );

    const itemIndex = state.reports[selectedReport].items.findIndex(
        (item) => item.id == actions.payload.id
    );

    if (itemIndex >= 0) {
      state.reports[selectedReport].items[itemIndex] = actions.payload;
    } else {
      state.reports[selectedReport].items =
        state.reports[selectedReport].items.concat(actions.payload);
    }
    state.reports[selectedReport].items =
      state.reports[selectedReport].items.concat(actions.payload);
  },
  deleteItem(state, actions) {
    const selectedReport = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );

    state.reports[selectedReport].items =
    state.reports[selectedReport].items.filter(
        (item) => item.id != actions.payload
    );
  },
  selectItem(state, actions) {
    const selectedReport = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );
    state.reports[selectedReport].selectedItemId = actions.payload;
  },
  updateItemField(state, actions) {
    const selectedReport = state.reports.findIndex(
        (report) => report.reportId == state.selectedReportId
    );

    const itemIndex = state.reports[selectedReport].items.findIndex(
        (item) => item.id == state.reports[selectedReport].selectedItemId
    );

    if (itemIndex >= 0) {
      state.reports[selectedReport].items[itemIndex].meta.dataField =
       actions.payload;
    }
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
