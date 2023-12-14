import localizedString from 'config/localization';
import {useNavigate} from 'react-router';

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
      'label': localizedString.newWindow,
      'type': 'TextButton',
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
    'ReportSetting': {
      'id': 'report_setting',
      'label': localizedString.reportSetting,
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
      'type': 'TextButton',
      'onClick': (e) => {
        nav('/editds/dashboard');
      }
    },
    'DownloadReport': {
      'id': 'designer',
      'label': localizedString.downloadReport,
      'type': 'TextButton'
    }
  };
};

export default HeaderDefaultElement;
