import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  informations: {}
};

const reducers = {
  initLink: () => initialState,
  insertLink(state, actions) {
    const {linkReportId} = actions.payload;
    if (!state.informations[linkReportId]) {
      state.informations[linkReportId] = {};
    }
    state.informations[linkReportId]= actions.payload;
  },
  updateLink(state, actions) {
    const {linkReportId} = actions.payload;
    state.informations[linkReportId]= actions.payload;
  },
  deleteLink(state, actions) {
    const {linkReportId} = actions.payload;
    delete state.informations[linkReportId];
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
