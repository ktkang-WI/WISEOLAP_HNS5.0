import initStateImg from 'assets/image/icon/button/init_state.png';
import totalImg from 'assets/image/icon/button/total.png';
import grandTotalImg from 'assets/image/icon/button/grand_total.png';
import layoutImg from 'assets/image/icon/button/layout.png';
import rowTotalPosImg from 'assets/image/icon/button/row_total_position.png';
import colTotalPosImg from 'assets/image/icon/button/column_total_position.png';
import {useDispatch, useSelector} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentItem}
  from 'redux/selector/ItemSelector';
import localizedString from 'config/localization';
import {RadioGroup} from 'devextreme-react';
import itemOptionManager from '../ItemOptionManager';

const useCustomEvent = () => {
  const dispatch = useDispatch();
  const reportId = useSelector(selectCurrentReportId);
  const selectedItem = useSelector(selectCurrentItem);
  const {updateItem} = ItemSlice.actions;
  const commonPopoverButton = itemOptionManager().commonPopoverButtonElement;
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

  const ribbonConfig = {
    'rotate': {
      ...commonPopoverButton,
      'id': 'init_state',
      'label': localizedString.initState,
      'imgSrc': initStateImg,
      'renderContent': () => {
        return getCheckBoxPopover('initState');
      }
    },
    'xAxis': {
      ...commonPopoverButton,
      'id': 'total',
      'label': localizedString.total,
      'imgSrc': totalImg,
      'renderContent': () => {
        return getCheckBoxPopover('total');
      }
    },
    'yAxis': {
      ...commonPopoverButton,
      'id': 'grand_total',
      'label': localizedString.grandTotal,
      'imgSrc': grandTotalImg,
      'renderContent': () => {
        return getCheckBoxPopover('grandTotal');
      }
    },
    'supportAxis': {
      ...commonPopoverButton,
      'id': 'layout',
      'label': localizedString.layout,
      'imgSrc': layoutImg,
      'renderContent': () => {
        return getRadioPopover('layout', selectedItem.meta.layout);
      }
    },
    'legend': {
      ...commonPopoverButton,
      'id': 'row_total_position',
      'label': localizedString.rowTotalPosition,
      'imgSrc': rowTotalPosImg,
      'renderContent': () => {
        return getRadioPopover('rowTotalPosition',
            selectedItem.meta.positionOption.row.position);
      }
    },
    'chartType': {
      ...commonPopoverButton,
      'id': 'column_total_position',
      'label': localizedString.columnTotalPosition,
      'imgSrc': colTotalPosImg,
      'renderContent': () => {
        return getRadioPopover('columnTotalPosition',
            selectedItem.meta.positionOption.column.position);
      }
    }
  };

  return {ribbonConfig};
};

export default useCustomEvent;
