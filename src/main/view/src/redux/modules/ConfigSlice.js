import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  designerMode: 'dashboard',
  runMode: 'designer',
  initialDisplay: 'dashboard' // 'adhoc',
  // TODO: 추후 환경설정의 초기화면, designerMode 로 대체 가능 개발시 고려
};

const reducers = {
  updateConfig(state, actions) {
    Object.assign(state, actions.payload);
  },
  setDesignerMode(state, actions) {
    state.designerMode = actions.payload;
  }
};

const extraReducers = {};

const ConfigSlice = createSlice({
  name: 'Config',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ConfigSlice;
