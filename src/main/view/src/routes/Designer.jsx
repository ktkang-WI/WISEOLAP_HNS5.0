import {createBrowserHistory} from '@remix-run/router';
import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar
  from 'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {AdHocLayoutTypes, DesignerMode} from 'components/config/configType';
import configureUtility
  from 'components/config/organisms/configurationSetting/ConfigureUtility';
import useConfig from 'hooks/useConfig';
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
  const {reload} = useReportSave();
  const {generalConfigure, myPageConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  // saveConfiguration(generalConfigure, myPageConfigure);
  // selector
  const designerMode = useSelector(selectCurrentDesignerMode);
  // actions
  const {setDesignerMode, reloadDisplaySetting} = ConfigSlice.actions;
  const history = createBrowserHistory();
  // function js
  const {configStringToJson} = configureUtility();

  // 브라우저 새로고침 문제.
  useEffect(() => {
    // 아이템, 레이아웃
    const configJson = configStringToJson(generalConfigure);
    const initPage =
      configJson.menuConfig.Menu.WI_DEFAULT_PAGE;

    if (designerMode == DesignerMode['AD_HOC']) {
      let layout = AdHocLayoutTypes[generalConfigure.adHocLayout];

      if (myPageConfigure.defaultLayout.check) {
        layout = AdHocLayoutTypes[myPageConfigure.defaultLayout.layout];
      }

      const param = {
        mode: designerMode,
        adhocLayout: layout
      };

      dispatch(LayoutSlice.actions.initLayout(param));
      dispatch(ItemSlice.actions.initItems(param));
    }

    if (designerMode == DesignerMode['DASHBOARD']) {
      const param = {
        mode: designerMode,
        defaultItem: myPageConfigure.defaultItem
      };
      dispatch(LayoutSlice.actions.initLayout(param));
      dispatch(ItemSlice.actions.initItems(param));
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
