import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar
  from 'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {Outlet, useLocation} from 'react-router-dom';
const Designer = () => {
  const pageLoaction = useLocation();
  let left = ['Logo', 'NewWindow', 'ReportTabs'];

  if (pageLoaction.pathname.includes('spreadsheet')) {
    left = ['Logo', 'NewWindow'];
  }

  return (
    <div>
      <Header
        left={left}
        right={[
          'Viewer',
          'ShowQuery',
          'ReportSetting',
          'ReportProperty'
        ]}
      >
      </Header>
      <SideNavigationBar
        content={['Dashboard', 'AdHoc', 'SpreadSheet', 'Preference']}
      />
      <Outlet/>
    </div>
  );
};
export default Designer;
