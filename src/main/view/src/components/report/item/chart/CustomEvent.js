import localizedString from 'config/localization';
import itemOptionManager from '../ItemOptionManager';
import rotate from 'assets/image/icon/button/rotate.png';
import xAxisSetting from 'assets/image/icon/button/x_axis_settings.png';
import yAxisSetting from 'assets/image/icon/button/y_axis_settings.png';
import seriesType from 'assets/image/icon/button/series_type.png';
import RibbonPopoverContents
  from 'components/common/atomic/Popover/molecules/RibbonPopoverContents';
import useModal from 'hooks/useModal';
import ItemOptionModal from '../pie/itemOptionModal/ItemOptionModal';

const useCustomEvent = () => {
  const {openModal} = useModal();
  const commonRibbonButton = itemOptionManager().commonRibbonBtnElement;
  const commonPopoverButton = itemOptionManager().commonPopoverButtonElement;

  const ribbonConfig = {
    'Rotate': {
      ...commonRibbonButton,
      'id': 'rotate',
      'label': localizedString.rotate,
      'imgSrc': rotate,
      'onClick': () => {
      }
    },
    'XAxisSetting': {
      ...commonRibbonButton,
      'id': 'xAxis_setting',
      'label': localizedString.xAxisSetting,
      'imgSrc': xAxisSetting,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'labelEdit',
              modalTitle: localizedString.labelDataEdit
            }
        );
      }
    },
    'YAxisSetting': {
      ...commonRibbonButton,
      'id': 'yAxis_setting',
      'label': localizedString.yAxisSetting,
      'imgSrc': yAxisSetting,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'yAxis',
              modalTitle: localizedString.labelDataEdit
            }
        );
      }
    },
    'ExtraAxisSetting': {
      ...commonRibbonButton,
      'id': 'extra_setting',
      'label': localizedString.extraAxisSetting,
      'imgSrc': yAxisSetting,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'supplyAxis',
              modalTitle: localizedString.labelDataEdit
            }
        );
      }
    },
    'SeriesType': {
      ...commonPopoverButton,
      'id': 'seriesType',
      'label': localizedString.seriesType,
      'imgSrc': seriesType,
      'renderContent': () => {
        return <RibbonPopoverContents
          popoverType={'labelImages'}
          titlePanel={true}
          id={'add_default_chart'}
          seriesTypeCompact={true}
        />;
      }
    }
  };

  return {ribbonConfig};
};

export default useCustomEvent;
