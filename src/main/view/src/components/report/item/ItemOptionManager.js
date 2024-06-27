import localizedString from 'config/localization';
import showColorLegend from 'assets/image/icon/button/show_color_legend.png';
import palette from 'assets/image/icon/button/global_color.png';
import colorEdit from 'assets/image/icon/button/edit_color.png';
import animation from 'assets/image/icon/button/animation.png';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import _ from 'lodash';
import legendPositionIcon from './LegendPositionIcon';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import styled from 'styled-components';

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
  const reportId = useSelector(selectCurrentReportId);

  const dispatch = useDispatch();

  const {updateItem} = ItemSlice.actions;

  const getBtnAndImagePopover = (compact) => {
    const legend = selectedItem?.meta?.legend || {};
    const ButtonWrapper = styled.div`
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      img {
        height: 24px;
        width: 24px;
      }

      div {
        margin-top: 10px !important;
      }

      div + div {
        margin-left: 0px !important;
      }
    `;
    return <div>
      <CommonButton
        width={'100%'}
        type={legend.useLegend ? 'selected' : 'selectable'}
        onClick={() => {
          const value = {
            ...legend,
            useLegend: !legend.useLegend
          };
          const item = setMeta(selectedItem, 'legend', value);

          dispatch(updateItem({reportId, item}));
        }}
      >
        범례 표시
      </CommonButton>
      <ButtonWrapper>
        {legendPositionIcon.slice(compact ? 12 : 0, 30).map((icon, idx) => {
          const options = {
            position: icon.position,
            horizontalAlignment: icon.horizontalAlignment,
            verticalAlignment: icon.verticalAlignment,
            itemTextPosition: icon.itemTextPosition
          };

          const selected = _.isEqual(legend, {...legend, ...options});
          return <CommonButton
            key={idx}
            width={'48px'}
            height={'48px'}
            minWidth='48px'
            type={selected ? 'selected' : 'selectable'}
            onClick={(e) => {
              const newLegend = {
                ...selectedItem.meta.legend,
                ...options
              };
              const item = setMeta(selectedItem, 'legend', newLegend);

              dispatch(updateItem({reportId, item}));
            }}
          >
            <img src={icon.src}/>
          </CommonButton>;
        })}
      </ButtonWrapper>
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
      'popoverWidth': '204px',
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
      'imgSrc': animation,
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
