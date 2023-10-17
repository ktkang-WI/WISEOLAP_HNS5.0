import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  0: {
    layoutConfig: {
      global: {tabEnableClose: false},
      layout: {
        type: 'row',
        children: []
      }
    }
  }
};
const reducers = {
  // defaultFlexLayout -> dashboard, adhoc Layout 다르게.
  defaultFlexLayout(state, actions) {
    state[0].layoutConfig = actions.payload;
  },
  // deleteFlexLayout
  deleteFlextLayout(state, actions) {
    const reportId = actions.payload.reportId;
    const tabId = actions.payload.tabId;
    state[reportId].layoutConfig = {
      ...state[reportId].layoutConfig,
      layout: {
        ...state[reportId].layoutConfig.layout,
        children: state[reportId].layoutConfig.layout.children.filter(
            (child) => child.children[0].id != tabId
        )
      }
    };
  },
  // deleteFlexLayout
  insertFlextLayout(state, actions) {
    const reportId = actions.payload.reportId;
    const num = actions.payload.num;
    const component = actions.payload.component;
    const child = {
      id: num,
      type: 'tab',
      name: 'Chart '+ num,
      component: component
    };
    state[reportId].layoutConfig = {
      ...state[reportId].layoutConfig,
      layout: {
        ...state[reportId].layoutConfig.layout,
        children: state[reportId].layoutConfig.layout.children.concat(
            {type: 'tabset', weight: 50, selected: 0, children: [{...child}]}
        )
      }
    };
  }
};
const extraReducers = {};

const LayoutSlice = createSlice({
  name: 'Layout',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default LayoutSlice;
