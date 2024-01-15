import {createSlice} from '@reduxjs/toolkit';
import {makeAdHocItem, makeAdHocOption, makeItem}
  from 'components/report/item/util/ItemFactory';
import ConfigSlice from './ConfigSlice';
import {DesignerMode} from 'components/config/configType';

const item = makeItem({
  id: 'item1',
  type: 'chart'
});

const adHocChartItem = makeAdHocItem({
  id: 'item1',
  type: 'chart'
});

const adHocPivotItem = makeAdHocItem({
  id: 'item2',
  type: 'pivot'
});

const dashboardInitialState = {
  0: {
    selectedItemId: 'item1',
    itemQuantity: 1,
    items: [item]
  }
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

  if (mode === DesignerMode['ADHOC']) {
    return adHocInitialState;
  }
};

const reducers = {
  /* REPORT */
  initItems: (state, actions) => {
    const mode = actions.payload;

    if (mode === DesignerMode['DASHBOARD']) {
      return dashboardInitialState;
    }

    if (mode === DesignerMode['ADHOC']) {
      return adHocInitialState;
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

    state[reportId].itemQuantity++;
    const itemId = 'item' + state[reportId].itemQuantity;

    actions.payload.item.id = itemId;

    const item = makeItem(actions.payload.item);

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
  deleteAllItems(state, actions) {
    const reportId = actions.payload.reportId;

    state[reportId].items = [];
  },
  selectItem(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId].selectedItemId = actions.payload.itemId;
  },
  // 파라미터로 reportId, datasetId.
  // 넘어온 datasetId 사용하는 아이템 dataField 초기화
  initItemByDatsetId(state, actions) {
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
  setItems(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.items;
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
  }
};

const extraReducers = {};

const ItemSlice = createSlice({
  name: 'Item',
  initialState: getInitialState(),
  reducers: reducers,
  extraReducers: extraReducers
});

export default ItemSlice;
