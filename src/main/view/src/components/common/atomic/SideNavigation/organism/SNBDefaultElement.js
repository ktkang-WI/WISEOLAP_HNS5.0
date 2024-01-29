import localizedString from 'config/localization';
import dashboard from '../../../../../assets/image/icon/button/dashboard.png';
import dashboardActive
  from '../../../../../assets/image/icon/button/dashboard_active.png';
import adhoc from '../../../../../assets/image/icon/button/adhoc.png';
import spreadsheet
  from '../../../../../assets/image/icon/button/spreadsheet.png';
import spreadsheetActive
  from '../../../../../assets/image/icon/button/spreadsheet_active.png';
import adhocActive
  from '../../../../../assets/image/icon/button/adhoc_active.png';
import preference from '../../../../../assets/image/icon/button/preference.png';
import preferenceActive
  from '../../../../../assets/image/icon/button/preference_active.png';
import {useNavigate} from 'react-router';

const SNBDefaultElement = () => {
  const nav = useNavigate();

  return {
    'Dashboard': {
      id: 'dashboard',
      imgSrc: dashboard,
      hoveredImgSrc: dashboardActive,
      label: localizedString.dashboard,
      onClick: (e) => {
        nav('dashboard');
      }
    },
    'AdHoc': {
      id: 'adhoc',
      imgSrc: adhoc,
      hoveredImgSrc: adhocActive,
      label: localizedString.adhoc,
      onClick: (e) => {
        nav('adhoc');
      }
    },
    'Spreadsheet': {
      id: 'spreadsheet',
      imgSrc: spreadsheet,
      hoveredImgSrc: spreadsheetActive,
      label: localizedString.spreadsheet,
      onClick: (e) => {
        nav('spreadsheet'); // TO DO: router에 new tab 띄우기 기능 추가 예정
      }
    },
    'Preference': {
      id: 'preference',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.preference,
      onClick: (e) => {
        nav('config');
      }
    },
    // TODO: 임시용 입니다.
    '환경 설정': {
      id: '환경 설정',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.preference,
      onClick: (e) => {
        nav('general');
      }
    },
    // TODO: 임시용 입니다.
    '사용자/그룹관리': {
      id: '사용자/그룹관리',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: '사용자/그룹관리',
      onClick: (e) => {
        nav('user-group');
      }
    },
    '권한': {
      id: '권한',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: '권한',
      onClick: (e) => {
        nav('auth');
      }
    }
  };
};

export default SNBDefaultElement;
