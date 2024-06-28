import localizedString from 'config/localization';
import pieStyle from 'assets/image/icon/button/style.png';
import tooltip from 'assets/image/icon/button/tooltip.png';
import dataLabelEdit from 'assets/image/icon/button/label.png';
import labelPosition from 'assets/image/icon/button/label_location.png';
import itemOptionManager from '../ItemOptionManager';
import {RadioGroup} from 'devextreme-react';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import ItemType from '../util/ItemType';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import CustomEventUtility from './CusomEventUtility';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import useModal from 'hooks/useModal';
import ItemOptionModal from './itemOptionModal/ItemOptionModal';

const useCustomEvent = () => {
  const selectedItem = useSelector(selectCurrentItem);
  const dispatch = useDispatch();
  const {updateItem} = ItemSlice.actions;
  const reportId = useSelector(selectCurrentReportId);
  const {openModal} = useModal();
  // 팝오버 버튼의 공통 요소 집합
  // 팝오버가 아닌 일반 리본 버튼 요소 집합.
  const {commonPopoverButtonElement, commonRibbonBtnElement, commonRibbonBtn} =
    itemOptionManager();
  let formItems = {};

  if (selectedItem && selectedItem.type == ItemType.PIE_CHART) {
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

  // ribbon Element 객체 : pie차트에서 사용됨.
  const ribbonConfig = {
    'DataLabelEdit': {
      ...commonRibbonBtnElement,
      'id': 'data_label_edit',
      'label': localizedString.dataLabelEdit,
      'imgSrc': dataLabelEdit,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'labelEdit',
              modalTitle: localizedString.labelDataEdit
            }
        );
      }
    },
    'LabelPosition': {
      ...commonPopoverButtonElement,
      'id': 'label_position',
      'label': localizedString.labelPosition,
      'imgSrc': labelPosition,
      'renderContent': () => {
        return getRadioPopover(
            'labelPosition',
            selectedItem.meta.labelPosition
        );
      }
    },
    'Tooltip': {
      ...commonRibbonBtnElement,
      'id': 'tootip',
      'label': localizedString.tooltip,
      'imgSrc': tooltip,
      'onClick': () => {
        openModal(ItemOptionModal,
            {
              popupName: 'tooltip',
              modalTitle: localizedString.tooltip
            }
        );
      }
    },
    'PieChartStyle': {
      ...commonPopoverButtonElement,
      'id': 'pie_chart_style',
      'label': localizedString.pieChartStyle,
      'imgSrc': pieStyle,
      'renderContent': () => {
        return getRadioPopover(
            'pieChartStyle',
            selectedItem.meta.pieChartStyle
        );
      }
    },
    // 공통으로 사용 되는 리본 버튼.
    'InputTxt': commonRibbonBtn['InputTxt'],
    'ShowColorLegend': commonRibbonBtn['ShowColorLegend'],
    'Palette': commonRibbonBtn['Palette'],
    'ColorEdit': commonRibbonBtn['ColorEdit'],
    'PointLabel': commonRibbonBtn['PointLabel']
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

  const ribbonEvent = {
    'pieChartStyle': (e) => {
      return setMeta(selectedItem, 'pieChartStyle', e.value);
    },
    'labelPosition': (e) => {
      return setMeta(selectedItem, 'labelPosition', e.value);
    }
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
