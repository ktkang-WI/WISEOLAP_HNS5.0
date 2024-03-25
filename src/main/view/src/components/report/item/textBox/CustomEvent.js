import localizedString from 'config/localization';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import legend from 'assets/image/icon/button/ico_showColorLegend.png';
import {Switch} from 'devextreme-react';
import {useSelector} from 'react-redux';
import itemOptionManager from '../ItemOptionManager';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const useCustomEvent = () => {
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = useSelector(selectCurrentReportId);
  const commonPopoverButton = itemOptionManager().commonPopoverButtonElement;
  const {updateItem} = ItemSlice.actions;

  const onOffToText = (value) => {
    return value ? 'on' : 'off';
  };
  const onOffToBoolean = (value) => {
    return value === 'on' ? true : false;
  };

  const getRadioPopover = (key, value) => {
    return <Switch
      width='100%'
      onValueChange={(e) => {
        const item = ribbonEvent[key](key, e);
        dispatch(updateItem({reportId, item}));
      }}
      valueExpr={'id'}
      displayExpr={'text'}
      value={onOffToBoolean(value)}
    />;
  };

  const textBoxOption = (id, key, value) => {
    let textBoxOption = selectedItem.meta.textBoxOption;
    const isThisRadio = id === key;
    if (!isThisRadio) {
      textBoxOption = {
        ...textBoxOption,
        [key]: {
          ...textBoxOption[key],
          [id]: value
        }
      };
    } else {
      textBoxOption = {
        ...textBoxOption,
        [key]: value
      };
    }

    return setMeta('textBoxOption', textBoxOption);
  };

  const setMeta = (key, value) => {
    const item = selectedItem;
    return {
      ...item,
      meta: {
        ...item.meta,
        textBoxOption: {
          ...value
        }
      }
    };
  };

  const ribbonEvent = {
    'toolBar': (id, e) => {
      return textBoxOption(id, 'toolBar', e);
    },
    'readOnly': (id, e) => {
      return textBoxOption(id, 'readOnly', e);
    }
  };

  const ribbonConfig = {
    'ToolBar': {
      ...commonPopoverButton,
      'id': 'input_toolBar',
      'label': localizedString.ToolbarVisible,
      'imgSrc': legend,
      'renderContent': () => {
        return getRadioPopover('toolBar',
            onOffToText(selectedItem.meta.textBoxOption.toolBar));
      }
    },
    'ReadOnly': {
      ...commonPopoverButton,
      'id': 'input_readOnly',
      'label': localizedString.editable,
      'imgSrc': legend,
      'renderContent': () => {
        return getRadioPopover('readOnly',
            onOffToText(selectedItem.meta.textBoxOption.readOnly));
      }
    }
  };
  return {
    ribbonConfig
  };
};

export default useCustomEvent;

