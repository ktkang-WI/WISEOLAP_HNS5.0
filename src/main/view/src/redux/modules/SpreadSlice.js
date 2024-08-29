import {createSlice} from '@reduxjs/toolkit';

const defaultBindInfo = {
  rowIndex: 0,
  columnIndex: 0,
  useHeader: false,
  useBorder: false,
  useBind: false,
  sheetNm: '',
  id: '',
  datasetNm: undefined
};

const initialState = {
  0: {
    mart: {
      spreadData: {}
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
  setSpreadData(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].mart.spreadData = actions.payload.data;
  },
  setSpread(state, actions) {
    const reportId = actions.payload.reportId;
    const meta = actions.payload.meta;
    return {
      ...state,
      [reportId]: {
        ...initialState[0],
        meta: meta
      }
    };
  },
  changeSpread(state, actions) {
    const prevId = actions.payload.reportId.prevId;
    const newId = actions.payload.reportId.newId;
    const meta = actions.payload.meta;
    delete state[prevId];
    state[newId] = {
      ...initialState[0],
      meta: meta
    };
  },
  setBindingInfos(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].meta.bindingInfos = actions.payload.bindingInfos;
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
    state[reportId].meta.bindingInfos[datasetId] = actions.payload.bindingInfo;
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
