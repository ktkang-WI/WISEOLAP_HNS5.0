import {createSlice} from '@reduxjs/toolkit';
import seriesOptionSlice from './SeriesOption/SeriesOptionSlice';
import {makeAdHocItem, makeAdHocOption, makeItem}
  from 'components/report/item/util/ItemFactory';
import ConfigSlice from './ConfigSlice';
import {DesignerMode} from 'components/config/configType';

const item = (defaultItem, palette) => {
  return makeItem({
    id: 'item1',
    type: defaultItem || 'chart',
    palette: palette,
    tab: 0
  });
};

const adHocChartItem = makeAdHocItem({
  id: 'item1',
  type: 'chart'
});

const adHocPivotItem = makeAdHocItem({
  id: 'item2',
  type: 'pivot'
});

const dashboardInitialState = (defaultItem, palette) => {
  return {
    0: {
      selectedItemId: 'item1',
      itemQuantity: 1,
      items: [item(defaultItem, palette)],
      chartCount: {[defaultItem]: 1}
    }
  };
};

const adHocInitialState = {
  0: {
    selectedItemId: 'item1',
    itemQuantity: 1,
    items: [adHocChartItem, adHocPivotItem],
    adHocOption: makeAdHocOption()
  }
};

const initialState = {
  0: {
    selectedItemId: 'item1',
    itemQuantity: 1,
    items: [item]
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

  return dashboardInitialState;
};

const reducers = {
  /* REPORT */
  initItems: (state, actions) => {
    const action = actions.payload;
    const mode = action.mode ? action.mode : action;
    const palette = action.defaultPalette;

    if (mode === DesignerMode['DASHBOARD']) {
      const defaultItem = actions.payload.defaultItem;
      return {...dashboardInitialState(defaultItem, palette)};
    } else if (mode === DesignerMode['AD_HOC']) {
      const layout = action.adhocLayout;

      return {
        0: {...adHocInitialState[0], adHocOption: makeAdHocOption(layout)}
      };
    } else if (mode === DesignerMode['EXCEL']) {
      return {...dashboardInitialState('chart')};
    }
  },
  changeItemReportId(state, actions) {
    const prevId = actions.payload.prevId;
    const newId = actions.payload.newId;

    if (prevId != newId) {
      const item = state[prevId];
      delete state[prevId];
      state[newId] = item;
    }
  },
  deleteItemForDesigner(state, actions) {
    delete state[actions.payload];

    if (Object.keys(state).length == 0) {
      state[0] = initialState[0];
    }
  },
  // 파라미터로 reportId와 item
  insertItem(state, actions) {
    const reportId = actions.payload.reportId;
    if (!state[reportId]) {
      state[reportId] = {
        selectedItemId: '',
        itemQuantity: 0,
        items: []
      };
    }
    // 아아템 이름에 번호 생성.
    const countMap = state[reportId].chartCount;
    const itemType = actions.payload.item.type;
    const palette = actions.payload.item.palette;

    countMap[itemType] = (countMap[itemType] || 0) + 1;

    state[reportId].chartCount = countMap;
    state[reportId].itemQuantity++;

    const itemId = 'item' + state[reportId].itemQuantity;

    actions.payload.item.id = itemId;

    const item = makeItem(actions.payload.item, countMap, palette);

    state[reportId].items =
      state[reportId].items.concat(item);

    state[reportId].selectedItemId = itemId;
  },
  // 파라미터로 reportId와 item
  updateItem(state, actions) {
    const reportId = actions.payload.reportId;
    const item = actions.payload.item;

    const itemIndex = state[reportId].items.findIndex(
        (i) => i.id == item.id
    );

    if (itemIndex >= 0) {
      state[reportId].items[itemIndex] = item;
    }
  },
  // 파라미터로 reportId와 itemId
  deleteItem(state, actions) {
    const reportId = actions.payload.reportId;
    const itemId = actions.payload.itemId;

    state[reportId].items =
    state[reportId].items.filter(
        (item) => item.id != itemId
    );

    const lastItem = state[reportId].items[state[reportId].items.length - 1];
    const selectedItemId = lastItem ? lastItem.id : '';

    state[reportId].selectedItemId = selectedItemId;
  },
  // 파라미터로 reportId
  deleteReportItem(state, actions) {
    const reportId = actions.payload.reportId;

    delete state[reportId];
  },
  selectItem(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].selectedItemId = actions.payload.itemId;
  },
  // 파라미터로 reportId, datasetId.
  // 넘어온 datasetId 사용하는 아이템 dataField 초기화
  initItemByDatasetId(state, actions) {
    const reportId = actions.payload.reportId;
    const datasetId = actions.payload.datasetId;

    if (state[reportId].adHocOption) {
      const dataField = state[reportId].adHocOption.dataField;
      if (dataField.datasetId == datasetId) {
        for (const fields in dataField) {
          if (typeof dataField[fields] === 'object') {
            dataField[fields] = [];
          }
        }
        delete dataField.datasetId;
        dataField.dataFieldQuantity = 0;
      }
    } else {
      state[reportId].items.map((i) => {
        if (i.meta.dataField.datasetId == datasetId) {
          for (const fields in i.meta.dataField) {
            if (typeof i.meta.dataField[fields] === 'object') {
              i.meta.dataField[fields] = [];
            }
          }

          delete i.meta.dataField.datasetId;
          i.meta.dataField.dataFieldQuantity = 0;
        }
      });
    }
  },
  setItemField(state, actions) {
    const reportId = actions.payload.reportId;
    const dataField = actions.payload.dataField;

    if (state[reportId].adHocOption) {
      state[reportId].adHocOption.dataField = dataField;
    } else {
      const itemIndex = state[reportId].items.findIndex(
          (item) => item.id == state[reportId].selectedItemId
      );

      if (itemIndex >= 0) {
        state[reportId].items[itemIndex].meta.dataField = dataField;
      }
    }
  },
  updateItemField(state, actions) {
    const reportId = actions.payload.reportId;
    const dataField = actions.payload.dataField;

    if (state[reportId].adHocOption) {
      state[reportId].adHocOption.dataField[dataField.category] =
        state[reportId].adHocOption.dataField[dataField.category]
            .map((field) => {
              if (field.fieldId == dataField.fieldId) {
                return dataField;
              }
              return field;
            });
    } else {
      const itemIndex = state[reportId].items.findIndex(
          (item) => item.id == state[reportId].selectedItemId
      );

      if (itemIndex >= 0) {
        state[reportId].items[itemIndex].meta.dataField[dataField.category] =
            state[reportId].items[itemIndex].meta.dataField[dataField.category]
                .map((field) => {
                  if (field.fieldId == dataField.fieldId) {
                    return dataField;
                  }
                  return field;
                });
      }
    }
  },
  setItem(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.item;
  },
  updateInteractiveOption(state, actions) {
    const reportId = actions.payload.reportId;

    const itemIndex = state[reportId].items.findIndex(
        (item) => item.id == state[reportId].selectedItemId
    );

    Object.assign(state[reportId].items[itemIndex].meta.interactiveOption,
        actions.payload.option);
  },
  updateTopBottomInfo(state, actions) {
    const reportId = actions.payload.reportId;
    const topBottomInfo = actions.payload.topBottomInfo;

    state[reportId].adHocOption.topBottomInfo = topBottomInfo;
  },
  updateVariationValues(state, actions) {
    const reportId = actions.payload.reportId;
    const variationValues = actions.payload.variationValues;
    const designerMode = actions.payload.designerMode;
    const itemId = actions.payload.itemId;

    if (designerMode === DesignerMode['DASHBOARD']) {
      const dashboardItems = state[reportId].items;
      const idx = dashboardItems.findIndex((i) => i.id === itemId);
      state[reportId].items[idx].meta.variationValues = variationValues;
    } else {
      state[reportId].adHocOption.variationValues = variationValues;
    }
  },
  updateGridAttribute(state, actions) {
    const reportId = actions.payload.reportId;
    const gridAttribute = actions.payload.gridAttribute;
    const designerMode = actions.payload.designerMode;
    const itemId = actions.payload.itemId;

    if (designerMode === DesignerMode['DASHBOARD']) {
      const dashboardItems = state[reportId].items;
      const idx = dashboardItems.findIndex((i) => i.id === itemId);
      state[reportId].items[idx].meta.gridAttribute = gridAttribute;
    } else {
      state[reportId].adHocOption.gridAttribute = gridAttribute;
    }
  },
  updateLayoutSetting(state, actions) {
    const reportId = actions.payload.reportId;
    const layoutType = actions.payload.layoutType;

    state[reportId].adHocOption.layoutSetting = layoutType;
  },
  changeItem(state, actions) {
    const prevId = actions.payload.reportId.prevId;
    const newId = actions.payload.reportId.newId;
    delete state[prevId];
    state[newId] = actions.payload.item;
  },
  deleteContainerItem(state, actions) {
    const {reportId, tab} = actions.payload;

    state[reportId].items =
      state[reportId].items.filter((item) => item.tab != tab);
  }
};

const extraReducers = (builder) => {
  seriesOptionSlice(builder);
};

const ItemSlice = createSlice({
  name: 'Item',
  initialState: getInitialState(),
  reducers: reducers,
  extraReducers: extraReducers
});

export default ItemSlice;
