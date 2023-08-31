import localizedString from '../../../config/localization';
import {useNavigate} from 'react-router';
import dashboard from '../../../assets/image/icon/button/dashboard.png';
import dashboardActive
  from '../../../assets/image/icon/button/dashboard_active.png';

const HeaderDefaultElement = () => {
  const nav = useNavigate();

  return {
    'Logo': {
      'id': 'logo',
      'type': 'Logo',
      'height': '25px',
      'width': '130px'
    },
    'ReportTabs': {
      'id': 'report_tabs',
      'type': 'ReportTabs',
      'width': 'calc(100% - 130px)'
    },
    'NewWindow': {
      'id': 'new_window',
      'title': localizedString.newWindow,
      'type': 'TextButton',
      'width': '45px',
      'height': '45px',
      'onClick': (e) => {
        window.open('dashboard');
      }
    },
    'Viewer': {
      'id': 'viewer',
      'label': localizedString.viewer,
      'type': 'TextButton',
      'onClick': (e) => {
        nav('viewer');
      }
    },
    'ShowQuery': {
      'id': 'show_query',
      'label': localizedString.showQuery,
      'type': 'TextButton'
    },
    'ReportProperty': {
      'id': 'report_property',
      'label': localizedString.reportProperty,
      'type': 'TextButton'
    },
    'Designer': {
      'id': 'designer',
      'label': localizedString.designer,
      'type': 'AnimatedImageButton',
      'imgSrc': dashboard,
      'hoveredImgSrc': dashboardActive,
      'width': '45px',
      'height': '45px',
      'onClick': (e) => {
        window.open('dashboard');
      }
    }
  };
};

export default HeaderDefaultElement;
