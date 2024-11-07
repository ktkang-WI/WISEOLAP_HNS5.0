import {useDispatch} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import itemOptionManager from '../ItemOptionManager';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {useSelector} from 'react-redux';
import imgContentArray
  from 'assets/image/icon/button/ico_Vlines.png';
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
    'contentArray': (key, value) => {
      return openModal(ContentArrayModal,
          {
            popupName: 'contentArray',
            modalTitle: localizedString.contentArray,
            options: value,
            max: 5,
            contentArray:
              selectedItem.meta.cardOption.contentArray,
            onSubmit: (returnedOptions) => {
              const item =
              ribbonEvent[key](key, returnedOptions.contentArray);
              dispatch(updateItem({reportId, item}));
            }
          }
      );
    }
  };
  const editCardOption = (id, key, value) => {
    let cardOption = selectedItem.meta.cardOption;
    const isThisRadio = id === key;
    if (!isThisRadio) {
      cardOption = {
        ...cardOption,
        [key]: {
          ...cardOption[key],
          [id]: value
        }
      };
    } else {
      cardOption = {
        ...cardOption,
        [key]: value
      };
    }

    return setMeta('cardOption', cardOption);
  };
  const setMeta = (key, value) => {
    const item = selectedItem;
    return {
      ...item,
      meta: {
        ...item.meta,
        cardOption: {
          ...value
        }
      }
    };
  };
  const ribbonEvent = {
    'contentArray': (id, e) => {
      return editCardOption(id, 'contentArray', e);
    }
  };
  const ribbonConfig = {
    'ContentArray': {
      ...commonRibbonButton,
      'id': 'input_contentArray',
      'label': localizedString.contentArray,
      'imgSrc': imgContentArray,
      'onClick': () => {
        return modalEvent['contentArray']('contentArray',
            selectedItem.meta.cardOption.contentArray);
      }
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
