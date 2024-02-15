import localizedString from 'config/localization';
import openViewerImg from 'assets/image/icon/button/open_viewer.png';
import {useNavigate} from 'react-router';

const HeaderDefaultElement = () => {
  const nav = useNavigate();

  return {
    'Logo': {
      'id': 'logo',
      'type': 'Logo',
      'height': 'auto',
      'width': '220px'
    },
    'ReportTab': {
      'id': 'report_tab',
      'type': 'ReportTab',
      'width': 'auto'
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
        window.open('dashany');
      }
    },
    'Viewer': {
      'id': 'viewer',
      'buttonType': 'whiteRound',
      'width': '94px',
      'icon': openViewerImg,
      'label': localizedString.openViewer,
      'type': 'CommonButton',
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
        nav('/editds/dashany');
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
