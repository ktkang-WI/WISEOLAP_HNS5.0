import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  links: [{
    reportId: 0,
    linkReportId: 0,
    linkXml: '',
    linkReportOrdinal: 0,
    linkReportType: '',
    dataLinkType: ''
  }]
};

const reducers = {
  getInitialState: () => initialState,
  /* LINK */
  initLink: () => initialState,
  changeLink(state, actions) {
    return actions.payload;
  },
  insertLink(state, actions) {
    state.links = state.links.concat(actions.payload);
  },
  setLinks(state, actions) {
    state.links = actions.payload;
  },
  deleteLink(state, actions) {
    state.links = state.links.filter((link) => link.linkReportId !== actions.payload);
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