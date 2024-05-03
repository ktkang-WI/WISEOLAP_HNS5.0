import {createBrowserHistory} from '@remix-run/router';
import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar
  from 'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {DesignerMode} from 'components/config/configType';
import useConfig from 'hooks/useConfig';
import useReportSave from 'hooks/useReportSave';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Outlet, useLoaderData} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';

const Designer = () => {
  // hooks
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {generalConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  saveConfiguration(generalConfigure);
  // selector
  const designerMode = useSelector(selectCurrentDesignerMode);
  // actions
  const {setDesignerMode} = ConfigSlice.actions;
  const history = createBrowserHistory();

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
          // 'Viewer'
          // 'NewWindow',
          // 'ShowQuery',
          // 'ReportProperty'
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
