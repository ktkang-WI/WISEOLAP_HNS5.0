import {createSlice} from '@reduxjs/toolkit';
import ConfigSlice from './ConfigSlice';
import {DesignerMode} from 'components/config/configType';

const dashboardInitialState = {
  0: {
    layoutQuantity: 1,
    layoutConfig: {
      global: {
        tabEnableClose: false,
        tabEnableRename: false
      },
      borders: [],
      layout: {
        type: 'row',
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                className: 'item1',
                id: 'item1',
                type: 'tab',
                name: 'Chart 1',
                component: 'chart'
              }
            ]
          }
        ]
      }
    }
  }
};

const adHocInitialState = {
  0: {
    layoutQuantity: 1,
    layoutConfig: {
      global: {
        tabEnableClose: false,
        tabEnableRename: false
      },
      layout: {
        type: 'row',
        children: [
          {
            type: 'row',
            weight: 50,
            selected: 0,
            children: [
              {
                type: 'tabset',
                weight: 50,
                selected: 0,
                children: [
                  {
                    id: 'item1',
                    type: 'tab',
                    name: 'Chart',
                    component: 'chart'
                  }
                ]
              },
              {
                type: 'tabset',
                weight: 50,
                selected: 0,
                children: [
                  {
                    id: 'item2',
                    type: 'tab',
                    name: 'PivotGrid',
                    component: 'pivot'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
};

const excelInitialState = {
  0: {
    layoutQuantity: 1,
    layoutConfig: {
      global: {
        tabEnableClose: false,
        tabEnableRename: false
      },
      layout: {}
    }
  }
};

const getInitialState = () => {
  const mode = ConfigSlice.getInitialState().designerMode;

  if (mode === DesignerMode['DASHBOARD']) {
    return dashboardInitialState;
  }

  if (mode === DesignerMode['AD_HOC']) {
    return adHocInitialState;
  }

  if (mode === DesignerMode['EXCEL']) {
    return excelInitialState;
  }
};

const reducers = {
  // initLayout -> dashboard, adhoc Layout 다르게.
  initLayout: (state, actions) => {
    const mode = actions.payload;

    if (mode === DesignerMode['DASHBOARD']) {
      state = dashboardInitialState;
    }

    if (mode === DesignerMode['AD_HOC']) {
      state = adHocInitialState;
    }

    if (mode === DesignerMode['EXCEL']) {
      state = excelInitialState;
    }
  },
  setLayout(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.layout;
  },
  // delete 및 layout 배치 변경 등.
  updataFlexLayout(state, actions) {
    const reportId = actions.payload.reportId;
    const layout = actions.payload.layout;

    state[reportId].layoutConfig = layout;
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
    delete state[actions.payload.reportId];

    if (Object.keys(state).length == 0) {
      state = getInitialState();
    }
  },
  changeLayout(state, actions) {
    const prevId = actions.payload.reportId.prevId;
    const newId = actions.payload.reportId.newId;
    delete state[prevId];
    state[newId] = actions.payload.layout;
  }
};
const extraReducers = {};

const LayoutSlice = createSlice({
  name: 'Layout',
  initialState: getInitialState(),
  reducers: reducers,
  extraReducers: extraReducers
});

export default LayoutSlice;
