import Header from 'components/common/atomic/Header/organism/Header';
import SideNavigationBar
  from 'components/common/atomic/SideNavigation/organism/SideNavigationBar';
import {Outlet} from 'react-router-dom';
const Designer = () => {
  return (
    <div>
      <Header
        left={['Logo', 'ReportTabs']}
        right={['Viewer', 'ShowQuery', 'ReportProperty']}
      >
      </Header>
      <SideNavigationBar
        content={['Dashboard', 'AdHoc', 'Preference']}
      />
      <Outlet/>
    </div>
  );
};
export default Designer;
