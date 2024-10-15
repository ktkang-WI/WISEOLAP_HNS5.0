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
  initialDisplay: 'DashAny',
  editMode: EditMode.DESIGNER,
  configure: {},
  myPageConfigure: {}
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
  },
  reloadDisplaySetting(state, actions) {
    // 브라우저 새로고침시 다시 설정.
    state.initialDisplay = actions.payload.init;
    state.designerMode = actions.payload.currPage;
    state.runMode = actions.payload.currPage;
  },
  setInitDisplayConfig(state, actions) {
    state.designerMode = actions.payload;
    state.runMode = actions.payload;
    state.initialDisplay = actions.payload;
  },
  setMyPageConfigure(state, actions) {
    if (typeof actions?.payload?.maxReportQueryPeriod === 'string') {
      // eslint-disable-next-line max-len
      actions.payload.maxReportQueryPeriod =
      JSON.parse(actions.payload.maxReportQueryPeriod);
    }
    state.myPageConfigure = actions.payload;
  },
  setUserNm(state, actions) {
    state.myPageConfigure.userNm = actions.payload;
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
