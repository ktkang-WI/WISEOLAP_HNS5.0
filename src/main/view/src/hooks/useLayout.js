import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';

export default function useLayout() {
  const dispatch = useDispatch();
  const flexLayout = LayoutSlice.actions;
  const itemSlice = ItemSlice.actions;

  const initFlexLayout = (reportType) => {
    dispatch(flexLayout.initFlexLayout(reportType));
  };

  const setLayout = (reportId, layout) => {
    dispatch(flexLayout.setLayout({reportId: reportId, layout: layout}));
  };

  const setMovedLayout = (action) => {
    dispatch(flexLayout.setMovedLayout(action));
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

  const deleteFlexLayout = (reportId, itemId) => {
    const param = {reportId: reportId, itemId: itemId};

    dispatch(flexLayout.deleteFlexLayout(param));
    dispatch(itemSlice.deleteItem(param));
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
    initFlexLayout,
    setMovedLayout,
    convertCaptionVisible,
    editItemName
  };
};
