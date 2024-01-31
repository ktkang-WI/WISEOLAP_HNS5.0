import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar
  from 'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {Outlet} from 'react-router-dom';
const Designer = () => {
  const left = ['Logo', 'ReportTabs'];

  return (
    <div>
      <Header
        left={left}
        right={[
          'Viewer'
          // 'NewWindow',
          // 'ShowQuery',
          // 'ReportProperty'
        ]}
      >
      </Header>
      {/* , 'Spreadsheet', 'Preference' */}
      <SideNavigationBar
        content={['Dashboard', 'AdHoc']}
      />
      <Outlet/>
    </div>
  );
};
export default Designer;
