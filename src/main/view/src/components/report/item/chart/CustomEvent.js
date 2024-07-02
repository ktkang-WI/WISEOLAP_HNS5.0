import localizedString from 'config/localization';
import itemOptionManager from '../ItemOptionManager';
import rotate from 'assets/image/icon/button/rotate.png';
import xAxisSetting from 'assets/image/icon/button/x_axis_settings.png';
import yAxisSetting from 'assets/image/icon/button/y_axis_settings.png';
import extraAxisSetting from 'assets/image/icon/button/auxiliary_axis.png';
import useModal from 'hooks/useModal';
import ItemOptionModal from '../pie/itemOptionModal/ItemOptionModal';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';

const useCustomEvent = () => {
  const {openModal} = useModal();
  const dispatch = useDispatch();
  const {updateItem} = ItemSlice.actions;
  const {commonRibbonBtnElement, commonRibbonBtn} =
    itemOptionManager();

  const ribbonConfig = {
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
    },
    'ShowColorLegend': commonRibbonBtn['ShowColorLegend'],
    // TODO : x, y, 보조 축 설정 추가
    'XAxisSetting': {
      ...commonRibbonBtnElement,
      'id': 'xAxis_setting',
      'label': localizedString.xAxisSetting,
      'imgSrc': xAxisSetting,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'xAxis',
              height: '300px',
              modalTitle: localizedString.xAxisSetting
            }
        );
      }
    },
    'YAxisSetting': {
      ...commonRibbonBtnElement,
      'id': 'yAxis_setting',
      'label': localizedString.yAxisSetting,
      'imgSrc': yAxisSetting,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'yAxis',
              modalTitle: localizedString.yAxisSetting
            }
        );
      }
    },
    'ExtraAxisSetting': {
      ...commonRibbonBtnElement,
      'id': 'extra_setting',
      'label': localizedString.extraAxisSetting,
      'imgSrc': extraAxisSetting,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'extraAxis',
              modalTitle: localizedString.extraAxisSetting
            }
        );
      }
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
