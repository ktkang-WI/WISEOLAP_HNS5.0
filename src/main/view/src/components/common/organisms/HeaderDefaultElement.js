import localizedString from '../../../config/localization';
import newWindow from '../../../assets/image/icon/button/new_window.png';
import newWindowActive
  from '../../../assets/image/icon/button/new_window_active.png';
import viewer from '../../../assets/image/icon/button/viewer.png';
import viewerActive
  from '../../../assets/image/icon/button/viewer_active.png';
import reportProperty
  from '../../../assets/image/icon/button/report_property.png';
import showQuery from '../../../assets/image/icon/button/query.png';
import {useNavigate} from 'react-router';


const HeaderDefaultElement = () => {
  const nav = useNavigate();

  return {
    'Logo': {
      'id': 'logo',
      'type': 'Logo'
    },
    'ReportTabs': {
      'id': 'report_tabs',
      'type': 'ReportTabs',
      'width': 'calc(100% - 200px)'
    },
    'NewWindow': {
      'id': 'new_window',
      'title': localizedString.newWindow,
      'type': 'AnimatedImageButton',
      'imgSrc': newWindow,
      'hoveredImgSrc': newWindowActive,
      'width': '45px',
      'height': '45px',
      'onClick': (e) => {
        window.open('dashboard');
      }
    },
    'Viewer': {
      'id': 'viewer',
      'title': localizedString.viewer,
      'type': 'AnimatedImageButton',
      'imgSrc': viewer,
      'hoveredImgSrc': viewerActive,
      'width': '50px',
      'height': '50px',
      'onClick': (e) => {
        nav('viewer');
      }
    },
    'ShowQuery': {
      'id': 'show_query',
      'label': localizedString.showQuery,
      'type': 'LabelImageButton',
      'imgSrc': showQuery
    },
    'ReportProperty': {
      'id': 'report_property',
      'label': localizedString.reportProperty,
      'type': 'LabelImageButton',
      'imgSrc': reportProperty
    }
  };
};

export default HeaderDefaultElement;
