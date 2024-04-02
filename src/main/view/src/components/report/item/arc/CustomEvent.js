import localizedString from 'config/localization';
import itemOptionManager from '../ItemOptionManager';
import rotate from 'assets/image/icon/button/rotate.png';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';

const useCustomEvent = () => {
  const dispatch = useDispatch();
  const {updateItem} = ItemSlice.actions;
  const {commonRibbonBtnElement, commonRibbonBtn} = itemOptionManager();

  const ribbonConfig = {
    'ShowColorLegendD3': {...commonRibbonBtn['ShowColorLegendD3']},
    'Rotate': {
      ...commonRibbonBtnElement,
      'id': 'rotate',
      'label': localizedString.rotate,
      'imgSrc': rotate,
      'onClick': () => {
        const reportId = selectCurrentReportId(store.getState());
        const selectedItem = _.cloneDeep(selectCurrentItem(store.getState()));
        selectedItem.meta.useRotate = !selectedItem.meta.useRotate;
        dispatch(updateItem({
          reportId: reportId,
          item: selectedItem
        }));
      }
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
