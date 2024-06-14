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
import {DesignerMode, EditMode} from 'components/config/configType';
import ConfigSlice from 'redux/modules/ConfigSlice';
import useReportSave from 'hooks/useReportSave';
import useModal from 'hooks/useModal';
import {useSelector} from 'react-redux';
import {
  selectCurrentConfigure,
  selectCurrentDesignerMode,
  selectMyPageDesignerConfig
} from 'redux/selector/ConfigSelector';

const SNBDefaultElement = () => {
  // actions
  const {setDesignerMode, setEditMode} = ConfigSlice.actions;

  // hook
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {reload} = useReportSave();
  const {confirm} = useModal();

  // redux
  const designerMode = useSelector(selectCurrentDesignerMode);
  const configure = useSelector(selectCurrentConfigure);
  const myPageConfigure = useSelector(selectMyPageDesignerConfig);

  // local
  const onClick = (designerMode) => {
    confirm(localizedString.menuChangeConfirm, () => changeNav(designerMode));
  };

  const changeNav = (designerMode) => {
    let adHocLayout = configure.adHocLayout;
    const defaultItem = myPageConfigure.defaultItem;

    if (myPageConfigure.defaultLayout.check) {
      adHocLayout = myPageConfigure.defaultLayout.layout || 'CTGB';
    }

    nav(designerMode.toLowerCase());
    dispatch(setDesignerMode(designerMode));
    dispatch(setEditMode(EditMode.DESIGNER));
    reload(designerMode, adHocLayout, defaultItem);
  };

  return {
    'Dashboard': {
      id: 'dashboard',
      imgSrc: dashboard,
      hoveredImgSrc: dashboardActive,
      label: localizedString.dashboard,
      active: designerMode == DesignerMode.DASHBOARD,
      onClick: (e) => {
        onClick(DesignerMode['DASHBOARD']);
      }
    },
    'AdHoc': {
      id: 'adhoc',
      imgSrc: adhoc,
      hoveredImgSrc: adhocActive,
      label: localizedString.adhoc,
      active: designerMode == DesignerMode.AD_HOC,
      onClick: (e) => {
        onClick(DesignerMode['AD_HOC']);
      }
    },
    'Spreadsheet': {
      id: 'spreadsheet',
      imgSrc: spreadsheet,
      hoveredImgSrc: spreadsheetActive,
      label: localizedString.spreadsheet,
      active: designerMode == DesignerMode.EXCEL,
      onClick: (e) => {
        onClick(DesignerMode['EXCEL']);
      }
    },
    'Preference': {
      id: 'preference',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.preference,
      onClick: (e) => {
        nav('config/general');
      }
    },
    // TODO: 임시용 입니다.
    'ConfigurationSetting': {
      id: 'configurationSetting',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.preference,
      onClick: (e) => {
        nav('general');
      }
    },
    // TODO: 임시용 입니다.
    'UserGroupManagement': {
      id: 'userGroupManagement',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.userGroupManagement,
      onClick: (e) => {
        nav('user-group');
      }
    },
    'Authority': {
      id: 'authority',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.authority,
      onClick: (e) => {
        nav('auth');
      }
    },
    'ReportFolderManagement': {
      id: 'reportFolderManagement',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.reportFolderManagement,
      onClick: (e) => {
        nav('report-folder');
      }
    },
    'DataSourceAddition': {
      id: 'dataSourceAddition',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: localizedString.dataSourceAddition,
      onClick: (e) => {
        nav('add-datasource');
      }
    }
  };
};

export default SNBDefaultElement;
