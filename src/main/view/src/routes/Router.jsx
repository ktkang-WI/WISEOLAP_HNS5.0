import {createBrowserRouter} from 'react-router-dom';
import Designer from './Designer';
import Dashboard from 'components/designer/Dashboard';
import Adhoc from 'components/designer/Adhoc';
import Viewer from './Viewer';
import Config from './Config';
import Login from './Login';
import Register from 'components/login/organisms/Register';
import SignIn from 'components/login/organisms/SignIn';
import Spreadsheet from 'components/designer/Spreadsheet';
import UserGroupManagement
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import {
  generalConfigure as generalLoader,
  groupData as groupDataLoader,
  userGroupManagement as userGroupLoader} from './loader/LoaderConfig';
import ConfigurationSetting
  from 'components/config/organisms/configurationSetting/ConfigurationSetting';
import Authority from 'components/config/organisms/authority/Authority';
import {DesignerMode} from 'components/config/configType';
import ReportFolderManagement from
  'components/config/organisms/reportFolderManagement/ReportFolderManagement';
import DataSourceAddition
  from 'components/config/organisms/dataSourceAddition/DataSourceAddition';
import LinkViewer from './LinkViewer';

const contextPath = '/editds';

const router = createBrowserRouter([
  {
    path: contextPath,
    element: <Login/>,
    children: [
      {
        index: true,
        element: <SignIn/>
      },
      {
        path: contextPath + '/regist',
        element: <Register/>
      }
    ]
  },
  { // 초기 화면
    path: contextPath + '',
    element: <Designer/>,
    children: [
      {
        path: DesignerMode['DASHBOARD'].toLowerCase(),
        element: <Dashboard/>
      },
      {
        path: DesignerMode['AD_HOC'].toLowerCase(),
        element: <Adhoc/>
      },
      {
        path: DesignerMode['EXCEL'].toLowerCase(),
        element: <Spreadsheet/>
      }
    ]
  },
  {
    path: contextPath + '/viewer',
    element: <Viewer/>
  },
  {
    path: contextPath + '/linkViewer',
    element: <LinkViewer/>
  },
  {
    path: contextPath + '/config',
    element: <Config/>,
    children: [
      {
        path: 'general',
        element: <ConfigurationSetting/>,
        loader: generalLoader
      },
      {
        path: 'user-group',
        element: <UserGroupManagement/>,
        loader: userGroupLoader
      },
      {
        path: 'auth',
        element: <Authority/>,
        loader: groupDataLoader
      },
      {
        path: 'report-folder',
        element: <ReportFolderManagement/>
      },
      {
        path: 'add-datasource',
        element: <DataSourceAddition/>
      }
    ]
  }
]);

export default router;
