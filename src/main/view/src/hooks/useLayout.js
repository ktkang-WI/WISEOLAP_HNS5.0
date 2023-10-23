import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';

export default function useLayout() {
  const dispatch = useDispatch();
  const flexLayout = LayoutSlice.actions;
  const itemSlice = ItemSlice.actions;

  const defaultFlexLayout = (reportType) => {
    dispatch(flexLayout.defaultFlexLayout(reportType));
  };

  const setLayout = (reportId, layout) => {
    dispatch(flexLayout.seLayout({reportId: reportId, layout: layout}));
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

  const deleteFlexLayout = (reportId, tabId) => {
    const param = {reportId: reportId, itemId: tabId};

    dispatch(flexLayout.deleteFlexLayout(param));
    dispatch(itemSlice.deleteItem(param));
  };

  return {
    insertFlexLayout,
    setLayout,
    deleteFlexLayout,
    defaultFlexLayout
  };
};
