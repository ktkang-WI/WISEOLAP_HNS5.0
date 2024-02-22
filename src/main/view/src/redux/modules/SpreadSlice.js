import {createSlice} from '@reduxjs/toolkit';

const defaultBindInfo = {
  rowIndex: 0,
  columnIndex: 0,
  useHeader: false,
  useBorder: false,
  useBind: false,
  sheetNm: '',
  datasetNm: undefined
};

const initialState = {
  0: {
    mart: {
      data: {}
    },
    meta: {
      bindingInfos: {}
    }
  }
};

const reducers = {
  initSpread: (state) => {
    return {
      ...initialState
    };
  },
  setViewSpread(state, actions) {
    const reportId = actions.payload.reportId;
    return {
      ...state,
      [reportId]: {
        bindingInfos: actions.payload.bindingInfos
      }
    };
  },
  changeSpread(state, actions) {
    const newId = actions.payload.reportId.newId;
    const prevId = actions.payload.reportId.prevId;
    const {config, sheets, defaultBindInfo} = state;
    const newState = {
      config,
      sheets,
      defaultBindInfo,
      [newId]: {
        bindingInfos: actions.payload.bindingInfos,
        designer: state[prevId]?.designer
      }
    };

    return newState;
  },
  setBindingInfos(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].bindingInfos = actions.payload.bindingInfos;
  },
  setBindingInfo(state, actions) {
    const reportId = actions.payload.reportId;
    const datasetId = actions.payload.datasetId;
    const keys1 = Object.keys(actions.payload.bindingInfo).sort();
    const keys2 = Object.keys(defaultBindInfo).sort();
    if (keys1.length === keys2.length &&
        keys1.every((key, index) => key === keys2[index])) {
      new Error('setBindingInfo의 bindingInfo의 key가 다릅니다.');
    }
    state[reportId].bindingInfos[datasetId] = actions.payload.bindingInfo;
  },
  deleteSpread(state, actions) {
    if (actions.payload == 0) {
      return initialState;
    } else {
      delete state[actions.payload];
    }
  },
  // 디자이너에서 저장 후 reportId만 변경할 때 사용
  changeSpreadReportId(state, actions) {
    const prevId = actions.payload.prevId;
    const newId = actions.payload.newId;

    if (prevId != newId) {
      const newState = {...state};
      const spread = newState[prevId];
      delete newState[prevId];
      newState[newId] = spread;
      return newState;
    }
  }
};

const extraReducers = (builder) => {
  builder.addDefaultCase((state) => {
    state.defaultBindInfo = defaultBindInfo;
  });
};

const SpreadSlice = createSlice({
  name: 'Spread',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default SpreadSlice;
