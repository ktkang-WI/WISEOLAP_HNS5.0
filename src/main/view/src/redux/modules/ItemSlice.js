import {createSlice} from '@reduxjs/toolkit';
import {makeItem} from 'components/report/item/util/ItemFactory';
import ConfigSlice from './ConfigSlice';
import {DesignerMode} from 'components/config/configType';

const getItems = (designerMode) => {
  const mode = designerMode || ConfigSlice.getInitialState.designerMode;
  const items = [];

  const chartItem = makeItem({
    id: 'item1',
    type: 'chart'
  });

  items.push(chartItem);

  if (mode === 'adhoc') {
    const pivotItem = makeItem({
      id: 'item2',
      type: 'pivot'
    });
    items.push(pivotItem);
  }

  return items;
};

const dashboardInitialState = {
  0: {
    selectedItemId: 'item1',
    itemQuantity: 1,
    items: getItems('designer')
  }
};

const adhocInitialState = {
  0: {
    selectedItemId: 'item1',
    itemQuantity: 1,
    items: getItems('adhoc')
  }
};

const initialState = {
  0: {
    selectedItemId: 'item1',
    itemQuantity: 1,
    items: getItems()
  }
};

const getInitialState = () => {
  const mode = ConfigSlice.getInitialState().designerMode;

  if (mode === 'dashboard') {
    return dashboardInitialState;
  }

  if (mode === 'adhoc') {
    return adhocInitialState;
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
      return adhocInitialState;
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
  },
  setItemField(state, actions) {
    const reportId = actions.payload.reportId;
    const dataField = actions.payload.dataField;

    const itemIndex = state[reportId].items.findIndex(
        (item) => item.id == state[reportId].selectedItemId
    );

    if (itemIndex >= 0) {
      state[reportId].items[itemIndex].meta.dataField = dataField;
    }
  },
  updateItemField(state, actions) {
    const reportId = actions.payload.reportId;
    const dataField = actions.payload.dataField;

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
  },
  setItems(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.items;
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
