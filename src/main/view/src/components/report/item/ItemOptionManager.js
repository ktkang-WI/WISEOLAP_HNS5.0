import localizedString from 'config/localization';
import showColorLegend from 'assets/image/icon/button/show_color_legend.png';
import palette from 'assets/image/icon/button/global_color.png';
import colorEdit from 'assets/image/icon/button/edit_color.png';
import pointLabel from 'assets/image/icon/button/point_labels.png';


// itemOption 중 많이 사용되는 리본버튼.
const ItemOptionManager = () => {
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
    'ShowColorLegend': {
      ...commonPopoverButtonElement,
      'id': 'show_color_legend',
      'label': localizedString.showColorLegend,
      'imgSrc': showColorLegend,
      'renderContent': () => {
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
