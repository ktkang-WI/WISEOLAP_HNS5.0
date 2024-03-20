import localizedString from 'config/localization';
import itemOptionManager from '../ItemOptionManager';
import yAxisSetting from 'assets/image/icon/button/y_axis_settings.png';
import useModal from 'hooks/useModal';
import ItemOptionModal from '../pie/itemOptionModal/ItemOptionModal';

const useCustomEvent = () => {
  const {openModal} = useModal();
  const {commonRibbonBtnElement} = itemOptionManager();


  const ribbonConfig = {
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
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
