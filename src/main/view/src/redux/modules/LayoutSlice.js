import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  0: {
    layoutQuantity: 1,
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
  setLayout(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.layout;
  },
  setMovedLayout(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].layoutConfig = actions.payload.layout;
  },
  // deleteFlexLayout
  deleteFlexLayout(state, actions) {
    const reportId = actions.payload.reportId;
    const itemId = actions.payload.itemId;

    state[reportId].layoutConfig = {
      ...state[reportId].layoutConfig,
      layout: {
        ...state[reportId].layoutConfig.layout,
        children: state[reportId].layoutConfig.layout.children.filter(
            (child) => child.children[0].id != itemId
        )
      }
    };
  },
  // insertFlexLayout
  insertFlexLayout(state, actions) {
    const reportId = actions.payload.reportId;
    const component = actions.payload.component;
    state[reportId].layoutQuantity++;

    const child = {
      id: 'item' + state[reportId].layoutQuantity,
      type: 'tab',
      name: 'Chart '+ state[reportId].layoutQuantity,
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
