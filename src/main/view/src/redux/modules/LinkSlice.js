import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  linkReport: {},
  subLinkReport: {}
};

const reducers = {
  initLink: () => initialState,
  insertLink(state, action) {
    const {
      linkReportId
      // subYn,
      // subLinkReport
    } = action.payload;
    if (!state.linkReport[linkReportId]) {
      state.linkReport[linkReportId] =
        {
          ...action.payload
          // subLinkReport: subYn === 'True' ?
          //   [subLinkReport].flat() : []
        };
    } else {
      state.linkReport[linkReportId] = {
        ...action.payload
      };
      // if (subYn === 'True') {
      // const newSubLinks =
      //   Array.isArray(subLinkReport) ? subLinkReport : [subLinkReport];
      // newSubLinks.forEach((newSubLink) => {
      //   const index =
      //     state.linkReport[linkReportId].subLinkReport.findIndex(
      //         (sub) => sub.subLinkItemId === newSubLink.subLinkItemId
      //     );
      //   if (index !== -1) {
      //     state.linkReport[linkReportId].subLinkReport[index] = newSubLink;
      //   } else {
      //     state.linkReport[linkReportId].subLinkReport.push(newSubLink);
      //   }
      // });
      // } else {
      // subLinkReport: state.linkReport[linkReportId].subLinkReport
      // };
    }
  },

  updateLink(state, action) {
    const {
      linkReportId
      // subYn,
      // subLinkReport
    } = action.payload;
    // subYn === 'True' &&
    if (state.linkReport[linkReportId]) {
      // const newSubLinks =
      //   Array.isArray(subLinkReport) ? subLinkReport : [subLinkReport];
      // newSubLinks.forEach((newSubLink) => {
      //   const index =
      //     state.linkReport[linkReportId].subLinkReport.findIndex(
      //         (sub) => sub.subLinkItemId === newSubLink.subLinkItemId);
      //   if (index !== -1) {
      //     state.linkReport[linkReportId].subLinkReport[index] = newSubLink;
      //   } else {
      //     state.linkReport[linkReportId].subLinkReport.push(newSubLink);
      //   }
      // });
    } else {
      state.linkReport[linkReportId] =
        {
          ...action.payload
          // subLinkReport: state.linkReport[linkReportId]?.subLinkReport || []
        };
    }
  },

  deleteLink(state, action) {
    const {
      linkReportId
      // subYn,
      // subLinkItemId
    } = action.payload;
    // subYn === 'True' &&
    if (state.linkReport[linkReportId]) {
      // state.linkReport[linkReportId].subLinkReport =
      //   state.linkReport[linkReportId].subLinkReport.filter(
      //       (sub) => sub.subLinkItemId !== subLinkItemId
      //   );
    } else {
      delete state.linkReport[linkReportId];
    }
  },

  setLinkReport(state, action) {
    if (!action.payload) {
      state.linkReport = {};
      return;
    }
    const reports =
      Array.isArray(action.payload) ? action.payload : [action.payload];
    reports.forEach((report) => {
      const {linkReportId} = report;
      state.linkReport[linkReportId] = report;
    });
  }

  // setSubLinkReport(state, action) {
  //   if (!action.payload) return;
  //   state.linkReport = {};
  //   const {
  //     reportId,
  //     linkReportId,
  //     linkSubItem,
  //     linkDataType,
  //     linkXmlParam,
  //     linkXmlData,
  //     linkReportOrdinal,
  //     linkReportType,
  //     linkReportNm
  //   } = action.payload;
  //   const matchSubLinkInfo ={
  //     reportId: reportId,
  //     linkReportId: linkReportId,
  //     subLinkItemId: linkSubItem,
  //     dataLinkType: linkDataType,
  //     subLinkXmlParam: linkXmlParam,
  //     subLinkXmlData: linkXmlData,
  //     subLinkReportOrdinal: linkReportOrdinal,
  //     subLinkReportType: linkReportType,
  //     sublinkReportNm: linkReportNm,
  //     subLinkParamInfo: []
  //   };
  //   const matchLinkInfo = {
  //     reportId: reportId,
  //     linkReportId: linkReportId,
  //     linkXmlParam: linkXmlParam,
  //     linkReportOrdinal: linkReportOrdinal,
  //     linkReportType: linkReportType,
  //     dataLinkType: linkDataType,
  //     linkReportNm: linkReportNm,
  //     linkParamInfo: [],
  //     linkFkInfo: [],
  //     subYn: 'True',
  //     subLinkReport: matchSubLinkInfo
  //   };
  //   state.linkReport[linkReportId] = matchLinkInfo;
  // }
};

const extraReducers = {};

const LinkSlice = createSlice({
  name: 'LinkInfo',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default LinkSlice;
