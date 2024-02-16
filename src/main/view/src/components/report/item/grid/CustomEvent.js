import grandTotalImg from 'assets/image/icon/button/grand_total.png';
import itemOptionManager from '../ItemOptionManager';
import localizedString from 'config/localization';
import inputTxt from 'assets/image/icon/button/inputTxt.png';
import gridLine from 'assets/image/icon/button/ico_defaultStatus.png';
import paging from 'assets/image/icon/button/ico_layout.png';
import autoWidh from 'assets/image/icon/button/ico_rowTotalsPosition.png';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {CheckBox, RadioGroup} from 'devextreme-react';
import CustomEventUtility from './CustomEventUtility';
import ItemType from '../util/ItemType';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import ItemOptionModal from './ItemOptionModal/ItemOptionModal';
import useModal from 'hooks/useModal';


const useCustomEvent = () => {
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = useSelector(selectCurrentReportId);
  const commonRibbonButton = itemOptionManager().commonRibbonBtnElement;
  const commonPopoverButton = itemOptionManager().commonPopoverButtonElement;
  const {updateItem} = ItemSlice.actions;
  const {openModal} = useModal();
  let formItems = {};

  // Ribbon 영역 CustomEvent
  // Ribbon 렌더링에 사용되는 dataSource
  if (selectedItem && selectedItem.type == ItemType.DATA_GRID) {
    formItems = CustomEventUtility.getFormItems(selectedItem);
  }

  const onOffToBoolean = (value) => {
    return value === 'on' ? true : false;
  };

  const booleanToOnOff = (value) => {
    return value ? 'on' : 'off';
  };

  const getModal = (key, value) => {
    return openModal(ItemOptionModal,
        {
          popupName: 'pagingSetting',
          modalTitle: '페이징 설정',
          options: value,
          onSubmit: (returnedOptions) => {
            const item =
            ribbonEvent[key](key, returnedOptions.paging);
            dispatch(updateItem({reportId, item}));
          }
        }
    );
  };

  const getRadioPopover = (key, value) => {
    return <RadioGroup
      onValueChanged={(e) => {
        const item = ribbonEvent[key](key, e);

        dispatch(updateItem({reportId, item}));
      }}
      valueExpr={'id'}
      displayExpr={'text'}
      value={value}
      items={formItems[key]}/>;
  };

  const getCheckBoxPopover = (key) => {
    const onValueChanged = (id, e) => {
      const item = ribbonEvent[key](id, e);

      dispatch(updateItem({reportId, item}));
    };

    return <>
      {formItems[key].map((item) => (
        <CheckBox
          onValueChanged={(e) => {
            onValueChanged(item.id, e);
          }}
          key={item.id}
          value={item.value}
          text={item.text}
        />
      ))}
    </>;
  };

  const setMeta = (key, value) => {
    const item = selectedItem;
    return {
      ...item,
      meta: {
        ...item.meta,
        dataGridOption: {
          ...value
        }
      }
    };
  };

  const ribbonConfig = {
    'GridLine': {
      ...commonPopoverButton,
      'id': 'input_gridLine',
      'label': localizedString.gridLine,
      'imgSrc': gridLine,
      'renderContent': () => {
        return getCheckBoxPopover('gridLine',
            selectedItem.meta.dataGridOption.gridLine);
      }
    },
    'AutoGridWidth': {
      ...commonPopoverButton,
      'id': 'input_autoGridWidth',
      'label': localizedString.gridResiging,
      'imgSrc': autoWidh,
      'renderContent': () => {
        return getRadioPopover('autoGridWidth',
            booleanToOnOff(selectedItem.meta.dataGridOption.autoGridWidth));
      }
    },
    /*
    'BarPalet': {
      ...commonPopoverButton,
      'id': 'input_text',
      'label': localizedString.cellMerging,
      'imgSrc': grandTotalImg,
      'renderContent': () => {
        return getRadioPopover('merge', selectedItem.meta.merging);
      }
    },
    'BarColorEdit': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.cellMerging,
      'imgSrc': grandTotalImg,
      'renderContent': () => {
        return getRadioPopover('merge', selectedItem.meta.merging);
      }
    },*/
    'CellMerging': {
      ...commonPopoverButton,
      'id': 'input_cellMerging',
      'label': localizedString.cellMerging,
      'imgSrc': grandTotalImg,
      'renderContent': () => {
        return getRadioPopover('cellMerging',
            booleanToOnOff(selectedItem.meta.dataGridOption.cellMerging));
      }
    },
    'ColumnHeader': {
      ...commonPopoverButton,
      'id': 'input_columnHeader',
      'label': localizedString.columnHeader,
      'imgSrc': grandTotalImg,
      'renderContent': () => {
        return getRadioPopover('columnHeader',
            booleanToOnOff(selectedItem.meta.dataGridOption.columnHeader));
      }
    },
    'Paging': {
      ...commonRibbonButton,
      'id': 'input_paging',
      'label': localizedString.paging,
      'imgSrc': paging,
      'onClick': () => {
        return getModal('paging',
            selectedItem.meta.dataGridOption);
      }
    },
    'AutoWrap': {
      ...commonPopoverButton,
      'id': 'input_autoWrap',
      'label': localizedString.autoWrap,
      'imgSrc': inputTxt,
      'renderContent': () => {
        return getRadioPopover('autoWrap',
            booleanToOnOff(selectedItem.meta.dataGridOption.autoWrap));
      }
    }
    /*
    'HeaderAdd': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.headerAdd,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    }
    'InputTxt': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.inputTxt,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    }
    */
  };

  const editDataGridOption = (id, key, value) => {
    let dataGridOption = selectedItem.meta.dataGridOption;
    const isThisRadio = id === key;
    if (!isThisRadio) {
      dataGridOption = {
        ...dataGridOption,
        [key]: {
          ...dataGridOption[key],
          [id]: value
        }
      };
    } else {
      dataGridOption = {
        ...dataGridOption,
        [key]: value
      };
    }

    return setMeta('dataGridOption', dataGridOption);
  };

  const ribbonEvent = {
    'cellMerging': (id, e) => {
      return editDataGridOption(id, 'cellMerging', onOffToBoolean(e.value));
    },
    'columnHeader': (id, e) => {
      return editDataGridOption(id, 'columnHeader', onOffToBoolean(e.value));
    },
    'autoWrap': (id, e) => {
      return editDataGridOption(id, 'autoWrap', onOffToBoolean(e.value));
    },
    'gridLine': (id, e) => {
      return editDataGridOption(id, 'gridLine', e.value);
    },
    'autoGridWidth': (id, e) => {
      return editDataGridOption(id, 'autoGridWidth', onOffToBoolean(e.value));
    },
    'paging': (id, e) => {
      return editDataGridOption(id, 'paging', e);
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
