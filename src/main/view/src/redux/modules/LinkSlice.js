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
    const {linkReportId} = action.payload;
    if (state.informations[linkReportId]) {
      state.informations[linkReportId] = action.payload;
    } else {
      state.informations[linkReportId] = action.payload;
    }
  },

  setSubLinkReport(state, action) {
    const {linkReportId} = action.payload;
    if (state.informations[linkReportId]) {
      state.informations[linkReportId] = action.payload;
    } else {
      state.informations[linkReportId] = action.payload;
    }
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
