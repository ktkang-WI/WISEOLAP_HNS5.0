import {createSlice} from '@reduxjs/toolkit';
import ConfigSlice from './ConfigSlice';
import {DesignerMode} from 'components/config/configType';
import adHocLayoutSetting from 'components/utils/AdhocLayoutSetting';
import localizedString from 'config/localization';

const getNewContainer = () => {
  return {
    global: {
      tabEnableClose: false,
      tabEnableRename: false,
      tabSetEnableDrop: false
    },
    borders: [],
    layout: {
      type: 'row',
      children: [
      ]
    }
  };
};

const dashboardInitialState = (defaultItem) => {
  return {
    0: {
      layoutQuantity: 1,
      tabQuantity: 1,
      selectedTab: 0,
      tabEnabled: false,
      layoutConfig: {
        global: {
          tabEnableClose: false,
          tabEnableRename: false,
          tabSetEnableDrop: false
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
                  component: defaultItem || 'chart'
                }
              ]
            }
          ]
        }
      }
    }
  };
};

const adHocInitialState = {
  0: {
    layoutQuantity: 1,
    layoutConfig: {
      global: {
        tabEnableClose: false,
        tabEnableRename: false,
        tabSetEnableMaximize: false,
        tabSetEnableDrop: false
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
                maximized: false,
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
                maximized: false,
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
        tabEnableRename: false,
        tabSetEnableDrop: false
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
    const action = actions.payload;
    const mode = action.mode ? action.mode : action;

    if (mode === DesignerMode['DASHBOARD']) {
      const defaultItem = actions.payload.defaultItem;
      const dashboardInit = dashboardInitialState(defaultItem);

      return {...dashboardInit};
    }

    if (mode === DesignerMode['AD_HOC']) {
      const adhocLayout = action.adhocLayout;
      const adHocInitial =
        adHocLayoutSetting(adhocLayout, 0, adHocInitialState);

      return {0: {...adHocInitial}};
    }

    if (mode === DesignerMode['EXCEL']) {
      return {...excelInitialState};
    }
  },
  setLayout(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.layout;
  },
  // delete 및 layout 배치 변경 등.
  updataFlexLayout(state, actions) {
    const {reportId, layout} = actions.payload;

    if (Array.isArray(state[reportId].layoutConfig)) {
      const selectedTab = state[reportId].selectedTab;
      const title = state[reportId].layoutConfig[selectedTab].title;
      state[reportId].layoutConfig[selectedTab] = {
        title,
        ...layout
      };
      return;
    }

    const title = state[reportId].layoutConfig.title ||
      localizedString.tab + 1;
    state[reportId].layoutConfig = {
      title,
      ...layout
    };
  },
  // insertFlexLayout
  insertFlexLayout(state, actions) {
    const {reportId, component} = actions.payload;
    state[reportId].layoutQuantity++;

    const child = {
      id: 'item' + state[reportId].layoutQuantity,
      type: 'tab',
      name: 'Chart '+ state[reportId].layoutQuantity,
      component: component
    };

    const tabset = {
      type: 'tabset',
      weight: 50,
      selected: 0,
      children: [{...child}]
    };

    if (Array.isArray(state[reportId].layoutConfig)) {
      state[reportId].layoutConfig[state[reportId].selectedTab]
          .layout.children.push(tabset);
      return;
    }

    state[reportId].layoutConfig.layout.children.push(tabset);
  },
  toggleTabEnabled(state, actions) {
    const {reportId} = actions.payload;

    state[reportId].tabEnabled = !state[reportId].tabEnabled;
  },
  selectTab(state, actions) {
    const {reportId, tab} = actions.payload;
    state[reportId].selectedTab = tab;
  },
  updateTabTitle(state, actions) {
    const {reportId, tab, title} = actions.payload;
    if (Array.isArray(state[reportId].layoutConfig)) {
      state[reportId].layoutConfig[tab].title = title;
      return;
    }

    state[reportId].layoutConfig.title = title;
  },
  insertContainerTab(state, actions) {
    const {reportId} = actions.payload;

    const container = getNewContainer();

    if (!state[reportId].tabQuantity) {
      state[reportId].tabQuantity = 1;
    }

    if (!Array.isArray(state[reportId].layoutConfig)) {
      if (state[reportId].layoutConfig.title) {
        state[reportId].tabQuantity++;
      } else {
        state[reportId].layoutConfig.title =
          localizedString.tab + (state[reportId].tabQuantity++);
      }

      state[reportId].layoutConfig = [state[reportId].layoutConfig];
    }

    container.title = localizedString.tab + (state[reportId].tabQuantity++);

    state[reportId].tabEnabled = true;
    state[reportId].selectedTab = state[reportId].layoutConfig.length;
    state[reportId].layoutConfig.push(container);
  },
  deleteContainerTab(state, actions) {
    const {reportId, tab} = actions.payload;

    if (tab == state[reportId].selectedTab) {
      state[reportId].selectedTab = 0;
    }

    state[reportId].layoutConfig.splice(tab, 1);
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
  deleteReportLayout(state, actions) {
    const {reportId} = actions.payload;

    delete state[reportId];
  },
  deleteLayoutForDesigner(state, actions) {
    delete state[actions.payload.reportId];

    if (Object.keys(state).length == 0) {
      state = getInitialState();
    }
  },
  adHocLayoutUpdate(state, actions) {
    const reportId = actions.payload.reportId;
    const layoutType = actions.payload.layoutType;
    state[reportId] = adHocLayoutSetting(layoutType, reportId, state);
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
