import {paletteCollection}
  from 'components/common/atomic/Popover/organism/Palette';
import {useDispatch} from 'react-redux';
import store from 'redux/modules';
import ConfigSlice from 'redux/modules/ConfigSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import {selectMyPageDesignerConfig} from 'redux/selector/ConfigSelector';

export default function useLayout() {
  const dispatch = useDispatch();
  const layoutSlice = LayoutSlice.actions;
  const itemSlice = ItemSlice.actions;
  const configSlice = ConfigSlice.actions;

  const initLayout = (reportTypes) => {
    dispatch(layoutSlice.initLayout(reportTypes));
  };

  const setLayout = (reportId, layout) => {
    dispatch(layoutSlice.setLayout({reportId: reportId, layout: layout}));
  };

  const updateLayoutShape = (reportId, model) => {
    const param = {reportId: reportId, layout: model};

    dispatch(layoutSlice.updataFlexLayout(param));
  };

  const insertFlexLayout = (reportId, component, chartType, options) => {
    const myConfig = selectMyPageDesignerConfig(store?.getState());
    const param =
      {reportId: reportId, component: component};
    const paletteIdx = paletteCollection.findIndex(
        (palette) => palette.name == myConfig?.defaultPalette
    );

    dispatch(layoutSlice.insertFlexLayout(param));
    dispatch(itemSlice.insertItem({
      reportId: reportId, // 보고서 ID
      item: {
        type: component, // type을 담고 있는 item 객체
        chartType: chartType,
        options: options,
        palette: paletteIdx > -1? paletteIdx : 0
      }
    }));
  };

  const deleteFlexLayout = (reportId, itemId, model) => {
    const itemSliceParam = {reportId: reportId, itemId: itemId};
    const layoutSliceParam = {
      reportId: reportId,
      layout: model
    };

    // layout 전부 삭제 시 비어있는 layout이 state에 존재.
    // layout이 전부 비어 있을 경우 children의 값을 빈 배열로 반환.
    const emptyCheck = layoutSliceParam.layout.layout.children;

    if (emptyCheck.length == 1 && emptyCheck[0].children.length == 0) {
      layoutSliceParam.layout.layout.children = [];
    }

    dispatch(layoutSlice.updataFlexLayout(layoutSliceParam));
    dispatch(itemSlice.deleteItem(itemSliceParam));
  };

  // 캡션 보기 활성화, 비활성화.
  const convertCaptionVisible = (reportId, selectedItem) => {
    const convert = selectedItem.meta.useCaption;
    const item = {
      ...selectedItem,
      meta: {...selectedItem.meta, useCaption: convert? false : true}
    };

    dispatch(itemSlice.updateItem({reportId: reportId, item: item}));
  };

  // 아이템 이름 변경.
  const editItemName = (reportId, selectedItem, editText) => {
    const item = {
      ...selectedItem,
      meta: {...selectedItem.meta, name: editText}
    };

    dispatch(itemSlice.updateItem({reportId: reportId, item: item}));
  };

  const editColor = (reportId, selectedItem, colorEditValues) => {
    const item = {
      ...selectedItem,
      meta: {
        ...selectedItem.meta,
        paletteType: 'colorEdit',
        colorEdit: colorEditValues.colorEdit}
    };

    dispatch(itemSlice.updateItem({reportId: reportId, item: item}));
  };

  const editMemo = (reportId, selectedItem, memoValue) => {
    const item = {
      ...selectedItem,
      meta: {
        ...selectedItem.meta,
        memo: memoValue.memo}
    };

    dispatch(itemSlice.updateItem({reportId: reportId, item: item}));
  };

  const editPalette = (reportId, selectedItem, paletteValue) => {
    const item = {
      ...selectedItem,
      meta: {
        ...selectedItem.meta,
        colorEdit: [],
        paletteType: 'palette',
        palette: paletteValue}
    };

    dispatch(itemSlice.updateItem({reportId: reportId, item: item}));
  };

  const adHocLayoutUpdate = (reportId, value) => {
    const param = {
      reportId: reportId,
      layoutType: value
    };

    dispatch(itemSlice.updateLayoutSetting(param));
    dispatch(layoutSlice.adHocLayoutUpdate(param));
  };

  const afterLoginInitSettingLayout = (reportTypes, personalConfig) => {
    dispatch(configSlice.setInitDisplayConfig(reportTypes));

    if (personalConfig !== '') {
      const object = personalConfig;
      const stringToJson = JSON.parse(personalConfig.defaultItem);

      object.defaultItem = stringToJson?.item || '';
      object.defaultLayout =
        {
          check: stringToJson?.check || false,
          layout: stringToJson?.layout || 'CTGB'
        };

      dispatch(configSlice.setMyPageConfigure(object));
    }
  };

  return {
    insertFlexLayout,
    setLayout,
    deleteFlexLayout,
    initLayout,
    updateLayoutShape,
    convertCaptionVisible,
    editItemName,
    adHocLayoutUpdate,
    editPalette,
    editColor,
    editMemo,
    afterLoginInitSettingLayout
  };
};
