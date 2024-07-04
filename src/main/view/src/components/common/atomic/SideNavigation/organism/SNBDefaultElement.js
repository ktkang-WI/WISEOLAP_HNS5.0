import localizedString from 'config/localization';
import dashboard from 'assets/image/icon/button/dashboard.png';
import dashboardActive
  from 'assets/image/icon/button/dashboard_active.png';
import adhoc from 'assets/image/icon/button/adhoc.png';
import spreadsheet
  from 'assets/image/icon/button/spreadsheet.png';
import spreadsheetActive
  from 'assets/image/icon/button/spreadsheet_active.png';
import adhocActive
  from 'assets/image/icon/button/adhoc_active.png';
import preference from 'assets/image/icon/button/preference.png';
import preferenceActive
  from 'assets/image/icon/button/preference_active.png';
import log from 'assets/image/icon/button/log.png';
import logActive
  from 'assets/image/icon/button/log_active.png';
import userGroup from 'assets/image/icon/button/user_group.png';
import userGroupActive from 'assets/image/icon/button/user_group_active.png';
import reportFoler from 'assets/image/icon/button/report_folder.png';
import reportFolderActive
  from 'assets/image/icon/button/report_folder_active.png';
import auth from 'assets/image/icon/button/auth.png';
import authActive from 'assets/image/icon/button/auth_active.png';
import addDataSource from 'assets/image/icon/button/add_data_source.png';
import addDataSourceActive
  from 'assets/image/icon/button/add_data_source_active.png';
import {useNavigate, useLocation} from 'react-router';
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
import {clearSheets} from
  'components/report/atomic/spreadBoard/util/SpreadCore';
import useReportLoad from 'hooks/useReportLoad';

const SNBDefaultElement = () => {
  // actions
  const {setDesignerMode, setEditMode} = ConfigSlice.actions;

  // hook
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {reload, querySearch} = useReportSave();
  const {getReport, getLinkedReport} = useReportLoad();
  const location = useLocation();
  const {confirm} = useModal();

  // redux
  const designerMode = useSelector(selectCurrentDesignerMode);
  const configure = useSelector(selectCurrentConfigure);
  const myPageConfigure = useSelector(selectMyPageDesignerConfig);

  // local
  const onClick = (designerMode, executeFn) => {
    confirm(localizedString.menuChangeConfirm, () => {
      changeNav(designerMode);
      if (typeof executeFn === 'function') {
        executeFn();
      }
    });
  };

  const changeNav = (designerMode) => {
    const myReportId = myPageConfigure.defaultReportId;
    const myReportType = myPageConfigure.defaultReportType;
    let adHocLayout = configure.adHocLayout || 'CTGB';
    const defaultItem = myPageConfigure?.defaultItem || 'chart';

    if (myPageConfigure?.defaultLayout?.check) {
      adHocLayout = myPageConfigure.defaultLayout.layout || 'CTGB';
    }

    nav(designerMode.toLowerCase());
    dispatch(setDesignerMode(designerMode));
    dispatch(setEditMode(EditMode.DESIGNER));

    const loadReport = async () => {
      const isLoadReport = await getReport(myReportId);
      const loadGetReport = await getLinkedReport();

      // TODO: 보고서 바로 조회 개발시 적용예정.
      if (isLoadReport && loadGetReport) {
        querySearch();
      }
    };

    if (myPageConfigure?.defaultReportId && myReportType == designerMode) {
      loadReport();
    } else {
      reload(designerMode, adHocLayout, defaultItem);
    }
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
        onClick(DesignerMode['EXCEL'], clearSheets);
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
      active: location.pathname.includes('general'),
      onClick: (e) => {
        nav('general');
      }
    },
    'UserGroupManagement': {
      id: 'userGroupManagement',
      imgSrc: userGroup,
      hoveredImgSrc: userGroupActive,
      label: localizedString.userGroupManagement,
      active: location.pathname.includes('user-group'),
      onClick: (e) => {
        nav('user-group');
      }
    },
    'Authority': {
      id: 'authority',
      imgSrc: auth,
      hoveredImgSrc: authActive,
      label: localizedString.authority,
      active: location.pathname.includes('auth'),
      onClick: (e) => {
        nav('auth');
      }
    },
    'ReportFolderManagement': {
      id: 'reportFolderManagement',
      imgSrc: reportFoler,
      hoveredImgSrc: reportFolderActive,
      label: localizedString.reportFolderManagement,
      active: location.pathname.includes('report-folder'),
      onClick: (e) => {
        nav('report-folder');
      }
    },
    'DataSourceAddition': {
      id: 'dataSourceAddition',
      imgSrc: addDataSource,
      hoveredImgSrc: addDataSourceActive,
      label: localizedString.dataSourceAddition,
      active: location.pathname.includes('add-datasource'),
      onClick: (e) => {
        nav('add-datasource');
      }
    },
    'Log': {
      id: 'log',
      imgSrc: log,
      hoveredImgSrc: logActive,
      label: localizedString.log.log,
      active: location.pathname.includes('log'),
      onClick: (e) => {
        nav('log');
      }
    },
    'SearchQuery': {
      id: 'searchQuery',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: '쿼리 검색',
      onClick: (e) => {
        nav('search-query');
      }
    }
  };
};

export default SNBDefaultElement;
