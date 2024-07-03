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
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Outlet, useLoaderData} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';

const Designer = () => {
  // hooks
  const dispatch = useDispatch();
  const {reload, querySearch} = useReportSave();
  const {generalConfigure, myPageConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  const {getReport, getLinkedReport} = useReportLoad();

  // selector
  const designerMode = useSelector(selectCurrentDesignerMode);

  // actions
  const {setDesignerMode, reloadDisplaySetting} = ConfigSlice.actions;
  const history = createBrowserHistory();

  // function js
  const {configStringToJson} = configureUtility();

  const getFavoritReport = async (hasFavoritReport, param) => {
    const initState = (isLoadReport) => {
      if (hasFavoritReport == false || !isLoadReport) {
        dispatch(LayoutSlice.actions.initLayout(param));
        dispatch(ItemSlice.actions.initItems(param));
      }
    };

    let isLoadReport = false;

    if (hasFavoritReport) {
      const myReportId = myPageConfigure.defaultReportId;
      const myReportType = myPageConfigure.defaultReportType;

      if (myReportType == designerMode) {
        isLoadReport = await getReport(myReportId, myReportType);
        await getLinkedReport(myReportId);

        // TODO: 환경설정 보고서 바로 조회 개발시 분기 예정.
        if (isLoadReport) {
          querySearch();
        } else {
          initState(isLoadReport);
        }
      }
    }

    initState(isLoadReport);
  };

  // 브라우저 새로고침 문제.
  useEffect(() => {
    const configJson = configStringToJson(generalConfigure);
    const initPage = configJson?.menuConfig?.Menu?.WI_DEFAULT_PAGE || 'DashAny';
    const hasFavoritReport = myPageConfigure?.defaultReportId || false;
    const param = {mode: designerMode};
    const paletteNo = paletteCollection.findIndex(
        (color) => color.name == myPageConfigure?.defaultPalette
    );

    if (designerMode == DesignerMode['AD_HOC']) {
      const check = myPageConfigure?.defaultLayout?.check;
      const myOrGeneralConf = check?
        myPageConfigure?.defaultLayout?.layout : generalConfigure?.adHocLayout;
      const layout = AdHocLayoutTypes[myOrGeneralConf];

      param.adhocLayout = layout || 'CTGB';

      getFavoritReport(hasFavoritReport, param);
    } else if (designerMode == DesignerMode['DASHBOARD']) {
      param.defaultItem = myPageConfigure?.defaultItem || 'chart';
      param.defaultPalette = paletteNo > -1? paletteNo : 0;

      getFavoritReport(hasFavoritReport, param);
    } else {
      getFavoritReport(hasFavoritReport, param);
    }

    dispatch(reloadDisplaySetting({init: initPage, currPage: designerMode}));
    saveConfiguration(generalConfigure, myPageConfigure);
  }, []);

  useEffect(() => {
    const listenBackEvent = (reportType) => {
      dispatch(setDesignerMode(reportType));
      reload(reportType);
    };

    const unlistenHistoryEvent = history.listen(({action}) => {
      if (action === 'POP') {
        const path = history.location.pathname;
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
        right={[
          // 'NewWindow',
          // 'ReportProperty'
          'ReportSearch',
          'ShowQuery',
          'UserInfo'
        ]}
      >
      </Header>
      {/* ,  'Preference' */}
      <SideNavigationBar
        content={['Dashboard', 'AdHoc', 'Spreadsheet', 'Preference']}
      />
      <Outlet/>
    </div>
  );
};
export default Designer;
