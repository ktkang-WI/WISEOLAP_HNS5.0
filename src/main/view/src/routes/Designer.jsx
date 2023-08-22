import Header from 'components/common/organisms/Header';
import SideNavigationBar from 'components/common/organisms/SideNavigationBar';
import {Outlet} from 'react-router-dom';
const Designer = () => {
  return (
    <div>
      <Header
        left={['Logo', 'Viewer', 'NewWindow', 'ReportTabs']}
        right={['ShowQuery', 'ReportProperty']}
      >
      </Header>
      <SideNavigationBar
        content={['Dashboard', 'AdHoc', 'Dataset', 'Preference']}
      />
      <Outlet/>
    </div>
  );
};
export default Designer;
