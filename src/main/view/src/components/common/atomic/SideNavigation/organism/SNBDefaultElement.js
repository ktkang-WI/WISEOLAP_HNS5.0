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
import excelResource from 'assets/image/icon/button/ico_exist.png';
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
  selectCurrentDesignerMode
} from 'redux/selector/ConfigSelector';
import {clearSheets} from
  'components/report/atomic/spreadBoard/util/SpreadCore';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import useReportLoad from 'hooks/useReportLoad';
import ExcelUploadResourceMap from './ExcelUploadResourceMap';
import moveToCube from 'assets/image/icon/button/gnb-ico2@2x.png';
import moveToCubeActive from 'assets/image/icon/button/gnb-ico2-on@2x.png';
import {encode as base64Encode} from 'js-base64';
import {useLoaderData} from 'react-router-dom';

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
  const editMode = useSelector(selectEditMode);
  const {myPageConfigure, generalConfigure} = useLoaderData();
  const prog = generalConfigure?.prog;
  const userMode = {
    runMode: myPageConfigure.runMode,
    userId: myPageConfigure.userId,
    userNo: myPageConfigure.userNo,
    grpRunMode: myPageConfigure.grpRunMode,
    auth: prog.settings
  };

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
    const myReportId = {
      DashAny: myPageConfigure?.defaultReportId,
      AdHoc: myPageConfigure?.adHocDefaultReportId,
      Excel: myPageConfigure?.excelDefaultReportId
    };

    let adHocLayout = configure.adHocLayout || 'CTGB';
    const defaultItem = myPageConfigure?.defaultItem || 'chart';

    if (myPageConfigure?.defaultLayout?.check) {
      adHocLayout = myPageConfigure.defaultLayout.layout || 'CTGB';
    }

    nav(designerMode.toLowerCase());
    dispatch(setDesignerMode(designerMode));
    dispatch(setEditMode(EditMode.DESIGNER));


    const loadReport = async () => {
      const isLoadReport = await getReport(myReportId[designerMode]);
      const loadGetReport = await getLinkedReport();

      // TODO: 보고서 바로 조회 개발시 적용예정.
      if (isLoadReport && loadGetReport && editMode == EditMode.VIEWER) {
        querySearch();
      }
    };

    if (myReportId[designerMode]) {
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
        nav('confgeneral');
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
        nav('confgeneral');
      }
    },
    'UserGroupManagement': {
      id: 'userGroupManagement',
      imgSrc: userGroup,
      hoveredImgSrc: userGroupActive,
      label: localizedString.userGroupManagement,
      active: location.pathname.includes('usergroup'),
      onClick: (e) => {
        nav('confusergroup');
      }
    },
    'Authority': {
      id: 'authority',
      imgSrc: auth,
      hoveredImgSrc: authActive,
      label: localizedString.authority,
      active: location.pathname.includes('auth'),
      onClick: (e) => {
        nav('confauth');
      }
    },
    'ReportFolderManagement': {
      id: 'reportFolderManagement',
      imgSrc: reportFoler,
      hoveredImgSrc: reportFolderActive,
      label: localizedString.reportFolderManagement,
      active: location.pathname.includes('reportfolder'),
      onClick: (e) => {
        nav('confreportfolder');
      }
    },
    'DataSourceAddition': {
      id: 'dataSourceAddition',
      imgSrc: addDataSource,
      hoveredImgSrc: addDataSourceActive,
      label: localizedString.dataSourceAddition,
      active: location.pathname.includes('datasource'),
      onClick: (e) => {
        nav('confdatasourceadd');
      }
    },
    'Log': {
      id: 'log',
      imgSrc: log,
      hoveredImgSrc: logActive,
      label: localizedString.log.log,
      active: location.pathname.includes('log'),
      onClick: (e) => {
        nav('conflog');
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
    },
    'ExcelResource': {
      id: 'excelResource',
      imgSrc: excelResource,
      label: '엑셀 업로드/리소스맵',
      isPopover: true,
      target: '#excelResource',
      showEvent: 'click',
      position: 'right',
      content: (
        <ExcelUploadResourceMap
          userId={myPageConfigure.userId}
          sessionUserKey={myPageConfigure.sessionUserKey}
          prog={configure.prog}
        />
      ),
      onClick: (e) => {

      }
    },
    'PortalConfig': {
      id: 'portalconf',
      imgSrc: preference,
      hoveredImgSrc: preferenceActive,
      label: '메인화면 설정',
      onClick: (e) => {
        nav('portalconf');
      }
    },
    'MoveToCube': {
      id: 'movetocube',
      imgSrc: moveToCube,
      hoveredImgSrc: moveToCubeActive,
      label: '주제영역 편집',
      onClick: (e) => {
        const encodedUserMode = base64Encode(JSON.stringify(userMode));
        // 250212 hmj 홈앤쇼핑 기준 url 하드코딩을 해야함. 같은 도메인이라도 별도의 어플리케이션이기때문에
        // 반드시 사업지에서 사용되는 url로 변경할것. 로컬 개별 구동과 로컬 서버 구동 기준으로 정상작동 확인
        const urlString = `http://localhost:38080/cube/?data=${encodedUserMode}`;
        // const urlString = `http://localhost:3002/?data=${encodedUserMode}`;
        window.open(urlString, '_blank');
        // olap.hns.tv
      }
    }
  };
};

export default SNBDefaultElement;
