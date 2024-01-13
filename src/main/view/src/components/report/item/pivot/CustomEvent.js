import initStateImg from 'assets/image/icon/button/init_state.png';
import totalImg from 'assets/image/icon/button/total.png';
import grandTotalImg from 'assets/image/icon/button/grand_total.png';
import layoutImg from 'assets/image/icon/button/layout.png';
import removeNullDataImg from 'assets/image/icon/button/remove_null_data.png';
import rowTotalPosImg from 'assets/image/icon/button/row_total_position.png';
import colTotalPosImg from 'assets/image/icon/button/column_total_position.png';
import colRowSwitchImg from 'assets/image/icon/button/col_row_switch.png';
import filterImg from 'assets/image/icon/report/filter.png';
import {useDispatch, useSelector} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentItem, selectCurrentItems}
  from 'redux/selector/ItemSelector';
import localizedString from 'config/localization';
import {CheckBox, RadioGroup} from 'devextreme-react';
import ItemType from '../util/ItemType';
import CustomEventUtility from './CustomEventUtility';
import Utility from './Utility';
import itemOptionManager from '../ItemOptionManager';

const useCustomEvent = () => {
  const dispatch = useDispatch();
  const reportId = useSelector(selectCurrentReportId);
  const selectedItem = useSelector(selectCurrentItem);
  const items = useSelector(selectCurrentItems);
  const {updateItem} = ItemSlice.actions;
  const commonPopoverButton = itemOptionManager().commonPopoverButtonElement;
  let formItems = {};

  // Ribbon 영역 CustomEvent
  // Ribbon 렌더링에 사용되는 dataSource
  if (selectedItem && selectedItem.type == ItemType.PIVOT_GRID) {
    formItems = CustomEventUtility.getFormItems(selectedItem);
  }

  const getRadioPopover = (key, value) => {
    return <RadioGroup
      onValueChanged={(e) => {
        const item = ribbonEvent[key](e);

        dispatch(updateItem({reportId, item}));
      }}
      valueExpr={'id'}
      displayExpr={'text'}
      value={value}
      items={formItems[key]}/>;
  };

  const getCheckBoxPopover = (key) => {
    const onValueChanged = (id, e) => {
      let item = ribbonEvent[key](id, e);

      if (key == 'initState') {
        item = _.cloneDeep(item);
        Utility.generateItem(item, item.mart.data);
      }

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

  // ribbon Element 객체
  const ribbonConfig = {
    'InitState': {
      ...commonPopoverButton,
      'id': 'init_state',
      'label': localizedString.initState,
      'imgSrc': initStateImg,
      'renderContent': () => {
        return getCheckBoxPopover('initState');
      }
    },
    'Total': {
      ...commonPopoverButton,
      'id': 'total',
      'label': localizedString.total,
      'imgSrc': totalImg,
      'renderContent': () => {
        return getCheckBoxPopover('total');
      }
    },
    'GrandTotal': {
      ...commonPopoverButton,
      'id': 'grand_total',
      'label': localizedString.grandTotal,
      'imgSrc': grandTotalImg,
      'renderContent': () => {
        return getCheckBoxPopover('grandTotal');
      }
    },
    'Layout': {
      ...commonPopoverButton,
      'id': 'layout',
      'label': localizedString.layout,
      'imgSrc': layoutImg,
      'renderContent': () => {
        return getRadioPopover('layout', selectedItem.meta.layout);
      }
    },
    'RowTotalPosition': {
      ...commonPopoverButton,
      'id': 'row_total_position',
      'label': localizedString.rowTotalPosition,
      'imgSrc': rowTotalPosImg,
      'renderContent': () => {
        return getRadioPopover('rowTotalPosition',
            selectedItem.meta.positionOption.row.position);
      }
    },
    'ColumnTotalPosition': {
      ...commonPopoverButton,
      'id': 'column_total_position',
      'label': localizedString.columnTotalPosition,
      'imgSrc': colTotalPosImg,
      'renderContent': () => {
        return getRadioPopover('columnTotalPosition',
            selectedItem.meta.positionOption.column.position);
      }
    },
    'DataPosition': {
      ...commonPopoverButton,
      'id': 'data_position',
      'label': localizedString.dataPosition,
      'imgSrc': colTotalPosImg,
      'renderContent': () => {
        return getRadioPopover('dataPosition',
            selectedItem.meta.positionOption.dataPosition);
      }
    },
    'RemoveNullData': {
      ...commonPopoverButton,
      'id': 'remove_null_data',
      'label': localizedString.removeNullData,
      'imgSrc': removeNullDataImg,
      'renderContent': () => {
        return getCheckBoxPopover('removeNullData');
      }
    },
    'ShowFilter': {
      ...commonPopoverButton,
      'id': 'show_filter',
      'label': localizedString.showFilter,
      'imgSrc': filterImg,
      'renderContent': () => {
        return getCheckBoxPopover('showFilter');
      }
    }
  };

  const setMeta = (item, key, value) => {
    return {
      ...item,
      meta: {
        ...item.meta,
        [key]: value
      }
    };
  };

  const editPositionOption = (id, key, value) => {
    let positionOption = selectedItem.meta.positionOption;
    let target = '';

    const tempId = id.toLowerCase();
    if (tempId.indexOf('row') >= 0) {
      target = 'row';
    } else if (tempId.indexOf('column') >= 0) {
      target = 'column';
    }

    if (target) {
      positionOption = {
        ...positionOption,
        [target]: {
          ...positionOption[target],
          [key]: value
        }
      };
    } else {
      positionOption = {
        ...positionOption,
        [key]: value
      };
    }

    return setMeta(selectedItem, 'positionOption', positionOption);
  };

  // Ribbon 영역에서 수정할 수 있는 항목에서
  // 값 변화가 탐지될 경우(onValueChanged) 이벤트
  const ribbonEvent = {
    'initState': (id, e) => {
      return editPositionOption(id, 'expand', e.value);
    },
    'total': (id, e) => {
      return editPositionOption(id, 'totalVisible', e.value);
    },
    'grandTotal': (id, e) => {
      return editPositionOption(id, 'grandTotalVisible', e.value);
    },
    'layout': (e) => {
      return setMeta(selectedItem, 'layout', e.value);
    },
    'columnTotalPosition': (e) => {
      return editPositionOption('columnTotalPosition', 'position', e.value);
    },
    'rowTotalPosition': (e) => {
      return editPositionOption('rowTotalPosition', 'position', e.value);
    },
    'dataPosition': (e) => {
      return editPositionOption('dataPosition', 'dataPosition', e.value);
    },
    'removeNullData': (id, e) => {
      return setMeta(selectedItem, id, e.value);
    },
    'showFilter': (id, e) => {
      return setMeta(selectedItem, id, e.value);
    }
  };

  // TabButton CustomEvent
  const tabButtonConfig = {
    'ColRowSwitch': {
      title: localizedString.colRowSwitch,
      onClick: (id) => {
        const item = _.cloneDeep(items.find((i) => id == i.id));

        item.meta.colRowSwitch = !item.meta.colRowSwitch;
        Utility.generateItem(item, item.mart.data);

        dispatch(updateItem({reportId, item}));
      },
      icon: <img width={'100%'} src={colRowSwitchImg}></img>
    }
  };

  /**
   * Tab Header Button element를 리턴합니다.
   * @param {*} key tabButton key
   * @param {*} id item id
   * @return {JSONObject} button config
   */
  const getTabHeaderButton = (key, id) => {
    return (
      <button
        key={key}
        title={tabButtonConfig[key].title}
        onClick={() => tabButtonConfig[key].onClick(id)}
      >
        {tabButtonConfig[key].icon}
      </button>
    );
  };

  return {ribbonConfig, getTabHeaderButton};
};

export default useCustomEvent;
