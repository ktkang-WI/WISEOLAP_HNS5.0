import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import LayoutSlice from 'redux/modules/LayoutSlice';
import {selectFlexLayoutConfig} from 'redux/selector/LayoutSelector';

export default function useLayout() {
  const dispatch = useDispatch();
  const flexLayout = LayoutSlice.actions;
  const layoutNum = useSelector(selectFlexLayoutConfig);

  const defaultFlexLayout = (reportType) => {
    dispatch(flexLayout.defaultFlexLayout(reportType));
  };

  const insertFlexLayout = (reportId, component) => {
    const len = layoutNum.layout.children.length;
    const num = len != 0? layoutNum.layout.children[len-1].children[0].id : 0;
    const param =
      {reportId: reportId, num: parseInt(num)+1, component: component};

    dispatch(flexLayout.insertFlexLayout(param));
  };

  const deleteFlexLayout = (reportId, tabId) => {
    const param = {reportId: reportId, tabId: tabId};

    dispatch(flexLayout.deleteFlexLayout(param));
  };

  return {
    insertFlexLayout,
    deleteFlexLayout,
    defaultFlexLayout
  };
};
