import {createSlice} from '@reduxjs/toolkit';
import {DesignerMode, EditMode} from 'components/config/configType';

const setInitDesignerMode = () => {
  const href = window.location.href;
  if (href.indexOf(DesignerMode['DASHBOARD'].toLowerCase()) > -1) {
    return DesignerMode['DASHBOARD'];
  } else if (href.indexOf(DesignerMode['AD_HOC'].toLowerCase()) > -1) {
    return DesignerMode['AD_HOC'];
  } else if (href.indexOf(DesignerMode['EXCEL'].toLowerCase()) > -1) {
    return DesignerMode['EXCEL'];
  }

  return DesignerMode['DASHBOARD'];
};

const initialState = {
  designerMode: setInitDesignerMode(),
  runMode: 'DashAny',
  initialDisplay: 'DashAny', // 'adHoc',
  editMode: EditMode.DESIGNER,
  configure: {}
  // TODO: 추후 환경설정의 초기화면, designerMode 로 대체 가능 개발시 고려
};

const reducers = {
  updateConfig(state, actions) {
    Object.assign(state, actions.payload);
  },
  setDesignerMode(state, actions) {
    state.designerMode = actions.payload;
  },
  setEditMode(state, actions) {
    state.editMode = actions.payload;
  },
  addConfigure(state, actions) {
    Object.assign(state.configure, actions.payload);
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
