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
    'SpreadSheet': {
      id: 'spreadsheet',
      imgSrc: spreadsheet,
      hoveredImgSrc: spreadsheetActive,
      label: localizedString.spreadsheet,
      onClick: (e) => {
        nav('spreadsheet'); // new tab 띄우기 기능 찾는 중...
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
    }
  };
};

export default SNBDefaultElement;
