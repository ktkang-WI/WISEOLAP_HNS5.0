import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  desinerIsExecute: false,
  viewerIsExecute: false
};

const reducers = {
  init(state, actions) {
    state.desinerIsExecute = false;
    state.viewerIsExecute = false;
  },
  // 디자이너와 뷰어에서의 조회를 다르게 분기.
  updateDesinerExecutionState(state, actions) {
    // TODO: 비정형, 대시보드, 스프레드 각자 실행여부 분기 추후 고려.
    state.desinerIsExecute = actions.payload;
  },
  updateViewerExecutionState(state, actions) {
    state.viewerIsExecute = actions.payload;
  }
};

const extraReducers = {};

const ExecuteSlice = createSlice({
  name: 'Execution',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ExecuteSlice;
