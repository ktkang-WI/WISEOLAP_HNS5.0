import {createSlice} from '@reduxjs/toolkit';
import {DesignerMode} from 'components/config/configType';

const setInitDesignerMode = () => {
  const href = window.location.href;
  if (href.indexOf(DesignerMode['DASHBOARD'].toLowerCase()) > -1) {
    return DesignerMode['DASHBOARD'];
  } else if (href.indexOf(DesignerMode['AD_HOC'].toLowerCase()) > -1) {
    return DesignerMode['AD_HOC'];
  } else if (href.indexOf(DesignerMode['EXCEL'].toLowerCase()) > -1) {
    return DesignerMode['EXCEL'];
  } else {
    throw Error('ConfigSlise setInitDesignerMode 에러');
  }
};

const initialState = {
  designerMode: setInitDesignerMode(),
  runMode: 'DashAny',
  initialDisplay: 'DashAny' // 'adHoc',
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
