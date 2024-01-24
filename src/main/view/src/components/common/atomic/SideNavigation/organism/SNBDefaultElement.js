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
import {useDispatch} from 'react-redux';
import {DesignerMode} from 'components/config/configType';
import ConfigSlice from 'redux/modules/ConfigSlice';
import useReportSave from 'hooks/useReportSave';
import useModal from 'hooks/useModal';

const SNBDefaultElement = () => {
  // actions
  const {setDesignerMode} = ConfigSlice.actions;

  // hook
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {reload} = useReportSave();
  const {confirm} = useModal();

  // local
  const onClick = (designerMode) => {
    confirm(localizedString.menuChangeConfirm, () => changeNav(designerMode));
  };

  const changeNav = (designerMode) => {
    nav(designerMode.toLowerCase());
    dispatch(setDesignerMode(designerMode));
    reload(designerMode);
  };

  return {
    'Dashboard': {
      id: 'dashboard',
      imgSrc: dashboard,
      hoveredImgSrc: dashboardActive,
      label: localizedString.dashboard,
      onClick: (e) => {
        onClick(DesignerMode['DASHBOARD']);
      }
    },
    'AdHoc': {
      id: 'adhoc',
      imgSrc: adhoc,
      hoveredImgSrc: adhocActive,
      label: localizedString.adhoc,
      onClick: (e) => {
        onClick(DesignerMode['AD_HOC']);
      }
    },
    'Spreadsheet': {
      id: 'spreadsheet',
      imgSrc: spreadsheet,
      hoveredImgSrc: spreadsheetActive,
      label: localizedString.spreadsheet,
      onClick: (e) => {
        onClick(DesignerMode['SPREAD_SHEET']);
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
