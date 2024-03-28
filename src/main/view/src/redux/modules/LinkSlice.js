import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  informations: {}
};

const reducers = {
  initLink: () => initialState,
  insertLink(state, action) {
    const {linkReportId, subYn, subLinkReport} = action.payload;
    if (!state.informations[linkReportId]) {
      state.informations[linkReportId] =
        {
          ...action.payload,
          subLinkReport: subYn === 'True' ?
            [subLinkReport].flat() : []
        };
    } else {
      if (subYn === 'True') {
        const newSubLinks =
          Array.isArray(subLinkReport) ? subLinkReport : [subLinkReport];
        newSubLinks.forEach((newSubLink) => {
          const index =
            state.informations[linkReportId].subLinkReport.findIndex(
                (sub) => sub.subLinkItemId === newSubLink.subLinkItemId
            );
          if (index !== -1) {
            state.informations[linkReportId].subLinkReport[index] = newSubLink;
          } else {
            state.informations[linkReportId].subLinkReport.push(newSubLink);
          }
        });
      } else {
        state.informations[linkReportId] = {
          ...action.payload,
          subLinkReport: state.informations[linkReportId].subLinkReport
        };
      }
    }
  },

  updateLink(state, action) {
    const {linkReportId, subYn, subLinkReport} = action.payload;
    if (subYn === 'True' && state.informations[linkReportId]) {
      const newSubLinks =
        Array.isArray(subLinkReport) ? subLinkReport : [subLinkReport];
      newSubLinks.forEach((newSubLink) => {
        const index =
          state.informations[linkReportId].subLinkReport.findIndex(
              (sub) => sub.subLinkItemId === newSubLink.subLinkItemId);
        if (index !== -1) {
          state.informations[linkReportId].subLinkReport[index] = newSubLink;
        } else {
          state.informations[linkReportId].subLinkReport.push(newSubLink);
        }
      });
    } else {
      state.informations[linkReportId] =
        {
          ...action.payload,
          subLinkReport: state.informations[linkReportId]?.subLinkReport || []
        };
    }
  },

  deleteLink(state, action) {
    const {linkReportId, subYn, subLinkItemId} = action.payload;
    if (subYn === 'True' && state.informations[linkReportId]) {
      state.informations[linkReportId].subLinkReport =
        state.informations[linkReportId].subLinkReport.filter(
            (sub) => sub.subLinkItemId !== subLinkItemId
        );
    } else {
      delete state.informations[linkReportId];
    }
  },

  setLinkReport(state, action) {
    if (!action.payload) return;
    const {linkReportId} = action.payload;
    if (state.informations[linkReportId]) {
      state.informations[linkReportId] = action.payload;
    } else {
      state.informations[linkReportId] = action.payload;
    }
  },

  setSubLinkReport(state, action) {
    if (!action.payload) return;
    state.informations = {};
    const {
      reportId,
      linkReportId,
      linkSubItem,
      linkDataType,
      linkXmlParam,
      linkXmlData,
      linkReportOrdinal,
      linkReportType,
      linkReportNm
    } = action.payload;
    const matchSubLinkInfo ={
      reportId: reportId,
      linkReportId: linkReportId,
      subLinkItemId: linkSubItem,
      dataLinkType: linkDataType,
      subLinkXmlParam: linkXmlParam,
      subLinkXmlData: linkXmlData,
      subLinkReportOrdinal: linkReportOrdinal,
      subLinkReportType: linkReportType,
      sublinkReportNm: linkReportNm,
      subLinkParamInfo: []
    };
    const matchLinkInfo = {
      reportId: reportId,
      linkReportId: linkReportId,
      linkXmlParam: linkXmlParam,
      linkReportOrdinal: linkReportOrdinal,
      linkReportType: linkReportType,
      dataLinkType: linkDataType,
      linkReportNm: linkReportNm,
      linkParamInfo: [],
      linkFkInfo: [],
      subYn: 'True',
      subLinkReport: matchSubLinkInfo
    };
    state.informations[linkReportId] = matchLinkInfo;
  }
};

const extraReducers = {};

const LinkSlice = createSlice({
  name: 'Link',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default LinkSlice;
