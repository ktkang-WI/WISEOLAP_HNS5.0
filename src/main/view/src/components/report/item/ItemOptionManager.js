import localizedString from 'config/localization';
import showColorLegend from 'assets/image/icon/button/show_color_legend.png';
import palette from 'assets/image/icon/button/global_color.png';
import colorEdit from 'assets/image/icon/button/edit_color.png';
import pointLabel from 'assets/image/icon/button/point_labels.png';
import {Button} from 'devextreme-react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import _ from 'lodash';
import legendPositionIcon from './LegendPositionIcon';

const setMeta = (item, key, value) => {
  return {
    ...item,
    meta: {
      ...item.meta,
      [key]: value
    }
  };
};

// itemOption 중 많이 사용되는 리본버튼.
const ItemOptionManager = () => {
  const selectedItem = useSelector(selectCurrentItem);
  const dispatch = useDispatch();
  const {updateItem} = ItemSlice.actions;
  const reportId = useSelector(selectCurrentReportId);
  const getBtnAndImagePopover = (compact) => {
    return <div>
      <Button
        width={200}
        text='범례 표시'
        type='normal'
        stylingMode='outlined'
        onClick={() => {
          const cloneSelectedItem = _.cloneDeep(selectedItem);
          const value = {
            ...cloneSelectedItem.meta.legend,
            useLegend: !cloneSelectedItem.meta.legend.useLegend
          };
          const item = setMeta(cloneSelectedItem, 'legend', value);

          dispatch(updateItem({reportId, item}));
        }}
      />
      {legendPositionIcon.slice(compact ? 12 : 0, 30).map((icon, idx) => {
        return <Button
          key={idx}
          icon={icon.src}
          width={52}
          height={50}
          onClick={(e) => {
            const cloneSelectedItem = _.cloneDeep(selectedItem);
            const value = {
              ...cloneSelectedItem.meta.legend,
              position: icon.position,
              horizontalAlignment: icon.horizontalAlignment,
              verticalAlignment: icon.verticalAlignment,
              itemTextPosition: icon.itemTextPosition
            };
            const item = setMeta(cloneSelectedItem, 'legend', value);

            dispatch(updateItem({reportId, item}));
          }}
        />;
      })}
    </div>;
  };

  // 팝오버 리본 버튼의 공통(디폴트) 요소.
  const commonPopoverButtonElement = {
    'width': 'auto',
    'height': '45px',
    'type': 'PopoverButton',
    'useArrowButton': false,
    'popoverWidth': '200px',
    'popoverHeight': 'auto'
  };

  // 일반 리본 버튼의 공통(디폴트) 요소.
  const commonRibbonBtnElement = {
    'width': 'auto',
    'height': '45px',
    'useArrowButton': false,
    'type': 'RibbonButton'
  };

  const commonRibbonBtn = {
    'ShowColorLegend': { // 범례
      ...commonPopoverButtonElement,
      'id': 'show_color_legend',
      'label': localizedString.showColorLegend,
      'imgSrc': showColorLegend,
      'renderContent': () => {
        return getBtnAndImagePopover();
      }
    },
    'ShowColorLegendD3': { // 범례
      ...commonPopoverButtonElement,
      'id': 'show_color_legend_d3',
      'label': localizedString.showColorLegend,
      'imgSrc': showColorLegend,
      'renderContent': () => {
        return getBtnAndImagePopover(true);
      }
    },
    'Palette': {
      ...commonPopoverButtonElement,
      'id': 'palette',
      'label': localizedString.palette,
      'imgSrc': palette,
      'renderContent': () => {
      }
    },
    'ColorEdit': {
      ...commonRibbonBtnElement,
      'id': 'color_edit',
      'label': localizedString.colorEdit,
      'imgSrc': colorEdit,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'PointLabel': {
      ...commonPopoverButtonElement,
      'id': 'point_label',
      'label': localizedString.pointLabel,
      'imgSrc': pointLabel,
      'renderContent': () => {
        // 없음, 입방, 선형 radioType
        const type = ['none', 'linear', 'cubic'];
        console.log(type);
      }
    }
  };

  return {
    commonRibbonBtn,
    commonPopoverButtonElement,
    commonRibbonBtnElement
  };
};
export default ItemOptionManager;
