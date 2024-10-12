import {createBrowserHistory} from '@remix-run/router';
import Header from 'components/common/atomic/Header/organism/Header';
import {paletteCollection}
  from 'components/common/atomic/Popover/organism/Palette';
import SideNavigationBar
  from 'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {AdHocLayoutTypes, DesignerMode} from 'components/config/configType';
import configureUtility
  from 'components/config/organisms/configurationSetting/ConfigureUtility';
import useConfig from 'hooks/useConfig';
import useReportLoad from 'hooks/useReportLoad';
import useReportSave from 'hooks/useReportSave';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Outlet, useLoaderData, useNavigate} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';

const Designer = () => {
  // hooks
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {generalConfigure, myPageConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  const {getReport, getLinkedReport} = useReportLoad();
  const nav = useNavigate();

  if (myPageConfigure != undefined) {
    saveConfiguration(generalConfigure, myPageConfigure);
  } else {
    nav('/editds');
  }

  const [tabItems, setTabItems] = useState();
  const [mainTabItems, setMainTabItems] = useState();

  // selector
  const designerMode = useSelector(selectCurrentDesignerMode);

  // actions
  const {setDesignerMode, reloadDisplaySetting} = ConfigSlice.actions;
  const history = createBrowserHistory();

  // function js
  const {configStringToJson} = configureUtility();

  const getFavoritReport = async (hasFavoritReport, param) => {
    const privateReportType = window.sessionStorage.getItem('reportType');
    const mapper = {
      AdHoc: myPageConfigure?.adHocDefaultReportType,
      DashAny: myPageConfigure?.defaultReportType,
      Excel: myPageConfigure?.excelDefaultReportType
    };
    const initState = (isLoadReport) => {
      if (hasFavoritReport == false || !isLoadReport) {
        dispatch(LayoutSlice.actions.initLayout(param));
        dispatch(ItemSlice.actions.initItems(param));
      }
    };

    let isLoadReport = false;
    let isLoadLinkReport = false;

    if (hasFavoritReport || privateReportType) {
      // const myReportId = myPageConfigure.defaultReportId;
      let myReportType = mapper[designerMode];
      if (privateReportType) {
        myReportType = privateReportType;
      }

      if (myReportType == designerMode) {
        isLoadReport = await getReport(hasFavoritReport, myReportType);
        isLoadLinkReport = await getLinkedReport(hasFavoritReport);

        // TODO: 환경설정 보고서 바로 조회 개발시 분기 예정.
        if (isLoadReport && isLoadLinkReport) {
          // querySearch();
        } else {
          initState(isLoadReport);
        }
      }
    }

    initState(isLoadReport);
  };

  // Tab item setting
  useEffect(() => {
    if (window.location.pathname.indexOf('adhoc') > -1 ||
        window.location.pathname.indexOf('dashany') > -1 ||
        window.location.pathname.indexOf('excel') > -1 ||
        (
          window.location.pathname.indexOf('conf') > -1 &&
          window.location.pathname.indexOf('my') <0
        )
    ) {
      if (myPageConfigure?.runMode === 'VIEW') {
        nav('viewer');
      } else if (myPageConfigure?.runMode === 'VIEW') {
        nav('viewer');
      }
    }
    // const menu = generalConfigure?.menu;
    const prog = generalConfigure?.prog;
    const mainTabItems = ['UserInfo'];
    /* 보고서 관리 권한 변경 (전체 설정 -> 그룹 및 사용자 별)
    ** 보고서 형상 관리
    ** 쿼리 보기*/
    mainTabItems.unshift('ReportSearch');
    // if (menu.reportHistory) mainTabItems.unshift('ReportHistory');
    // if (menu.lookQuery) mainTabItems.unshift('ShowQuery');
    if (prog.reportConfiguration) mainTabItems.unshift('ReportHistory');
    if (prog.viewQuery) mainTabItems.unshift('ShowQuery');
    const tabItems = [];

    // SNB 관리 권한 변경 (전체 설정 -> 그룹 및 사용자 별)
    // const accesUserNo = [1001, 2374, 1385, 1598];
    // if (menu.tabAdhoc) tabItems.push('Dashboard');
    // if (menu.tabDashboard) tabItems.push('AdHoc');
    // if (menu.tabSpreadSheet) tabItems.push('Spreadsheet');
    // if (accesUserNo.includes(myPageConfigure.userNo)) {
    //   tabItems.push('Preference');
    // }
    if (prog.dashboard) tabItems.push('Dashboard');
    if (prog.adhoc) tabItems.push('AdHoc');
    if (prog.spreadSheet) tabItems.push('Spreadsheet');
    if (prog.settings) tabItems.push('Preference');

    setTabItems(tabItems);
    setMainTabItems(mainTabItems);
  }, []);

  // 브라우저 새로고침 문제.
  useEffect(() => {
    // 환결설정 개인보고서 관리 시 사용.
    const flag = window.sessionStorage.getItem('flag');
    const privateReportId = window.sessionStorage.getItem('reportId');

    const configJson = configStringToJson(generalConfigure);
    const initPage = configJson?.general?.wiDefaultPage || 'DashAny';
    const hasFavoritReport = {
      DashAny: myPageConfigure?.defaultReportId,
      AdHoc: myPageConfigure?.adHocDefaultReportId,
      Excel: myPageConfigure?.excelDefaultReportId
    };

    const param = {mode: designerMode};
    const paletteNo = paletteCollection.findIndex(
        (color) => color.name == myPageConfigure?.defaultPalette
    );

    let reportId = hasFavoritReport[designerMode];
    if (flag) {
      reportId = privateReportId;
    }

    if (designerMode == DesignerMode['AD_HOC']) {
      const check = myPageConfigure?.defaultLayout?.check;
      const myOrGeneralConf = check?
        myPageConfigure?.defaultLayout?.layout :
        generalConfigure?.report?.adHocLayout;
      const layout = AdHocLayoutTypes[myOrGeneralConf];
      param.adhocLayout = layout || 'CTGB';

      getFavoritReport(reportId, param);
    } else if (designerMode == DesignerMode['DASHBOARD']) {
      param.defaultItem = myPageConfigure?.defaultItem || 'chart';
      param.defaultPalette = paletteNo > -1? paletteNo : 0;

      getFavoritReport(reportId, param);
    } else {
      getFavoritReport(reportId, param);
    }

    dispatch(reloadDisplaySetting({init: initPage, currPage: designerMode}));
    if (myPageConfigure != undefined) {
      saveConfiguration(generalConfigure, myPageConfigure);
    } else {
      nav('/editds');
    }
  }, []);

  useEffect(() => {
    const listenBackEvent = (reportType) => {
      dispatch(setDesignerMode(reportType));
      reload(reportType);
    };

    const unlistenHistoryEvent = history.listen(({action}) => {
      if (action === 'POP') {
        const path = history.location.pame;
        let reportType = DesignerMode['DASHBOARD'];

        if (path.indexOf(DesignerMode['AD_HOC'].toLowerCase()) > -1) {
          reportType = DesignerMode['AD_HOC'];
        } else if (path.indexOf(DesignerMode['EXCEL'].toLowerCase()) > -1) {
          reportType = DesignerMode['EXCEL'];
        }

        listenBackEvent(reportType);
      }
    });

    return unlistenHistoryEvent;
  }, [designerMode]);

  return (
    <div>
      <Header
        left={['Logo', 'Viewer']}
        middle={['ReportTab']}
        right={
          mainTabItems
        }
      >
      </Header>
      {/* ,  'Preference' */}
      <SideNavigationBar
        content={tabItems}
      />
      <Outlet/>
    </div>
  );
};
export default Designer;
