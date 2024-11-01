import {useDispatch} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import itemOptionManager from '../ItemOptionManager';
import ItemSlice from 'redux/modules/ItemSlice';
import {useSelector} from 'react-redux';
import localizedString from 'config/localization';
import imgNotaionFormat
  from 'assets/image/icon/button/add_chart.png';
import imgContentArray
  from 'assets/image/icon/button/ico_Vlines.png';
import useModal from 'hooks/useModal';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import NotationFormatModal
  from '../util/modal/organism/notationFormat/NotationFormatModal';
import ContentArrayModal
  from '../util/modal/organism/contentArray/ContentArrayModal';

const useCustomEvent = () => {
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = useSelector(selectCurrentReportId);
  const commonRibbonButton = itemOptionManager().commonRibbonBtnElement;
  const {updateItem} = ItemSlice.actions;
  const {openModal} = useModal();

  const modalEvent = {
    'notationFormat': (key, value) => {
      return openModal(NotationFormatModal,
          {
            popupName: 'notationFormat',
            modalTitle: localizedString.notationFormat,
            options: value,
            notationFormat:
              selectedItem.meta.liquidFillGaugeOption.notationFormat,
            onSubmit: (returnedOptions) => {
              const item =
                 ribbonEvent[key](key, returnedOptions.notationFormat.key);
              dispatch(updateItem({reportId, item}));
            }
          }
      );
    },
    'contentArray': (key, value) => {
      return openModal(ContentArrayModal,
          {
            popupName: 'contentArray',
            modalTitle: localizedString.contentArray,
            options: value,
            contentArray:
              selectedItem.meta.liquidFillGaugeOption.contentArray,
            onSubmit: (returnedOptions) => {
              const item =
              ribbonEvent[key](key, returnedOptions.contentArray);
              dispatch(updateItem({reportId, item}));
            }
          }
      );
    }
  };

  const editLiquidFillGaugeOption = (id, key, value) => {
    let liquidFillGaugeOption = selectedItem.meta.liquidFillGaugeOption;
    const isThisRadio = id === key;
    if (!isThisRadio) {
      liquidFillGaugeOption = {
        ...liquidFillGaugeOption,
        [key]: {
          ...liquidFillGaugeOption[key],
          [id]: value
        }
      };
    } else {
      liquidFillGaugeOption = {
        ...liquidFillGaugeOption,
        [key]: value
      };
    }

    return setMeta('liquidFillGaugeOption', liquidFillGaugeOption);
  };

  const setMeta = (key, value) => {
    const item = selectedItem;
    return {
      ...item,
      meta: {
        ...item.meta,
        liquidFillGaugeOption: {
          ...value
        }
      }
    };
  };
  const ribbonEvent = {
    'notationFormat': (id, e) => {
      return editLiquidFillGaugeOption(id, 'notationFormat', e);
    },
    'contentArray': (id, e) => {
      return editLiquidFillGaugeOption(id, 'contentArray', e);
    }
  };

  const ribbonConfig = {
    'NotationFormat': {
      ...commonRibbonButton,
      'id': 'input_notationFormat',
      'label': localizedString.notationFormat,
      'imgSrc': imgNotaionFormat,
      'onClick': () => {
        return modalEvent['notationFormat']('notationFormat',
            selectedItem.meta.liquidFillGaugeOption.notationFormat);
      }
    },
    'ContentArray': {
      ...commonRibbonButton,
      'id': 'input_contentArray',
      'label': localizedString.contentArray,
      'imgSrc': imgContentArray,
      'onClick': () => {
        return modalEvent['contentArray']('contentArray',
            selectedItem.meta.liquidFillGaugeOption.contentArray);
      }
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
