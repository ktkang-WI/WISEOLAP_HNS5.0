import grandTotalImg from 'assets/image/icon/button/grand_total.png';
import itemOptionManager from '../ItemOptionManager';
import localizedString from 'config/localization';
import inputTxt from 'assets/image/icon/button/inputTxt.png';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';

const useCustomEvent = () => {
  const selectedItem = useSelector(selectCurrentItem);
  const commonRibbonButton = itemOptionManager().commonRibbonBtnElement;

  console.log(selectedItem);

  const ribbonConfig = {
    'GridLine': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.gridLine,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    },
    /*
    'CellMerging': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.cellMerging,
      'imgSrc': totalImg,
      'onClick': () => {
      }
    },*/
    'ColumnHeader': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.columnHeader,
      'imgSrc': grandTotalImg,
      'onClick': () => {
      }
    },
    'Paging': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.paging,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    },
    /*
    'AutoWrap': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.autoWrap,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    }, */
    'GridResiging': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.gridResiging,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    },
    /*
    'HeaderAdd': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.headerAdd,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    },
    */
    'InputTxt': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.inputTxt,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    }
  };

  return {ribbonConfig};
};

export default useCustomEvent;
