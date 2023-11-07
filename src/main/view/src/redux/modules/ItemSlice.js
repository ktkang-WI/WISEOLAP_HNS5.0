import {createSlice} from '@reduxjs/toolkit';
import {makeItem} from 'components/report/item/util/ItemFactory';
import chartSeriesButtonIcon
  from 'assets/image/icon/item/chart_bar.png';
import dimensionIcon
  from 'assets/image/icon/dataSource/dimension.png';
import measureIcon from 'assets/image/icon/dataSource/measure.png';
import localizedString from 'config/localization';

const initialState = {
  0: {
    selectedItemId: 'item1',
    itemQuantity: 1,
    items: [{
      id: 'item1',
      meta: {
        name: '아이템',
        useCaption: true,
        dataField: {
          dataFieldQuantity: 0,
          measure: [],
          dimension: []
        }
      },
      mart: {
        dataFieldOption: {
          measure: {
            label: localizedString.measure,
            icon: measureIcon,
            placeholder: localizedString.measurePlaceholder,
            type: 'MEA',
            useButton: true,
            // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
            buttonIcon: chartSeriesButtonIcon,
            buttonEvent: function(e) {
              console.log(e);
            }
          },
          dimension: {
            label: localizedString.dimension,
            icon: dimensionIcon,
            placeholder: localizedString.dimensionPlaceholder,
            type: 'DIM' // 타입은 DIM 또는 MEA. 조회시 MEA와 DIM 구분하기 위함.
          }
        }
      }
    }]
  }
};

const reducers = {
  /* REPORT */
  initItems(state, actions) {
    state = initialState;
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
  updateItemField(state, actions) {
    const reportId = actions.payload.reportId;

    const dataField = actions.payload.dataField;

    const itemIndex = state[reportId].items.findIndex(
        (item) => item.id == state[reportId].selectedItemId
    );

    if (itemIndex >= 0) {
      state[reportId].items[itemIndex].meta.dataField = dataField;
    }
  },
  setItem(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.items;
  }
};

const extraReducers = {};

const ItemSlice = createSlice({
  name: 'Item',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ItemSlice;
