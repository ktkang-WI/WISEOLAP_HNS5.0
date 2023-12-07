import IndiVisualDownload from 'assets/image/icon/button/download_new.png';
import localizedString from 'config/localization';
import Close from 'assets/image/icon/button/close.png';
import GridView from 'assets/image/icon/button/grid_view.png';
import Conversion from 'assets/image/icon/button/conversion.png';


const ItemBoardDefaultElement = {
  'IndiVisualDownload': {
    id: 'indivisual_download',
    title: localizedString.IndiVisualDownload,
    label: localizedString.IndiVisualDownload,
    type: 'DefaultButton',
    imgSrc: IndiVisualDownload,
    width: 'auto',
    height: '45px'
  },
  'Close': {
    id: 'close',
    title: localizedString.Close,
    label: localizedString.Close,
    type: 'DashBoard',
    imgSrc: Close,
    width: 'auto',
    height: '45px'
  },
  'GridView': {
    id: 'gridview',
    title: localizedString.GridView,
    label: localizedString.GridView,
    type: 'PivotGrid',
    imgSrc: GridView,
    width: 'auto',
    height: '45px'
  },
  'Conversion': {
    id: 'conversion',
    title: localizedString.Conversion,
    label: localizedString.Conversion,
    type: 'PivotGrid',
    imgSrc: Conversion,
    width: 'auto',
    height: '45px'
  }
};

export default ItemBoardDefaultElement;
