import localizedString from 'config/localization';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import legend from 'assets/image/icon/button/ico_showColorLegend.png';
import {Switch} from 'devextreme-react';
import {useSelector} from 'react-redux';
import itemOptionManager from '../ItemOptionManager';
import ItemType from '../util/ItemType';
import CustomEventUtility from './CustomEventUtility';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const useCustomEvent = () => {
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = useSelector(selectCurrentReportId);
  const commonPopoverButton = itemOptionManager().commonPopoverButtonElement;
  const {updateItem} = ItemSlice.actions;
  let formItems = {};

  if (selectedItem && selectedItem.type == ItemType.CHOROPLETH) {
    formItems = CustomEventUtility.getFormItems(selectedItem);
  }

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
      items={formItems[key]}
    />;
  };

  const editDataGridOption = (id, key, value) => {
    let choroplethOption = selectedItem.meta.choroplethOption;
    const isThisRadio = id === key;
    if (!isThisRadio) {
      choroplethOption = {
        ...choroplethOption,
        [key]: {
          ...choroplethOption[key],
          [id]: value
        }
      };
    } else {
      choroplethOption = {
        ...choroplethOption,
        [key]: value
      };
    }

    return setMeta('choroplethOption', choroplethOption);
  };

  const setMeta = (key, value) => {
    const item = selectedItem;
    return {
      ...item,
      meta: {
        ...item.meta,
        choroplethOption: {
          ...value
        }
      }
    };
  };

  const ribbonEvent = {
    'legend': (id, e) => {
      return editDataGridOption(id, 'legend', e);
    }
  };

  const ribbonConfig = {
    'Legend': {
      ...commonPopoverButton,
      'id': 'input_Legend',
      'label': localizedString.legned,
      'imgSrc': legend,
      'renderContent': () => {
        return getRadioPopover('legend',
            onOffToText(selectedItem.meta.choroplethOption.legend));
      }
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
