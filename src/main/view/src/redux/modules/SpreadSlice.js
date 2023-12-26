import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  Sheets: undefined,
  excelIO: undefined,
  0: {
    spreadJS: undefined,
    dataPosition: {
      row: 0,
      column: 0
    },
    useHeader: false
    // useBorder: false
  }
};

const reducers = {
  setLibrariesObject(state, actions) {
    state.Sheets = actions.payload.Sheets;
    state.excelIO = actions.payload.excelIO;
  },
  setSpreadJS(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].spreadJS = actions.payload.spreadJS;
  }
};

const extraReducers = {};

const SpreadSlice = createSlice({
  name: 'Spread',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default SpreadSlice;
