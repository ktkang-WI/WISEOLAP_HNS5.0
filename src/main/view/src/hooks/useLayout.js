import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';

export default function useLayout() {
  const dispatch = useDispatch();
  const flexLayout = LayoutSlice.actions;
  const itemSlice = ItemSlice.actions;

  const initLayout = (reportTypes) => {
    dispatch(flexLayout.initLayout(reportTypes));
  };

  const setLayout = (reportId, layout) => {
    dispatch(flexLayout.setLayout({reportId: reportId, layout: layout}));
  };

  const setMovedLayout = (reportId, model) => {
    const param = {reportId: reportId, layout: model};

    dispatch(flexLayout.updataFlexLayout(param));
  };

  const insertFlexLayout = (reportId, component) => {
    const param =
      {reportId: reportId, component: component};

    dispatch(flexLayout.insertFlexLayout(param));
    dispatch(itemSlice.insertItem({
      reportId: reportId, // 보고서 ID
      item: {
        type: component // type을 담고 있는 item 객체
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

    dispatch(flexLayout.updataFlexLayout(layoutSliceParam));
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

  return {
    insertFlexLayout,
    setLayout,
    deleteFlexLayout,
    initLayout,
    setMovedLayout,
    convertCaptionVisible,
    editItemName
  };
};
