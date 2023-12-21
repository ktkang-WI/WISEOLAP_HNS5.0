import {createSlice} from '@reduxjs/toolkit';
import flexLayoutDefault
  from 'components/report/atomic/ItemBoard/organisms/FlexLayoutDefault';

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
  // initLayout -> dashboard, adhoc Layout 다르게.
  initLayout(state, actions) {
    actions.payload.reportId != 0 && delete state[actions.payload.reportId];

    state[0] = {
      layoutQuantity: 1,
      layoutConfig: flexLayoutDefault()[actions.payload.designer]
    };
    // if (actions.payload.reportId == 0) {
    //   state[actions.payload.reportId] = {
    //     layoutQuantity: 1,
    //     layoutConfig: flexLayoutDefault()[actions.payload.designer]
    //   };
    // } else {
    //   delete state[actions.payload.reportId];
    //   state[0] = {
    //     layoutQuantity: 1,
    //     layoutConfig: flexLayoutDefault()[actions.payload.designer]
    //   };
    // }
  },
  setLayout(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.layout;
  },
  setMovedLayout(state, actions) {
    state[0].layoutConfig = actions.payload;
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
  },
  changeLayoutReportId(state, actions) {
    const prevId = actions.payload.prevId;
    const newId = actions.payload.newId;

    if (prevId != newId) {
      const layout = state[prevId];
      delete state[prevId];
      state[newId] = layout;
    }
  },
  deleteLayoutForDesigner(state, actions) {
    delete state[actions.payload];

    if (Object.keys(state).length == 0) {
      state[0] = initialState[0];
    }
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
