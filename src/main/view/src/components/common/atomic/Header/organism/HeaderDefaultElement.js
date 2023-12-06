import localizedString from 'config/localization';
import {useNavigate} from 'react-router';
import newWindow from '../../../../../assets/image/icon/button/new_window.png';
import newWindowActive
  from '../../../../../assets/image/icon/button/new_window_active.png';

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
      'type': 'AnimatedImageButton',
      'width': '40px',
      'height': '40px',
      'imgSrc': newWindow,
      'hoveredImgSrc': newWindowActive,
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
    },
    'UserInfomation': {
      'id': 'user_infomation',
      'label': localizedString.userInfomation,
      'imgSrc': newWindow,
      'width': '200px',
      'height': '50px',
      'type': 'ImageAndTextButton',
      'onClick': (e) => {
        console.log('유저 정보 팝오버.');
      }
    }
  };
};

export default HeaderDefaultElement;
